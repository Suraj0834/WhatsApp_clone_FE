import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SectionList,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    Platform,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';
import { Searchbar, Divider, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import axiosInstance from '../../api/axios';
import { COLORS, SPACING } from '../../utils/constants';
import { setCurrentConversation } from '../../store/slices/chatSlice';

interface Contact {
    id: string;
    name: string;
    phoneNumbers: string[];
    imageAvailable: boolean;
    userId?: string; // If registered on our app
    isRegistered?: boolean;
}

interface Section {
    title: string;
    data: Contact[];
}

export const ContactsListScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            // Get device contacts
            const { status } = await Contacts.requestPermissionsAsync();

            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
                });

                if (data.length > 0) {
                    // Get registered users from backend
                    const registeredUsers = await fetchRegisteredUsers();

                    // Format and cross-reference contacts
                    const formattedContacts = data
                        .filter(contact => contact.name && contact.phoneNumbers)
                        .map(contact => {
                            const phoneNumbers = contact.phoneNumbers
                                ?.map(p => normalizePhoneNumber(p.number))
                                .filter(Boolean) as string[];

                            // Check if this contact is registered
                            // Note: Backend returns 'phone' field, not 'phoneNumber'
                            const registeredUser = registeredUsers.find((ru: any) =>
                                phoneNumbers.some(phone =>
                                    normalizePhoneNumber(ru.phone) === phone
                                )
                            );

                            return {
                                id: contact.id,
                                name: contact.name || 'Unknown',
                                phoneNumbers,
                                imageAvailable: contact.imageAvailable || false,
                                userId: registeredUser?._id,
                                isRegistered: !!registeredUser,
                            };
                        })
                        .sort((a, b) => a.name.localeCompare(b.name));

                    setContacts(formattedContacts);
                    updateSections(formattedContacts, '');
                }
            } else {
                Alert.alert(
                    'Permission Required',
                    'Please grant contacts permission to see your contacts'
                );
            }
        } catch (error) {
            console.error('Error loading contacts:', error);
            Alert.alert('Error', 'Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    const fetchRegisteredUsers = async () => {
        try {
            const response = await axiosInstance.get('/users');
            return response.data || [];
        } catch (error) {
            console.error('Error fetching registered users:', error);
            return [];
        }
    };

    const normalizePhoneNumber = (phone?: string): string => {
        if (!phone) return '';
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        // Get last 10 digits (or all if less than 10)
        return cleaned.slice(-10);
    };

    const updateSections = (contactsList: Contact[], query: string) => {
        const filtered = query.trim() === ''
            ? contactsList
            : contactsList.filter(c =>
                c.name.toLowerCase().includes(query.toLowerCase())
            );

        const registered = filtered.filter(c => c.isRegistered);
        const notRegistered = filtered.filter(c => !c.isRegistered);

        const newSections: Section[] = [];

        if (registered.length > 0) {
            newSections.push({
                title: `On WhatsApp (${registered.length})`,
                data: registered,
            });
        }

        if (notRegistered.length > 0) {
            newSections.push({
                title: `Invite to WhatsApp (${notRegistered.length})`,
                data: notRegistered,
            });
        }

        setSections(newSections);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        updateSections(contacts, query);
    };

    const handleContactPress = async (contact: Contact) => {
        if (contact.isRegistered && contact.userId) {
            // Start chat with registered user
            try {
                // Create or get conversation with this user
                const response = await axiosInstance.post('/conversations', {
                    type: 'direct',
                    memberIds: [contact.userId],
                });

                const conversation = response.data.conversation;
                dispatch(setCurrentConversation(conversation));

                navigation.navigate('Chat', {
                    conversationId: conversation._id || conversation.id,
                    title: contact.name,
                });
            } catch (error) {
                console.error('Error creating conversation:', error);
                Alert.alert('Error', 'Failed to start chat');
            }
        } else {
            // Send SMS invite
            handleInvite(contact);
        }
    };

    const handleInvite = async (contact: Contact) => {
        const isAvailable = await SMS.isAvailableAsync();

        if (isAvailable && contact.phoneNumbers.length > 0) {
            const message = `Hey! I'm using WhatsApp Clone. Download it and let's chat! 🚀`;

            try {
                const { result } = await SMS.sendSMSAsync(
                    contact.phoneNumbers,
                    message
                );

                if (result === 'sent') {
                    Alert.alert('Success', `Invite sent to ${contact.name}!`);
                }
            } catch (error) {
                console.error('Error sending SMS:', error);
                Alert.alert('Error', 'Failed to send invite');
            }
        } else {
            Alert.alert(
                'Invite',
                `Send an invite to ${contact.name} via your SMS app?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'OK',
                        onPress: () => {
                            Alert.alert('Info', 'Please invite them manually via SMS or other messaging apps');
                        }
                    },
                ]
            );
        }
    };

    const renderSectionHeader = ({ section }: { section: Section }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
    );

    const renderContact = ({ item, section }: { item: Contact; section: Section }) => (
        <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContactPress(item)}
        >
            <View style={styles.avatar}>
                <Image
                    source={{
                        uri: `https://ui-avatars.com/api/?name=${item.name}&background=25D366&color=fff`
                    }}
                    style={styles.avatarImage}
                />
            </View>
            <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                {item.phoneNumbers && item.phoneNumbers[0] && (
                    <Text style={styles.contactPhone}>
                        {item.isRegistered ? 'Using WhatsApp' : item.phoneNumbers[0]}
                    </Text>
                )}
            </View>
            {!item.isRegistered && (
                <TouchableOpacity
                    style={styles.inviteButton}
                    onPress={() => handleInvite(item)}
                >
                    <Text style={styles.inviteText}>Invite</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search contacts"
                onChangeText={handleSearch}
                value={searchQuery}
                style={styles.searchBar}
                iconColor={COLORS.primary}
            />

            {loading ? (
                <View style={styles.centerContainer}>
                    <Text>Loading contacts...</Text>
                </View>
            ) : sections.length === 0 ? (
                <View style={styles.centerContainer}>
                    <IconButton icon="account-group" size={80} iconColor="#E5E5E5" />
                    <Text style={styles.emptyText}>
                        {searchQuery ? 'No contacts found' : 'No contacts available'}
                    </Text>
                    <Text style={styles.emptySubtext}>
                        Make sure you've granted contacts permission
                    </Text>
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    renderItem={renderContact}
                    renderSectionHeader={renderSectionHeader}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                    stickySectionHeadersEnabled={true}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        margin: SPACING.md,
        elevation: 0,
        backgroundColor: '#F0F2F5',
    },
    sectionHeader: {
        backgroundColor: '#F7F8FA',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E9EDEF',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: '#fff',
    },
    avatar: {
        marginRight: SPACING.md,
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    contactPhone: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    inviteButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
    },
    inviteText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        marginLeft: 74,
        backgroundColor: '#E9EDEF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.textSecondary,
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 8,
        textAlign: 'center',
    },
});
