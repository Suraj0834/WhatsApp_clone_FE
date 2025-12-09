import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Searchbar, Avatar, IconButton } from 'react-native-paper';

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
    pinned: boolean;
    isGroup: boolean;
}

export const PinChatScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const [chats, setChats] = useState<Chat[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            lastMessage: 'See you at the meeting!',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            unreadCount: 2,
            pinned: true,
            isGroup: false,
        },
        {
            id: '2',
            name: 'Family Group',
            lastMessage: 'Mom: Don\'t forget dinner tonight',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            unreadCount: 5,
            pinned: true,
            isGroup: true,
        },
        {
            id: '3',
            name: 'Work Team',
            lastMessage: 'David: Project update shared',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            unreadCount: 0,
            pinned: true,
            isGroup: true,
        },
        {
            id: '4',
            name: 'John Doe',
            lastMessage: 'Thanks for the help!',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            unreadCount: 0,
            pinned: false,
            isGroup: false,
        },
        {
            id: '5',
            name: 'Best Friends',
            lastMessage: 'Alex: Let\'s plan the trip',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            unreadCount: 3,
            pinned: false,
            isGroup: true,
        },
        {
            id: '6',
            name: 'Lisa Chen',
            lastMessage: 'Got it, will do!',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
            unreadCount: 0,
            pinned: false,
            isGroup: false,
        },
    ]);

    const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinnedChats = filteredChats.filter((c) => c.pinned);
    const unpinnedChats = filteredChats.filter((c) => !c.pinned);

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));

        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else {
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) {
                return `${diffHours}h ago`;
            } else {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
        }
    };

    const handleTogglePin = (id: string) => {
        const chat = chats.find((c) => c.id === id);
        if (!chat) return;

        const currentPinnedCount = chats.filter((c) => c.pinned).length;

        if (!chat.pinned && currentPinnedCount >= 3) {
            Alert.alert(
                'Pin Limit Reached',
                'You can only pin up to 3 chats. Unpin a chat to pin this one.',
                [{ text: 'OK' }]
            );
            return;
        }

        setChats(
            chats.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
        );
    };

    const handleUnpinAll = () => {
        Alert.alert(
            'Unpin All Chats',
            'Unpin all pinned chats?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unpin All',
                    style: 'destructive',
                    onPress: () => {
                        setChats(chats.map((c) => ({ ...c, pinned: false })));
                    },
                },
            ]
        );
    };

    const renderChat = ({ item }: { item: Chat }) => {
        return (
            <TouchableOpacity style={styles.chatCard}>
                <Avatar.Text
                    size={56}
                    label={item.name.charAt(0)}
                    style={styles.avatar}
                />
                <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                        <View style={styles.nameRow}>
                            <Text style={styles.chatName}>{item.name}</Text>
                            {item.isGroup && (
                                <Text style={styles.groupIcon}>👥</Text>
                            )}
                        </View>
                        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                    </View>
                    <View style={styles.messageRow}>
                        <Text style={styles.lastMessage} numberOfLines={1}>
                            {item.lastMessage}
                        </Text>
                        {item.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{item.unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <IconButton
                    icon={item.pinned ? 'pin' : 'pin-outline'}
                    size={24}
                    iconColor={item.pinned ? '#25D366' : '#667781'}
                    onPress={() => handleTogglePin(item.id)}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pin Chats</Text>
                <Text style={styles.headerSubtitle}>
                    Pin important chats to the top (max 3)
                </Text>
            </View>

            <Searchbar
                placeholder="Search chats"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchbar}
            />

            <View style={styles.pinnedInfo}>
                <Text style={styles.pinnedInfoText}>
                    📌 {pinnedChats.length} of 3 chats pinned
                </Text>
                {pinnedChats.length > 0 && (
                    <TouchableOpacity onPress={handleUnpinAll}>
                        <Text style={styles.unpinAllLink}>Unpin All</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={[...pinnedChats, ...unpinnedChats]}
                renderItem={renderChat}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    pinnedChats.length > 0 && unpinnedChats.length > 0 ? (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Other Chats</Text>
                        </View>
                    ) : null
                }
                ListHeaderComponentStyle={
                    pinnedChats.length > 0 ? styles.listHeader : undefined
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>💬</Text>
                        <Text style={styles.emptyStateText}>No chats found</Text>
                    </View>
                }
            />

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    ℹ️ Pinned chats stay at the top of your chat list. You can pin up to 3
                    chats at a time.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        backgroundColor: '#F7F8FA',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#667781',
    },
    searchbar: {
        marginHorizontal: 16,
        marginVertical: 16,
        backgroundColor: '#F7F8FA',
    },
    pinnedInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    pinnedInfoText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#667781',
    },
    unpinAllLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F44336',
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    listHeader: {
        marginTop: 16,
    },
    sectionHeader: {
        paddingVertical: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#667781',
        textTransform: 'uppercase',
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatar: {
        backgroundColor: '#25D366',
        marginRight: 12,
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
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginRight: 6,
    },
    groupIcon: {
        fontSize: 14,
    },
    timestamp: {
        fontSize: 12,
        color: '#667781',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        fontSize: 14,
        color: '#667781',
        flex: 1,
    },
    unreadBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginLeft: 8,
    },
    unreadText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
    },
    infoBox: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        margin: 16,
        padding: 16,
        backgroundColor: '#E7F5EC',
        borderRadius: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
});
