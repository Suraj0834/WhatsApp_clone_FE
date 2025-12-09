import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity } from 'react-native';
import { IconButton, Switch } from 'react-native-paper';

export const NotificationSettingsScreen = () => {
    const [conversationTones, setConversationTones] = useState(true);
    const [messageNotifications, setMessageNotifications] = useState(true);
    const [groupNotifications, setGroupNotifications] = useState(true);
    const [callNotifications, setCallNotifications] = useState(true);
    const [vibrate, setVibrate] = useState(true);
    const [notificationLight, setNotificationLight] = useState(true);
    const [inAppNotifications, setInAppNotifications] = useState(true);

    const NotificationCard = ({ icon, title, description, rightElement, disabled }: any) => (
        <View style={[styles.notificationCard, disabled && styles.disabledCard]}>
            <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
                    <IconButton icon={icon.name} size={24} iconColor={disabled ? '#CCC' : icon.color} style={styles.iconButton} />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, disabled && styles.disabledText]}>{title}</Text>
                    {description && (
                        <Text style={[styles.cardDescription, disabled && styles.disabledText]}>{description}</Text>
                    )}
                </View>
            </View>
            {rightElement}
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={styles.bellIcon}>
                    <IconButton icon="bell-ring" iconColor="#FF9800" size={32} />
                </View>
                <Text style={styles.headerTitle}>Notification Settings</Text>
                <Text style={styles.headerSubtitle}>
                    Customize alerts for messages, groups, and calls
                </Text>
            </View>

            {/* General */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>General</Text>
                <View style={styles.cardContainer}>
                    <NotificationCard
                        icon={{ name: 'music', color: '#9C27B0' }}
                        title="Conversation tones"
                        description="Play sounds for incoming and outgoing messages"
                        rightElement={
                            <Switch
                                value={conversationTones}
                                onValueChange={setConversationTones}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                    <NotificationCard
                        icon={{ name: 'bell-badge', color: '#4CAF50' }}
                        title="In-app notifications"
                        description="Show notifications while using the app"
                        rightElement={
                            <Switch
                                value={inAppNotifications}
                                onValueChange={setInAppNotifications}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                </View>
            </View>

            {/* Message Notifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Messages</Text>
                <View style={styles.cardContainer}>
                    <NotificationCard
                        icon={{ name: 'bell', color: '#2196F3' }}
                        title="Show notifications"
                        description={messageNotifications ? 'Receiving message alerts' : 'Notifications disabled'}
                        rightElement={
                            <Switch
                                value={messageNotifications}
                                onValueChange={setMessageNotifications}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                    <NotificationCard
                        icon={{ name: 'volume-high', color: '#00BCD4' }}
                        title="Notification tone"
                        description="Default (Tri-tone)"
                        disabled={!messageNotifications}
                        rightElement={
                            <IconButton icon="chevron-right" size={20} iconColor="#8696A0" />
                        }
                    />
                    <NotificationCard
                        icon={{ name: 'vibrate', color: '#FF5722' }}
                        title="Vibrate"
                        description={vibrate ? 'Enabled' : 'Disabled'}
                        disabled={!messageNotifications}
                        rightElement={
                            <Switch
                                value={vibrate}
                                onValueChange={setVibrate}
                                color="#25D366"
                                style={styles.switch}
                                disabled={!messageNotifications}
                            />
                        }
                    />
                    <NotificationCard
                        icon={{ name: 'lightbulb', color: '#FFC107' }}
                        title="Notification light"
                        description={notificationLight ? 'White' : 'Off'}
                        disabled={!messageNotifications}
                        rightElement={
                            <Switch
                                value={notificationLight}
                                onValueChange={setNotificationLight}
                                color="#25D366"
                                style={styles.switch}
                                disabled={!messageNotifications}
                            />
                        }
                    />
                    <NotificationCard
                        icon={{ name: 'priority-high', color: '#F44336' }}
                        title="High priority"
                        description="Show at top of notification screen"
                        disabled={!messageNotifications}
                        rightElement={
                            <IconButton icon="chevron-right" size={20} iconColor="#8696A0" />
                        }
                    />
                </View>
            </View>

            {/* Group Notifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Groups</Text>
                <View style={styles.cardContainer}>
                    <NotificationCard
                        icon={{ name: 'account-group', color: '#9C27B0' }}
                        title="Show notifications"
                        description={groupNotifications ? 'Receiving group alerts' : 'Notifications disabled'}
                        rightElement={
                            <Switch
                                value={groupNotifications}
                                onValueChange={setGroupNotifications}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                    <NotificationCard
                        icon={{ name: 'volume-high', color: '#00BCD4' }}
                        title="Notification tone"
                        description="Default (Tri-tone)"
                        disabled={!groupNotifications}
                        rightElement={
                            <IconButton icon="chevron-right" size={20} iconColor="#8696A0" />
                        }
                    />
                    <NotificationCard
                        icon={{ name: 'vibrate', color: '#FF5722' }}
                        title="Vibrate"
                        description="Default"
                        disabled={!groupNotifications}
                        rightElement={
                            <IconButton icon="chevron-right" size={20} iconColor="#8696A0" />
                        }
                    />
                    <NotificationCard
                        icon={{ name: 'eye-off', color: '#607D8B' }}
                        title="Show preview"
                        description="Display message content in notifications"
                        disabled={!groupNotifications}
                        rightElement={
                            <Switch
                                value={true}
                                onValueChange={() => {}}
                                color="#25D366"
                                style={styles.switch}
                                disabled={!groupNotifications}
                            />
                        }
                    />
                </View>
            </View>

            {/* Call Notifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Calls</Text>
                <View style={styles.cardContainer}>
                    <NotificationCard
                        icon={{ name: 'phone', color: '#4CAF50' }}
                        title="Call notifications"
                        description={callNotifications ? 'Receiving call alerts' : 'Notifications disabled'}
                        rightElement={
                            <Switch
                                value={callNotifications}
                                onValueChange={setCallNotifications}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                    <NotificationCard
                        icon={{ name: 'phone-in-talk', color: '#2196F3' }}
                        title="Ringtone"
                        description="Default"
                        disabled={!callNotifications}
                        rightElement={
                            <IconButton icon="chevron-right" size={20} iconColor="#8696A0" />
                        }
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
    bellIcon: {
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
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    disabledCard: {
        opacity: 0.5,
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
    disabledText: {
        color: '#CCC',
    },
    cardDescription: {
        fontSize: 13,
        color: '#667781',
        marginTop: 2,
    },
    switch: {
        marginRight: 8,
    },
    bottomSpace: {
        height: 24,
    },
});
