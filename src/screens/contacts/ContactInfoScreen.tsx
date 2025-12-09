import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Avatar, IconButton, Button, Divider, List } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Contact {
    id: string;
    name: string;
    phoneNumber: string;
    avatar?: string;
    about?: string;
    email?: string;
}

export const ContactInfoScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    
    const [contact] = useState<Contact>({
        id: '1',
        name: 'Alice Johnson',
        phoneNumber: '+1 234 567 8900',
        about: 'Hey there! I am using WhatsApp.',
        email: 'alice.johnson@example.com',
    });

    const [isBlocked, setIsBlocked] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const handleBlock = () => {
        Alert.alert(
            isBlocked ? 'Unblock contact' : 'Block contact',
            isBlocked 
                ? `${contact.name} will be able to call you and send you messages`
                : `You won't receive messages or calls from ${contact.name}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: isBlocked ? 'Unblock' : 'Block',
                    style: 'destructive',
                    onPress: () => {
                        setIsBlocked(!isBlocked);
                        Alert.alert('Success', `${contact.name} has been ${isBlocked ? 'unblocked' : 'blocked'}`);
                    },
                },
            ]
        );
    };

    const handleMute = () => {
        Alert.alert(
            'Mute notifications',
            'Choose duration',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: '8 hours', onPress: () => setIsMuted(true) },
                { text: '1 week', onPress: () => setIsMuted(true) },
                { text: 'Always', onPress: () => setIsMuted(true) },
            ]
        );
    };

    const handleReport = () => {
        Alert.alert(
            'Report contact',
            'Block contact and report spam?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Report and Block',
                    style: 'destructive',
                    onPress: () => {
                        setIsBlocked(true);
                        Alert.alert('Reported', 'Contact has been reported and blocked');
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {contact.avatar ? (
                    <Avatar.Image size={100} source={{ uri: contact.avatar }} />
                ) : (
                    <Avatar.Text
                        size={100}
                        label={contact.name.substring(0, 2).toUpperCase()}
                        style={styles.avatar}
                    />
                )}
                <Text style={styles.name}>{contact.name}</Text>
                <Text style={styles.phoneNumber}>{contact.phoneNumber}</Text>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Chat', { contactId: contact.id })}
                >
                    <IconButton icon="message" iconColor="#25D366" size={24} />
                    <Text style={styles.actionButtonText}>Message</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Call', `Calling ${contact.name}`)}
                >
                    <IconButton icon="phone" iconColor="#25D366" size={24} />
                    <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Video Call', `Video calling ${contact.name}`)}
                >
                    <IconButton icon="video" iconColor="#25D366" size={24} />
                    <Text style={styles.actionButtonText}>Video</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Info', 'View contact details')}
                >
                    <IconButton icon="information" iconColor="#25D366" size={24} />
                    <Text style={styles.actionButtonText}>Info</Text>
                </TouchableOpacity>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.sectionContent}>{contact.about}</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <List.Item
                    title="Media, links and docs"
                    description="125 items"
                    left={() => <List.Icon icon="image" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={() => navigation.navigate('MediaLinks')}
                />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <List.Item
                    title="Mute notifications"
                    left={() => <List.Icon icon="bell-off" color="#25D366" />}
                    right={() => (
                        <TouchableOpacity onPress={handleMute}>
                            <Text style={styles.muteStatus}>{isMuted ? 'Muted' : 'Off'}</Text>
                        </TouchableOpacity>
                    )}
                    onPress={handleMute}
                />
                
                <List.Item
                    title="Custom notifications"
                    left={() => <List.Icon icon="bell-ring" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={() => {}}
                />
                
                <List.Item
                    title="Disappearing messages"
                    description="Off"
                    left={() => <List.Icon icon="timer-sand" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={() => {}}
                />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <List.Item
                    title="Starred messages"
                    left={() => <List.Icon icon="star" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={() => {}}
                />
                
                <List.Item
                    title="Chat lock"
                    left={() => <List.Icon icon="lock" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={() => {}}
                />
                
                <List.Item
                    title="Export chat"
                    left={() => <List.Icon icon="export" color="#25D366" />}
                    onPress={() => Alert.alert('Export', 'Export chat history')}
                />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.dangerSection}>
                <List.Item
                    title={isBlocked ? 'Unblock' : 'Block'}
                    titleStyle={styles.dangerText}
                    left={() => <List.Icon icon="block-helper" color="#F44336" />}
                    onPress={handleBlock}
                />
                
                <List.Item
                    title="Report contact"
                    titleStyle={styles.dangerText}
                    left={() => <List.Icon icon="alert-octagon" color="#F44336" />}
                    onPress={handleReport}
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Created on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Text>
            </View>
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
        backgroundColor: '#fff',
    },
    avatar: {
        backgroundColor: '#25D366',
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    phoneNumber: {
        fontSize: 16,
        color: '#667781',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 12,
        color: '#25D366',
        marginTop: -8,
    },
    divider: {
        height: 8,
        backgroundColor: '#F7F8FA',
    },
    section: {
        paddingVertical: 8,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#667781',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    sectionContent: {
        fontSize: 16,
        color: '#000',
        paddingHorizontal: 16,
        paddingBottom: 16,
        lineHeight: 22,
    },
    muteStatus: {
        fontSize: 14,
        color: '#667781',
        marginRight: 8,
    },
    dangerSection: {
        paddingVertical: 8,
    },
    dangerText: {
        color: '#F44336',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    footerText: {
        fontSize: 12,
        color: '#667781',
    },
});
