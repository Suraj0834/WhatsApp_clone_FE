import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RTCView, MediaStream } from '../../utils/webrtcPolyfill';
import { webRTCService } from '../../services/webRTCService';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export const ActiveCallScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { callId, callType, isIncoming, callerName, callerAvatar } = route.params;

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isSpeaker, setIsSpeaker] = useState(true);
    const [callDuration, setCallDuration] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setupCall();

        return () => {
            cleanupCall();
        };
    }, []);

    useEffect(() => {
        // Start call timer
        timerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const setupCall = () => {
        // Set up callbacks for streams
        webRTCService.onLocalStream = (stream: MediaStream) => {
            setLocalStream(stream);
            setIsConnected(true);
        };

        webRTCService.onRemoteStream = (stream: MediaStream) => {
            setRemoteStream(stream);
        };

        webRTCService.onCallEnded = () => {
            navigation.goBack();
        };

        // Get existing streams if call already started
        const existingLocal = webRTCService.getLocalStream();
        const existingRemote = webRTCService.getRemoteStream();

        if (existingLocal) setLocalStream(existingLocal);
        if (existingRemote) setRemoteStream(existingRemote);
    };

    const cleanupCall = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const handleEndCall = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        webRTCService.endCall(callDuration);
        navigation.goBack();
    };

    const handleToggleMute = () => {
        const muted = webRTCService.toggleMute();
        setIsMuted(muted);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleToggleVideo = () => {
        if (callType === 'video') {
            const videoOff = webRTCService.toggleVideo();
            setIsVideoOff(videoOff);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handleSwitchCamera = async () => {
        if (callType === 'video') {
            await webRTCService.switchCamera();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            {/* Remote Video (Full Screen) */}
            {callType === 'video' && remoteStream ? (
                <RTCView
                    streamURL={remoteStream.toURL()}
                    style={styles.remoteVideo}
                    objectFit="cover"
                    mirror={false}
                />
            ) : (
                <View style={styles.audioCallBackground}>
                    <Text style={styles.audioCallName}>{callerName || 'User'}</Text>
                    <Text style={styles.audioCallStatus}>
                        {isConnected ? 'Connected' : 'Connecting...'}
                    </Text>
                </View>
            )}

            {/* Local Video (Picture in Picture) */}
            {callType === 'video' && localStream && !isVideoOff && (
                <TouchableOpacity
                    style={styles.localVideoContainer}
                    onPress={handleSwitchCamera}
                    activeOpacity={0.9}
                >
                    <RTCView
                        streamURL={localStream.toURL()}
                        style={styles.localVideo}
                        objectFit="cover"
                        mirror={true}
                    />
                </TouchableOpacity>
            )}

            {/* Top Info Bar */}
            <View style={styles.topBar}>
                <View style={styles.callInfo}>
                    <Text style={styles.callerNameTop}>{callerName || 'User'}</Text>
                    <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
                </View>
            </View>

            {/* Bottom Controls */}
            <View style={styles.controlsContainer}>
                <View style={styles.controls}>
                    {/* Mute Button */}
                    <TouchableOpacity
                        style={[styles.controlButton, isMuted && styles.controlButtonActive]}
                        onPress={handleToggleMute}
                        activeOpacity={0.7}
                    >
                        <IconButton
                            icon={isMuted ? 'microphone-off' : 'microphone'}
                            iconColor="#fff"
                            size={28}
                        />
                    </TouchableOpacity>

                    {/* Video Toggle (Video calls only) */}
                    {callType === 'video' && (
                        <TouchableOpacity
                            style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
                            onPress={handleToggleVideo}
                            activeOpacity={0.7}
                        >
                            <IconButton
                                icon={isVideoOff ? 'video-off' : 'video'}
                                iconColor="#fff"
                                size={28}
                            />
                        </TouchableOpacity>
                    )}

                    {/* End Call Button */}
                    <TouchableOpacity
                        style={styles.endCallButton}
                        onPress={handleEndCall}
                        activeOpacity={0.7}
                    >
                        <IconButton
                            icon="phone-hangup"
                            iconColor="#fff"
                            size={32}
                        />
                    </TouchableOpacity>

                    {/* Speaker Toggle */}
                    <TouchableOpacity
                        style={[styles.controlButton, !isSpeaker && styles.controlButtonActive]}
                        onPress={() => {
                            setIsSpeaker(!isSpeaker);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        activeOpacity={0.7}
                    >
                        <IconButton
                            icon={isSpeaker ? 'volume-high' : 'volume-off'}
                            iconColor="#fff"
                            size={28}
                        />
                    </TouchableOpacity>

                    {/* Switch Camera (Video calls only) */}
                    {callType === 'video' && (
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={handleSwitchCamera}
                            activeOpacity={0.7}
                        >
                            <IconButton
                                icon="camera-flip"
                                iconColor="#fff"
                                size={28}
                            />
                        </TouchableOpacity>
                    )}
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
    remoteVideo: {
        width: width,
        height: height,
    },
    audioCallBackground: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioCallName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    audioCallStatus: {
        fontSize: 18,
        color: '#a0a0a0',
    },
    localVideoContainer: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 120,
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    localVideo: {
        width: '100%',
        height: '100%',
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    callInfo: {
        alignItems: 'center',
    },
    callerNameTop: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    callDuration: {
        fontSize: 14,
        color: '#e0e0e0',
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: Platform.OS === 'ios' ? 40 : 30,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    controlButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlButtonActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    endCallButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#dc3545',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
});
