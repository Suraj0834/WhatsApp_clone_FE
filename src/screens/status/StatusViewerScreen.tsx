import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Animated, Text, TextInput } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export const StatusViewerScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { statusId, userId } = route.params;
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress] = useState(new Animated.Value(0));
    const [paused, setPaused] = useState(false);

    const statuses = [
        { id: '1', type: 'image', uri: 'https://picsum.photos/400/800', timestamp: new Date() },
        { id: '2', type: 'image', uri: 'https://picsum.photos/401/800', timestamp: new Date() },
        { id: '3', type: 'text', content: 'Hello World!', backgroundColor: '#075E54', timestamp: new Date() },
    ];

    useEffect(() => {
        if (!paused) {
            progress.setValue(0);
            Animated.timing(progress, {
                toValue: 1,
                duration: 5000,
                useNativeDriver: false,
            }).start(({ finished }) => {
                if (finished && currentIndex < statuses.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                } else if (finished) {
                    navigation.goBack();
                }
            });
        }
        return () => progress.stopAnimation();
    }, [currentIndex, paused]);

    const handleNext = () => {
        if (currentIndex < statuses.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.goBack();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentStatus = statuses[currentIndex];

    return (
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                {statuses.map((_, index) => (
                    <View key={index} style={styles.progressBarBackground}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    }),
                                    opacity: index === currentIndex ? 1 : index < currentIndex ? 1 : 0,
                                },
                            ]}
                        />
                    </View>
                ))}
            </View>

            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Image
                        source={{ uri: 'https://ui-avatars.com/api/?name=User' }}
                        style={styles.avatar}
                    />
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>User Name</Text>
                        <Text style={styles.timestamp}>2h ago</Text>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <IconButton icon="pause" iconColor="#fff" size={24} onPress={() => setPaused(!paused)} />
                    <IconButton icon="volume-high" iconColor="#fff" size={24} />
                    <IconButton icon="close" iconColor="#fff" size={24} onPress={() => navigation.goBack()} />
                </View>
            </View>

            <TouchableOpacity
                style={[styles.touchArea, styles.leftArea]}
                onPress={handlePrevious}
                activeOpacity={1}
            />
            <TouchableOpacity
                style={[styles.touchArea, styles.rightArea]}
                onPress={handleNext}
                activeOpacity={1}
            />

            {currentStatus.type === 'image' && (
                <Image source={{ uri: currentStatus.uri }} style={styles.statusImage} />
            )}

            {currentStatus.type === 'text' && (
                <View style={[styles.textStatus, { backgroundColor: currentStatus.backgroundColor }]}>
                    <Text style={styles.textContent}>{currentStatus.content}</Text>
                </View>
            )}

            <View style={styles.footer}>
                <View style={styles.replyContainer}>
                    <IconButton icon="emoticon-happy-outline" iconColor="#fff" size={24} />
                    <TextInput
                        style={styles.replyInput}
                        placeholder="Reply..."
                        placeholderTextColor="rgba(255,255,255,0.7)"
                    />
                    <IconButton icon="send" iconColor="#fff" size={24} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    progressBarContainer: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingTop: 50,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    progressBarBackground: {
        flex: 1,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginHorizontal: 2,
        borderRadius: 1,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    userDetails: {},
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    timestamp: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    headerActions: {
        flexDirection: 'row',
    },
    touchArea: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: width / 2,
    },
    leftArea: {
        left: 0,
    },
    rightArea: {
        right: 0,
    },
    statusImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    textStatus: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    textContent: {
        fontSize: 32,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    replyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 25,
        paddingHorizontal: 8,
    },
    replyInput: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        paddingVertical: 8,
    },
});
