import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity, Alert } from 'react-native';
import { IconButton, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export const SecuritySettingsScreen = () => {
    const navigation = useNavigation<any>();
    const [twoStepEnabled, setTwoStepEnabled] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [faceIDEnabled, setFaceIDEnabled] = useState(false);
    const [securityNotifications, setSecurityNotifications] = useState(true);

    const SecurityCard = ({ icon, title, description, onPress, rightElement, badge }: any) => (
        <TouchableOpacity
            style={styles.securityCard}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
                    <IconButton icon={icon.name} size={24} iconColor={icon.color} style={styles.iconButton} />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{title}</Text>
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
                <View style={styles.shieldIcon}>
                    <IconButton icon="shield-check" iconColor="#FF9800" size={32} />
                </View>
                <Text style={styles.headerTitle}>Security & Protection</Text>
                <Text style={styles.headerSubtitle}>
                    Keep your account secure with additional protection layers
                </Text>
            </View>

            {/* Biometric Security */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Biometric Security</Text>
                <View style={styles.cardContainer}>
                    <SecurityCard
                        icon={{ name: 'lock', color: '#FF9800' }}
                        title="App Lock"
                        description="Secure WhatsApp with PIN or biometric"
                        onPress={() => navigation.navigate('AppLock')}
                    />
                    <SecurityCard
                        icon={{ name: 'fingerprint', color: '#9C27B0' }}
                        title="Fingerprint Authentication"
                        description={biometricEnabled ? 'Enabled' : 'Use fingerprint to unlock'}
                        rightElement={
                            <Switch
                                value={biometricEnabled}
                                onValueChange={setBiometricEnabled}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                    <SecurityCard
                        icon={{ name: 'face-recognition', color: '#2196F3' }}
                        title="Face ID Authentication"
                        description={faceIDEnabled ? 'Enabled' : 'Use Face ID to unlock'}
                        rightElement={
                            <Switch
                                value={faceIDEnabled}
                                onValueChange={setFaceIDEnabled}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                </View>
            </View>

            {/* Account Security */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Security</Text>
                <View style={styles.cardContainer}>
                    <SecurityCard
                        icon={{ name: 'shield-check', color: '#4CAF50' }}
                        title="Two-step verification"
                        description={twoStepEnabled ? 'Enabled - Extra security active' : 'Add extra layer of security'}
                        onPress={() => navigation.navigate('TwoStepVerification')}
                    />
                    <SecurityCard
                        icon={{ name: 'bell-alert', color: '#FF5722' }}
                        title="Security Notifications"
                        description={securityNotifications ? 'Get notified of security changes' : 'Notifications disabled'}
                        rightElement={
                            <Switch
                                value={securityNotifications}
                                onValueChange={setSecurityNotifications}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                    <SecurityCard
                        icon={{ name: 'shield-lock', color: '#00BCD4' }}
                        title="Encryption Info"
                        description="View end-to-end encryption details"
                        onPress={() => navigation.navigate('EncryptionInfo')}
                    />
                </View>
            </View>

            {/* Account Management */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Management</Text>
                <View style={styles.cardContainer}>
                    <SecurityCard
                        icon={{ name: 'phone-sync', color: '#2196F3' }}
                        title="Change number"
                        description="Migrate your account to a new number"
                        onPress={() => Alert.alert(
                            'Change Number',
                            'Changing your phone number will migrate your account info, groups & settings.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Continue', onPress: () => {} },
                            ]
                        )}
                    />
                    <SecurityCard
                        icon={{ name: 'file-document', color: '#4CAF50' }}
                        title="Request account info"
                        description="Download a report of your account data"
                        onPress={() => Alert.alert(
                            'Request Account Info',
                            'Create a report of your WhatsApp account information and settings.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Request Report', onPress: () => {} },
                            ]
                        )}
                    />
                </View>
            </View>

            {/* Danger Zone */}
            <View style={styles.section}>
                <Text style={styles.dangerTitle}>Danger Zone</Text>
                <View style={styles.dangerContainer}>
                    <SecurityCard
                        icon={{ name: 'delete-forever', color: '#F44336' }}
                        title="Delete my account"
                        description="Permanently delete your account and data"
                        onPress={() => Alert.alert(
                            'Delete My Account',
                            'This will delete your account and erase your message history. This action cannot be undone.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Delete',
                                    style: 'destructive',
                                    onPress: () => {},
                                },
                            ]
                        )}
                    />
                </View>
            </View>

            {/* Info Cards */}
            <View style={styles.infoSection}>
                <View style={styles.infoCard}>
                    <View style={styles.infoIconContainer}>
                        <IconButton icon="lock" iconColor="#4CAF50" size={20} />
                    </View>
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoTitle}>End-to-end encryption</Text>
                        <Text style={styles.infoText}>
                            Messages and calls are secured with end-to-end encryption.
                        </Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.infoIconContainer}>
                        <IconButton icon="qrcode" iconColor="#2196F3" size={20} />
                    </View>
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoTitle}>Security code verification</Text>
                        <Text style={styles.infoText}>
                            Verify that calls and messages are end-to-end encrypted via security codes.
                        </Text>
                    </View>
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
    shieldIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF3E0',
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
    securityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
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
    infoSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    infoIconContainer: {
        marginRight: 12,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#667781',
        lineHeight: 16,
    },
    bottomSpace: {
        height: 24,
    },
});
