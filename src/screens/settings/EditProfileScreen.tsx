import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import settingsAPI from '../../services/settingsAPI';

export const EditProfileScreen = () => {
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const profile = await settingsAPI.profile.get();
            setName(profile.name || '');
            setAbout(profile.statusMessage || 'Hey there! I am using WhatsApp.');
            setProfileImage(profile.avatarUrl || null);
        } catch (error: any) {
            console.error('Error loading profile:', error);
            // Only show alert if it's not a 401 (not logged in)
            if (error.response?.status !== 401) {
                Alert.alert('Error', 'Failed to load profile data');
            }
            // Use default values
            setName('User');
            setAbout('Hey there! I am using WhatsApp.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        try {
            setIsSaving(true);
            await settingsAPI.profile.update({
                name: name.trim(),
                statusMessage: about.trim(),
                avatarUrl: profileImage || undefined,
            });
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePhoto = () => {
        // Photo change logic would go here
        Alert.alert('Coming Soon', 'Photo upload feature will be available soon');
    };

    const quickAboutMessages = [
        { emoji: '📱', text: 'Available' },
        { emoji: '💼', text: 'At work' },
        { emoji: '🏃', text: 'Busy' },
        { emoji: '🔋', text: 'Battery about to die' },
        { emoji: '📞', text: 'In a meeting' },
        { emoji: '🎬', text: 'At the movies' },
        { emoji: '💤', text: 'Sleeping' },
    ];


    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#25D366" />
                <Text style={{ marginTop: 16, color: '#666' }}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Card with Avatar */}
            <View style={styles.headerCard}>
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={handleChangePhoto}
                    activeOpacity={0.7}
                >
                    {profileImage ? (
                        <Avatar.Image size={120} source={{ uri: profileImage }} />
                    ) : (
                        <Avatar.Text
                            size={120}
                            label={name.substring(0, 2).toUpperCase()}
                            style={styles.avatar}
                        />
                    )}
                    <View style={styles.cameraOverlay}>
                        <IconButton icon="camera" iconColor="#fff" size={24} />
                    </View>
                </TouchableOpacity>
                <Text style={styles.photoHint}>Tap to change profile photo</Text>
            </View>

            {/* Name Card */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile Information</Text>
                <View style={styles.inputCard}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>Name</Text>
                        <Text style={[
                            styles.charCount,
                            name.length >= 23 && styles.charCountWarning,
                            name.length === 25 && styles.charCountDanger
                        ]}>
                            {name.length}/25
                        </Text>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        placeholderTextColor="#999"
                        maxLength={25}
                    />
                    <View style={styles.inputFooter}>
                        <IconButton icon="information" iconColor="#2196F3" size={16} />
                        <Text style={styles.inputHint}>
                            This name will be visible to your WhatsApp contacts
                        </Text>
                    </View>
                </View>
            </View>

            {/* About Card */}
            <View style={styles.section}>
                <View style={styles.inputCard}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.inputLabel}>About</Text>
                        <Text style={[
                            styles.charCount,
                            about.length >= 130 && styles.charCountWarning,
                            about.length === 139 && styles.charCountDanger
                        ]}>
                            {about.length}/139
                        </Text>
                    </View>
                    <TextInput
                        style={[styles.textInput, styles.multilineInput]}
                        value={about}
                        onChangeText={setAbout}
                        placeholder="Add a status"
                        placeholderTextColor="#999"
                        maxLength={139}
                        multiline
                        numberOfLines={3}
                    />
                </View>
            </View>

            {/* Quick About Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick About Messages</Text>
                <View style={styles.quickAboutContainer}>
                    {quickAboutMessages.map((status, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.quickAboutCard}
                            onPress={() => setAbout(`${status.emoji} ${status.text}`)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.quickAboutEmoji}>{status.emoji}</Text>
                            <Text style={styles.quickAboutText}>{status.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Save Button */}
            <View style={styles.section}>
                <TouchableOpacity
                    style={[styles.saveButton, (!name.trim() || isSaving) && styles.buttonDisabled]}
                    onPress={handleSave}
                    disabled={!name.trim() || isSaving}
                    activeOpacity={0.8}
                >
                    {isSaving ? (
                        <Text style={styles.saveButtonText}>Saving...</Text>
                    ) : (
                        <>
                            <IconButton icon="check-circle" iconColor="#fff" size={20} />
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Info Card */}
            <View style={styles.section}>
                <View style={styles.infoCard}>
                    <View style={styles.infoIconContainer}>
                        <IconButton icon="shield-check" iconColor="#4CAF50" size={20} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Your Privacy</Text>
                        <Text style={styles.infoText}>
                            Your profile information is end-to-end encrypted and only visible to people you choose to share with
                        </Text>
                    </View>
                </View>
            </View>
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
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        alignItems: 'center',
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
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        backgroundColor: '#25D366',
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#25D366',
        borderRadius: 24,
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    photoHint: {
        marginTop: 12,
        fontSize: 13,
        color: '#666',
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    inputCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    inputHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    charCount: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
    },
    charCountWarning: {
        color: '#FF9800',
    },
    charCountDanger: {
        color: '#dc3545',
    },
    textInput: {
        fontSize: 16,
        color: '#1a1a1a',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    multilineInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    inputFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginLeft: -8,
    },
    inputHint: {
        flex: 1,
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
    quickAboutContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    quickAboutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        marginBottom: 8,
    },
    quickAboutEmoji: {
        fontSize: 20,
        marginRight: 12,
    },
    quickAboutText: {
        fontSize: 15,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#25D366',
        borderRadius: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
    infoCard: {
        backgroundColor: '#E8F5E9',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    infoIconContainer: {
        marginRight: 8,
        marginTop: -4,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2E7D32',
        marginBottom: 6,
    },
    infoText: {
        fontSize: 13,
        color: '#388E3C',
        lineHeight: 18,
    },
});
