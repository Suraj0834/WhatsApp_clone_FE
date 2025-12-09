import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
    Platform,
} from 'react-native';
import { Button, Divider, Avatar, IconButton, FAB } from 'react-native-paper';

interface Recipient {
    id: string;
    name: string;
    phoneNumber: string;
    avatar?: string;
}

interface BroadcastList {
    id: string;
    name: string;
    recipients: Recipient[];
    createdAt: Date;
}

export const BroadcastListScreen = () => {
    const [broadcastLists, setBroadcastLists] = useState<BroadcastList[]>([
        {
            id: '1',
            name: 'Important Updates',
            recipients: [
                { id: '1', name: 'John Doe', phoneNumber: '+1 234 567 8900' },
                { id: '2', name: 'Jane Smith', phoneNumber: '+1 234 567 8901' },
                { id: '3', name: 'Mike Johnson', phoneNumber: '+1 234 567 8902' },
            ],
            createdAt: new Date('2024-01-15'),
        },
        {
            id: '2',
            name: 'Team Announcements',
            recipients: [
                { id: '4', name: 'Sarah Williams', phoneNumber: '+1 234 567 8903' },
                { id: '5', name: 'Tom Brown', phoneNumber: '+1 234 567 8904' },
            ],
            createdAt: new Date('2024-02-10'),
        },
    ]);

    const handleCreateBroadcast = () => {
        Alert.alert('Create Broadcast', 'This will navigate to contact selection screen');
    };

    const handleDeleteBroadcast = (listId: string) => {
        Alert.alert(
            'Delete broadcast list',
            'Are you sure you want to delete this broadcast list?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setBroadcastLists(prev => prev.filter(list => list.id !== listId));
                    },
                },
            ]
        );
    };

    const renderBroadcastList = ({ item }: { item: BroadcastList }) => (
        <View style={styles.cardContainer}>
            <TouchableOpacity
                style={styles.listItem}
                onLongPress={() => handleDeleteBroadcast(item.id)}
            >
                <View style={styles.listIcon}>
                    <IconButton icon="bullhorn" iconColor="#25D366" size={28} />
                </View>
                <View style={styles.listInfo}>
                    <Text style={styles.listName}>{item.name}</Text>
                    <View style={styles.recipientRow}>
                        <IconButton icon="account-multiple" iconColor="#8696A0" size={16} style={styles.recipientIcon} />
                        <Text style={styles.listRecipients}>
                            {item.recipients.length} recipient{item.recipients.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                </View>
                <View style={styles.listMeta}>
                    <Text style={styles.listDate}>
                        {item.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                    <IconButton icon="chevron-right" size={20} iconColor="#8696A0" />
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(37, 211, 102, 0.15)' }]}>
                    <IconButton icon="bullhorn" iconColor="#25D366" size={32} />
                </View>
                <Text style={styles.headerTitle}>Broadcast Lists</Text>
                <Text style={styles.headerSubtitle}>
                    Send messages to multiple contacts at once
                </Text>
            </View>

            {/* Info Card */}
            <View style={styles.section}>
                <View style={styles.infoCard}>
                    <View style={styles.infoIcon}>
                        <IconButton icon="information" iconColor="#25D366" size={20} />
                    </View>
                    <Text style={styles.infoText}>
                        Only contacts who have your number saved will receive your broadcast messages.
                        Messages appear in their regular chat list.
                    </Text>
                </View>
            </View>

            {/* Broadcast Lists */}
            {broadcastLists.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>📢</Text>
                    <Text style={styles.emptyStateTitle}>No broadcast lists</Text>
                    <Text style={styles.emptyStateText}>
                        Create a broadcast list to send messages to multiple contacts at once
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={broadcastLists}
                    renderItem={renderBroadcastList}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Create Button */}
            <FAB
                style={styles.fab}
                icon="plus"
                label="New Broadcast"
                color="white"
                onPress={handleCreateBroadcast}
            />
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
    section: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        padding: 16,
        borderRadius: 12,
    },
    infoIcon: {
        margin: 0,
        marginRight: -8,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
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
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    listIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(37, 211, 102, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    listInfo: {
        flex: 1,
    },
    listName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    recipientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -8,
    },
    recipientIcon: {
        margin: 0,
    },
    listRecipients: {
        fontSize: 13,
        color: '#8696A0',
        marginLeft: -8,
    },
    listMeta: {
        alignItems: 'flex-end',
    },
    listDate: {
        fontSize: 12,
        color: '#8696A0',
        marginBottom: 4,
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#25D366',
    },
});
