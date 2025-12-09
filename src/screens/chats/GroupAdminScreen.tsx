import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { List, Avatar, IconButton, Divider, Button } from 'react-native-paper';

interface GroupMember {
    id: string;
    name: string;
    phone: string;
    role: 'admin' | 'member';
}

export const GroupAdminScreen = ({ route }: any) => {
    const groupName = route?.params?.groupName || 'Family Group';
    
    const [members, setMembers] = useState<GroupMember[]>([
        { id: '1', name: 'Alice Johnson', phone: '+1 234 567 8901', role: 'admin' },
        { id: '2', name: 'Bob Smith', phone: '+1 234 567 8902', role: 'admin' },
        { id: '3', name: 'Charlie Brown', phone: '+1 234 567 8903', role: 'member' },
        { id: '4', name: 'Diana Prince', phone: '+1 234 567 8904', role: 'member' },
        { id: '5', name: 'Eve Wilson', phone: '+1 234 567 8905', role: 'member' },
    ]);

    const [groupSettings, setGroupSettings] = useState({
        sendMessages: 'all', // 'all' | 'admins'
        editGroupInfo: 'all', // 'all' | 'admins'
        approveNewMembers: false,
    });

    const admins = members.filter((m) => m.role === 'admin');
    const regularMembers = members.filter((m) => m.role === 'member');

    const handleMakeAdmin = (memberId: string) => {
        const member = members.find((m) => m.id === memberId);
        Alert.alert(
            'Make Group Admin',
            `Make ${member?.name} a group admin?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Make Admin',
                    onPress: () => {
                        setMembers(
                            members.map((m) =>
                                m.id === memberId ? { ...m, role: 'admin' } : m
                            )
                        );
                        Alert.alert('Success', `${member?.name} is now an admin`);
                    },
                },
            ]
        );
    };

    const handleDismissAdmin = (memberId: string) => {
        const member = members.find((m) => m.id === memberId);
        Alert.alert(
            'Dismiss as Admin',
            `Remove ${member?.name} as group admin?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Dismiss',
                    style: 'destructive',
                    onPress: () => {
                        setMembers(
                            members.map((m) =>
                                m.id === memberId ? { ...m, role: 'member' } : m
                            )
                        );
                        Alert.alert('Success', `${member?.name} is no longer an admin`);
                    },
                },
            ]
        );
    };

    const handleRemoveMember = (memberId: string) => {
        const member = members.find((m) => m.id === memberId);
        Alert.alert(
            'Remove from Group',
            `Remove ${member?.name} from the group?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setMembers(members.filter((m) => m.id !== memberId));
                        Alert.alert('Success', `${member?.name} has been removed`);
                    },
                },
            ]
        );
    };

    const handleMessagePermission = () => {
        Alert.alert(
            'Send Messages',
            'Who can send messages to this group?',
            [
                {
                    text: 'All Members',
                    onPress: () => setGroupSettings({ ...groupSettings, sendMessages: 'all' }),
                },
                {
                    text: 'Only Admins',
                    onPress: () =>
                        setGroupSettings({ ...groupSettings, sendMessages: 'admins' }),
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleEditInfoPermission = () => {
        Alert.alert(
            'Edit Group Info',
            'Who can edit this group\'s info?',
            [
                {
                    text: 'All Members',
                    onPress: () => setGroupSettings({ ...groupSettings, editGroupInfo: 'all' }),
                },
                {
                    text: 'Only Admins',
                    onPress: () =>
                        setGroupSettings({ ...groupSettings, editGroupInfo: 'admins' }),
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const renderMember = (member: GroupMember) => {
        const isAdmin = member.role === 'admin';

        return (
            <View key={member.id} style={styles.memberItem}>
                <Avatar.Text
                    size={48}
                    label={member.name.substring(0, 2).toUpperCase()}
                    style={styles.avatar}
                />
                <View style={styles.memberInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        {isAdmin && <Text style={styles.adminBadge}>ADMIN</Text>}
                    </View>
                    <Text style={styles.memberPhone}>{member.phone}</Text>
                </View>
                <IconButton
                    icon="dots-vertical"
                    size={24}
                    onPress={() => {
                        Alert.alert(
                            member.name,
                            'Select an action',
                            [
                                isAdmin
                                    ? {
                                          text: 'Dismiss as Admin',
                                          onPress: () => handleDismissAdmin(member.id),
                                      }
                                    : {
                                          text: 'Make Admin',
                                          onPress: () => handleMakeAdmin(member.id),
                                      },
                                {
                                    text: 'Remove from Group',
                                    style: 'destructive',
                                    onPress: () => handleRemoveMember(member.id),
                                },
                                { text: 'Cancel', style: 'cancel' },
                            ]
                        );
                    }}
                />
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Group Admin Settings</Text>
                <Text style={styles.subtitle}>{groupName}</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>GROUP PERMISSIONS</Text>

                <List.Item
                    title="Send messages"
                    description={
                        groupSettings.sendMessages === 'all' ? 'All members' : 'Only admins'
                    }
                    left={() => <List.Icon icon="message-text" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={handleMessagePermission}
                />

                <List.Item
                    title="Edit group info"
                    description={
                        groupSettings.editGroupInfo === 'all' ? 'All members' : 'Only admins'
                    }
                    left={() => <List.Icon icon="information" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={handleEditInfoPermission}
                />

                <List.Item
                    title="Approve new members"
                    description="Admin approval required to join"
                    left={() => <List.Icon icon="account-check" color="#25D366" />}
                    right={() => (
                        <IconButton
                            icon={groupSettings.approveNewMembers ? 'toggle-switch' : 'toggle-switch-off-outline'}
                            size={28}
                            iconColor={groupSettings.approveNewMembers ? '#25D366' : '#667781'}
                            onPress={() =>
                                setGroupSettings({
                                    ...groupSettings,
                                    approveNewMembers: !groupSettings.approveNewMembers,
                                })
                            }
                        />
                    )}
                />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>ADMINS ({admins.length})</Text>
                {admins.map((member) => renderMember(member))}
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>MEMBERS ({regularMembers.length})</Text>
                {regularMembers.map((member) => renderMember(member))}
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    ℹ️ Admins can change group settings, add or remove members, and make other
                    members admins.
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
        padding: 16,
        backgroundColor: '#F7F8FA',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#667781',
    },
    divider: {
        height: 8,
        backgroundColor: '#F7F8FA',
    },
    section: {
        backgroundColor: '#fff',
        paddingVertical: 8,
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '600',
        color: '#667781',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F7F8FA',
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatar: {
        backgroundColor: '#25D366',
    },
    memberInfo: {
        flex: 1,
        marginLeft: 16,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginRight: 8,
    },
    adminBadge: {
        fontSize: 10,
        fontWeight: '700',
        color: '#25D366',
        backgroundColor: '#E7F5EC',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    memberPhone: {
        fontSize: 13,
        color: '#667781',
    },
    infoBox: {
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
});
