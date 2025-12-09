import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { List, RadioButton, Divider, Searchbar, Avatar, Checkbox } from 'react-native-paper';

interface Contact {
    id: string;
    name: string;
    phone: string;
}

export const StatusPrivacyScreen = () => {
    const [privacySetting, setPrivacySetting] = useState<'everyone' | 'contacts' | 'contacts_except' | 'only_share'>('contacts');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const [showContactList, setShowContactList] = useState(false);

    const [contacts] = useState<Contact[]>([
        { id: '1', name: 'Alice Johnson', phone: '+1 234 567 8901' },
        { id: '2', name: 'Bob Smith', phone: '+1 234 567 8902' },
        { id: '3', name: 'Charlie Brown', phone: '+1 234 567 8903' },
        { id: '4', name: 'Diana Prince', phone: '+1 234 567 8904' },
        { id: '5', name: 'Eve Wilson', phone: '+1 234 567 8905' },
        { id: '6', name: 'Frank Miller', phone: '+1 234 567 8906' },
        { id: '7', name: 'Grace Lee', phone: '+1 234 567 8907' },
        { id: '8', name: 'Henry Adams', phone: '+1 234 567 8908' },
    ]);

    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.phone.includes(searchQuery)
    );

    const handlePrivacyChange = (value: string) => {
        setPrivacySetting(value as any);
        if (value === 'contacts_except' || value === 'only_share') {
            setShowContactList(true);
        } else {
            setShowContactList(false);
            setSelectedContacts([]);
        }
    };

    const toggleContact = (contactId: string) => {
        if (selectedContacts.includes(contactId)) {
            setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
        } else {
            setSelectedContacts([...selectedContacts, contactId]);
        }
    };

    const getPrivacyDescription = () => {
        switch (privacySetting) {
            case 'everyone':
                return 'Your status updates will be visible to all WhatsApp users';
            case 'contacts':
                return 'Only your contacts can see your status updates';
            case 'contacts_except':
                return `All contacts except ${selectedContacts.length} selected`;
            case 'only_share':
                return `Only ${selectedContacts.length} selected contacts`;
            default:
                return '';
        }
    };

    const renderContactList = () => {
        if (!showContactList) return null;

        const listTitle = privacySetting === 'contacts_except'
            ? 'EXCLUDED CONTACTS'
            : 'SELECTED CONTACTS';

        return (
            <>
                <Divider style={styles.divider} />
                <View style={styles.contactListHeader}>
                    <Text style={styles.contactListTitle}>{listTitle}</Text>
                    <Text style={styles.contactCount}>
                        {selectedContacts.length} of {contacts.length}
                    </Text>
                </View>

                <Searchbar
                    placeholder="Search contacts"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchbar}
                />

                <View style={styles.contactList}>
                    {filteredContacts.map((contact) => {
                        const isSelected = selectedContacts.includes(contact.id);
                        return (
                            <TouchableOpacity
                                key={contact.id}
                                style={styles.contactItem}
                                onPress={() => toggleContact(contact.id)}
                            >
                                <Avatar.Text
                                    size={48}
                                    label={contact.name.substring(0, 2).toUpperCase()}
                                    style={styles.avatar}
                                />
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactName}>{contact.name}</Text>
                                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                                </View>
                                <Checkbox
                                    status={isSelected ? 'checked' : 'unchecked'}
                                    onPress={() => toggleContact(contact.id)}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                    ℹ️ Choose who can see your status updates
                </Text>
            </View>

            <View style={styles.section}>
                <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => handlePrivacyChange('everyone')}
                >
                    <View style={styles.optionContent}>
                        <List.Icon icon="earth" color="#25D366" />
                        <View style={styles.optionText}>
                            <Text style={styles.optionTitle}>Everyone</Text>
                            <Text style={styles.optionDescription}>
                                Anyone on WhatsApp can see your status
                            </Text>
                        </View>
                    </View>
                    <RadioButton
                        value="everyone"
                        status={privacySetting === 'everyone' ? 'checked' : 'unchecked'}
                        onPress={() => handlePrivacyChange('everyone')}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => handlePrivacyChange('contacts')}
                >
                    <View style={styles.optionContent}>
                        <List.Icon icon="account-multiple" color="#25D366" />
                        <View style={styles.optionText}>
                            <Text style={styles.optionTitle}>My contacts</Text>
                            <Text style={styles.optionDescription}>
                                Only people in your contacts
                            </Text>
                        </View>
                    </View>
                    <RadioButton
                        value="contacts"
                        status={privacySetting === 'contacts' ? 'checked' : 'unchecked'}
                        onPress={() => handlePrivacyChange('contacts')}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => handlePrivacyChange('contacts_except')}
                >
                    <View style={styles.optionContent}>
                        <List.Icon icon="account-minus" color="#25D366" />
                        <View style={styles.optionText}>
                            <Text style={styles.optionTitle}>My contacts except...</Text>
                            <Text style={styles.optionDescription}>
                                Exclude specific contacts
                            </Text>
                        </View>
                    </View>
                    <RadioButton
                        value="contacts_except"
                        status={privacySetting === 'contacts_except' ? 'checked' : 'unchecked'}
                        onPress={() => handlePrivacyChange('contacts_except')}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => handlePrivacyChange('only_share')}
                >
                    <View style={styles.optionContent}>
                        <List.Icon icon="account-check" color="#25D366" />
                        <View style={styles.optionText}>
                            <Text style={styles.optionTitle}>Only share with...</Text>
                            <Text style={styles.optionDescription}>
                                Select specific contacts only
                            </Text>
                        </View>
                    </View>
                    <RadioButton
                        value="only_share"
                        status={privacySetting === 'only_share' ? 'checked' : 'unchecked'}
                        onPress={() => handlePrivacyChange('only_share')}
                    />
                </TouchableOpacity>
            </View>

            {renderContactList()}

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Current Setting</Text>
                <Text style={styles.summaryText}>{getPrivacyDescription()}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    infoCard: {
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
    section: {
        backgroundColor: '#fff',
        paddingVertical: 8,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    optionContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        flex: 1,
        marginLeft: 12,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 13,
        color: '#667781',
    },
    divider: {
        height: 8,
        backgroundColor: '#F7F8FA',
    },
    contactListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F7F8FA',
    },
    contactListTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#667781',
    },
    contactCount: {
        fontSize: 13,
        color: '#667781',
    },
    searchbar: {
        marginHorizontal: 16,
        marginVertical: 12,
        backgroundColor: '#F7F8FA',
    },
    contactList: {
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
    summaryCard: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFF9E6',
        borderRadius: 8,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    summaryText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
});
