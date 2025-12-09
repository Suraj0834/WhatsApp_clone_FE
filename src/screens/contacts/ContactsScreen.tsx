import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Avatar, IconButton, Searchbar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface Contact {
    id: string;
    name: string;
    phoneNumber: string;
    avatar?: string;
    about?: string;
    lastSeen?: Date;
}

export const ContactsScreen = () => {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    
    const [contacts] = useState<Contact[]>([
        { id: '1', name: 'Alice Johnson', phoneNumber: '+1 234 567 8900', about: 'Hey there!', lastSeen: new Date() },
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

    const handleContactPress = (contact: Contact) => {
        navigation.navigate('ContactInfo', { contactId: contact.id });
    };

    const handleNewContact = () => {
        Alert.alert('New Contact', 'This will navigate to add contact screen');
    };

    const renderContact = ({ item }: { item: Contact }) => (
        <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContactPress(item)}
        >
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
                <Text style={styles.contactStatus} numberOfLines={1}>
                    {item.about || item.phoneNumber}
                </Text>
            </View>
            <View style={styles.contactActions}>
                <IconButton
                    icon="message-outline"
                    iconColor="#25D366"
                    size={20}
                    onPress={() => navigation.navigate('Chat', { contactId: item.id })}
                />
                <IconButton
                    icon="phone"
                    iconColor="#25D366"
                    size={20}
                    onPress={() => Alert.alert('Call', `Calling ${item.name}`)}
                />
            </View>
        </TouchableOpacity>
    );

    const renderHeader = () => (
        <>
            <TouchableOpacity style={styles.inviteItem}>
                <View style={styles.inviteIcon}>
                    <IconButton icon="account-plus" iconColor="#25D366" size={24} />
                </View>
                <View style={styles.inviteInfo}>
                    <Text style={styles.inviteTitle}>Invite friends</Text>
                    <Text style={styles.inviteSubtitle}>Share WhatsApp with your friends</Text>
                </View>
            </TouchableOpacity>
            
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>CONTACTS ON WHATSAPP</Text>
                <Text style={styles.sectionCount}>{contacts.length}</Text>
            </View>
        </>
    );

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

            <FlatList
                data={filteredContacts}
                renderItem={renderContact}
                keyExtractor={item => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContainer}
            />

            <FAB
                icon="account-plus"
                style={styles.fab}
                color="#fff"
                onPress={handleNewContact}
            />
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
    listContainer: {
        paddingBottom: 80,
    },
    inviteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    inviteIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E7F5EC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inviteInfo: {
        marginLeft: 12,
        flex: 1,
    },
    inviteTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#25D366',
        marginBottom: 2,
    },
    inviteSubtitle: {
        fontSize: 13,
        color: '#667781',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F7F8FA',
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#667781',
    },
    sectionCount: {
        fontSize: 13,
        color: '#667781',
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
        marginLeft: 12,
        flex: 1,
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
    },
    contactActions: {
        flexDirection: 'row',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#25D366',
    },
});
