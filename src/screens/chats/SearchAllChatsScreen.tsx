import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Searchbar, Avatar, Chip } from 'react-native-paper';

interface Message {
    id: string;
    chatName: string;
    messageText: string;
    timestamp: Date;
    senderName: string;
    isGroup: boolean;
}

export const SearchAllChatsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<'all' | 'messages' | 'media' | 'links' | 'docs'>('all');

    const [allMessages] = useState<Message[]>([
        {
            id: '1',
            chatName: 'Sarah Johnson',
            messageText: 'Can you send me the project report by tomorrow?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            senderName: 'Sarah',
            isGroup: false,
        },
        {
            id: '2',
            chatName: 'Work Team',
            messageText: 'Meeting scheduled for 3 PM in conference room',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            senderName: 'David',
            isGroup: true,
        },
        {
            id: '3',
            chatName: 'Family Group',
            messageText: 'Don\'t forget Mom\'s birthday dinner on Saturday',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            senderName: 'Sister',
            isGroup: true,
        },
        {
            id: '4',
            chatName: 'John Doe',
            messageText: 'Thanks for your help with the presentation!',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            senderName: 'John',
            isGroup: false,
        },
        {
            id: '5',
            chatName: 'Best Friends',
            messageText: 'Let\'s plan a trip to the beach next weekend',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            senderName: 'Alex',
            isGroup: true,
        },
        {
            id: '6',
            chatName: 'Lisa Chen',
            messageText: 'Got the tickets for the concert! So excited!',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            senderName: 'Lisa',
            isGroup: false,
        },
        {
            id: '7',
            chatName: 'Project Team',
            messageText: 'The client loved our proposal! Great job everyone',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            senderName: 'Manager',
            isGroup: true,
        },
        {
            id: '8',
            chatName: 'Mark Anderson',
            messageText: 'Can we reschedule our meeting to next week?',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            senderName: 'Mark',
            isGroup: false,
        },
    ]);

    const filteredMessages = allMessages.filter((message) => {
        const matchesSearch =
            searchQuery === '' ||
            message.messageText.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.chatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.senderName.toLowerCase().includes(searchQuery.toLowerCase());

        // Type filtering can be extended based on message content type
        return matchesSearch;
    });

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const handleMessagePress = (message: Message) => {
        Alert.alert(
            message.chatName,
            `Jump to this message in the chat?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Chat', onPress: () => {} },
            ]
        );
    };

    const highlightSearchTerm = (text: string, query: string): string => {
        if (!query) return text;
        // Simple highlight simulation (in real app, use proper text highlighting)
        return text;
    };

    const renderMessage = ({ item }: { item: Message }) => {
        return (
            <TouchableOpacity
                style={styles.messageCard}
                onPress={() => handleMessagePress(item)}
            >
                <View style={styles.messageHeader}>
                    <Avatar.Text
                        size={48}
                        label={item.chatName.charAt(0)}
                        style={styles.avatar}
                    />
                    <View style={styles.messageInfo}>
                        <View style={styles.chatNameRow}>
                            <Text style={styles.chatName}>{item.chatName}</Text>
                            {item.isGroup && (
                                <Text style={styles.groupIcon}>👥</Text>
                            )}
                        </View>
                        {item.isGroup && (
                            <Text style={styles.senderName}>{item.senderName}:</Text>
                        )}
                        <Text style={styles.messageText} numberOfLines={2}>
                            {item.messageText}
                        </Text>
                    </View>
                    <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Search Chats</Text>
                <Text style={styles.headerSubtitle}>
                    Search across all your conversations
                </Text>
            </View>

            <Searchbar
                placeholder="Search messages, contacts, or groups"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchbar}
                autoFocus
            />

            <View style={styles.filters}>
                <Chip
                    selected={selectedType === 'all'}
                    onPress={() => setSelectedType('all')}
                    style={styles.chip}
                >
                    All
                </Chip>
                <Chip
                    selected={selectedType === 'messages'}
                    onPress={() => setSelectedType('messages')}
                    style={styles.chip}
                >
                    Messages
                </Chip>
                <Chip
                    selected={selectedType === 'media'}
                    onPress={() => setSelectedType('media')}
                    style={styles.chip}
                >
                    Media
                </Chip>
                <Chip
                    selected={selectedType === 'links'}
                    onPress={() => setSelectedType('links')}
                    style={styles.chip}
                >
                    Links
                </Chip>
                <Chip
                    selected={selectedType === 'docs'}
                    onPress={() => setSelectedType('docs')}
                    style={styles.chip}
                >
                    Docs
                </Chip>
            </View>

            {searchQuery === '' ? (
                <View style={styles.emptySearch}>
                    <Text style={styles.emptySearchIcon}>🔍</Text>
                    <Text style={styles.emptySearchText}>
                        Start typing to search
                    </Text>
                    <Text style={styles.emptySearchSubtext}>
                        Search through messages, media, links, and documents
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredMessages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={
                        filteredMessages.length > 0 ? (
                            <View style={styles.resultsHeader}>
                                <Text style={styles.resultsText}>
                                    {filteredMessages.length} result
                                    {filteredMessages.length !== 1 ? 's' : ''} found
                                </Text>
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateIcon}>🔍</Text>
                            <Text style={styles.emptyStateText}>No results found</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Try different keywords
                            </Text>
                        </View>
                    }
                />
            )}
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
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexWrap: 'wrap',
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    resultsHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F7F8FA',
        marginBottom: 8,
    },
    resultsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#667781',
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    messageCard: {
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    messageHeader: {
        flexDirection: 'row',
    },
    avatar: {
        backgroundColor: '#25D366',
        marginRight: 12,
    },
    messageInfo: {
        flex: 1,
    },
    chatNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
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
    senderName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#667781',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 14,
        color: '#000',
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 12,
        color: '#667781',
        marginLeft: 8,
    },
    emptySearch: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptySearchIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptySearchText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    emptySearchSubtext: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
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
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#667781',
    },
});
