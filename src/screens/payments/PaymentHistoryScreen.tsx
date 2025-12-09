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

interface Payment {
    id: string;
    recipientName: string;
    amount: number;
    currency: string;
    status: 'completed' | 'pending' | 'failed';
    date: Date;
    type: 'sent' | 'received';
}

export const PaymentHistoryScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'sent' | 'received'>('all');

    const [payments] = useState<Payment[]>([
        {
            id: '1',
            recipientName: 'Alice Johnson',
            amount: 50.00,
            currency: 'USD',
            status: 'completed',
            date: new Date('2024-12-07T14:30:00'),
            type: 'sent',
        },
        {
            id: '2',
            recipientName: 'Bob Smith',
            amount: 25.50,
            currency: 'USD',
            status: 'completed',
            date: new Date('2024-12-06T10:15:00'),
            type: 'received',
        },
        {
            id: '3',
            recipientName: 'Charlie Brown',
            amount: 100.00,
            currency: 'USD',
            status: 'pending',
            date: new Date('2024-12-05T16:45:00'),
            type: 'sent',
        },
        {
            id: '4',
            recipientName: 'Diana Prince',
            amount: 75.25,
            currency: 'USD',
            status: 'completed',
            date: new Date('2024-12-04T12:00:00'),
            type: 'received',
        },
        {
            id: '5',
            recipientName: 'Eve Wilson',
            amount: 30.00,
            currency: 'USD',
            status: 'failed',
            date: new Date('2024-12-03T09:30:00'),
            type: 'sent',
        },
    ]);

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch = payment.recipientName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || payment.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return '#25D366';
            case 'pending':
                return '#FF9800';
            case 'failed':
                return '#F44336';
            default:
                return '#667781';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return 'check-circle';
            case 'pending':
                return 'clock-outline';
            case 'failed':
                return 'alert-circle';
            default:
                return 'help-circle';
        }
    };

    const handlePaymentDetails = (payment: Payment) => {
        const statusText = payment.status.charAt(0).toUpperCase() + payment.status.slice(1);
        const typeText = payment.type === 'sent' ? 'Paid to' : 'Received from';
        
        Alert.alert(
            'Payment Details',
            `${typeText}: ${payment.recipientName}\nAmount: ${payment.currency} ${payment.amount.toFixed(2)}\nStatus: ${statusText}\nDate: ${formatDate(payment.date)}`,
            [
                { text: 'OK' },
                payment.status === 'failed' && {
                    text: 'Retry',
                    onPress: () => Alert.alert('Retry Payment', 'Payment will be retried'),
                },
            ].filter(Boolean) as any
        );
    };

    const handleNewPayment = () => {
        Alert.alert('New Payment', 'Select a contact to send money');
    };

    const getTotalSent = () => {
        return payments
            .filter((p) => p.type === 'sent' && p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
    };

    const getTotalReceived = () => {
        return payments
            .filter((p) => p.type === 'received' && p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
    };

    const renderPayment = ({ item }: { item: Payment }) => {
        const isReceived = item.type === 'received';
        
        return (
            <TouchableOpacity
                style={styles.paymentItem}
                onPress={() => handlePaymentDetails(item)}
            >
                <Avatar.Text
                    size={48}
                    label={item.recipientName.substring(0, 2).toUpperCase()}
                    style={[
                        styles.avatar,
                        { backgroundColor: isReceived ? '#25D366' : '#075E54' },
                    ]}
                />
                <View style={styles.paymentInfo}>
                    <Text style={styles.recipientName}>{item.recipientName}</Text>
                    <View style={styles.statusRow}>
                        <IconButton
                            icon={getStatusIcon(item.status)}
                            size={16}
                            iconColor={getStatusColor(item.status)}
                            style={styles.statusIcon}
                        />
                        <Text
                            style={[
                                styles.statusText,
                                { color: getStatusColor(item.status) },
                            ]}
                        >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Text>
                        <Text style={styles.dateText}> • {formatDate(item.date)}</Text>
                    </View>
                </View>
                <View style={styles.amountContainer}>
                    <Text
                        style={[
                            styles.amount,
                            { color: isReceived ? '#25D366' : '#000' },
                        ]}
                    >
                        {isReceived ? '+' : '-'}{item.currency} {item.amount.toFixed(2)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Sent</Text>
                    <Text style={styles.summaryValue}>USD {getTotalSent().toFixed(2)}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Received</Text>
                    <Text style={[styles.summaryValue, { color: '#25D366' }]}>
                        USD {getTotalReceived().toFixed(2)}
                    </Text>
                </View>
            </View>

            <Searchbar
                placeholder="Search payments"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchbar}
            />

            <View style={styles.filters}>
                <Chip
                    selected={filterType === 'all'}
                    onPress={() => setFilterType('all')}
                    style={styles.chip}
                >
                    All
                </Chip>
                <Chip
                    selected={filterType === 'sent'}
                    onPress={() => setFilterType('sent')}
                    style={styles.chip}
                >
                    Sent
                </Chip>
                <Chip
                    selected={filterType === 'received'}
                    onPress={() => setFilterType('received')}
                    style={styles.chip}
                >
                    Received
                </Chip>
            </View>

            <FlatList
                data={filteredPayments}
                renderItem={renderPayment}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>💳</Text>
                        <Text style={styles.emptyStateText}>No payments found</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={handleNewPayment}
                label="New Payment"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    summaryCard: {
        flexDirection: 'row',
        margin: 16,
        padding: 20,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        justifyContent: 'space-around',
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 13,
        color: '#667781',
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    summaryDivider: {
        width: 1,
        backgroundColor: '#E0E0E0',
    },
    searchbar: {
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#F7F8FA',
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    chip: {
        marginRight: 8,
    },
    list: {
        paddingBottom: 100,
    },
    paymentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatar: {
        marginRight: 12,
    },
    paymentInfo: {
        flex: 1,
    },
    recipientName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        margin: 0,
        padding: 0,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 13,
        color: '#667781',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
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
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#25D366',
    },
});
