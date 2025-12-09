import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity, Alert } from 'react-native';
import { IconButton, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export const AccountSettingsScreen = () => {
    const navigation = useNavigation<any>();
    const [readReceipts, setReadReceipts] = useState(true);
    const [lastSeen, setLastSeen] = useState(true);

    const AccountCard = ({ icon, title, description, onPress, rightElement, isDanger }: any) => (
        <TouchableOpacity
            style={[styles.accountCard, isDanger && styles.dangerCard]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
                    <IconButton icon={icon.name} size={24} iconColor={icon.color} style={styles.iconButton} />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, isDanger && styles.dangerText]}>{title}</Text>
                    {description && (
                        <Text style={styles.cardDescription}>{description}</Text>
                    )}
                </View>
            </View>
            {rightElement || <IconButton icon="chevron-right" size={20} iconColor="#8696A0" style={styles.chevron} />}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={styles.accountIcon}>
                    <IconButton icon="account-cog" iconColor="#2196F3" size={32} />
                </View>
                <Text style={styles.headerTitle}>Account Management</Text>
                <Text style={styles.headerSubtitle}>
                    Manage your account settings, privacy, and data
                </Text>
            </View>

            {/* Security */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security</Text>
                <View style={styles.cardContainer}>
                    <AccountCard
                        icon={{ name: 'shield-check', color: '#4CAF50' }}
                        title="Security notifications"
                        description="Get notified of security changes"
                        onPress={() => {}}
                    />
                </View>
            </View>

            {/* Account Options */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Options</Text>
                <View style={styles.cardContainer}>
                    <AccountCard
                        icon={{ name: 'phone-sync', color: '#2196F3' }}
                        title="Change number"
                        description="Update your phone number"
                        onPress={() => navigation.navigate('ChangeNumber')}
                    />
                    <AccountCard
                        icon={{ name: 'check-decagram', color: '#9C27B0' }}
                        title="Verify account"
                        description="Verify your account identity"
                        onPress={() => navigation.navigate('VerifyAccount')}
                    />
                    <AccountCard
                        icon={{ name: 'file-document', color: '#00BCD4' }}
                        title="Request account info"
                        description="Download your account data report"
                        onPress={() => navigation.navigate('RequestAccountInfo')}
                    />
                    <AccountCard
                        icon={{ name: 'history', color: '#FF9800' }}
                        title="Account activity"
                        description="View recent account activity"
                        onPress={() => navigation.navigate('AccountActivity')}
                    />
                    <AccountCard
                        icon={{ name: 'devices', color: '#607D8B' }}
                        title="Linked devices"
                        description="Manage connected devices"
                        onPress={() => navigation.navigate('LinkedDevicesDetail')}
                    />
                </View>
            </View>

            {/* Privacy Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy Settings</Text>
                <View style={styles.cardContainer}>
                    <AccountCard
                        icon={{ name: 'check-all', color: '#4CAF50' }}
                        title="Read receipts"
                        description={readReceipts ? 'Sending and receiving read receipts' : 'Read receipts disabled'}
                        rightElement={
                            <Switch
                                value={readReceipts}
                                onValueChange={setReadReceipts}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                    <AccountCard
                        icon={{ name: 'clock-outline', color: '#2196F3' }}
                        title="Last seen & online"
                        description={lastSeen ? 'Showing online status' : 'Status hidden'}
                        rightElement={
                            <Switch
                                value={lastSeen}
                                onValueChange={setLastSeen}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                    <AccountCard
                        icon={{ name: 'camera', color: '#FF5722' }}
                        title="Profile photo"
                        description="Everyone"
                        onPress={() => {}}
                    />
                    <AccountCard
                        icon={{ name: 'information', color: '#FF9800' }}
                        title="About"
                        description="Everyone"
                        onPress={() => {}}
                    />
                    <AccountCard
                        icon={{ name: 'account-group', color: '#9C27B0' }}
                        title="Groups"
                        description="Everyone can add me"
                        onPress={() => {}}
                    />
                    <AccountCard
                        icon={{ name: 'block-helper', color: '#F44336' }}
                        title="Blocked contacts"
                        description="0 blocked users"
                        onPress={() => {}}
                    />
                </View>
            </View>

            {/* Account Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Actions</Text>
                <View style={styles.cardContainer}>
                    <AccountCard
                        icon={{ name: 'pause-circle', color: '#FF9800' }}
                        title="Deactivate account"
                        description="Temporarily disable your account"
                        onPress={() => navigation.navigate('DeactivateAccount')}
                    />
                </View>
            </View>

            {/* Danger Zone */}
            <View style={styles.section}>
                <Text style={styles.dangerTitle}>Danger Zone</Text>
                <View style={styles.dangerContainer}>
                    <AccountCard
                        icon={{ name: 'delete-forever', color: '#F44336' }}
                        title="Delete my account"
                        description="Permanently delete your account and all data"
                        isDanger
                        onPress={() => navigation.navigate('DeleteAccount')}
                    />
                </View>
            </View>

            <View style={styles.bottomSpace} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerCard: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    accountIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 18,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    dangerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F44336',
        marginBottom: 12,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    dangerContainer: {
        backgroundColor: '#FFEBEE',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    accountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    dangerCard: {
        backgroundColor: 'transparent',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        margin: 0,
    },
    cardInfo: {
        marginLeft: 14,
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    dangerText: {
        color: '#F44336',
    },
    cardDescription: {
        fontSize: 13,
        color: '#667781',
        marginTop: 2,
    },
    chevron: {
        margin: 0,
    },
    switch: {
        marginRight: 8,
    },
    bottomSpace: {
        height: 24,
    },
});
