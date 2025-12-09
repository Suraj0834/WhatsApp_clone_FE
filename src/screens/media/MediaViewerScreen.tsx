import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    Text,
    Share,
    Alert,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MediaItem {
    id: string;
    type: 'image' | 'video';
    uri: string;
    timestamp: Date;
    sender: string;
}

export const MediaViewerScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    
    // Mock data - in real app, would come from route params
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mediaItems] = useState<MediaItem[]>([
        {
            id: '1',
            type: 'image',
            uri: 'https://picsum.photos/400/600',
            timestamp: new Date(),
            sender: 'John Doe',
        },
        {
            id: '2',
            type: 'image',
            uri: 'https://picsum.photos/400/601',
            timestamp: new Date(),
            sender: 'John Doe',
        },
    ]);

    const currentMedia = mediaItems[currentIndex];

    const handleShare = async () => {
        try {
            await Share.share({
                message: 'Check out this media!',
                url: currentMedia.uri,
            });
        } catch (error) {
            Alert.alert('Error', 'Could not share media');
        }
    };

    const handleDownload = () => {
        Alert.alert('Download', 'Media will be saved to gallery');
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete media',
            'Are you sure you want to delete this media?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="close"
                    iconColor="#fff"
                    size={24}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.headerInfo}>
                    <Text style={styles.senderName}>{currentMedia.sender}</Text>
                    <Text style={styles.timestamp}>
                        {currentMedia.timestamp.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>
                <IconButton
                    icon="dots-vertical"
                    iconColor="#fff"
                    size={24}
                    onPress={() => {}}
                />
            </View>

            <View style={styles.mediaContainer}>
                {currentMedia.type === 'image' && (
                    <Image
                        source={{ uri: currentMedia.uri }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                )}
                {currentMedia.type === 'video' && (
                    <View style={styles.videoPlaceholder}>
                        <IconButton
                            icon="play-circle"
                            iconColor="#fff"
                            size={64}
                            onPress={() => {}}
                        />
                        <Text style={styles.videoText}>Video Player</Text>
                    </View>
                )}
            </View>

            {mediaItems.length > 1 && (
                <View style={styles.pagination}>
                    <Text style={styles.paginationText}>
                        {currentIndex + 1} / {mediaItems.length}
                    </Text>
                </View>
            )}

            <View style={styles.footer}>
                <IconButton
                    icon="share-variant"
                    iconColor="#fff"
                    size={24}
                    onPress={handleShare}
                />
                <IconButton
                    icon="download"
                    iconColor="#fff"
                    size={24}
                    onPress={handleDownload}
                />
                <IconButton
                    icon="star-outline"
                    iconColor="#fff"
                    size={24}
                    onPress={() => Alert.alert('Star', 'Media starred')}
                />
                <IconButton
                    icon="delete"
                    iconColor="#fff"
                    size={24}
                    onPress={handleDelete}
                />
            </View>

            {mediaItems.length > 1 && (
                <>
                    <TouchableOpacity
                        style={[styles.navButton, styles.navButtonLeft]}
                        onPress={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                        disabled={currentIndex === 0}
                    >
                        <IconButton
                            icon="chevron-left"
                            iconColor="#fff"
                            size={32}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.navButton, styles.navButtonRight]}
                        onPress={() => setCurrentIndex(Math.min(mediaItems.length - 1, currentIndex + 1))}
                        disabled={currentIndex === mediaItems.length - 1}
                    >
                        <IconButton
                            icon="chevron-right"
                            iconColor="#fff"
                            size={32}
                        />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    headerInfo: {
        flex: 1,
    },
    senderName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    timestamp: {
        fontSize: 12,
        color: '#B3B3B3',
    },
    mediaContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.7,
    },
    videoPlaceholder: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    videoText: {
        fontSize: 16,
        color: '#fff',
        marginTop: 8,
    },
    pagination: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    paginationText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 8,
        paddingBottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -24 }],
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 24,
    },
    navButtonLeft: {
        left: 16,
    },
    navButtonRight: {
        right: 16,
    },
});
