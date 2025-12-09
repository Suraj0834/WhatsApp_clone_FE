import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
} from 'react-native';
import { Button, Divider, Chip } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Sticker {
    id: string;
    emoji: string;
}

interface StickerPack {
    id: string;
    name: string;
    author: string;
    thumbnail: string;
    stickers: Sticker[];
    installed: boolean;
    size: string;
}

export const StickerManagementScreen = () => {
    const [stickerPacks, setStickerPacks] = useState<StickerPack[]>([
        {
            id: '1',
            name: 'Happy Faces',
            author: 'WhatsApp',
            thumbnail: '😊',
            stickers: [
                { id: '1-1', emoji: '😊' },
                { id: '1-2', emoji: '😄' },
                { id: '1-3', emoji: '😁' },
                { id: '1-4', emoji: '😆' },
            ],
            installed: true,
            size: '2.5 MB',
        },
        {
            id: '2',
            name: 'Animals',
            author: 'WhatsApp',
            thumbnail: '🐶',
            stickers: [
                { id: '2-1', emoji: '🐶' },
                { id: '2-2', emoji: '🐱' },
                { id: '2-3', emoji: '🐭' },
                { id: '2-4', emoji: '🐹' },
            ],
            installed: true,
            size: '3.1 MB',
        },
        {
            id: '3',
            name: 'Love & Hearts',
            author: 'WhatsApp',
            thumbnail: '❤️',
            stickers: [
                { id: '3-1', emoji: '❤️' },
                { id: '3-2', emoji: '💕' },
                { id: '3-3', emoji: '💖' },
                { id: '3-4', emoji: '💗' },
            ],
            installed: false,
            size: '2.8 MB',
        },
        {
            id: '4',
            name: 'Food & Drinks',
            author: 'WhatsApp',
            thumbnail: '🍕',
            stickers: [
                { id: '4-1', emoji: '🍕' },
                { id: '4-2', emoji: '🍔' },
                { id: '4-3', emoji: '🍟' },
                { id: '4-4', emoji: '🌮' },
            ],
            installed: false,
            size: '3.5 MB',
        },
    ]);

    const [selectedCategory, setSelectedCategory] = useState<'all' | 'installed' | 'available'>('all');

    const filteredPacks = stickerPacks.filter(pack => {
        if (selectedCategory === 'installed') return pack.installed;
        if (selectedCategory === 'available') return !pack.installed;
        return true;
    });

    const handleToggleInstall = (packId: string) => {
        setStickerPacks(prev =>
            prev.map(pack =>
                pack.id === packId ? { ...pack, installed: !pack.installed } : pack
            )
        );
    };

    const renderStickerPack = ({ item }: { item: StickerPack }) => (
        <View style={styles.packCard}>
            <View style={styles.packHeader}>
                <View style={styles.packThumbnail}>
                    <Text style={styles.packThumbnailEmoji}>{item.thumbnail}</Text>
                </View>
                <View style={styles.packInfo}>
                    <Text style={styles.packName}>{item.name}</Text>
                    <Text style={styles.packAuthor}>{item.author}</Text>
                    <Text style={styles.packSize}>{item.size}</Text>
                </View>
                <Button
                    mode={item.installed ? 'outlined' : 'contained'}
                    onPress={() => handleToggleInstall(item.id)}
                    style={[
                        styles.actionButton,
                        item.installed && styles.actionButtonInstalled,
                    ]}
                    labelStyle={[
                        styles.actionButtonText,
                        item.installed && styles.actionButtonTextInstalled,
                    ]}
                    compact
                >
                    {item.installed ? 'Remove' : 'Add'}
                </Button>
            </View>

            <View style={styles.stickerPreview}>
                {item.stickers.slice(0, 4).map(sticker => (
                    <View key={sticker.id} style={styles.stickerItem}>
                        <Text style={styles.stickerEmoji}>{sticker.emoji}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>🎨 Sticker Packs</Text>
                <Text style={styles.infoText}>
                    Add sticker packs to use in your chats. Each pack contains multiple stickers.
                </Text>
            </View>

            <View style={styles.filterContainer}>
                <Chip
                    selected={selectedCategory === 'all'}
                    onPress={() => setSelectedCategory('all')}
                    style={[
                        styles.filterChip,
                        selectedCategory === 'all' && styles.filterChipSelected,
                    ]}
                    textStyle={[
                        styles.filterChipText,
                        selectedCategory === 'all' && styles.filterChipTextSelected,
                    ]}
                >
                    All
                </Chip>
                <Chip
                    selected={selectedCategory === 'installed'}
                    onPress={() => setSelectedCategory('installed')}
                    style={[
                        styles.filterChip,
                        selectedCategory === 'installed' && styles.filterChipSelected,
                    ]}
                    textStyle={[
                        styles.filterChipText,
                        selectedCategory === 'installed' && styles.filterChipTextSelected,
                    ]}
                >
                    My Stickers
                </Chip>
                <Chip
                    selected={selectedCategory === 'available'}
                    onPress={() => setSelectedCategory('available')}
                    style={[
                        styles.filterChip,
                        selectedCategory === 'available' && styles.filterChipSelected,
                    ]}
                    textStyle={[
                        styles.filterChipText,
                        selectedCategory === 'available' && styles.filterChipTextSelected,
                    ]}
                >
                    Available
                </Chip>
            </View>

            <FlatList
                data={filteredPacks}
                renderItem={renderStickerPack}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Tap "+" to create your own sticker pack
                </Text>
                <Button
                    mode="outlined"
                    onPress={() => {}}
                    style={styles.createButton}
                    labelStyle={styles.createButtonText}
                    icon="plus"
                >
                    Create Pack
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
    infoCard: {
        margin: 16,
        padding: 20,
        backgroundColor: '#E7F5EC',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#25D366',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#667781',
        lineHeight: 20,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    filterChip: {
        marginRight: 8,
        backgroundColor: '#F7F8FA',
    },
    filterChipSelected: {
        backgroundColor: '#25D366',
    },
    filterChipText: {
        color: '#667781',
    },
    filterChipTextSelected: {
        color: '#fff',
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    packCard: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
    },
    packHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    packThumbnail: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    packThumbnailEmoji: {
        fontSize: 32,
    },
    packInfo: {
        flex: 1,
    },
    packName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    packAuthor: {
        fontSize: 13,
        color: '#667781',
        marginBottom: 2,
    },
    packSize: {
        fontSize: 12,
        color: '#667781',
    },
    actionButton: {
        backgroundColor: '#25D366',
    },
    actionButtonInstalled: {
        backgroundColor: 'transparent',
        borderColor: '#F44336',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    actionButtonTextInstalled: {
        color: '#F44336',
    },
    stickerPreview: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    stickerItem: {
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stickerEmoji: {
        fontSize: 32,
    },
    footer: {
        padding: 16,
        backgroundColor: '#F7F8FA',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: '#667781',
        marginBottom: 12,
    },
    createButton: {
        borderColor: '#25D366',
    },
    createButtonText: {
        color: '#25D366',
    },
});
