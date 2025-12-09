import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { Avatar, IconButton, Searchbar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';

interface Contact {
    id: string;
    name: string;
    phoneNumber: string;
    avatar?: string;
    about?: string;
}

export const SelectContactScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { mode, conversationId } = route.params || {};
    const isShareMode = mode === 'share';
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    
    const [contacts] = useState<Contact[]>([
        { id: '1', name: 'Alice Johnson', phoneNumber: '+1 234 567 8900', about: 'Hey there!' },
        { id: '2', name: 'Bob Smith', phoneNumber: '+1 234 567 8901', about: 'Available' },
        { id: '3', name: 'Charlie Brown', phoneNumber: '+1 234 567 8902', about: 'Busy' },
        { id: '4', name: 'Diana Prince', phoneNumber: '+1 234 567 8903', about: 'At work' },
        { id: '5', name: 'Ethan Hunt', phoneNumber: '+1 234 567 8904', about: 'On mission' },
        { id: '6', name: 'Fiona Green', phoneNumber: '+1 234 567 8905', about: 'Sleeping' },
        { id: '7', name: 'George Wilson', phoneNumber: '+1 234 567 8906', about: 'Traveling' },
        { id: '8', name: 'Hannah White', phoneNumber: '+1 234 567 8907', about: 'Studying' },
    ]);

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber.includes(searchQuery)
    );

    const toggleContact = (contactId: string) => {
        setSelectedContacts(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    const handleNext = () => {
        if (selectedContacts.length === 0) {
            Alert.alert('Error', 'Please select at least one contact');
            return;
        }
        
        if (isShareMode && conversationId) {
            // Send contact(s) to the conversation
            const selectedContactsData = contacts.filter(c => selectedContacts.includes(c.id));
            Alert.alert(
                'Success',
                `Shared ${selectedContacts.length} contact${selectedContacts.length > 1 ? 's' : ''} to chat`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } else {
            Alert.alert('Success', `Selected ${selectedContacts.length} contact(s)`);
        }
    };

    const renderContact = ({ item }: { item: Contact }) => {
        const isSelected = selectedContacts.includes(item.id);
        
        return (
            <TouchableOpacity
                style={[styles.contactItem, isSelected && styles.contactItemSelected]}
                onPress={() => toggleContact(item.id)}
            >
                <View style={styles.contactLeft}>
                    {item.avatar ? (
                        <Avatar.Image size={50} source={{ uri: item.avatar }} />
                    ) : (
                        <Avatar.Text
                            size={50}
                            label={item.name.substring(0, 2).toUpperCase()}
                            style={styles.avatar}
                        />
                    )}
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>{item.name}</Text>
                        <Text style={styles.contactAbout} numberOfLines={1}>
                            {item.about || item.phoneNumber}
                        </Text>
                    </View>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search contacts"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

            {selectedContacts.length > 0 && (
                <View style={styles.selectedBar}>
                    <Text style={styles.selectedText}>
                        {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
                    </Text>
                    <TouchableOpacity onPress={() => setSelectedContacts([])}>
                        <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={filteredContacts}
                renderItem={renderContact}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />

            {selectedContacts.length > 0 && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>
                            {isShareMode ? 'SHARE' : 'NEXT'}
                        </Text>
                        <IconButton icon={isShareMode ? 'send' : 'arrow-right'} iconColor="#fff" size={20} />
                    </TouchableOpacity>
                </View>
            )}
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
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    searchBar: {
        elevation: 0,
        backgroundColor: '#F7F8FA',
    },
    selectedBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#E7F5EC',
    },
    selectedText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    clearText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#25D366',
    },
    listContainer: {
        paddingVertical: 8,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    contactItemSelected: {
        backgroundColor: '#F0F9F4',
    },
    contactLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        backgroundColor: '#25D366',
    },
    contactInfo: {
        marginLeft: 12,
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    contactAbout: {
        fontSize: 13,
        color: '#667781',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#667781',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#25D366',
        borderColor: '#25D366',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    },
    nextButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25D366',
        borderRadius: 8,
        paddingVertical: 8,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
