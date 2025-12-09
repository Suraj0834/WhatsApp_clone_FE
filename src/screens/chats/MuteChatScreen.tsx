import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Searchbar, Avatar, IconButton, RadioButton } from 'react-native-paper';

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    muted: boolean;
    mutedUntil?: Date;
    isGroup: boolean;
}

type MuteDuration = '8hours' | '1week' | 'always';

export const MuteChatScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const [chats, setChats] = useState<Chat[]>([
        {
            id: '1',
            name: 'Work Team',
            lastMessage: 'Meeting at 3 PM',
            muted: true,
            mutedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isGroup: true,
        },
        {
            id: '2',
            name: 'School Group',
            lastMessage: 'Homework due tomorrow',
            muted: true,
            mutedUntil: undefined, // Always muted
            isGroup: true,
        },
        {
            id: '3',
            name: 'Sarah Johnson',
            lastMessage: 'Thanks for the update!',
            muted: false,
            isGroup: false,
        },
        {
            id: '4',
            name: 'Family Chat',
            lastMessage: 'Dinner plans?',
            muted: false,
            isGroup: true,
        },
        {
            id: '5',
            name: 'John Doe',
            lastMessage: 'See you tomorrow',
            muted: false,
            isGroup: false,
        },
    ]);

    const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const mutedChats = filteredChats.filter((c) => c.muted);
    const unmutedChats = filteredChats.filter((c) => !c.muted);

    const getMuteDurationText = (chat: Chat): string => {
        if (!chat.muted) return 'Not muted';
        if (!chat.mutedUntil) return 'Muted forever';
        
        const now = new Date();
        const diffMs = chat.mutedUntil.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

        if (diffHours < 24) {
            return `Muted for ${diffHours}h`;
        } else if (diffDays < 7) {
            return `Muted for ${diffDays}d`;
        } else {
            return `Muted until ${chat.mutedUntil.toLocaleDateString()}`;
        }
    };

    const handleMuteChat = (id: string) => {
        const chat = chats.find((c) => c.id === id);
        if (!chat) return;

        if (chat.muted) {
            // Unmute
            Alert.alert(
                'Unmute Chat',
                `Unmute "${chat.name}"?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Unmute',
                        onPress: () => {
                            setChats(
                                chats.map((c) =>
                                    c.id === id
                                        ? { ...c, muted: false, mutedUntil: undefined }
                                        : c
                                )
                            );
                        },
                    },
                ]
            );
        } else {
            // Mute with duration selection
            showMuteDurationDialog(id, chat.name);
        }
    };

    const showMuteDurationDialog = (id: string, name: string) => {
        Alert.alert(
            'Mute Notifications',
            `Mute "${name}" for:`,
            [
                {
                    text: '8 hours',
                    onPress: () => applyMute(id, '8hours'),
                },
                {
                    text: '1 week',
                    onPress: () => applyMute(id, '1week'),
                },
                {
                    text: 'Always',
                    onPress: () => applyMute(id, 'always'),
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const applyMute = (id: string, duration: MuteDuration) => {
        let mutedUntil: Date | undefined;

        switch (duration) {
            case '8hours':
                mutedUntil = new Date(Date.now() + 8 * 60 * 60 * 1000);
                break;
            case '1week':
                mutedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                break;
            case 'always':
                mutedUntil = undefined;
                break;
        }

        setChats(
            chats.map((c) =>
                c.id === id ? { ...c, muted: true, mutedUntil } : c
            )
        );
    };

    const handleUnmuteAll = () => {
        Alert.alert(
            'Unmute All Chats',
            'Unmute all muted chats?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unmute All',
                    onPress: () => {
                        setChats(
                            chats.map((c) => ({ ...c, muted: false, mutedUntil: undefined }))
                        );
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
                    <View style={styles.nameRow}>
                        <Text style={styles.chatName}>{item.name}</Text>
                        {item.isGroup && <Text style={styles.groupIcon}>👥</Text>}
                        {item.muted && <Text style={styles.muteIcon}>🔕</Text>}
                    </View>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                    {item.muted && (
                        <Text style={styles.muteDuration}>
                            {getMuteDurationText(item)}
                        </Text>
                    )}
                </View>
                <IconButton
                    icon={item.muted ? 'bell-off' : 'bell-outline'}
                    size={24}
                    iconColor={item.muted ? '#667781' : '#25D366'}
                    onPress={() => handleMuteChat(item.id)}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mute Chats</Text>
                <Text style={styles.headerSubtitle}>
                    Mute notifications for chats
                </Text>
            </View>

            <Searchbar
                placeholder="Search chats"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchbar}
            />

            <View style={styles.mutedInfo}>
                <Text style={styles.mutedInfoText}>
                    🔕 {mutedChats.length} chat{mutedChats.length !== 1 ? 's' : ''} muted
                </Text>
                {mutedChats.length > 0 && (
                    <TouchableOpacity onPress={handleUnmuteAll}>
                        <Text style={styles.unmuteAllLink}>Unmute All</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={[...mutedChats, ...unmutedChats]}
                renderItem={renderChat}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    mutedChats.length > 0 && unmutedChats.length > 0 ? (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Other Chats</Text>
                        </View>
                    ) : null
                }
                ListHeaderComponentStyle={
                    mutedChats.length > 0 ? styles.listHeader : undefined
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
                    ℹ️ Muted chats won't send notifications but messages will still appear
                    in your chat list. You can choose to mute for 8 hours, 1 week, or
                    always.
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
    mutedInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    mutedInfoText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#667781',
    },
    unmuteAllLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#25D366',
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
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginRight: 6,
    },
    groupIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    muteIcon: {
        fontSize: 14,
    },
    lastMessage: {
        fontSize: 14,
        color: '#667781',
        marginBottom: 2,
    },
    muteDuration: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
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
        backgroundColor: '#FFF9E6',
        borderRadius: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
});
