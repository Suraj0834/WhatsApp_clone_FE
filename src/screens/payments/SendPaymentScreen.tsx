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
import { Searchbar, Avatar, Button, Chip } from 'react-native-paper';

interface Contact {
    id: string;
    name: string;
    phone: string;
    amount: number;
}

export const SendPaymentScreen = ({ route }: any) => {
    const preSelectedContact = route?.params?.contact;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(preSelectedContact || null);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [step, setStep] = useState<'select' | 'amount' | 'confirm'>(preSelectedContact ? 'amount' : 'select');

    const [contacts] = useState<Contact[]>([
        { id: '1', name: 'Alice Johnson', phone: '+1 234 567 8901', amount: 0 },
        { id: '2', name: 'Bob Smith', phone: '+1 234 567 8902', amount: 0 },
        { id: '3', name: 'Charlie Brown', phone: '+1 234 567 8903', amount: 0 },
        { id: '4', name: 'Diana Prince', phone: '+1 234 567 8904', amount: 0 },
        { id: '5', name: 'Eve Wilson', phone: '+1 234 567 8905', amount: 0 },
        { id: '6', name: 'Frank Miller', phone: '+1 234 567 8906', amount: 0 },
    ]);

    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.phone.includes(searchQuery)
    );

    const handleSelectContact = (contact: Contact) => {
        setSelectedContact(contact);
        setStep('amount');
    };

    const handleContinue = () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        setStep('confirm');
    };

    const handleSendPayment = () => {
        Alert.alert(
            'Send Payment',
            `Send $${parseFloat(amount).toFixed(2)} to ${selectedContact?.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send',
                    onPress: () => {
                        Alert.alert('Payment Sent', 'Payment successful!');
                        // Navigate back
                    },
                },
            ]
        );
    };

    const renderContact = ({ item }: { item: Contact }) => {
        return (
            <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handleSelectContact(item)}
            >
                <Avatar.Text
                    size={48}
                    label={item.name.substring(0, 2).toUpperCase()}
                    style={styles.avatar}
                />
                <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactPhone}>{item.phone}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (step === 'select') {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Send Payment</Text>
                    <Text style={styles.headerSubtitle}>Select a contact</Text>
                </View>

                <Searchbar
                    placeholder="Search contacts"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchbar}
                />

                <FlatList
                    data={filteredContacts}
                    renderItem={renderContact}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No contacts found</Text>
                        </View>
                    }
                />
            </View>
        );
    }

    if (step === 'amount') {
        return (
            <View style={styles.container}>
                <View style={styles.amountScreen}>
                    <View style={styles.recipientCard}>
                        <Avatar.Text
                            size={64}
                            label={selectedContact?.name.substring(0, 2).toUpperCase() || 'U'}
                            style={styles.largeAvatar}
                        />
                        <Text style={styles.recipientName}>{selectedContact?.name}</Text>
                        <Text style={styles.recipientPhone}>{selectedContact?.phone}</Text>
                    </View>

                    <View style={styles.amountInputContainer}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="decimal-pad"
                            autoFocus
                        />
                    </View>

                    <TextInput
                        style={styles.noteInput}
                        placeholder="Add a note (optional)"
                        value={note}
                        onChangeText={setNote}
                        maxLength={100}
                    />

                    <View style={styles.quickAmounts}>
                        <TouchableOpacity
                            style={styles.quickAmountButton}
                            onPress={() => setAmount('10')}
                        >
                            <Text style={styles.quickAmountText}>$10</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickAmountButton}
                            onPress={() => setAmount('20')}
                        >
                            <Text style={styles.quickAmountText}>$20</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickAmountButton}
                            onPress={() => setAmount('50')}
                        >
                            <Text style={styles.quickAmountText}>$50</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickAmountButton}
                            onPress={() => setAmount('100')}
                        >
                            <Text style={styles.quickAmountText}>$100</Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleContinue}
                        style={styles.continueButton}
                        disabled={!amount || parseFloat(amount) <= 0}
                        labelStyle={styles.continueButtonText}
                    >
                        CONTINUE
                    </Button>
                </View>
            </View>
        );
    }

    // Confirm step
    return (
        <View style={styles.container}>
            <View style={styles.confirmScreen}>
                <Text style={styles.confirmTitle}>Confirm Payment</Text>

                <View style={styles.confirmCard}>
                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmLabel}>To</Text>
                        <View style={styles.confirmValueContainer}>
                            <Avatar.Text
                                size={32}
                                label={selectedContact?.name.substring(0, 2).toUpperCase() || 'U'}
                                style={styles.smallAvatar}
                            />
                            <Text style={styles.confirmValue}>{selectedContact?.name}</Text>
                        </View>
                    </View>

                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmLabel}>Amount</Text>
                        <Text style={[styles.confirmValue, styles.confirmAmount]}>
                            ${parseFloat(amount).toFixed(2)}
                        </Text>
                    </View>

                    {note ? (
                        <View style={styles.confirmRow}>
                            <Text style={styles.confirmLabel}>Note</Text>
                            <Text style={styles.confirmValue}>{note}</Text>
                        </View>
                    ) : null}

                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmLabel}>Payment method</Text>
                        <Text style={styles.confirmValue}>Linked Bank Account</Text>
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        ℹ️ This payment will be processed securely. You'll receive a confirmation
                        once completed.
                    </Text>
                </View>

                <Button
                    mode="contained"
                    onPress={handleSendPayment}
                    style={styles.sendButton}
                    labelStyle={styles.sendButtonText}
                    icon="send"
                >
                    SEND PAYMENT
                </Button>

                <Button
                    mode="text"
                    onPress={() => setStep('amount')}
                    style={styles.backButton}
                    textColor="#667781"
                >
                    Go Back
                </Button>
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
        fontSize: 20,
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
    list: {
        paddingBottom: 16,
    },
    contactItem: {
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
    contactInfo: {
        flex: 1,
        marginLeft: 16,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    contactPhone: {
        fontSize: 13,
        color: '#667781',
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
    },
    amountScreen: {
        flex: 1,
        padding: 16,
    },
    recipientCard: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        marginBottom: 32,
    },
    largeAvatar: {
        backgroundColor: '#25D366',
        marginBottom: 16,
    },
    recipientName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    recipientPhone: {
        fontSize: 14,
        color: '#667781',
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    currencySymbol: {
        fontSize: 48,
        fontWeight: '700',
        color: '#000',
        marginRight: 8,
    },
    amountInput: {
        fontSize: 48,
        fontWeight: '700',
        color: '#000',
        minWidth: 150,
        borderBottomWidth: 2,
        borderBottomColor: '#25D366',
        textAlign: 'center',
    },
    noteInput: {
        fontSize: 16,
        color: '#000',
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 8,
        marginBottom: 24,
    },
    quickAmounts: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 32,
    },
    quickAmountButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#F7F8FA',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    quickAmountText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    continueButton: {
        backgroundColor: '#25D366',
        marginTop: 'auto',
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },
    confirmScreen: {
        flex: 1,
        padding: 16,
    },
    confirmTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 24,
        textAlign: 'center',
    },
    confirmCard: {
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
    },
    confirmRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    confirmLabel: {
        fontSize: 14,
        color: '#667781',
        fontWeight: '600',
    },
    confirmValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    confirmValue: {
        fontSize: 16,
        color: '#000',
        fontWeight: '600',
    },
    confirmAmount: {
        fontSize: 24,
        color: '#25D366',
    },
    smallAvatar: {
        backgroundColor: '#25D366',
        marginRight: 8,
    },
    infoBox: {
        padding: 16,
        backgroundColor: '#E7F5EC',
        borderRadius: 8,
        marginBottom: 24,
    },
    infoText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
    sendButton: {
        backgroundColor: '#25D366',
        marginBottom: 12,
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },
    backButton: {
        marginBottom: 16,
    },
});
