import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Platform, Modal, TouchableOpacity } from 'react-native';
import { IconButton, useTheme, Text, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { chatApi } from '../api/endpoints/chat';
import { useDispatch } from 'react-redux';
import { sendMessage, editMessage } from '../store/slices/chatSlice';
import { AppDispatch } from '../store';
import { socketService } from '../services/socketService';

import { Message } from '../types/models';

interface MessageComposerProps {
    conversationId: string;
    replyingTo?: Message | null;
    onCancelReply?: () => void;
    editingMessage?: Message | null;
    onCancelEdit?: () => void;
    onToggleQuickActions?: () => void;
}

export const MessageComposer = ({ conversationId, replyingTo, onCancelReply, editingMessage, onCancelEdit, onToggleQuickActions }: MessageComposerProps) => {
    const [text, setText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showAttachments, setShowAttachments] = useState(false);
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (editingMessage) {
            setText(editingMessage.content);
        } else {
            setText('');
        }
    }, [editingMessage]);

    const handleSend = async () => {
        if (!text.trim()) return;

        const content = text.trim();
        setText('');

        if (editingMessage) {
            await dispatch(editMessage({
                messageId: editingMessage.id,
                content
            }));
            if (onCancelEdit) onCancelEdit();
        } else {
            await dispatch(sendMessage({
                conversationId,
                content,
                type: 'text',
                replyToMessageId: replyingTo?.id
            }));
            if (onCancelReply) onCancelReply();
        }
    };

    const handleTyping = (text: string) => {
        setText(text);
        if (!editingMessage) {
            socketService.sendTyping(conversationId, text.length > 0);
        }
    };

    const uploadMedia = async (result: ImagePicker.ImagePickerResult) => {
        if (result.canceled || !result.assets || result.assets.length === 0) return;

        const asset = result.assets[0];
        setIsUploading(true);
        setShowAttachments(false);

        try {
            const uploadResult = await chatApi.uploadFile({
                uri: asset.uri,
                name: asset.fileName || 'upload.jpg',
                type: asset.mimeType || 'image/jpeg',
            });

            await dispatch(sendMessage({
                conversationId,
                content: '',
                type: asset.type === 'video' ? 'video' : 'image',
                attachments: [uploadResult],
                replyToMessageId: replyingTo?.id
            }));

            if (onCancelReply) onCancelReply();
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.8,
        });
        uploadMedia(result);
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.8,
        });
        uploadMedia(result);
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            setIsUploading(true);
            setShowAttachments(false);

            const asset = result.assets[0];
            const uploadResult = await chatApi.uploadFile({
                uri: asset.uri,
                name: asset.name,
                type: asset.mimeType || 'application/octet-stream',
            });

            await dispatch(sendMessage({
                conversationId,
                content: '',
                type: 'file',
                attachments: [uploadResult],
                replyToMessageId: replyingTo?.id
            }));

            if (onCancelReply) onCancelReply();
        } catch (error) {
            console.error('Document upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <View style={styles.wrapper}>
            {replyingTo && !editingMessage && (
                <View style={styles.replyPreview}>
                    <View style={styles.replyBar} />
                    <View style={styles.replyContent}>
                        <Text style={styles.replyTitle}>Replying to message</Text>
                        <Text numberOfLines={1} style={styles.replyText}>
                            {replyingTo.content || (replyingTo.type === 'image' ? '📷 Photo' : 'File')}
                        </Text>
                    </View>
                    <IconButton
                        icon="close"
                        size={20}
                        onPress={onCancelReply}
                        style={styles.closeReplyButton}
                    />
                </View>
            )}

            {editingMessage && (
                <View style={styles.replyPreview}>
                    <View style={[styles.replyBar, { backgroundColor: theme.colors.primary }]} />
                    <View style={styles.replyContent}>
                        <Text style={[styles.replyTitle, { color: theme.colors.primary }]}>Editing message</Text>
                        <Text numberOfLines={1} style={styles.replyText}>
                            {editingMessage.content}
                        </Text>
                    </View>
                    <IconButton
                        icon="close"
                        size={20}
                        onPress={onCancelEdit}
                        style={styles.closeReplyButton}
                    />
                </View>
            )}

            <View style={styles.container}>
                {isUploading && (
                    <View style={styles.uploadingOverlay}>
                        <ActivityIndicator color={theme.colors.primary} />
                        <Text style={styles.uploadingText}>Uploading...</Text>
                    </View>
                )}

                <Modal
                    visible={showAttachments}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowAttachments(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowAttachments(false)}
                    >
                        <View style={styles.attachmentMenu}>
                            <View style={styles.attachmentRow}>
                                <AttachmentOption
                                    icon="camera"
                                    label="Camera"
                                    color="#E91E63"
                                    onPress={takePhoto}
                                />
                                <AttachmentOption
                                    icon="image"
                                    label="Gallery"
                                    color="#9C27B0"
                                    onPress={pickImage}
                                />
                                <AttachmentOption
                                    icon="file-document"
                                    label="Document"
                                    color="#512DA8"
                                    onPress={pickDocument}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {!editingMessage && (
                    <>
                        <IconButton
                            icon="plus"
                            iconColor={theme.colors.primary}
                            onPress={() => setShowAttachments(true)}
                        />
                        {onToggleQuickActions && (
                            <IconButton
                                icon="view-grid-outline"
                                iconColor={theme.colors.primary}
                                onPress={onToggleQuickActions}
                                style={styles.quickActionsButton}
                            />
                        )}
                    </>
                )}

                <TextInput
                    style={styles.input}
                    placeholder={editingMessage ? "Edit message" : "Type a message"}
                    value={text}
                    onChangeText={handleTyping}
                    multiline
                    maxLength={1000}
                />

                <IconButton
                    icon={editingMessage ? "check" : (text.trim() ? "send" : "microphone")}
                    iconColor={theme.colors.primary}
                    onPress={text.trim() ? handleSend : () => { }}
                    disabled={isUploading}
                />
            </View>
        </View>
    );
};

const AttachmentOption = ({ icon, label, color, onPress }: any) => (
    <TouchableOpacity style={styles.attachmentOption} onPress={onPress}>
        <View style={[styles.iconCircle, { backgroundColor: color }]}>
            <IconButton icon={icon} iconColor="white" size={24} />
        </View>
        <Text style={styles.attachmentLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    replyPreview: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    },
    replyBar: {
        width: 4,
        height: '100%',
        backgroundColor: '#6200ee', // Primary color
        marginRight: 8,
        borderRadius: 2,
    },
    replyContent: {
        flex: 1,
    },
    replyTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6200ee',
    },
    replyText: {
        fontSize: 14,
        color: '#666',
    },
    closeReplyButton: {
        margin: 0,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 8,
        fontSize: 16,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    attachmentMenu: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
    },
    attachmentRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    attachmentOption: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    attachmentLabel: {
        fontSize: 12,
        color: '#666',
    },
    uploadingOverlay: {
        position: 'absolute',
        top: -40,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadingText: {
        marginLeft: 8,
        fontSize: 12,
        color: '#666',
    },
    quickActionsButton: {
        margin: 0,
        marginLeft: -8,
    },
});
