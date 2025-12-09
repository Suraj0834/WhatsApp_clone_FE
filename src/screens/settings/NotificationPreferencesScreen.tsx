import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';

interface NotificationPreferencesProps {
    conversationId?: string;
    conversationName?: string;
    onSave?: (preferences: NotificationPreferences) => void;
}

export interface NotificationPreferences {
    enabled: boolean;
    sound: boolean;
    vibrate: boolean;
    preview: boolean;
    customSound?: string;
    muteUntil?: Date;
    priority: 'high' | 'normal' | 'low';
}

/**
 * Notification preferences screen/modal
 */
export const NotificationPreferencesScreen: React.FC<NotificationPreferencesProps> = ({
    conversationId,
    conversationName,
    onSave,
}) => {
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        enabled: true,
        sound: true,
        vibrate: true,
        preview: true,
        priority: 'high',
    });

    const [showMuteOptions, setShowMuteOptions] = useState(false);

    const updatePreference = <K extends keyof NotificationPreferences>(
        key: K,
        value: NotificationPreferences[K]
    ) => {
        const updated = { ...preferences, [key]: value };
        setPreferences(updated);
        if (onSave) {
            onSave(updated);
        }
    };

    const handleMute = (duration?: number) => {
        if (!duration) {
            // Unmute
            updatePreference('muteUntil', undefined);
        } else {
            // Mute for duration (in hours)
            const muteUntil = new Date();
            muteUntil.setHours(muteUntil.getHours() + duration);
            updatePreference('muteUntil', muteUntil);
        }
        setShowMuteOptions(false);
    };

    const isMuted = preferences.muteUntil && preferences.muteUntil > new Date();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    {conversationName ? `${conversationName}` : 'Notification Preferences'}
                </Text>
            </View>

            {/* Master toggle */}
            <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Notifications</Text>
                    <Text style={styles.settingDescription}>
                        Receive notifications for new messages
                    </Text>
                </View>
                <Switch
                    value={preferences.enabled}
                    onValueChange={(value) => updatePreference('enabled', value)}
                    trackColor={{ false: '#D0D0D0', true: '#25D366' }}
                    thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : preferences.enabled ? '#FFFFFF' : '#F4F3F4'}
                />
            </View>

            <View style={styles.divider} />

            {/* Mute options */}
            <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Mute</Text>
                    {isMuted && preferences.muteUntil && (
                        <Text style={styles.settingDescription}>
                            Until {preferences.muteUntil.toLocaleString()}
                        </Text>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.muteButton}
                    onPress={() => setShowMuteOptions(!showMuteOptions)}
                    disabled={!preferences.enabled}
                >
                    <Text style={[styles.muteButtonText, !preferences.enabled && styles.disabledText]}>
                        {isMuted ? 'Unmute' : 'Mute'}
                    </Text>
                </TouchableOpacity>
            </View>

            {showMuteOptions && (
                <View style={styles.muteOptions}>
                    <TouchableOpacity
                        style={styles.muteOption}
                        onPress={() => handleMute(8)}
                    >
                        <Text style={styles.muteOptionText}>8 hours</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.muteOption}
                        onPress={() => handleMute(24)}
                    >
                        <Text style={styles.muteOptionText}>1 day</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.muteOption}
                        onPress={() => handleMute(168)}
                    >
                        <Text style={styles.muteOptionText}>1 week</Text>
                    </TouchableOpacity>
                    {isMuted && (
                        <TouchableOpacity
                            style={styles.muteOption}
                            onPress={() => handleMute()}
                        >
                            <Text style={[styles.muteOptionText, styles.unmuteText]}>Unmute</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <View style={styles.divider} />

            {/* Sound */}
            <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Sound</Text>
                    <Text style={styles.settingDescription}>
                        Play sound for notifications
                    </Text>
                </View>
                <Switch
                    value={preferences.sound}
                    onValueChange={(value) => updatePreference('sound', value)}
                    disabled={!preferences.enabled}
                    trackColor={{ false: '#D0D0D0', true: '#25D366' }}
                    thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : preferences.sound ? '#FFFFFF' : '#F4F3F4'}
                />
            </View>

            <View style={styles.divider} />

            {/* Vibrate */}
            <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Vibrate</Text>
                    <Text style={styles.settingDescription}>
                        Vibrate for notifications
                    </Text>
                </View>
                <Switch
                    value={preferences.vibrate}
                    onValueChange={(value) => updatePreference('vibrate', value)}
                    disabled={!preferences.enabled}
                    trackColor={{ false: '#D0D0D0', true: '#25D366' }}
                    thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : preferences.vibrate ? '#FFFFFF' : '#F4F3F4'}
                />
            </View>

            <View style={styles.divider} />

            {/* Message preview */}
            <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Message Preview</Text>
                    <Text style={styles.settingDescription}>
                        Show message content in notifications
                    </Text>
                </View>
                <Switch
                    value={preferences.preview}
                    onValueChange={(value) => updatePreference('preview', value)}
                    disabled={!preferences.enabled}
                    trackColor={{ false: '#D0D0D0', true: '#25D366' }}
                    thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : preferences.preview ? '#FFFFFF' : '#F4F3F4'}
                />
            </View>

            <View style={styles.divider} />

            {/* Priority */}
            <View style={styles.section}>
                <Text style={styles.sectionSubtitle}>Priority</Text>
            </View>

            <TouchableOpacity
                style={styles.priorityOption}
                onPress={() => updatePreference('priority', 'high')}
                disabled={!preferences.enabled}
            >
                <View style={styles.radioButton}>
                    {preferences.priority === 'high' && <View style={styles.radioButtonSelected} />}
                </View>
                <View style={styles.priorityInfo}>
                    <Text style={[styles.priorityLabel, !preferences.enabled && styles.disabledText]}>
                        High
                    </Text>
                    <Text style={[styles.priorityDescription, !preferences.enabled && styles.disabledText]}>
                        Always show at the top of notification list
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.priorityOption}
                onPress={() => updatePreference('priority', 'normal')}
                disabled={!preferences.enabled}
            >
                <View style={styles.radioButton}>
                    {preferences.priority === 'normal' && <View style={styles.radioButtonSelected} />}
                </View>
                <View style={styles.priorityInfo}>
                    <Text style={[styles.priorityLabel, !preferences.enabled && styles.disabledText]}>
                        Normal
                    </Text>
                    <Text style={[styles.priorityDescription, !preferences.enabled && styles.disabledText]}>
                        Standard notification behavior
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.priorityOption}
                onPress={() => updatePreference('priority', 'low')}
                disabled={!preferences.enabled}
            >
                <View style={styles.radioButton}>
                    {preferences.priority === 'low' && <View style={styles.radioButtonSelected} />}
                </View>
                <View style={styles.priorityInfo}>
                    <Text style={[styles.priorityLabel, !preferences.enabled && styles.disabledText]}>
                        Low
                    </Text>
                    <Text style={[styles.priorityDescription, !preferences.enabled && styles.disabledText]}>
                        Minimize notification interruptions
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={styles.bottomPadding} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    section: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
    },
    sectionSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#757575',
        textTransform: 'uppercase',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#757575',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 16,
    },
    muteButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
    },
    muteButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#25D366',
    },
    muteOptions: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    muteOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    muteOptionText: {
        fontSize: 14,
        color: '#000000',
    },
    unmuteText: {
        color: '#FF5252',
        fontWeight: '600',
    },
    priorityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    radioButtonSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#25D366',
    },
    priorityInfo: {
        flex: 1,
    },
    priorityLabel: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 4,
    },
    priorityDescription: {
        fontSize: 13,
        color: '#757575',
    },
    disabledText: {
        color: '#BDBDBD',
    },
    bottomPadding: {
        height: 40,
    },
});
