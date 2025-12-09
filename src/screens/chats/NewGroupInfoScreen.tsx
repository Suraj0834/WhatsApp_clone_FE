import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { TextInput, Button, FAB, ActivityIndicator, Text, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { chatApi } from '../../api/endpoints/chat';
import { useAppDispatch } from '../../store';
import { setCurrentConversation } from '../../store/slices/chatSlice';
import { COLORS } from '../../utils/constants';

export const NewGroupInfoScreen = () => {
    const route = useRoute<any>();
    const { participants } = route.params;
    const [title, setTitle] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const createGroup = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a group subject');
            return;
        }

        setLoading(true);
        try {
            // Upload avatar if selected (TODO: Implement avatar upload for groups)
            // For now, we'll just pass the URI if it's a remote URL, or handle upload in chatApi if supported
            // Assuming chatApi.createConversation supports avatarUrl string.
            // If local file, we need to upload it first.
            let avatarUrl = undefined;
            if (avatar) {
                const uploadResult = await chatApi.uploadFile({
                    uri: avatar,
                    name: 'group_avatar.jpg',
                    type: 'image/jpeg',
                });
                avatarUrl = uploadResult.url;
            }

            const memberIds = participants.map((u: any) => u.id);
            const data = await chatApi.createConversation(memberIds, 'group', title, avatarUrl);

            dispatch(setCurrentConversation(data.conversation));

            // Navigate to ChatScreen, replacing the stack so we don't go back to creation screens
            navigation.reset({
                index: 1,
                routes: [
                    { name: 'MainTabs' },
                    {
                        name: 'Chat',
                        params: {
                            conversationId: data.conversation.id,
                            title: data.conversation.title
                        }
                    },
                ],
            });

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(37, 211, 102, 0.15)' }]}>
                    <IconButton icon="account-group" iconColor="#25D366" size={32} />
                </View>
                <Text style={styles.headerTitle}>Create New Group</Text>
                <Text style={styles.headerSubtitle}>
                    Add group subject and optional icon
                </Text>
            </View>

            {/* Group Info Card */}
            <View style={styles.section}>
                <View style={styles.cardContainer}>
                    {/* Avatar Section */}
                    <TouchableOpacity onPress={pickImage} style={styles.avatarSection}>
                        {avatar ? (
                            <View style={styles.avatarWrapper}>
                                <Image source={{ uri: avatar }} style={styles.avatar} />
                                <View style={styles.cameraOverlay}>
                                    <IconButton icon="camera" iconColor="#fff" size={20} />
                                </View>
                            </View>
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <IconButton icon="camera" iconColor="#8696A0" size={32} />
                                <Text style={styles.avatarPlaceholderText}>Add Group Icon</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Subject Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Group Subject</Text>
                        <TextInput
                            placeholder="Enter group subject"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                            mode="flat"
                            maxLength={25}
                            underlineColor="transparent"
                            activeUnderlineColor="#25D366"
                        />
                        <Text style={styles.characterCount}>{title.length}/25</Text>
                    </View>

                    {/* Participants Info */}
                    <View style={styles.participantsCard}>
                        <View style={styles.participantsIcon}>
                            <IconButton icon="account-multiple" iconColor="#25D366" size={20} />
                        </View>
                        <Text style={styles.participantsText}>
                            {participants.length} {participants.length === 1 ? 'participant' : 'participants'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Create Button */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color="#25D366" size="large" />
                    <Text style={styles.loaderText}>Creating group...</Text>
                </View>
            ) : (
                <FAB
                    style={styles.fab}
                    icon="check"
                    label="Create Group"
                    color="white"
                    onPress={createGroup}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerCard: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    headerIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#667781',
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#25D366',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0F2F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E4E6EB',
        borderStyle: 'dashed',
    },
    avatarPlaceholderText: {
        fontSize: 12,
        color: '#8696A0',
        marginTop: 4,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#667781',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F0F2F5',
        fontSize: 16,
    },
    characterCount: {
        fontSize: 12,
        color: '#8696A0',
        textAlign: 'right',
        marginTop: 4,
    },
    participantsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        padding: 12,
        borderRadius: 12,
    },
    participantsIcon: {
        margin: 0,
        marginRight: -8,
    },
    participantsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#25D366',
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    loaderText: {
        marginTop: 12,
        fontSize: 14,
        color: '#667781',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#25D366',
    },
});
