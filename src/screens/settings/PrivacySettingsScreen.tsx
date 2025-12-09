import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Platform, Alert, ActivityIndicator } from 'react-native';
import { IconButton, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import settingsAPI from '../../services/settingsAPI';

export const PrivacySettingsScreen = () => {
    const navigation = useNavigation<any>();
    const [lastSeen, setLastSeen] = useState('everyone');
    const [profilePhoto, setProfilePhoto] = useState('everyone');
    const [about, setAbout] = useState('everyone');
    const [status, setStatus] = useState('my contacts');
    const [groups, setGroups] = useState('everyone');
    const [readReceipts, setReadReceipts] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPrivacySettings();
    }, []);

    const loadPrivacySettings = async () => {
        try {
            setIsLoading(true);
            const settings = await settingsAPI.privacy.getAll();
            if (settings) {
                setLastSeen(settings.lastSeen?.whoCanSee || 'everyone');
                setProfilePhoto(settings.profilePhoto?.whoCanSee || 'everyone');
                setAbout(settings.about?.whoCanSee || 'everyone');
                setReadReceipts(settings.readReceipts?.enabled !== false);
            }
        } catch (error: any) {
            console.error('Error loading privacy settings:', error);
            // Only show alert if it's not a 401 (not logged in)
            if (error.response?.status !== 401) {
                Alert.alert('Error', 'Failed to load privacy settings');
            }
            // Keep default values
        } finally {
            setIsLoading(false);
        }
    };

    const PrivacyCard = ({ icon, title, description, value, onPress }: any) => (
        <TouchableOpacity
            style={styles.privacyCard}
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
                    {value && (
                        <Text style={styles.cardValue}>{value}</Text>
                    )}
                </View>
            </View>
            <IconButton icon="chevron-right" size={20} iconColor="#8696A0" style={styles.chevron} />
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#25D366" />
                <Text style={{ marginTop: 16, color: '#666' }}>Loading privacy settings...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Info Card */}
            <View style={styles.headerCard}>
                <View style={styles.encryptionIcon}>
                    <IconButton icon="lock" iconColor="#4CAF50" size={28} />
                </View>
                <Text style={styles.headerTitle}>Privacy & Security</Text>
                <Text style={styles.headerSubtitle}>
                    Your personal information is protected by WhatsApp end-to-end encryption
                </Text>
            </View>

            {/* Personal Info Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Who can see my personal info</Text>
                <View style={styles.cardContainer}>
                    <PrivacyCard
                        icon={{ name: 'clock-outline', color: '#2196F3' }}
                        title="Last seen and online"
                        value={lastSeen}
                        onPress={() => navigation.navigate('LastSeenPrivacy')}
                    />
                    <PrivacyCard
                        icon={{ name: 'account-circle', color: '#9C27B0' }}
                        title="Profile photo"
                        value={profilePhoto}
                        onPress={() => navigation.navigate('ProfilePhotoPrivacy')}
                    />
                    <PrivacyCard
                        icon={{ name: 'information', color: '#FF9800' }}
                        title="About"
                        value={about}
                        onPress={() => navigation.navigate('AboutPrivacy')}
                    />
                    <PrivacyCard
                        icon={{ name: 'circle-slice-8', color: '#4CAF50' }}
                        title="Status"
                        value={status}
                        onPress={() => navigation.navigate('StatusPrivacy')}
                    />
                </View>
            </View>

            {/* Disappearing Messages */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Disappearing messages</Text>
                <View style={styles.cardContainer}>
                    <PrivacyCard
                        icon={{ name: 'timer-sand', color: '#FF5722' }}
                        title="Default message timer"
                        value="Off"
                        description="Set a default for new chats"
                        onPress={() => { }}
                    />
                </View>
            </View>

            {/* Other Privacy Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Other privacy settings</Text>
                <View style={styles.cardContainer}>
                    <PrivacyCard
                        icon={{ name: 'check-all', color: '#00BCD4' }}
                        title="Read receipts"
                        description="If turned off, you won't send or receive read receipts"
                        onPress={() => navigation.navigate('ReadReceiptsSettings')}
                    />
                    <PrivacyCard
                        icon={{ name: 'account-group', color: '#E91E63' }}
                        title="Groups"
                        value={groups}
                        description="Who can add me to groups"
                        onPress={() => navigation.navigate('GroupsPrivacy')}
                    />
                    <PrivacyCard
                        icon={{ name: 'map-marker', color: '#F44336' }}
                        title="Live location"
                        value="None"
                        description="No active location sharing"
                        onPress={() => navigation.navigate('LiveLocationPrivacy')}
                    />
                    <PrivacyCard
                        icon={{ name: 'phone', color: '#4CAF50' }}
                        title="Calls"
                        value="Everyone"
                        description="Who can call me"
                        onPress={() => navigation.navigate('CallsPrivacy')}
                    />
                </View>
            </View>

            {/* Security */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security</Text>
                <View style={styles.cardContainer}>
                    <PrivacyCard
                        icon={{ name: 'block-helper', color: '#FF5722' }}
                        title="Blocked contacts"
                        value="0"
                        description="Manage blocked users"
                        onPress={() => navigation.navigate('BlockedContacts')}
                    />
                    <PrivacyCard
                        icon={{ name: 'fingerprint', color: '#9C27B0' }}
                        title="Fingerprint lock"
                        value="Off"
                        description="Require fingerprint to open WhatsApp"
                        onPress={() => { }}
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
    encryptionIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E8F5E9',
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
    privacyCard: {
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
        marginBottom: 2,
    },
    cardDescription: {
        fontSize: 12,
        color: '#8696A0',
        marginTop: 2,
    },
    cardValue: {
        fontSize: 13,
        color: '#25D366',
        fontWeight: '600',
        marginTop: 4,
    },
    chevron: {
        margin: 0,
    },
    bottomSpace: {
        height: 24,
    },
});
