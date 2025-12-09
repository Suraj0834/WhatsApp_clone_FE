import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { format } from 'date-fns';
import { Message } from '../types/models';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { retryMessage, addReaction, removeReaction, deleteMessage } from '../store/slices/chatSlice';
import { COLORS } from '../utils/constants';
import { LinkPreview } from './LinkPreview';

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
    senderName?: string;
    onReply?: (message: Message) => void;
    onEdit?: (message: Message) => void;
}

export const MessageBubble = ({ message, isOwn, senderName, onReply, onEdit }: MessageBubbleProps) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [modalVisible, setModalVisible] = useState(false);
    const [reactionPickerVisible, setReactionPickerVisible] = useState(false);

    const renderContent = () => {
        if (message.type === 'image' && message.attachments?.[0]) {
            return (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image
                        source={{ uri: message.attachments[0].url }}
                        style={styles.media}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            );
        }

        if (message.type === 'video' && message.attachments?.[0]) {
            return (
                <View style={styles.mediaContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image
                            source={{ uri: message.attachments[0].url }}
                            style={styles.media}
                            resizeMode="cover"
                        />
                        <View style={styles.videoOverlay}>
                            <IconButton icon="play-circle" size={48} iconColor="white" />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

        if (message.type === 'file' && message.attachments?.[0]) {
            return (
                <View style={styles.fileContainer}>
                    <IconButton icon="file-document" size={24} iconColor={theme.colors.primary} />
                    <Text style={styles.fileName} numberOfLines={1}>
                        {message.attachments[0].name || 'Document'}
                    </Text>
                </View>
            );
        }

        return <Text style={styles.text}>{message.content}</Text>;
    };

    const handleLongPress = () => {
        setReactionPickerVisible(true);
    };

    const handleReaction = (emoji: string) => {
        setReactionPickerVisible(false);
        const currentUserId = user?.id || (user as any)?._id;
        if (!currentUserId) return;

        const existingReaction = message.reactions?.find(r => r.userId === currentUserId && r.emoji === emoji);

        if (existingReaction) {
            dispatch(removeReaction({ messageId: message.id, emoji }));
        } else {
            dispatch(addReaction({ messageId: message.id, emoji }));
        }
    };

    const handleReply = () => {
        setReactionPickerVisible(false);
        if (onReply) {
            onReply(message);
        }
    };

    const handleEdit = () => {
        setReactionPickerVisible(false);
        if (onEdit) {
            onEdit(message);
        }
    };

    const handleDelete = () => {
        setReactionPickerVisible(false);
        Alert.alert(
            "Delete Message",
            "Are you sure you want to delete this message?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => dispatch(deleteMessage(message.id))
                }
            ]
        );
    };

    const renderReactions = () => {
        if (!message.reactions || message.reactions.length === 0) return null;

        const reactionCounts: { [key: string]: number } = {};
        message.reactions.forEach(r => {
            reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
        });

        return (
            <View style={styles.reactionsContainer}>
                {Object.entries(reactionCounts).map(([emoji, count]) => (
                    <View key={emoji} style={styles.reactionBadge}>
                        <Text style={styles.reactionText}>{emoji} {count > 1 ? count : ''}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderStatusIcon = () => {
        switch (message.status) {
            case 'pending':
                return <IconButton icon="clock-outline" size={14} iconColor="#666" />;
            case 'sent':
                return <IconButton icon="check" size={14} iconColor="#666" />;
            case 'delivered':
                return <IconButton icon="check-all" size={14} iconColor="#666" />;
            case 'read':
                return <IconButton icon="check-all" size={14} iconColor="#34B7F1" />;
            case 'failed':
                return (
                    <TouchableOpacity onPress={() => dispatch(retryMessage(message))}>
                        <IconButton icon="alert-circle-outline" size={14} iconColor="red" />
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };

    return (
        <View style={[
            styles.container,
            isOwn ? styles.ownContainer : styles.otherContainer
        ]}>
            <TouchableOpacity
                activeOpacity={0.9}
                onLongPress={handleLongPress}
                style={[
                    styles.bubble,
                    isOwn ? styles.ownBubble : styles.otherBubble,
                    { backgroundColor: isOwn ? '#E7FFDB' : '#FFFFFF' }
                ]}
            >
                {senderName && !isOwn && (
                    <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: 'bold', marginBottom: 2 }}>
                        {senderName}
                    </Text>
                )}
                {message.replyToMessageId && (
                    <View style={styles.replyContainer}>
                        <Text style={styles.replyText}>Replying to message...</Text>
                    </View>
                )}

                {renderContent()}

                {message.previewData && message.type === 'text' && (
                    <LinkPreview preview={message.previewData} isOutgoing={isOwn} />
                )}

                {message.type !== 'text' && message.content ? (
                    <Text style={styles.caption}>{message.content}</Text>
                ) : null}

                <View style={styles.footer}>
                    <Text style={styles.time}>
                        {format(new Date(message.createdAt), 'HH:mm')}
                    </Text>
                    {isOwn && (
                        <View style={styles.statusContainer}>
                            {renderStatusIcon()}
                        </View>
                    )}
                </View>

                {renderReactions()}
            </TouchableOpacity>

            {/* Reaction Picker Overlay */}
            <Modal
                transparent={true}
                visible={reactionPickerVisible}
                onRequestClose={() => setReactionPickerVisible(false)}
                animationType="fade"
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setReactionPickerVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        <View style={styles.reactionPicker}>
                            {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
                                <TouchableOpacity
                                    key={emoji}
                                    onPress={() => handleReaction(emoji)}
                                    style={styles.emojiButton}
                                >
                                    <Text style={styles.emojiText}>{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.menuOptions}>
                            <TouchableOpacity style={styles.menuOption} onPress={handleReply}>
                                <IconButton icon="reply" size={20} iconColor="#333" />
                                <Text style={styles.menuOptionText}>Reply</Text>
                            </TouchableOpacity>
                            {isOwn && message.type === 'text' && (
                                <TouchableOpacity style={styles.menuOption} onPress={handleEdit}>
                                    <IconButton icon="pencil" size={20} iconColor="#333" />
                                    <Text style={styles.menuOptionText}>Edit</Text>
                                </TouchableOpacity>
                            )}
                            {isOwn && (
                                <TouchableOpacity style={styles.menuOption} onPress={handleDelete}>
                                    <IconButton icon="delete" size={20} iconColor="red" />
                                    <Text style={[styles.menuOptionText, { color: 'red' }]}>Delete</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Media Viewer Modal */}
            <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <IconButton
                        icon="close"
                        iconColor="white"
                        size={30}
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    />
                    {message.type === 'image' && message.attachments?.[0] && (
                        <Image
                            source={{ uri: message.attachments[0].url }}
                            style={styles.fullScreenImage}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    reactionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    reactionBadge: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
        marginRight: 4,
        marginBottom: 2,
        borderWidth: 1,
        borderColor: '#fff',
    },
    reactionText: {
        fontSize: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reactionPicker: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        elevation: 5,
    },
    emojiButton: {
        padding: 10,
    },
    emojiText: {
        fontSize: 24,
    },
    container: {
        marginVertical: 4,
        marginHorizontal: 8,
        flexDirection: 'row',
    },
    ownContainer: {
        justifyContent: 'flex-end',
    },
    otherContainer: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        borderRadius: 8,
        padding: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    text: {
        fontSize: 16,
        color: '#000',
    },
    media: {
        width: 240,
        height: 160,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    mediaContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative' as const,
    },
    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    fileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        paddingRight: 12,
        width: 240,
    },
    fileName: {
        flex: 1,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 2,
    },
    time: {
        fontSize: 10,
        color: '#666',
        marginRight: 4,
    },
    status: {
        fontSize: 10,
        color: '#34B7F1',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    ownBubble: {
        backgroundColor: '#E7FFDB',
        alignSelf: 'flex-end',
    },
    otherBubble: {
        backgroundColor: '#FFFFFF',
        alignSelf: 'flex-start',
    },
    replyContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 4,
        borderRadius: 4,
        marginBottom: 4,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    replyText: {
        fontSize: 12,
        color: '#666',
    },
    caption: {
        fontSize: 14,
        marginTop: 4,
        marginBottom: 2,
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        elevation: 5,
        minWidth: 200,
    },
    menuOptions: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 5,
        paddingTop: 5,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    menuOptionText: {
        fontSize: 16,
        marginLeft: 8,
        color: '#333',
    },
});
