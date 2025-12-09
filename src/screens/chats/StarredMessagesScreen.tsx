import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { IconButton, Searchbar } from 'react-native-paper';

interface StarredMessage {
    id: string;
    text: string;
    sender: string;
    chatName: string;
    timestamp: Date;
    type: 'text' | 'image' | 'video' | 'document';
}

export const StarredMessagesScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const [starredMessages] = useState<StarredMessage[]>([
        {
            id: '1',
            text: 'Meeting at 3 PM tomorrow',
            sender: 'John Doe',
            chatName: 'John Doe',
            timestamp: new Date('2024-01-15T14:30:00'),
            type: 'text',
        },
        {
            id: '2',
            text: 'Please review the attached document',
            sender: 'Alice Johnson',
            chatName: 'Project Team',
            timestamp: new Date('2024-01-14T10:00:00'),
            type: 'document',
        },
        {
            id: '3',
            text: 'Great job on the presentation! 👏',
            sender: 'Bob Smith',
            chatName: 'Bob Smith',
            timestamp: new Date('2024-01-13T16:45:00'),
            type: 'text',
        },
        {
            id: '4',
            text: 'Check out this video',
            sender: 'Mike Johnson',
            chatName: 'Family',
            timestamp: new Date('2024-01-12T09:15:00'),
            type: 'video',
        },
    ]);

    const filteredMessages = starredMessages.filter(message =>
        message.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.chatName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getMessageIcon = (type: string) => {
        switch (type) {
            case 'image':
                return '📷';
            case 'video':
                return '🎥';
            case 'document':
                return '📄';
            default:
                return null;
        }
    };

    const renderMessage = ({ item }: { item: StarredMessage }) => (
        <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.messageCard} activeOpacity={0.7}>
                <View style={styles.messageHeader}>
                    <View style={styles.chatInfo}>
                        <IconButton icon="forum" size={16} iconColor="#25D366" style={styles.chatIcon} />
                        <Text style={styles.chatName}>{item.chatName}</Text>
                    </View>
                    <Text style={styles.timestamp}>
                        {item.timestamp.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </Text>
                </View>
                
                <View style={styles.messageContent}>
                    {getMessageIcon(item.type) && (
                        <View style={styles.messageTypeIcon}>
                            <Text style={styles.messageIcon}>{getMessageIcon(item.type)}</Text>
                        </View>
                    )}
                    <Text style={styles.messageText} numberOfLines={3}>
                        {item.sender !== 'You' && (
                            <Text style={styles.senderName}>{item.sender}: </Text>
                        )}
                        {item.text}
                    </Text>
                </View>
                
                <View style={styles.messageFooter}>
                    <View style={styles.starBadge}>
                        <IconButton icon="star" iconColor="#FFA500" size={14} style={styles.starIcon} />
                        <Text style={styles.starText}>Starred</Text>
                    </View>
                    <View style={styles.messageActions}>
                        <IconButton
                            icon="reply"
                            iconColor="#25D366"
                            size={20}
                            onPress={() => {}}
                            style={styles.actionIcon}
                        />
                        <IconButton
                            icon="share-variant"
                            iconColor="#25D366"
                            size={20}
                            onPress={() => {}}
                            style={styles.actionIcon}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(255, 165, 0, 0.15)' }]}>
                    <IconButton icon="star" iconColor="#FFA500" size={32} />
                </View>
                <Text style={styles.headerTitle}>Starred Messages</Text>
                <Text style={styles.headerSubtitle}>
                    {starredMessages.length} starred message{starredMessages.length !== 1 ? 's' : ''}
                </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search starred messages..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    iconColor="#FFA500"
                    placeholderTextColor="#8696A0"
                />
            </View>

            {filteredMessages.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>⭐</Text>
                    <Text style={styles.emptyStateTitle}>No starred messages</Text>
                    <Text style={styles.emptyStateText}>
                        {searchQuery
                            ? 'No messages match your search'
                            : 'Tap and hold on any message and select star to find it here'}
                    </Text>
                </View>
            ) : (
                <View style={styles.section}>
                    <FlatList
                        data={filteredMessages}
                        renderItem={renderMessage}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
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
    searchContainer: {
        padding: 20,
        paddingBottom: 12,
    },
    searchBar: {
        backgroundColor: '#fff',
        elevation: 0,
        borderRadius: 12,
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
    section: {
        paddingHorizontal: 20,
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
    messageCard: {
        padding: 16,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    chatInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatIcon: {
        margin: 0,
        marginRight: 4,
    },
    chatName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#25D366',
    },
    timestamp: {
        fontSize: 12,
        color: '#8696A0',
    },
    messageContent: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    messageTypeIcon: {
        marginRight: 8,
        marginTop: 2,
    },
    messageIcon: {
        fontSize: 20,
    },
    messageText: {
        flex: 1,
        fontSize: 15,
        color: '#000',
        lineHeight: 22,
    },
    senderName: {
        fontWeight: '600',
        color: '#667781',
    },
    messageFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F2F5',
    },
    starBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    starIcon: {
        margin: 0,
        marginRight: -4,
    },
    starText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFA500',
    },
    messageActions: {
        flexDirection: 'row',
    },
    actionIcon: {
        margin: 0,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingTop: 60,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 20,
    },
});
