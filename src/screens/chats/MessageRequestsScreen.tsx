import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Searchbar, Avatar, IconButton, Chip, FAB } from 'react-native-paper';

interface MessageRequest {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
    avatar?: string;
    isGroup: boolean;
}

export const MessageRequestsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState<'requests' | 'spam'>('requests');

    const [requests, setRequests] = useState<MessageRequest[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            lastMessage: 'Hi! I found your contact from the community group',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            unreadCount: 3,
            isGroup: false,
        },
        {
            id: '2',
            name: 'Tech Meetup 2024',
            lastMessage: 'Welcome to our tech meetup group!',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            unreadCount: 1,
            isGroup: true,
        },
        {
            id: '3',
            name: 'Mark Anderson',
            lastMessage: 'Hey, can we discuss the project?',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            unreadCount: 2,
            isGroup: false,
        },
        {
            id: '4',
            name: 'Lisa Chen',
            lastMessage: 'Thanks for the recommendation!',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            unreadCount: 1,
            isGroup: false,
        },
    ]);

    const [spamMessages, setSpamMessages] = useState<MessageRequest[]>([
        {
            id: 's1',
            name: 'Unknown Number',
            lastMessage: 'Congratulations! You won a prize...',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            unreadCount: 5,
            isGroup: false,
        },
        {
            id: 's2',
            name: 'Business Opportunity',
            lastMessage: 'Make money fast with this...',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            unreadCount: 2,
            isGroup: false,
        },
    ]);

    const currentData = selectedTab === 'requests' ? requests : spamMessages;

    const filteredData = currentData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) {
            return 'Just now';
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const handleAcceptRequest = (id: string) => {
        const request = requests.find((r) => r.id === id);
        if (!request) return;

        Alert.alert(
            'Accept Request',
            `Accept message request from ${request.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Accept',
                    onPress: () => {
                        setRequests(requests.filter((r) => r.id !== id));
                        Alert.alert('Success', `Added ${request.name} to your chats`);
                    },
                },
            ]
        );
    };

    const handleDeleteRequest = (id: string) => {
        const request = currentData.find((r) => r.id === id);
        if (!request) return;

        Alert.alert(
            'Delete Request',
            `Delete message request from ${request.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (selectedTab === 'requests') {
                            setRequests(requests.filter((r) => r.id !== id));
                        } else {
                            setSpamMessages(spamMessages.filter((r) => r.id !== id));
                        }
                    },
                },
            ]
        );
    };

    const handleBlockRequest = (id: string) => {
        const request = currentData.find((r) => r.id === id);
        if (!request) return;

        Alert.alert(
            'Block Contact',
            `Block ${request.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Block',
                    style: 'destructive',
                    onPress: () => {
                        if (selectedTab === 'requests') {
                            setRequests(requests.filter((r) => r.id !== id));
                        } else {
                            setSpamMessages(spamMessages.filter((r) => r.id !== id));
                        }
                        Alert.alert('Blocked', `${request.name} has been blocked`);
                    },
                },
            ]
        );
    };

    const handleReportSpam = (id: string) => {
        const request = currentData.find((r) => r.id === id);
        if (!request) return;

        Alert.alert(
            'Report Spam',
            `Report ${request.name} as spam?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Report',
                    onPress: () => {
                        if (selectedTab === 'requests') {
                            setRequests(requests.filter((r) => r.id !== id));
                            setSpamMessages([...spamMessages, { ...request }]);
                        }
                        Alert.alert('Success', 'Message reported as spam');
                    },
                },
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            selectedTab === 'requests' ? 'Clear All Requests' : 'Clear All Spam',
            `Delete all ${selectedTab === 'requests' ? 'message requests' : 'spam messages'}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                        if (selectedTab === 'requests') {
                            setRequests([]);
                        } else {
                            setSpamMessages([]);
                        }
                    },
                },
            ]
        );
    };

    const renderRequest = ({ item }: { item: MessageRequest }) => {
        return (
            <TouchableOpacity style={styles.requestCard}>
                <View style={styles.requestHeader}>
                    <Avatar.Text
                        size={48}
                        label={item.name.charAt(0)}
                        style={styles.avatar}
                    />
                    <View style={styles.requestInfo}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>{item.name}</Text>
                            {item.isGroup && (
                                <View style={styles.groupBadge}>
                                    <Text style={styles.groupText}>Group</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.lastMessage} numberOfLines={2}>
                            {item.lastMessage}
                        </Text>
                        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                    </View>
                    {item.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>

                {selectedTab === 'requests' ? (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.acceptButton]}
                            onPress={() => handleAcceptRequest(item.id)}
                        >
                            <Text style={styles.acceptText}>✓ Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteRequest(item.id)}
                        >
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.blockButton]}
                            onPress={() => handleBlockRequest(item.id)}
                        >
                            <Text style={styles.blockText}>Block</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteRequest(item.id)}
                        >
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.blockButton]}
                            onPress={() => handleBlockRequest(item.id)}
                        >
                            <Text style={styles.blockText}>Block</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Message Requests</Text>
                <Text style={styles.headerSubtitle}>
                    Messages from people not in your contacts
                </Text>
            </View>

            <Searchbar
                placeholder="Search requests"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchbar}
            />

            <View style={styles.tabs}>
                <Chip
                    selected={selectedTab === 'requests'}
                    onPress={() => setSelectedTab('requests')}
                    style={styles.chip}
                >
                    Requests ({requests.length})
                </Chip>
                <Chip
                    selected={selectedTab === 'spam'}
                    onPress={() => setSelectedTab('spam')}
                    style={styles.chip}
                >
                    Spam ({spamMessages.length})
                </Chip>
                {filteredData.length > 0 && (
                    <TouchableOpacity onPress={handleClearAll}>
                        <Text style={styles.clearAll}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={filteredData}
                renderItem={renderRequest}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>
                            {selectedTab === 'requests' ? '✉️' : '🚫'}
                        </Text>
                        <Text style={styles.emptyStateText}>
                            {selectedTab === 'requests'
                                ? 'No message requests'
                                : 'No spam messages'}
                        </Text>
                    </View>
                }
            />
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
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 12,
        alignItems: 'center',
    },
    chip: {
        marginRight: 8,
    },
    clearAll: {
        fontSize: 14,
        color: '#F44336',
        fontWeight: '600',
        marginLeft: 'auto',
    },
    list: {
        paddingBottom: 16,
    },
    requestCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    requestHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    avatar: {
        backgroundColor: '#25D366',
        marginRight: 12,
    },
    requestInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginRight: 8,
    },
    groupBadge: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    groupText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#667781',
    },
    lastMessage: {
        fontSize: 14,
        color: '#667781',
        marginBottom: 4,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    unreadBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    acceptButton: {
        backgroundColor: '#25D366',
    },
    acceptText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    deleteButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    deleteText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#667781',
    },
    blockButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F44336',
    },
    blockText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F44336',
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
});
