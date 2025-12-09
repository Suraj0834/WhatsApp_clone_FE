import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, TouchableOpacity, Platform } from 'react-native';
import { Avatar, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../store';
import { RootState } from '../../store';
import { chatApi } from '../../api/endpoints/chat';
import { COLORS } from '../../utils/constants';

export const GroupInfoScreen = () => {
    const route = useRoute<any>();
    const { conversationId } = route.params;
    const navigation = useNavigation<any>();
    const [conversation, setConversation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAppSelector((state: RootState) => state.auth);

    useEffect(() => {
        loadConversation();
    }, [conversationId]);

    const loadConversation = async () => {
        try {
            const data = await chatApi.getConversation(conversationId);
            setConversation(data.conversation);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load group info');
        } finally {
            setLoading(false);
        }
    };

    const handleExitGroup = async () => {
        Alert.alert(
            'Exit Group',
            'Are you sure you want to exit this group?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Exit',
                    style: 'destructive',
                    onPress: async () => {
                        if (!user?.id) return;
                        try {
                            // Assuming we have a leave group endpoint or use updateConversation to remove self
                            // For now, let's use updateConversation to remove self
                            await chatApi.updateConversation(conversationId, {
                                removeMembers: [user.id]
                            });
                            navigation.navigate('ChatsList');
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'Failed to exit group');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#25D366" />
                <Text style={styles.loadingText}>Loading group info...</Text>
            </View>
        );
    }

    if (!conversation) return null;

    const isAdmin = conversation.adminIds.includes(user?.id);

    return (
        <ScrollView style={styles.container}>
            {/* Header Card with Group Avatar */}
            <View style={styles.headerCard}>
                <View style={styles.avatarContainer}>
                    <Avatar.Image
                        size={120}
                        source={{ uri: conversation.avatarUrl || `https://ui-avatars.com/api/?name=${conversation.title}&background=25D366&color=fff&size=120` }}
                    />
                    {isAdmin && (
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <IconButton icon="camera" size={20} iconColor="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.groupTitle}>{conversation.title}</Text>
                <Text style={styles.groupSubtitle}>
                    Group • {conversation.members.length} participants
                </Text>
            </View>

            {/* Group Description */}
            {conversation.description && (
                <View style={styles.section}>
                    <View style={styles.cardContainer}>
                        <View style={styles.descriptionCard}>
                            <View style={[styles.descIconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
                                <IconButton icon="information" iconColor="#2196F3" size={24} />
                            </View>
                            <View style={styles.descInfo}>
                                <Text style={styles.descTitle}>Group Description</Text>
                                <Text style={styles.descText}>{conversation.description}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Group Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Group Actions</Text>
                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                            <IconButton icon="bell" iconColor="#4CAF50" size={24} />
                        </View>
                        <View style={styles.actionInfo}>
                            <Text style={styles.actionTitle}>Mute Notifications</Text>
                            <Text style={styles.actionDescription}>Silence this group</Text>
                        </View>
                        <IconButton icon="chevron-right" size={24} iconColor="#8696A0" />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.15)' }]}>
                            <IconButton icon="star" iconColor="#FF9800" size={24} />
                        </View>
                        <View style={styles.actionInfo}>
                            <Text style={styles.actionTitle}>Starred Messages</Text>
                            <Text style={styles.actionDescription}>View starred messages</Text>
                        </View>
                        <IconButton icon="chevron-right" size={24} iconColor="#8696A0" />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(156, 39, 176, 0.15)' }]}>
                            <IconButton icon="folder-image" iconColor="#9C27B0" size={24} />
                        </View>
                        <View style={styles.actionInfo}>
                            <Text style={styles.actionTitle}>Media & Files</Text>
                            <Text style={styles.actionDescription}>View shared media</Text>
                        </View>
                        <IconButton icon="chevron-right" size={24} iconColor="#8696A0" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Participants Section */}
            <View style={styles.section}>
                <View style={styles.participantsHeader}>
                    <Text style={styles.sectionTitle}>{conversation.members.length} Participants</Text>
                    {isAdmin && (
                        <TouchableOpacity>
                            <IconButton icon="account-plus" size={24} iconColor="#25D366" />
                        </TouchableOpacity>
                    )}
                </View>
                
                {conversation.members.map((member: any, index: number) => {
                    const memberId = member._id || member.id;
                    const memberIsAdmin = conversation.adminIds.includes(memberId);
                    
                    return (
                        <View key={memberId} style={styles.cardContainer}>
                            <TouchableOpacity style={styles.participantCard}>
                                <Avatar.Image
                                    size={48}
                                    source={{ uri: member.avatarUrl || `https://ui-avatars.com/api/?name=${member.name}&background=25D366&color=fff` }}
                                />
                                <View style={styles.participantInfo}>
                                    <View style={styles.participantHeader}>
                                        <Text style={styles.participantName}>{member.name}</Text>
                                        {memberIsAdmin && (
                                            <View style={styles.adminBadge}>
                                                <Text style={styles.adminText}>Admin</Text>
                                            </View>
                                        )}
                                    </View>
                                    {member.statusMessage && (
                                        <Text style={styles.participantStatus} numberOfLines={1}>
                                            {member.statusMessage}
                                        </Text>
                                    )}
                                </View>
                                {isAdmin && memberId !== user?.id && (
                                    <IconButton icon="dots-vertical" size={24} iconColor="#8696A0" />
                                )}
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>

            {/* Exit Group Button */}
            <View style={styles.section}>
                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.dangerCard}
                        onPress={handleExitGroup}
                    >
                        <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(244, 67, 54, 0.15)' }]}>
                            <IconButton icon="logout" iconColor="#F44336" size={24} />
                        </View>
                        <View style={styles.actionInfo}>
                            <Text style={[styles.actionTitle, { color: '#F44336' }]}>Exit Group</Text>
                            <Text style={styles.actionDescription}>Leave this group</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ height: 20 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    loadingText: {
        fontSize: 15,
        color: '#8696A0',
        marginTop: 16,
    },
    headerCard: {
        backgroundColor: '#fff',
        padding: 32,
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
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    editAvatarButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#25D366',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    groupTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
        textAlign: 'center',
    },
    groupSubtitle: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
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
    descriptionCard: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'flex-start',
    },
    descIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    descInfo: {
        flex: 1,
        marginLeft: 16,
    },
    descTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 6,
    },
    descText: {
        fontSize: 14,
        color: '#667781',
        lineHeight: 20,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionInfo: {
        flex: 1,
        marginLeft: 16,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    actionDescription: {
        fontSize: 13,
        color: '#667781',
    },
    participantsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    participantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    participantInfo: {
        flex: 1,
        marginLeft: 16,
    },
    participantHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    participantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginRight: 8,
    },
    participantStatus: {
        fontSize: 13,
        color: '#667781',
    },
    adminBadge: {
        backgroundColor: 'rgba(37, 211, 102, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    adminText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#25D366',
    },
    dangerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
});
