import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
    Text,
} from 'react-native';
import { Avatar, List, Button, Divider, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';

export const ContactProfileScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { conversationId, contactId } = route.params;
    const [isBlocked, setIsBlocked] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Mock contact data - replace with actual data from your store/API
    const contact = {
        id: contactId || 'user-1',
        name: 'John Doe',
        phone: '+1 234 567 8900',
        about: 'Hey there! I am using WhatsApp',
        avatarUrl: null,
        commonGroups: 3,
        isOnline: true,
        lastSeen: '2 hours ago',
    };

    const handleCall = (type: 'audio' | 'video') => {
        navigation.navigate('OutgoingCall', {
            callType: type,
            calleeIds: [contact.id],
            calleeName: contact.name,
            calleeAvatar: contact.avatarUrl,
            conversationId,
        });
    };

    const handleBlock = () => {
        Alert.alert(
            isBlocked ? 'Unblock Contact' : 'Block Contact',
            isBlocked
                ? `Unblock ${contact.name}? You will be able to call and send messages to this contact.`
                : `Block ${contact.name}? Blocked contacts will no longer be able to call you or send you messages.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: isBlocked ? 'Unblock' : 'Block',
                    style: isBlocked ? 'default' : 'destructive',
                    onPress: () => {
                        setIsBlocked(!isBlocked);
                        Alert.alert(
                            'Success',
                            isBlocked ? 'Contact unblocked' : 'Contact blocked'
                        );
                    },
                },
            ]
        );
    };

    const handleReport = () => {
        Alert.alert(
            'Report Contact',
            'Block contact and report to WhatsApp? Last 5 messages will be forwarded to WhatsApp. This contact will not be notified.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Report and Block',
                    style: 'destructive',
                    onPress: () => {
                        setIsBlocked(true);
                        Alert.alert('Success', 'Contact reported and blocked');
                    },
                },
            ]
        );
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Chat',
            'Delete all messages in this chat?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        navigation.goBack();
                        Alert.alert('Success', 'Chat deleted');
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                <Avatar.Text
                    size={100}
                    label={contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{contact.name}</Text>
                <Text style={styles.phone}>{contact.phone}</Text>
                {contact.isOnline ? (
                    <Text style={styles.online}>Online</Text>
                ) : (
                    <Text style={styles.lastSeen}>Last seen {contact.lastSeen}</Text>
                )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCall('audio')}
                >
                    <IconButton icon="phone" size={24} iconColor="#25D366" />
                    <Text style={styles.actionText}>Audio</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCall('video')}
                >
                    <IconButton icon="video" size={24} iconColor="#25D366" />
                    <Text style={styles.actionText}>Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('SearchMessages', { conversationId })}
                >
                    <IconButton icon="magnify" size={24} iconColor="#25D366" />
                    <Text style={styles.actionText}>Search</Text>
                </TouchableOpacity>
            </View>

            <Divider style={styles.divider} />

            {/* About & Phone */}
            <List.Section>
                <List.Subheader>About and phone number</List.Subheader>
                <List.Item
                    title={contact.about}
                    description="About"
                    left={props => <List.Icon {...props} icon="information" />}
                />
                <List.Item
                    title={contact.phone}
                    description="Phone"
                    left={props => <List.Icon {...props} icon="phone" />}
                    right={props => (
                        <View style={styles.phoneActions}>
                            <IconButton icon="message" size={20} iconColor="#25D366" />
                            <IconButton icon="phone" size={20} iconColor="#25D366" />
                        </View>
                    )}
                />
            </List.Section>

            <Divider style={styles.divider} />

            {/* Settings */}
            <List.Section>
                <List.Item
                    title="Media, links, and docs"
                    description={`${Math.floor(Math.random() * 100)} items`}
                    left={props => <List.Icon {...props} icon="image-multiple" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('MediaLinks', { conversationId })}
                />
                <List.Item
                    title="Starred messages"
                    left={props => <List.Icon {...props} icon="star" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('StarredMessages', { conversationId })}
                />
                <List.Item
                    title="Chat search"
                    left={props => <List.Icon {...props} icon="magnify" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('SearchMessages', { conversationId })}
                />
            </List.Section>

            <Divider style={styles.divider} />

            {/* Notification Settings */}
            <List.Section>
                <List.Item
                    title="Mute notifications"
                    description={isMuted ? 'Muted' : 'Not muted'}
                    left={props => <List.Icon {...props} icon="volume-off" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => {
                        navigation.navigate('MuteChat', { conversationId });
                    }}
                />
                <List.Item
                    title="Custom notifications"
                    left={props => <List.Icon {...props} icon="bell" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('CustomNotification', { conversationId })}
                />
                <List.Item
                    title="Wallpaper"
                    left={props => <List.Icon {...props} icon="image" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('ChatWallpaper', { conversationId })}
                />
            </List.Section>

            <Divider style={styles.divider} />

            {/* Privacy Settings */}
            <List.Section>
                <List.Item
                    title="Disappearing messages"
                    description="Off"
                    left={props => <List.Icon {...props} icon="timer-sand" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('DisappearingMessages', { conversationId })}
                />
                <List.Item
                    title="Encryption"
                    description="Messages are end-to-end encrypted"
                    left={props => <List.Icon {...props} icon="lock" />}
                />
            </List.Section>

            <Divider style={styles.divider} />

            {/* Groups in Common */}
            <List.Section>
                <List.Item
                    title={`${contact.commonGroups} groups in common`}
                    left={props => <List.Icon {...props} icon="account-group" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => Alert.alert('Info', 'View common groups')}
                />
            </List.Section>

            <Divider style={styles.divider} />

            {/* Danger Zone */}
            <List.Section>
                <List.Item
                    title={isBlocked ? 'Unblock' : 'Block'}
                    left={props => <List.Icon {...props} icon="block-helper" color="#d32f2f" />}
                    titleStyle={{ color: '#d32f2f' }}
                    onPress={handleBlock}
                />
                <List.Item
                    title="Report contact"
                    left={props => <List.Icon {...props} icon="alert-circle" color="#d32f2f" />}
                    titleStyle={{ color: '#d32f2f' }}
                    onPress={handleReport}
                />
                <List.Item
                    title="Delete chat"
                    left={props => <List.Icon {...props} icon="delete" color="#d32f2f" />}
                    titleStyle={{ color: '#d32f2f' }}
                    onPress={handleDelete}
                />
            </List.Section>

            <View style={styles.bottomSpace} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: '#f5f5f5',
    },
    avatar: {
        backgroundColor: '#25D366',
        marginBottom: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    phone: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    online: {
        fontSize: 14,
        color: '#25D366',
    },
    lastSeen: {
        fontSize: 14,
        color: '#999',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    actionButton: {
        alignItems: 'center',
    },
    actionText: {
        fontSize: 12,
        color: '#666',
        marginTop: -4,
    },
    phoneActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        backgroundColor: '#E0E0E0',
        height: 8,
    },
    bottomSpace: {
        height: 40,
    },
});
