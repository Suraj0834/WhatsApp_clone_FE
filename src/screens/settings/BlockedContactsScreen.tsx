import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity, Alert, TextInput } from 'react-native';
import { IconButton, Avatar, Button } from 'react-native-paper';

interface BlockedContact {
    id: string;
    name: string;
    phoneNumber: string;
}

export const BlockedContactsScreen = () => {
    const [blockedContacts, setBlockedContacts] = useState<BlockedContact[]>([
        { id: '1', name: 'John Doe', phoneNumber: '+1 234 567 8900' },
        { id: '2', name: 'Jane Smith', phoneNumber: '+1 234 567 8901' },
        { id: '3', name: 'Mike Johnson', phoneNumber: '+1 234 567 8902' },
    ]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleUnblock = (contact: BlockedContact) => {
        Alert.alert(
            'Unblock contact',
            `Are you sure you want to unblock ${contact.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unblock',
                    style: 'destructive',
                    onPress: () => {
                        setBlockedContacts(prev => prev.filter(c => c.id !== contact.id));
                        Alert.alert('Success', `${contact.name} has been unblocked`);
                    }
                }
            ]
        );
    };

    const filteredContacts = blockedContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber.includes(searchQuery)
    );

    return (
        <View style={styles.container}>
            {/* Header Info */}
            <View style={styles.headerCard}>
                <View style={styles.blockIcon}>
                    <IconButton icon="block-helper" iconColor="#F44336" size={32} />
                </View>
                <Text style={styles.headerTitle}>Blocked Contacts</Text>
                <Text style={styles.headerSubtitle}>
                    Blocked contacts cannot call you or send you messages
                </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <IconButton icon="magnify" size={20} iconColor="#8696A0" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search blocked contacts..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#8696A0"
                    />
                </View>
            </View>

            {/* Contacts List */}
            <ScrollView style={styles.listContainer}>
                {filteredContacts.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Text style={styles.emptyIconText}>🚫</Text>
                        </View>
                        <Text style={styles.emptyTitle}>No blocked contacts</Text>
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'No contacts match your search' : 'You haven\'t blocked anyone yet'}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.cardContainer}>
                        {filteredContacts.map((contact, index) => (
                            <View
                                key={contact.id}
                                style={[
                                    styles.contactCard,
                                    index === filteredContacts.length - 1 && styles.lastCard
                                ]}
                            >
                                <Avatar.Text
                                    size={48}
                                    label={contact.name.charAt(0).toUpperCase()}
                                    style={styles.avatar}
                                    labelStyle={styles.avatarLabel}
                                />
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactName}>{contact.name}</Text>
                                    <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.unblockButton}
                                    onPress={() => handleUnblock(contact)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.unblockText}>Unblock</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
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
        marginBottom: 16,
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
    blockIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 18,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#000',
        paddingVertical: 12,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    lastCard: {
        borderBottomWidth: 0,
    },
    avatar: {
        backgroundColor: '#F44336',
    },
    avatarLabel: {
        fontSize: 20,
        fontWeight: '600',
    },
    contactInfo: {
        marginLeft: 14,
        flex: 1,
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
    unblockButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    unblockText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyIconText: {
        fontSize: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
    },
});
