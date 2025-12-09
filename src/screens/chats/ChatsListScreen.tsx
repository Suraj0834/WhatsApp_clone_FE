import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    RefreshControl,
    Platform,
} from 'react-native';
import { FAB, Divider, IconButton, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchConversations, setCurrentConversation } from '../../store/slices/chatSlice';
import { format } from 'date-fns';
import { COLORS, SPACING } from '../../utils/constants';

export const ChatsListScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { conversations, isLoading } = useSelector((state: RootState) => state.chat);
    const { user } = useSelector((state: RootState) => state.auth);
    const [refreshing, setRefreshing] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            await dispatch(fetchConversations({ offset: 0 }));
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadConversations();
        setRefreshing(false);
    };

    const getOtherMember = (members: any[]) => {
        return members.find(m => (m.id || m._id) !== user?.id);
    };

    const handlePinPress = (conversationId: string, isPinned: boolean) => {
        // TODO: Implement pin/unpin API call
        Alert.alert(isPinned ? 'Unpin' : 'Pin', 'Feature coming soon!');
    };

    const handleMutePress = (conversationId: string, isMuted: boolean) => {
        // TODO: Implement mute/unmute API call
        Alert.alert(isMuted ? 'Unmute' : 'Mute', 'Feature coming soon!');
    };

    const handleArchive = (conversationId: string) => {
        Alert.alert('Archive', 'Archive feature coming soon!');
    };

    const handleDelete = (conversationId: string) => {
        Alert.alert(
            'Delete Chat',
            'Are you sure you want to delete this chat?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: () => {
                        // TODO: Implement delete
                    }
                },
            ]
        );
    };

    const formatTime = (timestamp: Date) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return format(date, 'HH:mm');
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return format(date, 'EEEE');
        } else {
            return format(date, 'dd/MM/yyyy');
        }
    };

    const renderChatItem = ({ item }: { item: any }) => {
        const otherMember = getOtherMember(item.members);
        const title = item.type === 'group' ? item.title : otherMember?.name;
        const avatar = item.type === 'group' ? item.avatarUrl : otherMember?.avatarUrl;
        const lastMessageTime = item.lastMessage ? formatTime(item.lastMessage.timestamp) : '';
        const isPinned = item.pinnedBy?.includes(user?.id);
        const isMuted = user?.id && item.mutedUntil && item.mutedUntil[user.id] && new Date(item.mutedUntil[user.id]) > new Date();
        const isOwnMessage = item.lastMessage?.senderId === user?.id;

        // Get message preview with sender name for groups
        let messagePreview = item.lastMessage?.text || 'No messages yet';
        if (item.type === 'group' && item.lastMessage && !isOwnMessage) {
            const sender = item.members.find((m: any) => (m.id || m._id) === item.lastMessage.senderId);
            if (sender) {
                messagePreview = `${sender.name}: ${messagePreview}`;
            }
        }

        // Truncate long messages
        if (messagePreview.length > 35) {
            messagePreview = messagePreview.substring(0, 35) + '...';
        }

        return (
            <TouchableOpacity
                style={[styles.chatItem, isPinned && styles.pinnedChat]}
                onPress={() => {
                    dispatch(setCurrentConversation(item));
                    navigation.navigate('Chat', { conversationId: item.id, title });
                }}
                onLongPress={() => {
                    Alert.alert(
                        title,
                        'Choose an action',
                        [
                            {
                                text: isPinned ? 'Unpin' : 'Pin',
                                onPress: () => handlePinPress(item.id, isPinned),
                            },
                            {
                                text: isMuted ? 'Unmute' : 'Mute',
                                onPress: () => handleMutePress(item.id, isMuted),
                            },
                            {
                                text: 'Archive',
                                onPress: () => handleArchive(item.id),
                            },
                            {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => handleDelete(item.id),
                            },
                            { text: 'Cancel', style: 'cancel' },
                        ]
                    );
                }}
            >
                <Image
                    source={{
                        uri: avatar || `https://ui-avatars.com/api/?name=${title || 'User'}&background=25D366&color=fff`
                    }}
                    style={styles.avatar}
                />
                <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                        <Text style={[styles.chatName, item.unreadCount > 0 && styles.unreadName]} numberOfLines={1}>
                            {title}
                        </Text>
                        <View style={styles.timeContainer}>
                            <Text style={[styles.time, item.unreadCount > 0 && styles.unreadTime]}>
                                {lastMessageTime}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.messageRow}>
                        <View style={styles.messagePreview}>
                            {isOwnMessage && (
                                <Text style={styles.checkmark}>✓✓ </Text>
                            )}
                            <Text style={[styles.lastMessage, item.unreadCount > 0 && styles.unreadMessage]} numberOfLines={1}>
                                {messagePreview}
                            </Text>
                        </View>
                        <View style={styles.rightInfo}>
                            {isMuted && (
                                <IconButton icon="volume-off" size={16} iconColor="#8696A0" style={styles.smallIcon} />
                            )}
                            {item.unreadCount > 0 && (
                                <View style={styles.unreadBadge}>
                                    <Text style={styles.unreadText}>
                                        {item.unreadCount > 99 ? '99+' : item.unreadCount}
                                    </Text>
                                </View>
                            )}
                            {isPinned && (
                                <IconButton icon="pin" size={14} iconColor="#8696A0" style={styles.smallIcon} />
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                renderItem={renderChatItem}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <IconButton icon="forum-outline" size={80} iconColor="#E5E5E5" />
                        <Text style={styles.emptyText}>No chats yet</Text>
                        <Text style={styles.emptySubtext}>Tap the button below to start a new chat</Text>
                    </View>
                }
                contentContainerStyle={conversations.length === 0 && styles.emptyList}
            />
            <FAB
                style={styles.fab}
                icon="message-plus"
                color="#fff"
                onPress={() => navigation.navigate('NewChat')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatItem: {
        flexDirection: 'row',
        padding: SPACING.md,
        backgroundColor: '#fff',
    },
    pinnedChat: {
        backgroundColor: '#F0F2F5',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: SPACING.md,
    },
    chatInfo: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
        flex: 1,
    },
    unreadName: {
        fontWeight: '700',
        color: '#000',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: 13,
        color: '#8696A0',
    },
    unreadTime: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    messagePreview: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkmark: {
        fontSize: 14,
        color: '#53BDEB',
        marginRight: 2,
    },
    lastMessage: {
        fontSize: 15,
        color: '#667781',
        flex: 1,
    },
    unreadMessage: {
        color: '#000',
        fontWeight: '500',
    },
    rightInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    unreadBadge: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginLeft: 4,
    },
    unreadText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    smallIcon: {
        margin: 0,
        padding: 0,
    },
    divider: {
        marginLeft: 80,
        backgroundColor: '#E9EDEF',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyList: {
        flexGrow: 1,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#8696A0',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#8696A0',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.primary,
    },
});
