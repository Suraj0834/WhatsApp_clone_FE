import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { IconButton } from 'react-native-paper';

interface WallpaperOption {
    id: string;
    name: string;
    preview: string;
}

export const WallpaperSettingsScreen = () => {
    const [selectedWallpaper, setSelectedWallpaper] = useState<string>('default');

    const wallpapers: WallpaperOption[] = [
        { id: 'default', name: 'Default', preview: '#E5DDD5' },
        { id: 'light', name: 'Light', preview: '#F0F0F0' },
        { id: 'dark', name: 'Dark', preview: '#0B141A' },
        { id: 'blue', name: 'Ocean Blue', preview: '#1E88E5' },
        { id: 'green', name: 'Forest Green', preview: '#43A047' },
        { id: 'purple', name: 'Purple Haze', preview: '#8E24AA' },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
                    <IconButton icon="wallpaper" iconColor="#2196F3" size={32} />
                </View>
                <Text style={styles.headerTitle}>Chat Wallpaper</Text>
                <Text style={styles.headerSubtitle}>
                    Customize your chat background
                </Text>
            </View>

            {/* Wallpaper Options */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Choose Wallpaper</Text>

                <View style={styles.wallpaperGrid}>
                    {wallpapers.map((wallpaper) => (
                        <TouchableOpacity
                            key={wallpaper.id}
                            style={[
                                styles.wallpaperCard,
                                selectedWallpaper === wallpaper.id && styles.wallpaperCardSelected,
                            ]}
                            onPress={() => setSelectedWallpaper(wallpaper.id)}
                        >
                            <View style={[styles.wallpaperPreview, { backgroundColor: wallpaper.preview }]}>
                                {selectedWallpaper === wallpaper.id && (
                                    <View style={styles.selectedBadge}>
                                        <IconButton icon="check" iconColor="#fff" size={20} />
                                    </View>
                                )}
                            </View>
                            <Text style={styles.wallpaperName}>{wallpaper.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Custom Options */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Custom</Text>

                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.settingCard}>
                        <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                            <IconButton icon="image-plus" iconColor="#4CAF50" size={24} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Choose from Gallery</Text>
                            <Text style={styles.settingDescription}>
                                Use your own photo as wallpaper
                            </Text>
                        </View>
                        <IconButton icon="chevron-right" size={20} iconColor="#667781" />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.settingCard}>
                        <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.15)' }]}>
                            <IconButton icon="gradient-vertical" iconColor="#FF9800" size={24} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Solid Color</Text>
                            <Text style={styles.settingDescription}>
                                Choose a solid color background
                            </Text>
                        </View>
                        <IconButton icon="chevron-right" size={20} iconColor="#667781" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Reset Option */}
            <View style={styles.section}>
                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.settingCard}>
                        <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(244, 67, 54, 0.15)' }]}>
                            <IconButton icon="restore" iconColor="#F44336" size={24} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, { color: '#F44336' }]}>
                                Reset to Default
                            </Text>
                            <Text style={styles.settingDescription}>
                                Restore original wallpaper
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                    <IconButton icon="information" iconColor="#2196F3" size={20} />
                </View>
                <Text style={styles.infoText}>
                    The wallpaper you choose will apply to all your chats. You can also set individual wallpapers for specific chats from the chat settings.
                </Text>
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
        padding: 24,
        alignItems: 'center',
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
    headerIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#667781',
        textAlign: 'center',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    wallpaperGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    wallpaperCard: {
        width: '31.33%',
        marginHorizontal: '1%',
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    wallpaperCardSelected: {
        borderColor: '#25D366',
    },
    wallpaperPreview: {
        width: '100%',
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#25D366',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wallpaperName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
        paddingVertical: 8,
        backgroundColor: '#fff',
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingInfo: {
        flex: 1,
        marginLeft: 16,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#667781',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'flex-start',
    },
    infoIconContainer: {
        marginRight: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#2196F3',
        lineHeight: 18,
    },
});
