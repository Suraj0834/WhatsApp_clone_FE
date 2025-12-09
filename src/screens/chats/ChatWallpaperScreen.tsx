import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { Searchbar, Button, Chip } from 'react-native-paper';

interface Wallpaper {
    id: string;
    name: string;
    category: 'solid' | 'gradient' | 'pattern' | 'default';
    preview: string;
}

export const ChatWallpaperScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedWallpaper, setSelectedWallpaper] = useState<string>('1');

    const wallpapers: Wallpaper[] = [
        { id: '1', name: 'Default Light', category: 'default', preview: '#E5DDD5' },
        { id: '2', name: 'Default Dark', category: 'default', preview: '#0D1418' },
        { id: '3', name: 'Solid Black', category: 'solid', preview: '#000000' },
        { id: '4', name: 'Solid White', category: 'solid', preview: '#FFFFFF' },
        { id: '5', name: 'Navy Blue', category: 'solid', preview: '#001F3F' },
        { id: '6', name: 'Forest Green', category: 'solid', preview: '#0B3D0B' },
        { id: '7', name: 'Sunset', category: 'gradient', preview: 'linear-gradient(#FF6B6B, #FFD93D)' },
        { id: '8', name: 'Ocean', category: 'gradient', preview: 'linear-gradient(#0077BE, #00C9FF)' },
        { id: '9', name: 'Purple Dream', category: 'gradient', preview: 'linear-gradient(#667EEA, #764BA2)' },
        { id: '10', name: 'Dots', category: 'pattern', preview: 'dots' },
        { id: '11', name: 'Lines', category: 'pattern', preview: 'lines' },
        { id: '12', name: 'Bubbles', category: 'pattern', preview: 'bubbles' },
    ];

    const categories = [
        { label: 'All', value: 'all' },
        { label: 'Default', value: 'default' },
        { label: 'Solid Colors', value: 'solid' },
        { label: 'Gradients', value: 'gradient' },
        { label: 'Patterns', value: 'pattern' },
    ];

    const filteredWallpapers = wallpapers.filter((wallpaper) => {
        const matchesCategory = selectedCategory === 'all' || wallpaper.category === selectedCategory;
        const matchesSearch = wallpaper.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleSelectWallpaper = (wallpaperId: string) => {
        setSelectedWallpaper(wallpaperId);
    };

    const handleApplyWallpaper = () => {
        const wallpaper = wallpapers.find((w) => w.id === selectedWallpaper);
        Alert.alert('Wallpaper Applied', `${wallpaper?.name} has been set as your chat wallpaper`);
    };

    const handleResetToDefault = () => {
        setSelectedWallpaper('1');
        Alert.alert('Reset', 'Wallpaper reset to default');
    };

    const handleChooseFromGallery = () => {
        Alert.alert('Choose from Gallery', 'Gallery picker would open here');
    };

    const renderWallpaperPreview = (wallpaper: Wallpaper) => {
        const isSelected = wallpaper.id === selectedWallpaper;

        return (
            <TouchableOpacity
                key={wallpaper.id}
                style={[styles.wallpaperItem, isSelected && styles.selectedWallpaper]}
                onPress={() => handleSelectWallpaper(wallpaper.id)}
            >
                <View
                    style={[
                        styles.wallpaperPreview,
                        { backgroundColor: wallpaper.preview },
                    ]}
                >
                    {wallpaper.category === 'pattern' && (
                        <Text style={styles.patternIcon}>
                            {wallpaper.preview === 'dots' && '⚪⚪⚪'}
                            {wallpaper.preview === 'lines' && '|||'}
                            {wallpaper.preview === 'bubbles' && '🫧'}
                        </Text>
                    )}
                </View>
                <Text style={styles.wallpaperName}>{wallpaper.name}</Text>
                {isSelected && (
                    <View style={styles.selectedBadge}>
                        <Text style={styles.checkmark}>✓</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search wallpapers"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchbar}
                />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScroll}
                >
                    {categories.map((category) => (
                        <Chip
                            key={category.value}
                            selected={selectedCategory === category.value}
                            onPress={() => setSelectedCategory(category.value)}
                            style={styles.chip}
                            textStyle={styles.chipText}
                        >
                            {category.label}
                        </Chip>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.actionButtons}>
                    <Button
                        mode="outlined"
                        onPress={handleChooseFromGallery}
                        style={styles.actionButton}
                        icon="image"
                    >
                        Choose from Gallery
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={handleResetToDefault}
                        style={styles.actionButton}
                        icon="restore"
                    >
                        Reset to Default
                    </Button>
                </View>

                <View style={styles.wallpaperGrid}>
                    {filteredWallpapers.map((wallpaper) => renderWallpaperPreview(wallpaper))}
                </View>

                {filteredWallpapers.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No wallpapers found</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleApplyWallpaper}
                    style={styles.applyButton}
                    labelStyle={styles.applyButtonText}
                >
                    APPLY WALLPAPER
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingVertical: 8,
        backgroundColor: '#F7F8FA',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    searchbar: {
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
    },
    categoryScroll: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    chip: {
        marginRight: 8,
    },
    chipText: {
        fontSize: 13,
    },
    content: {
        flex: 1,
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 4,
    },
    wallpaperGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
    },
    wallpaperItem: {
        width: '31%',
        marginHorizontal: '1%',
        marginVertical: 8,
        alignItems: 'center',
    },
    wallpaperPreview: {
        width: '100%',
        aspectRatio: 0.75,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    selectedWallpaper: {
        opacity: 1,
    },
    patternIcon: {
        fontSize: 32,
        color: '#667781',
    },
    wallpaperName: {
        fontSize: 12,
        color: '#000',
        marginTop: 6,
        textAlign: 'center',
    },
    selectedBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#25D366',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
    },
    footer: {
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    applyButton: {
        backgroundColor: '#25D366',
    },
    applyButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
