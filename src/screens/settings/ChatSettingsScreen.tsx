import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity } from 'react-native';
import { IconButton, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export const ChatSettingsScreen = () => {
    const navigation = useNavigation<any>();
    const [theme, setTheme] = useState('light');
    const [enterToSend, setEnterToSend] = useState(false);
    const [mediaVisibility, setMediaVisibility] = useState(true);
    const [keepArchived, setKeepArchived] = useState(false);

    const ChatCard = ({ icon, title, description, onPress, rightElement, isDanger }: any) => (
        <TouchableOpacity
            style={[styles.chatCard, isDanger && styles.dangerCard]}
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
                <View style={styles.chatIcon}>
                    <IconButton icon="message-settings" iconColor="#9C27B0" size={32} />
                </View>
                <Text style={styles.headerTitle}>Chat Settings</Text>
                <Text style={styles.headerSubtitle}>
                    Customize your chat experience and appearance
                </Text>
            </View>

            {/* Display Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Display</Text>
                <View style={styles.cardContainer}>
                    <ChatCard
                        icon={{ name: 'palette', color: '#9C27B0' }}
                        title="Theme"
                        description={theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System default'}
                        onPress={() => navigation.navigate('ThemeSettings')}
                    />
                    <ChatCard
                        icon={{ name: 'image', color: '#00BCD4' }}
                        title="Wallpaper"
                        description="Customize chat background"
                        onPress={() => navigation.navigate('WallpaperSettings')}
                    />
                    <ChatCard
                        icon={{ name: 'format-size', color: '#FF9800' }}
                        title="Font size"
                        description="Medium"
                        onPress={() => navigation.navigate('FontSizeSettings')}
                    />
                </View>
            </View>

            {/* Chat Behavior */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Chat Behavior</Text>
                <View style={styles.cardContainer}>
                    <ChatCard
                        icon={{ name: 'keyboard-return', color: '#4CAF50' }}
                        title="Enter is send"
                        description={enterToSend ? 'Enter key sends messages' : 'Enter key adds new line'}
                        rightElement={
                            <Switch
                                value={enterToSend}
                                onValueChange={setEnterToSend}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                    <ChatCard
                        icon={{ name: 'eye', color: '#2196F3' }}
                        title="Media visibility"
                        description={mediaVisibility ? 'Media shown in gallery' : 'Media hidden from gallery'}
                        rightElement={
                            <Switch
                                value={mediaVisibility}
                                onValueChange={setMediaVisibility}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                </View>
            </View>

            {/* Archive Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Archived Chats</Text>
                <View style={styles.cardContainer}>
                    <ChatCard
                        icon={{ name: 'archive', color: '#607D8B' }}
                        title="Keep chats archived"
                        description={keepArchived ? 'Archived chats stay archived' : 'New messages unarchive chats'}
                        rightElement={
                            <Switch
                                value={keepArchived}
                                onValueChange={setKeepArchived}
                                color="#25D366"
                                style={styles.switch}
                            />
                        }
                    />
                </View>
            </View>

            {/* Backup */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Backup</Text>
                <View style={styles.cardContainer}>
                    <ChatCard
                        icon={{ name: 'backup-restore', color: '#3F51B5' }}
                        title="Chat backup"
                        description="Last backup: Never"
                        onPress={() => navigation.navigate('BackupSettings')}
                    />
                </View>
            </View>

            {/* Chat History */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Chat History</Text>
                <View style={styles.cardContainer}>
                    <ChatCard
                        icon={{ name: 'export', color: '#00BCD4' }}
                        title="Export chat"
                        description="Export chat history via email"
                        onPress={() => {}}
                    />
                </View>
            </View>

            {/* Danger Zone */}
            <View style={styles.section}>
                <Text style={styles.dangerTitle}>Danger Zone</Text>
                <View style={styles.dangerContainer}>
                    <ChatCard
                        icon={{ name: 'delete-sweep', color: '#F44336' }}
                        title="Clear all chats"
                        description="Delete all messages from all chats"
                        isDanger
                        onPress={() => {}}
                    />
                    <ChatCard
                        icon={{ name: 'delete-forever', color: '#F44336' }}
                        title="Delete all chats"
                        description="Delete all chats and message history"
                        isDanger
                        onPress={() => {}}
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
    chatIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3E5F5',
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
    chatCard: {
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
