import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Searchbar, Avatar, IconButton, Chip } from 'react-native-paper';

interface Contact {
    id: string;
    name: string;
    phone: string;
    status?: string;
}

export const NewCallScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [callType, setCallType] = useState<'voice' | 'video'>('voice');

    const [contacts] = useState<Contact[]>([
        { id: '1', name: 'Alice Johnson', phone: '+1 234 567 8901', status: 'Available' },
        { id: '2', name: 'Bob Smith', phone: '+1 234 567 8902', status: 'At work' },
        { id: '3', name: 'Charlie Brown', phone: '+1 234 567 8903' },
        { id: '4', name: 'Diana Prince', phone: '+1 234 567 8904', status: 'Busy' },
        { id: '5', name: 'Eve Wilson', phone: '+1 234 567 8905' },
        { id: '6', name: 'Frank Miller', phone: '+1 234 567 8906' },
        { id: '7', name: 'Grace Lee', phone: '+1 234 567 8907', status: 'Sleeping' },
        { id: '8', name: 'Henry Adams', phone: '+1 234 567 8908' },
    ]);

    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.phone.includes(searchQuery)
    );

    const handleCall = (contact: Contact) => {
        const callTypeText = callType === 'voice' ? 'Voice' : 'Video';
        Alert.alert(
            `${callTypeText} Call`,
            `Calling ${contact.name}...`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Call',
                    onPress: () => {
                        // Navigate to call screen
                        Alert.alert('Calling', `${callTypeText} calling ${contact.name}`);
                    },
                },
            ]
        );
    };

    const renderContact = ({ item }: { item: Contact }) => {
        return (
            <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handleCall(item)}
            >
                <Avatar.Text
                    size={48}
                    label={item.name.substring(0, 2).toUpperCase()}
                    style={styles.avatar}
                />
                <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    {item.status ? (
                        <Text style={styles.contactStatus}>{item.status}</Text>
                    ) : (
                        <Text style={styles.contactPhone}>{item.phone}</Text>
                    )}
                </View>
                <IconButton
                    icon={callType === 'voice' ? 'phone' : 'video'}
                    size={24}
                    iconColor="#25D366"
                    onPress={() => handleCall(item)}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search contacts"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchbar}
            />

            <View style={styles.callTypeSelector}>
                <Chip
                    icon="phone"
                    selected={callType === 'voice'}
                    onPress={() => setCallType('voice')}
                    style={styles.chip}
                    textStyle={styles.chipText}
                >
                    Voice Call
                </Chip>
                <Chip
                    icon="video"
                    selected={callType === 'video'}
                    onPress={() => setCallType('video')}
                    style={styles.chip}
                    textStyle={styles.chipText}
                >
                    Video Call
                </Chip>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                    📞 Select a contact to start a {callType === 'voice' ? 'voice' : 'video'} call
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
                        <Text style={styles.emptyStateText}>No contacts found</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchbar: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
        backgroundColor: '#F7F8FA',
    },
    callTypeSelector: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    chip: {
        marginRight: 8,
    },
    chipText: {
        fontSize: 13,
    },
    infoCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#E7F5EC',
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
    contactStatus: {
        fontSize: 13,
        color: '#667781',
        fontStyle: 'italic',
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
    },
});
