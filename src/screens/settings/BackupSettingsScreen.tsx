import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Switch, IconButton } from 'react-native-paper';

export const BackupSettingsScreen = () => {
    const [autoBackup, setAutoBackup] = useState(true);
    const [backupFrequency, setBackupFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [includeVideos, setIncludeVideos] = useState(true);
    const [backupOverWiFi, setBackupOverWiFi] = useState(true);
    const [showFrequencyOptions, setShowFrequencyOptions] = useState(false);
    
    const [backupInfo] = useState({
        lastBackup: new Date('2024-12-08T02:30:00'),
        backupSize: '2.4 GB',
        googleDriveAccount: 'user@gmail.com',
    });

    const formatLastBackup = () => {
        const now = new Date();
        const lastBackup = backupInfo.lastBackup;
        const diffMs = now.getTime() - lastBackup.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours < 1) return 'Less than an hour ago';
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        
        return lastBackup.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleBackupNow = () => {
        // Backup logic
    };

    const handleChangeAccount = () => {
        // Change account logic
    };

    const handleManageBackups = () => {
        // Manage backups logic
    };

    const getFrequencyText = () => {
        return backupFrequency.charAt(0).toUpperCase() + backupFrequency.slice(1);
    };

    const frequencyOptions = [
        { id: 'daily', label: 'Daily', icon: 'calendar-today' },
        { id: 'weekly', label: 'Weekly', icon: 'calendar-week' },
        { id: 'monthly', label: 'Monthly', icon: 'calendar-month' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                    <IconButton icon="cloud-upload" iconColor="#4CAF50" size={32} />
                </View>
                <Text style={styles.headerTitle}>Backup Settings</Text>
                <Text style={styles.headerSubtitle}>
                    Keep your chats safe with automatic backups
                </Text>
            </View>

            {/* Backup Status Card */}
            <View style={styles.section}>
                <View style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                        <View>
                            <Text style={styles.statusLabel}>Last Backup</Text>
                            <Text style={styles.statusTime}>{formatLastBackup()}</Text>
                        </View>
                        <View style={styles.syncBadge}>
                            <IconButton icon="check-circle" iconColor="#4CAF50" size={16} />
                            <Text style={styles.syncText}>Synced</Text>
                        </View>
                    </View>
                    
                    <View style={styles.statusDetails}>
                        <View style={styles.statusDetailItem}>
                            <IconButton icon="package-variant" iconColor="#666" size={20} />
                            <Text style={styles.statusSize}>{backupInfo.backupSize}</Text>
                        </View>
                        <View style={styles.statusDetailItem}>
                            <IconButton icon="google-drive" iconColor="#666" size={20} />
                            <Text style={styles.statusAccount}>{backupInfo.googleDriveAccount}</Text>
                        </View>
                    </View>
                    
                    <TouchableOpacity
                        style={styles.backupButton}
                        onPress={handleBackupNow}
                        activeOpacity={0.8}
                    >
                        <IconButton icon="backup-restore" iconColor="#fff" size={20} />
                        <Text style={styles.backupButtonText}>Backup Now</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Google Drive Account */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Settings</Text>
                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.settingCard}
                        onPress={handleChangeAccount}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(66, 133, 244, 0.15)' }]}>
                            <IconButton icon="google-drive" iconColor="#4285F4" size={24} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Google Drive Account</Text>
                            <Text style={styles.settingDescription}>{backupInfo.googleDriveAccount}</Text>
                        </View>
                        <IconButton icon="chevron-right" iconColor="#666" size={20} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Backup Frequency */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Backup Schedule</Text>
                <View style={styles.cardContainer}>
                    <View style={styles.settingCard}>
                        <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                            <IconButton icon="backup-restore" iconColor="#4CAF50" size={24} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Auto Backup</Text>
                            <Text style={styles.settingDescription}>Automatically backup your chats</Text>
                        </View>
                        <Switch
                            value={autoBackup}
                            onValueChange={setAutoBackup}
                            trackColor={{ false: '#ddd', true: '#25D36680' }}
                            thumbColor={autoBackup ? '#25D366' : '#f4f3f4'}
                        />
                    </View>

                    {autoBackup && (
                        <>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                style={styles.settingCard}
                                onPress={() => setShowFrequencyOptions(!showFrequencyOptions)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.15)' }]}>
                                    <IconButton icon="clock-outline" iconColor="#FF9800" size={24} />
                                </View>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>Backup Frequency</Text>
                                    <Text style={styles.settingDescription}>{getFrequencyText()}</Text>
                                </View>
                                <IconButton icon={showFrequencyOptions ? "chevron-up" : "chevron-down"} iconColor="#666" size={20} />
                            </TouchableOpacity>

                            {showFrequencyOptions && (
                                <View style={styles.frequencyOptions}>
                                    {frequencyOptions.map((option, index) => (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={[
                                                styles.frequencyOption,
                                                index === frequencyOptions.length - 1 && styles.lastOption,
                                            ]}
                                            onPress={() => {
                                                setBackupFrequency(option.id as 'daily' | 'weekly' | 'monthly');
                                                setShowFrequencyOptions(false);
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <IconButton icon={option.icon} iconColor="#666" size={20} />
                                            <Text style={styles.frequencyLabel}>{option.label}</Text>
                                            {backupFrequency === option.id && (
                                                <IconButton icon="check" iconColor="#25D366" size={20} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </>
                    )}
                </View>
            </View>

            {/* Backup Options */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Backup Options</Text>
                <View style={styles.cardContainer}>
                    <View style={styles.settingCard}>
                        <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(156, 39, 176, 0.15)' }]}>
                            <IconButton icon="video" iconColor="#9C27B0" size={24} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Include Videos</Text>
                            <Text style={styles.settingDescription}>Videos will be included in backups</Text>
                        </View>
                        <Switch
                            value={includeVideos}
                            onValueChange={setIncludeVideos}
                            trackColor={{ false: '#ddd', true: '#25D36680' }}
                            thumbColor={includeVideos ? '#25D366' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.settingCard}>
                        <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(3, 169, 244, 0.15)' }]}>
                            <IconButton icon="wifi" iconColor="#03A9F4" size={24} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Backup Over WiFi Only</Text>
                            <Text style={styles.settingDescription}>Use WiFi connection for backups</Text>
                        </View>
                        <Switch
                            value={backupOverWiFi}
                            onValueChange={setBackupOverWiFi}
                            trackColor={{ false: '#ddd', true: '#25D36680' }}
                            thumbColor={backupOverWiFi ? '#25D366' : '#f4f3f4'}
                        />
                    </View>
                </View>
            </View>

            {/* Advanced Options */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Advanced</Text>
                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.settingCard}
                        onPress={handleManageBackups}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(255, 193, 7, 0.15)' }]}>
                            <IconButton icon="folder-multiple" iconColor="#FFC107" size={24} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Manage Backups</Text>
                            <Text style={styles.settingDescription}>View and restore previous backups</Text>
                        </View>
                        <IconButton icon="chevron-right" iconColor="#666" size={20} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.settingCard}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                            <IconButton icon="lock" iconColor="#4CAF50" size={24} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Encrypted Backup</Text>
                            <Text style={styles.settingDescription}>Protect backups with encryption</Text>
                        </View>
                        <IconButton icon="chevron-right" iconColor="#666" size={20} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Info Cards */}
            <View style={styles.section}>
                <View style={styles.infoCard}>
                    <View style={styles.infoIconContainer}>
                        <IconButton icon="information" iconColor="#2196F3" size={20} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoText}>
                            Backups include your messages, media, and settings. They don't use your WhatsApp storage quota and are stored securely on Google Drive.
                        </Text>
                    </View>
                </View>

                <View style={styles.warningCard}>
                    <View style={styles.warningIconContainer}>
                        <IconButton icon="alert" iconColor="#FF9800" size={20} />
                    </View>
                    <View style={styles.warningContent}>
                        <Text style={styles.warningText}>
                            If you don't back up, your chat history may be lost if you switch phones or reinstall WhatsApp.
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
        paddingTop: 24,
        paddingBottom: 20,
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
    headerIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
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
    statusCard: {
        backgroundColor: '#E8F5E9',
        borderRadius: 16,
        padding: 20,
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
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    statusTime: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    syncBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    syncText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4CAF50',
        marginLeft: 4,
    },
    statusDetails: {
        marginBottom: 16,
    },
    statusDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusSize: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginLeft: 8,
    },
    statusAccount: {
        fontSize: 13,
        color: '#666',
        marginLeft: 8,
    },
    backupButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    backupButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
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
    settingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    settingIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingInfo: {
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 16,
    },
    frequencyOptions: {
        backgroundColor: '#F5F7FA',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    frequencyOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    lastOption: {
        borderBottomWidth: 0,
    },
    frequencyLabel: {
        flex: 1,
        fontSize: 15,
        color: '#1a1a1a',
        marginLeft: 12,
    },
    infoCard: {
        backgroundColor: '#E3F2FD',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        marginBottom: 12,
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
    infoText: {
        fontSize: 13,
        color: '#1976D2',
        lineHeight: 18,
    },
    warningCard: {
        backgroundColor: '#FFF3E0',
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
    warningIconContainer: {
        marginRight: 8,
        marginTop: -4,
    },
    warningContent: {
        flex: 1,
    },
    warningText: {
        fontSize: 13,
        color: '#F57C00',
        lineHeight: 18,
    },
});
