import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Avatar, IconButton, FAB, Searchbar } from 'react-native-paper';

interface CallLog {
    id: string;
    contactName: string;
    contactAvatar?: string;
    type: 'incoming' | 'outgoing' | 'missed' | 'video';
    timestamp: Date;
    duration?: number;
}

export const CallHistoryScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const [callLogs] = useState<CallLog[]>([
        {
            id: '1',
            contactName: 'Alice Johnson',
            type: 'video',
            timestamp: new Date('2024-12-08T14:30:00'),
            duration: 185,
        },
        {
            id: '2',
            contactName: 'Bob Smith',
            type: 'missed',
            timestamp: new Date('2024-12-08T10:15:00'),
        },
        {
            id: '3',
            contactName: 'Charlie Brown',
            type: 'outgoing',
            timestamp: new Date('2024-12-07T16:45:00'),
            duration: 320,
        },
        {
            id: '4',
            contactName: 'Diana Prince',
            type: 'incoming',
            timestamp: new Date('2024-12-07T09:20:00'),
            duration: 540,
        },
        {
            id: '5',
            contactName: 'Alice Johnson',
            type: 'outgoing',
            timestamp: new Date('2024-12-06T18:30:00'),
            duration: 125,
        },
    ]);

    const filteredLogs = callLogs.filter(log =>
        log.contactName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getCallIcon = (type: string) => {
        switch (type) {
            case 'incoming':
                return 'phone-incoming';
            case 'outgoing':
                return 'phone-outgoing';
            case 'missed':
                return 'phone-missed';
            case 'video':
                return 'video';
            default:
                return 'phone';
        }
    };

    const getCallIconColor = (type: string) => {
        return type === 'missed' ? '#F44336' : '#25D366';
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return 'Not connected';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const handleCallPress = (log: CallLog) => {
        Alert.alert('Call', `Call ${log.contactName}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Voice Call', onPress: () => {} },
            { text: 'Video Call', onPress: () => {} },
        ]);
    };

    const renderCallLog = ({ item }: { item: CallLog }) => (
        <TouchableOpacity
            style={styles.callItem}
            onPress={() => handleCallPress(item)}
        >
            {item.contactAvatar ? (
                <Avatar.Image size={50} source={{ uri: item.contactAvatar }} />
            ) : (
                <Avatar.Text
                    size={50}
                    label={item.contactName.substring(0, 2).toUpperCase()}
                    style={styles.avatar}
                />
            )}
            <View style={styles.callInfo}>
                <Text style={styles.contactName}>{item.contactName}</Text>
                <View style={styles.callDetails}>
                    <IconButton
                        icon={getCallIcon(item.type)}
                        iconColor={getCallIconColor(item.type)}
                        size={16}
                        style={styles.callIcon}
                    />
                    <Text
                        style={[
                            styles.callTime,
                            item.type === 'missed' && styles.missedCall,
                        ]}
                    >
                        {formatTimestamp(item.timestamp)}
                    </Text>
                </View>
            </View>
            <View style={styles.callActions}>
                {item.duration && (
                    <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
                )}
                <IconButton
                    icon={item.type === 'video' ? 'video' : 'phone'}
                    iconColor="#25D366"
                    size={24}
                    onPress={() => handleCallPress(item)}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search calls"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

            <FlatList
                data={filteredLogs}
                renderItem={renderCallLog}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>📞</Text>
                        <Text style={styles.emptyStateTitle}>No calls</Text>
                        <Text style={styles.emptyStateText}>
                            Your call history will appear here
                        </Text>
                    </View>
                }
            />

            <FAB
                icon="phone-plus"
                style={styles.fab}
                color="#fff"
                onPress={() => Alert.alert('New Call', 'Select a contact to call')}
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
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    searchBar: {
        elevation: 0,
        backgroundColor: '#F7F8FA',
    },
    listContainer: {
        paddingBottom: 80,
    },
    callItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatar: {
        backgroundColor: '#25D366',
    },
    callInfo: {
        flex: 1,
        marginLeft: 12,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    callDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    callIcon: {
        margin: 0,
        marginRight: -8,
    },
    callTime: {
        fontSize: 13,
        color: '#667781',
    },
    missedCall: {
        color: '#F44336',
    },
    callActions: {
        alignItems: 'flex-end',
    },
    duration: {
        fontSize: 12,
        color: '#667781',
        marginBottom: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 32,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#25D366',
    },
});
