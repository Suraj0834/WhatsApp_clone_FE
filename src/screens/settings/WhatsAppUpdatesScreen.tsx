import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { List, Avatar, IconButton, Chip, Divider } from 'react-native-paper';

interface StatusUpdate {
    id: string;
    type: 'privacy' | 'security' | 'feature' | 'update';
    title: string;
    description: string;
    date: Date;
    icon: string;
    read: boolean;
}

export const WhatsAppUpdatesScreen = () => {
    const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

    const [updates, setUpdates] = useState<StatusUpdate[]>([
        {
            id: '1',
            type: 'feature',
            title: 'New Feature: Communities',
            description: 'Organize your group chats with Communities. Bring together separate groups under one umbrella.',
            date: new Date('2024-12-05T10:00:00'),
            icon: 'account-group',
            read: false,
        },
        {
            id: '2',
            type: 'security',
            title: 'Enhanced Privacy Settings',
            description: 'Control who can see your profile photo, about, and last seen with new privacy options.',
            date: new Date('2024-12-01T14:30:00'),
            icon: 'shield-lock',
            read: false,
        },
        {
            id: '3',
            type: 'update',
            title: 'App Update Available',
            description: 'Version 2.23.25 is now available with bug fixes and performance improvements.',
            date: new Date('2024-11-28T09:00:00'),
            icon: 'download',
            read: true,
        },
        {
            id: '4',
            type: 'feature',
            title: 'Polls in Groups',
            description: 'Create polls to get quick feedback from group members. Ask questions and see results instantly.',
            date: new Date('2024-11-25T16:00:00'),
            icon: 'poll',
            read: true,
        },
        {
            id: '5',
            type: 'privacy',
            title: 'Privacy Policy Update',
            description: 'We\'ve updated our privacy policy. Review the changes to understand how we protect your data.',
            date: new Date('2024-11-20T11:00:00'),
            icon: 'file-document',
            read: true,
        },
        {
            id: '6',
            type: 'feature',
            title: 'View Once Messages',
            description: 'Send photos and videos that can be viewed only once, then disappear automatically.',
            date: new Date('2024-11-15T13:30:00'),
            icon: 'eye-off',
            read: true,
        },
    ]);

    const filteredUpdates = filterType === 'unread'
        ? updates.filter((u) => !u.read)
        : updates;

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'feature':
                return '#25D366';
            case 'security':
                return '#2196F3';
            case 'privacy':
                return '#FF9800';
            case 'update':
                return '#9C27B0';
            default:
                return '#667781';
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'feature':
                return 'NEW';
            case 'security':
                return 'SECURITY';
            case 'privacy':
                return 'PRIVACY';
            case 'update':
                return 'UPDATE';
            default:
                return '';
        }
    };

    const handleMarkAsRead = (updateId: string) => {
        setUpdates(
            updates.map((update) =>
                update.id === updateId ? { ...update, read: true } : update
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setUpdates(updates.map((update) => ({ ...update, read: true })));
        Alert.alert('Success', 'All updates marked as read');
    };

    const handleUpdateDetails = (update: StatusUpdate) => {
        handleMarkAsRead(update.id);
        Alert.alert(
            update.title,
            `${update.description}\n\n${formatDate(update.date)}`,
            [{ text: 'OK' }]
        );
    };

    const unreadCount = updates.filter((u) => !u.read).length;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerTitle}>WhatsApp Updates</Text>
                        <Text style={styles.headerSubtitle}>
                            Stay informed about new features and improvements
                        </Text>
                    </View>
                    {unreadCount > 0 && (
                        <TouchableOpacity onPress={handleMarkAllAsRead}>
                            <Text style={styles.markAllRead}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.filters}>
                    <Chip
                        selected={filterType === 'all'}
                        onPress={() => setFilterType('all')}
                        style={styles.chip}
                    >
                        All ({updates.length})
                    </Chip>
                    <Chip
                        selected={filterType === 'unread'}
                        onPress={() => setFilterType('unread')}
                        style={styles.chip}
                    >
                        Unread ({unreadCount})
                    </Chip>
                </View>
            </View>

            <ScrollView style={styles.updatesList}>
                {filteredUpdates.map((update) => (
                    <TouchableOpacity
                        key={update.id}
                        style={[
                            styles.updateItem,
                            !update.read && styles.updateItemUnread,
                        ]}
                        onPress={() => handleUpdateDetails(update)}
                    >
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: getTypeColor(update.type) + '20' },
                            ]}
                        >
                            <IconButton
                                icon={update.icon}
                                size={24}
                                iconColor={getTypeColor(update.type)}
                            />
                        </View>

                        <View style={styles.updateContent}>
                            <View style={styles.updateHeader}>
                                <Text style={styles.updateTitle}>{update.title}</Text>
                                {!update.read && <View style={styles.unreadDot} />}
                            </View>
                            <Text style={styles.updateDescription} numberOfLines={2}>
                                {update.description}
                            </Text>
                            <View style={styles.updateFooter}>
                                <View
                                    style={[
                                        styles.typeBadge,
                                        { backgroundColor: getTypeColor(update.type) },
                                    ]}
                                >
                                    <Text style={styles.typeBadgeText}>
                                        {getTypeBadge(update.type)}
                                    </Text>
                                </View>
                                <Text style={styles.updateDate}>{formatDate(update.date)}</Text>
                            </View>
                        </View>

                        <IconButton icon="chevron-right" size={20} iconColor="#667781" />
                    </TouchableOpacity>
                ))}

                {filteredUpdates.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>✓</Text>
                        <Text style={styles.emptyStateText}>
                            You're all caught up!
                        </Text>
                        <Text style={styles.emptyStateSubtext}>
                            No unread updates at the moment
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#F7F8FA',
        paddingBottom: 12,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#667781',
    },
    markAllRead: {
        fontSize: 14,
        fontWeight: '600',
        color: '#25D366',
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    chip: {
        marginRight: 8,
    },
    updatesList: {
        flex: 1,
    },
    updateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    updateItemUnread: {
        backgroundColor: '#F7FCF9',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    updateContent: {
        flex: 1,
    },
    updateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    updateTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#25D366',
        marginLeft: 8,
    },
    updateDescription: {
        fontSize: 14,
        color: '#667781',
        lineHeight: 20,
        marginBottom: 8,
    },
    updateFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    typeBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
    },
    updateDate: {
        fontSize: 12,
        color: '#667781',
    },
    emptyState: {
        paddingVertical: 80,
        alignItems: 'center',
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
        color: '#25D366',
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#667781',
    },
});
