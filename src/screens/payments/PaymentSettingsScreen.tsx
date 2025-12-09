import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput as RNTextInput,
} from 'react-native';
import { List, Divider, Button, TextInput } from 'react-native-paper';

export const PaymentSettingsScreen = () => {
    const [upiId, setUpiId] = useState('user@bank');
    const [isPinSet, setIsPinSet] = useState(true);
    const [autoAcceptPayments, setAutoAcceptPayments] = useState(false);

    const [bankAccount] = useState({
        bankName: 'Chase Bank',
        accountNumber: '****5678',
        accountHolder: 'John Doe',
        verified: true,
    });

    const handleAddPaymentMethod = () => {
        Alert.alert(
            'Add Payment Method',
            'Choose payment method type',
            [
                { text: 'Bank Account', onPress: () => {} },
                { text: 'Debit Card', onPress: () => {} },
                { text: 'UPI', onPress: () => {} },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleManageBank = () => {
        Alert.alert('Manage Bank Account', 'View and update your linked bank account');
    };

    const handleSetupPin = () => {
        Alert.alert(
            isPinSet ? 'Change Payment PIN' : 'Set Payment PIN',
            'Enter a 6-digit PIN to secure your payments'
        );
    };

    const handleTransactionHistory = () => {
        Alert.alert('Transaction History', 'View all your payment transactions');
    };

    const handlePaymentLimits = () => {
        Alert.alert('Payment Limits', 'Daily limit: $1,000\nMonthly limit: $10,000');
    };

    const handleDisputeResolution = () => {
        Alert.alert('Dispute Resolution', 'Report a problem with a payment');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>LINKED ACCOUNTS</Text>

                <TouchableOpacity style={styles.bankCard} onPress={handleManageBank}>
                    <View style={styles.bankCardHeader}>
                        <Text style={styles.bankName}>{bankAccount.bankName}</Text>
                        {bankAccount.verified && (
                            <View style={styles.verifiedBadge}>
                                <Text style={styles.verifiedText}>✓ Verified</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.accountNumber}>{bankAccount.accountNumber}</Text>
                    <Text style={styles.accountHolder}>{bankAccount.accountHolder}</Text>
                </TouchableOpacity>

                <Button
                    mode="outlined"
                    onPress={handleAddPaymentMethod}
                    style={styles.addButton}
                    icon="plus"
                    textColor="#25D366"
                >
                    Add Payment Method
                </Button>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>UPI SETTINGS</Text>

                <View style={styles.upiContainer}>
                    <Text style={styles.upiLabel}>Your UPI ID</Text>
                    <TextInput
                        value={upiId}
                        onChangeText={setUpiId}
                        style={styles.upiInput}
                        mode="outlined"
                        right={<TextInput.Icon icon="pencil" />}
                    />
                </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <List.Item
                    title={isPinSet ? 'Change payment PIN' : 'Set payment PIN'}
                    description={isPinSet ? 'Update your 6-digit PIN' : 'Secure your payments'}
                    left={() => <List.Icon icon="lock" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={handleSetupPin}
                />

                <List.Item
                    title="Transaction history"
                    description="View all your transactions"
                    left={() => <List.Icon icon="history" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={handleTransactionHistory}
                />

                <List.Item
                    title="Payment limits"
                    description="Daily and monthly limits"
                    left={() => <List.Icon icon="cash-multiple" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={handlePaymentLimits}
                />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <List.Item
                    title="Auto-accept payments"
                    description="Automatically accept incoming payments"
                    left={() => <List.Icon icon="cash-check" color="#25D366" />}
                    right={() => (
                        <TouchableOpacity
                            onPress={() => setAutoAcceptPayments(!autoAcceptPayments)}
                        >
                            <Text style={styles.switchText}>
                                {autoAcceptPayments ? 'ON' : 'OFF'}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                <List.Item
                    title="Payment notifications"
                    description="Get notified for payments"
                    left={() => <List.Icon icon="bell" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={() => {}}
                />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <List.Item
                    title="Dispute resolution"
                    description="Report a payment issue"
                    left={() => <List.Icon icon="alert-circle" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={handleDisputeResolution}
                />

                <List.Item
                    title="Payment terms"
                    description="Terms and conditions"
                    left={() => <List.Icon icon="file-document" color="#25D366" />}
                    right={() => <List.Icon icon="open-in-new" />}
                    onPress={() => {}}
                />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    ℹ️ Your payment information is encrypted and securely stored. WhatsApp
                    doesn't have access to your full bank details.
                </Text>
            </View>

            <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                    ⚠️ Never share your payment PIN with anyone. WhatsApp will never ask for
                    your PIN.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    section: {
        backgroundColor: '#fff',
        paddingVertical: 8,
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '600',
        color: '#667781',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F7F8FA',
    },
    bankCard: {
        margin: 16,
        padding: 20,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    bankCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    bankName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    verifiedBadge: {
        backgroundColor: '#E7F5EC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    verifiedText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#25D366',
    },
    accountNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
        letterSpacing: 2,
    },
    accountHolder: {
        fontSize: 14,
        color: '#667781',
    },
    addButton: {
        marginHorizontal: 16,
        borderColor: '#25D366',
    },
    divider: {
        height: 8,
        backgroundColor: '#F7F8FA',
    },
    upiContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    upiLabel: {
        fontSize: 14,
        color: '#667781',
        marginBottom: 8,
    },
    upiInput: {
        backgroundColor: '#fff',
    },
    switchText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#25D366',
    },
    infoBox: {
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
    warningBox: {
        margin: 16,
        marginTop: 0,
        padding: 16,
        backgroundColor: '#FFF9E6',
        borderRadius: 8,
    },
    warningText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
});
