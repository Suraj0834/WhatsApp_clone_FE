import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    TextInput,
} from 'react-native';
import { IconButton, Chip, FAB } from 'react-native-paper';

interface AutoReply {
    id: string;
    name: string;
    message: string;
    keywords: string[];
    active: boolean;
    usageCount: number;
}

export const AutoReplyScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [autoReplies, setAutoReplies] = useState<AutoReply[]>([
        {
            id: '1',
            name: 'Business Hours',
            message: 'Thank you for contacting us! Our business hours are Monday-Friday, 9AM-6PM. We\'ll respond to your message during business hours.',
            keywords: ['hours', 'open', 'timing', 'schedule'],
            active: true,
            usageCount: 245,
        },
        {
            id: '2',
            name: 'Pricing Inquiry',
            message: 'Thanks for your interest! Please visit our website at www.example.com/pricing for detailed pricing information, or I can help you directly.',
            keywords: ['price', 'cost', 'pricing', 'quote', 'rate'],
            active: true,
            usageCount: 189,
        },
        {
            id: '3',
            name: 'Customer Support',
            message: 'We appreciate you reaching out! For technical support, please provide:\n1. Your order/account number\n2. Description of the issue\n3. Any error messages\n\nWe\'ll assist you shortly!',
            keywords: ['help', 'support', 'issue', 'problem', 'error'],
            active: true,
            usageCount: 312,
        },
        {
            id: '4',
            name: 'Location',
            message: 'We\'re located at 123 Main Street, San Francisco, CA 94105. You can also view our location on Google Maps: [link]',
            keywords: ['location', 'address', 'where', 'directions'],
            active: false,
            usageCount: 67,
        },
        {
            id: '5',
            name: 'Out of Office',
            message: 'I\'m currently out of office and will return on [date]. For urgent matters, please contact support@example.com',
            keywords: [],
            active: false,
            usageCount: 15,
        },
    ]);

    const filteredReplies = autoReplies.filter((reply) => {
        if (selectedFilter === 'active') return reply.active;
        if (selectedFilter === 'inactive') return !reply.active;
        return true;
    });

    const activeCount = autoReplies.filter((r) => r.active).length;
    const inactiveCount = autoReplies.filter((r) => !r.active).length;

    const handleToggleActive = (id: string) => {
        setAutoReplies(
            autoReplies.map((reply) =>
                reply.id === id ? { ...reply, active: !reply.active } : reply
            )
        );
    };

    const handleEditReply = (reply: AutoReply) => {
        Alert.alert(
            'Edit Auto Reply',
            `Edit "${reply.name}"`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Edit', onPress: () => {} },
            ]
        );
    };

    const handleDeleteReply = (id: string) => {
        const reply = autoReplies.find((r) => r.id === id);
        if (!reply) return;

        Alert.alert(
            'Delete Auto Reply',
            `Delete "${reply.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setAutoReplies(autoReplies.filter((r) => r.id !== id));
                        Alert.alert('Success', 'Auto reply deleted');
                    },
                },
            ]
        );
    };

    const handleTestReply = (reply: AutoReply) => {
        Alert.alert('Test Auto Reply', reply.message);
    };

    const handleCreateReply = () => {
        Alert.alert(
            'Create Auto Reply',
            'Create a new automatic reply',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Create', onPress: () => {} },
            ]
        );
    };

    const renderReply = ({ item }: { item: AutoReply }) => {
        return (
            <TouchableOpacity
                style={styles.replyCard}
                onPress={() => handleEditReply(item)}
            >
                <View style={styles.replyHeader}>
                    <View style={styles.replyTitleRow}>
                        <Text style={styles.replyName}>{item.name}</Text>
                        <View style={[styles.statusBadge, item.active && styles.statusBadgeActive]}>
                            <Text
                                style={[
                                    styles.statusText,
                                    item.active && styles.statusTextActive,
                                ]}
                            >
                                {item.active ? '● Active' : '○ Inactive'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.usageRow}>
                        <Text style={styles.usageText}>📊 Used {item.usageCount} times</Text>
                    </View>
                </View>

                <Text style={styles.replyMessage} numberOfLines={3}>
                    {item.message}
                </Text>

                {item.keywords.length > 0 && (
                    <View style={styles.keywordsRow}>
                        <Text style={styles.keywordsLabel}>Keywords:</Text>
                        <View style={styles.keywords}>
                            {item.keywords.slice(0, 3).map((keyword, index) => (
                                <View key={index} style={styles.keywordChip}>
                                    <Text style={styles.keywordText}>{keyword}</Text>
                                </View>
                            ))}
                            {item.keywords.length > 3 && (
                                <Text style={styles.moreKeywords}>
                                    +{item.keywords.length - 3} more
                                </Text>
                            )}
                        </View>
                    </View>
                )}

                <View style={styles.replyActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.toggleButton]}
                        onPress={() => handleToggleActive(item.id)}
                    >
                        <Text style={styles.toggleButtonText}>
                            {item.active ? 'Deactivate' : 'Activate'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.testButton]}
                        onPress={() => handleTestReply(item)}
                    >
                        <Text style={styles.testButtonText}>Test</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteReply(item.id)}
                    >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Auto Replies</Text>
                <Text style={styles.headerSubtitle}>
                    Automatically respond to messages
                </Text>
            </View>

            <View style={styles.filters}>
                <Chip
                    selected={selectedFilter === 'all'}
                    onPress={() => setSelectedFilter('all')}
                    style={styles.chip}
                >
                    All ({autoReplies.length})
                </Chip>
                <Chip
                    selected={selectedFilter === 'active'}
                    onPress={() => setSelectedFilter('active')}
                    style={styles.chip}
                >
                    Active ({activeCount})
                </Chip>
                <Chip
                    selected={selectedFilter === 'inactive'}
                    onPress={() => setSelectedFilter('inactive')}
                    style={styles.chip}
                >
                    Inactive ({inactiveCount})
                </Chip>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    ℹ️ Auto replies are sent when messages contain specified keywords or during
                    specific conditions (e.g., outside business hours).
                </Text>
            </View>

            <FlatList
                data={filteredReplies}
                renderItem={renderReply}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>🤖</Text>
                        <Text style={styles.emptyStateText}>No auto replies found</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Create auto replies to respond automatically
                        </Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={handleCreateReply}
                color="#fff"
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
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    chip: {
        marginRight: 8,
    },
    infoBox: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#E7F5EC',
        borderRadius: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    replyCard: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    replyHeader: {
        marginBottom: 12,
    },
    replyTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    replyName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
    },
    statusBadgeActive: {
        backgroundColor: '#E7F5EC',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#667781',
    },
    statusTextActive: {
        color: '#25D366',
    },
    usageRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    usageText: {
        fontSize: 13,
        color: '#667781',
    },
    replyMessage: {
        fontSize: 14,
        color: '#000',
        lineHeight: 20,
        marginBottom: 12,
    },
    keywordsRow: {
        marginBottom: 12,
    },
    keywordsLabel: {
        fontSize: 13,
        color: '#667781',
        marginBottom: 6,
    },
    keywords: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    keywordChip: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    keywordText: {
        fontSize: 12,
        color: '#667781',
        fontWeight: '500',
    },
    moreKeywords: {
        fontSize: 12,
        color: '#667781',
        fontStyle: 'italic',
    },
    replyActions: {
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
    toggleButton: {
        backgroundColor: '#25D366',
    },
    toggleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    testButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#25D366',
    },
    testButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#25D366',
    },
    deleteButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F44336',
    },
    deleteButtonText: {
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
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#667781',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#25D366',
    },
});
