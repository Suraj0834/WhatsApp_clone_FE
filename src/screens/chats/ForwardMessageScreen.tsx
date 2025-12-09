import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Searchbar, Avatar, Checkbox, Button, Chip } from 'react-native-paper';

interface Contact {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
}

export const ForwardMessageScreen = ({ route }: any) => {
    const messageToForward = route?.params?.message || {
        text: 'Check out this amazing app!',
        mediaUrl: null,
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const [filterType, setFilterType] = useState<'all' | 'recent' | 'groups'>('all');

    const [contacts] = useState<Contact[]>([
        { id: '1', name: 'Alice Johnson', phone: '+1 234 567 8901' },
        { id: '2', name: 'Bob Smith', phone: '+1 234 567 8902' },
        { id: '3', name: 'Charlie Brown', phone: '+1 234 567 8903' },
        { id: '4', name: 'Diana Prince', phone: '+1 234 567 8904' },
        { id: '5', name: 'Eve Wilson', phone: '+1 234 567 8905' },
        { id: '6', name: 'Family Group', phone: 'Group • 5 members' },
        { id: '7', name: 'Work Team', phone: 'Group • 12 members' },
        { id: '8', name: 'Friends', phone: 'Group • 8 members' },
    ]);

    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.phone.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterType === 'groups') {
            return matchesSearch && contact.phone.includes('Group');
        }
        if (filterType === 'recent') {
            return matchesSearch && ['1', '2', '6'].includes(contact.id);
        }
        return matchesSearch;
    });

    const toggleContact = (contactId: string) => {
        if (selectedContacts.includes(contactId)) {
            setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
        } else {
            setSelectedContacts([...selectedContacts, contactId]);
        }
    };

    const handleForward = () => {
        if (selectedContacts.length === 0) {
            Alert.alert('Error', 'Please select at least one recipient');
            return;
        }

        const recipientNames = contacts
            .filter((c) => selectedContacts.includes(c.id))
            .map((c) => c.name)
            .join(', ');

        Alert.alert(
            'Forward Message',
            `Forward to ${recipientNames}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Forward',
                    onPress: () => {
                        Alert.alert('Success', 'Message forwarded successfully');
                    },
                },
            ]
        );
    };

    const handleClearSelection = () => {
        setSelectedContacts([]);
    };

    const renderContact = ({ item }: { item: Contact }) => {
        const isSelected = selectedContacts.includes(item.id);
        const isGroup = item.phone.includes('Group');

        return (
            <TouchableOpacity
                style={styles.contactItem}
                onPress={() => toggleContact(item.id)}
            >
                <Checkbox
                    status={isSelected ? 'checked' : 'unchecked'}
                    onPress={() => toggleContact(item.id)}
                />
                <Avatar.Text
                    size={48}
                    label={item.name.substring(0, 2).toUpperCase()}
                    style={[
                        styles.avatar,
                        { backgroundColor: isGroup ? '#075E54' : '#25D366' },
                    ]}
                />
                <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactPhone}>{item.phone}</Text>
                </View>
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

            <View style={styles.messagePreview}>
                <Text style={styles.previewLabel}>Message to forward:</Text>
                <View style={styles.previewBox}>
                    <Text style={styles.previewText}>{messageToForward.text}</Text>
                    {messageToForward.mediaUrl && (
                        <Text style={styles.previewMedia}>📎 Contains media</Text>
                    )}
                </View>
            </View>

            <Searchbar
                placeholder="Search contacts"
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
                    selected={filterType === 'recent'}
                    onPress={() => setFilterType('recent')}
                    style={styles.chip}
                >
                    Recent
                </Chip>
                <Chip
                    selected={filterType === 'groups'}
                    onPress={() => setFilterType('groups')}
                    style={styles.chip}
                >
                    Groups
                </Chip>
            </View>

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

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleForward}
                    style={styles.forwardButton}
                    disabled={selectedContacts.length === 0}
                    labelStyle={styles.forwardButtonText}
                    icon="send"
                >
                    FORWARD ({selectedContacts.length})
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
    messagePreview: {
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    previewLabel: {
        fontSize: 13,
        color: '#667781',
        marginBottom: 8,
    },
    previewBox: {
        backgroundColor: '#DCF8C6',
        padding: 12,
        borderRadius: 8,
    },
    previewText: {
        fontSize: 14,
        color: '#000',
    },
    previewMedia: {
        fontSize: 12,
        color: '#667781',
        marginTop: 6,
    },
    searchbar: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        backgroundColor: '#F7F8FA',
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    chip: {
        marginRight: 8,
    },
    list: {
        paddingBottom: 16,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatar: {
        marginLeft: 12,
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
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
    },
    footer: {
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    forwardButton: {
        backgroundColor: '#25D366',
    },
    forwardButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
