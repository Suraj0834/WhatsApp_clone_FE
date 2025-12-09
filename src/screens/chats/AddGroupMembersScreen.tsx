import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Searchbar, Avatar, Chip, IconButton, Button } from 'react-native-paper';

interface Participant {
    id: string;
    name: string;
    phone: string;
    isAdmin: boolean;
}

export const AddGroupMembersScreen = ({ route }: any) => {
    const groupId = route?.params?.groupId;
    const existingMemberIds = route?.params?.existingMemberIds || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

    const [allContacts] = useState<Participant[]>([
        { id: '1', name: 'Alice Johnson', phone: '+1 234 567 8901', isAdmin: false },
        { id: '2', name: 'Bob Smith', phone: '+1 234 567 8902', isAdmin: false },
        { id: '3', name: 'Charlie Brown', phone: '+1 234 567 8903', isAdmin: false },
        { id: '4', name: 'Diana Prince', phone: '+1 234 567 8904', isAdmin: false },
        { id: '5', name: 'Eve Wilson', phone: '+1 234 567 8905', isAdmin: false },
        { id: '6', name: 'Frank Miller', phone: '+1 234 567 8906', isAdmin: false },
        { id: '7', name: 'Grace Lee', phone: '+1 234 567 8907', isAdmin: false },
        { id: '8', name: 'Henry Adams', phone: '+1 234 567 8908', isAdmin: false },
    ]);

    const availableContacts = allContacts.filter(
        (contact) => !existingMemberIds.includes(contact.id)
    );

    const filteredContacts = availableContacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.phone.includes(searchQuery)
    );

    const toggleContact = (contactId: string) => {
        if (selectedContacts.includes(contactId)) {
            setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
        } else {
            setSelectedContacts([...selectedContacts, contactId]);
        }
    };

    const handleAddMembers = () => {
        if (selectedContacts.length === 0) {
            Alert.alert('Error', 'Please select at least one contact');
            return;
        }

        const selectedNames = allContacts
            .filter((c) => selectedContacts.includes(c.id))
            .map((c) => c.name)
            .join(', ');

        Alert.alert(
            'Add Members',
            `Add ${selectedContacts.length} member(s) to the group?\n\n${selectedNames}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Add',
                    onPress: () => {
                        Alert.alert('Success', 'Members added successfully');
                        // Navigate back
                    },
                },
            ]
        );
    };

    const handleClearSelection = () => {
        setSelectedContacts([]);
    };

    const renderContact = ({ item }: { item: Participant }) => {
        const isSelected = selectedContacts.includes(item.id);

        return (
            <TouchableOpacity
                style={styles.contactItem}
                onPress={() => toggleContact(item.id)}
            >
                <Avatar.Text
                    size={48}
                    label={item.name.substring(0, 2).toUpperCase()}
                    style={[
                        styles.avatar,
                        isSelected && styles.selectedAvatar,
                    ]}
                />
                <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactPhone}>{item.phone}</Text>
                </View>
                {isSelected && (
                    <IconButton
                        icon="check-circle"
                        size={24}
                        iconColor="#25D366"
                    />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {selectedContacts.length > 0 && (
                <View style={styles.selectedBar}>
                    <Text style={styles.selectedCount}>
                        {selectedContacts.length} selected
                    </Text>
                    <Button onPress={handleClearSelection} textColor="#25D366">
                        Clear
                    </Button>
                </View>
            )}

            <Searchbar
                placeholder="Search contacts"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchbar}
            />

            <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                    👥 Select contacts to add to the group
                </Text>
            </View>

            <FlatList
                data={filteredContacts}
                renderItem={renderContact}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>🔍</Text>
                        <Text style={styles.emptyStateText}>
                            {searchQuery
                                ? 'No contacts found'
                                : 'All contacts are already in the group'}
                        </Text>
                    </View>
                }
            />

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleAddMembers}
                    style={styles.addButton}
                    disabled={selectedContacts.length === 0}
                    labelStyle={styles.addButtonText}
                    icon="account-plus"
                >
                    ADD MEMBERS ({selectedContacts.length})
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
    selectedBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#E7F5EC',
    },
    selectedCount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    searchbar: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        backgroundColor: '#F7F8FA',
    },
    infoCard: {
        marginHorizontal: 16,
        marginBottom: 8,
        padding: 12,
        backgroundColor: '#FFF9E6',
        borderRadius: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#667781',
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
    selectedAvatar: {
        backgroundColor: '#075E54',
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
    emptyStateIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    footer: {
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    addButton: {
        backgroundColor: '#25D366',
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
