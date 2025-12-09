import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Vibration, Animated, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { webRTCService } from '../../services/webRTCService';

export const IncomingCallScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { callId, callerId, callerName, callerAvatar, callType, offer } = route.params;

    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        // Start vibration pattern
        const vibrationPattern = [0, 1000, 500, 1000];
        if (Platform.OS === 'android') {
            Vibration.vibrate(vibrationPattern, true);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Pulse animation for avatar
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        return () => {
            Vibration.cancel();
        };
    }, []);

    const handleAnswer = async () => {
        try {
            Vibration.cancel();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            // Navigate to active call screen immediately for better UX
            navigation.replace('ActiveCall', {
                callId,
                callType,
                isIncoming: true,
                callerName,
                callerAvatar,
            });

            // Answer the call
            await webRTCService.answerCall(callId, offer, callType);

        } catch (error) {
            console.error('Error answering call:', error);
            navigation.goBack();
        }
    };

    const handleDecline = () => {
        Vibration.cancel();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        webRTCService.declineCall(callId);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Background */}
            <View style={styles.backgroundGradient} />

            {/* Caller Info */}
            <View style={styles.callerSection}>
                <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
                    <Image
                        source={{
                            uri: callerAvatar || `https://ui-avatars.com/api/?name=${callerName}&background=25D366&color=fff&size=200`,
                        }}
                        style={styles.avatar}
                    />
                    <View style={styles.avatarRing} />
                    <View style={styles.avatarRing2} />
                </Animated.View>

                <Text style={styles.callerName}>{callerName}</Text>
                <Text style={styles.callType}>
                    {callType === 'video' ? '📹 Video Call' : '📞 Voice Call'}
                </Text>
                <Text style={styles.status}>Incoming Call...</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsSection}>
                {/* Decline Button */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleDecline}
                    activeOpacity={0.8}
                >
                    <View style={[styles.buttonInner, styles.declineButton]}>
                        <IconButton
                            icon="phone-hangup"
                            iconColor="#fff"
                            size={32}
                            style={styles.iconButton}
                        />
                    </View>
                    <Text style={styles.actionLabel}>Decline</Text>
                </TouchableOpacity>

                {/* Answer Button */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleAnswer}
                    activeOpacity={0.8}
                >
                    <View style={[styles.buttonInner, styles.answerButton]}>
                        <IconButton
                            icon={callType === 'video' ? 'video' : 'phone'}
                            iconColor="#fff"
                            size={32}
                            style={styles.iconButton}
                        />
                    </View>
                    <Text style={styles.actionLabel}>Answer</Text>
                </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickAction}>
                    <IconButton icon="message" iconColor="#fff" size={20} />
                    <Text style={styles.quickActionText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickAction}>
                    <IconButton icon="clock" iconColor="#fff" size={20} />
                    <Text style={styles.quickActionText}>Remind</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    backgroundGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#16213e',
        opacity: 0.8,
    },
    callerSection: {
        alignItems: 'center',
        marginTop: 60,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 32,
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: '#fff',
    },
    avatarRing: {
        position: 'absolute',
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        top: -15,
        left: -15,
    },
    avatarRing2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        top: -30,
        left: -30,
    },
    callerName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    callType: {
        fontSize: 18,
        color: '#e0e0e0',
        marginBottom: 4,
    },
    status: {
        fontSize: 16,
        color: '#a0a0a0',
        marginTop: 8,
    },
    actionsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 60,
        marginBottom: 40,
    },
    actionButton: {
        alignItems: 'center',
    },
    buttonInner: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    declineButton: {
        backgroundColor: '#dc3545',
    },
    answerButton: {
        backgroundColor: '#25D366',
    },
    iconButton: {
        margin: 0,
    },
    actionLabel: {
        color: '#fff',
        fontSize: 14,
        marginTop: 12,
        fontWeight: '600',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        marginBottom: 20,
    },
    quickAction: {
        alignItems: 'center',
    },
    quickActionText: {
        color: '#a0a0a0',
        fontSize: 12,
        marginTop: 4,
    },
});
