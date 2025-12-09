import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { webRTCService } from '../../services/webRTCService';
import { socketService } from '../../services/socketService';
import { isWebRTCAvailable } from '../../utils/webrtcPolyfill';

export const OutgoingCallScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { callType, calleeIds, calleeName, calleeAvatar, conversationId } = route.params;
    const { user } = useSelector((state: RootState) => state.auth);

    const [pulseAnim] = useState(new Animated.Value(1));
    const [callStatus, setCallStatus] = useState('Calling...');

    useEffect(() => {
        // Check if WebRTC is available
        if (!isWebRTCAvailable()) {
            Alert.alert(
                'WebRTC Not Available',
                'Video and audio calls require a development build. Expo Go does not support WebRTC.\n\nCreate a development build with:\nnpx expo run:android\nor\nnpx expo run:ios',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
            return;
        }

        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
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

        // Start the call
        initiateCall();

        // Listen for call events
        socketService.on('call:answered', handleCallAnswered);
        socketService.on('call:declined', handleCallDeclined);
        socketService.on('call:ended', handleCallEnded);

        return () => {
            socketService.off('call:answered');
            socketService.off('call:declined');
            socketService.off('call:ended');
        };
    }, []);

    const initiateCall = async () => {
        try {
            await webRTCService.initCall(conversationId, calleeIds, callType);
        } catch (error) {
            console.error('Error initiating call:', error);
            navigation.goBack();
        }
    };

    const handleCallAnswered = (data: { callId: string }) => {
        setCallStatus('Connecting...');
        // Navigate to active call screen
        setTimeout(() => {
            navigation.replace('ActiveCall', {
                callId: data.callId,
                callType,
                isIncoming: false,
                calleeName,
                calleeAvatar,
            });
        }, 500);
    };

    const handleCallDeclined = () => {
        setCallStatus('Call Declined');
        setTimeout(() => {
            navigation.goBack();
        }, 1500);
    };

    const handleCallEnded = () => {
        navigation.goBack();
    };

    const handleCancel = () => {
        webRTCService.endCall();
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.backgroundGradient} />

            {/* Callee Info */}
            <View style={styles.calleeSection}>
                <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
                    <Image
                        source={{
                            uri: calleeAvatar || `https://ui-avatars.com/api/?name=${calleeName}&background=25D366&color=fff&size=200`,
                        }}
                        style={styles.avatar}
                    />
                    <View style={styles.avatarRing} />
                    <View style={styles.avatarRing2} />
                </Animated.View>

                <Text style={styles.calleeName}>{calleeName}</Text>
                <Text style={styles.callType}>
                    {callType === 'video' ? '📹 Video Call' : '📞 Voice Call'}
                </Text>
                <Text style={styles.status}>{callStatus}</Text>
            </View>

            {/* Cancel Button */}
            <View style={styles.actionsSection}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                    activeOpacity={0.8}
                >
                    <View style={styles.buttonInner}>
                        <IconButton
                            icon="phone-hangup"
                            iconColor="#fff"
                            size={32}
                            style={styles.iconButton}
                        />
                    </View>
                    <Text style={styles.actionLabel}>Cancel</Text>
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
    calleeSection: {
        alignItems: 'center',
        marginTop: 100,
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
    calleeName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
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
        alignItems: 'center',
        marginBottom: 60,
    },
    cancelButton: {
        alignItems: 'center',
    },
    buttonInner: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: '#dc3545',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
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
});
