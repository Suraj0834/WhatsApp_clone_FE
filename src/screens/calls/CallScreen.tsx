import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices, RTCIceCandidate } from '../../utils/webrtcPolyfill';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { socketService } from '../../services/socketService';
import { webrtcApi } from '../../api/endpoints/webrtc';
import { COLORS } from '../../utils/constants';
import { requestVideoCallPermissions, requestVoiceCallPermissions } from '../../utils/permissions';
import { 
    callStartFeedback, 
    callConnectedFeedback, 
    callEndedFeedback, 
    callFailedFeedback,
    triggerLight,
    triggerMedium 
} from '../../utils/haptics';

interface CallScreenProps {
    route: {
        params: {
            conversationId: string;
            callType: 'audio' | 'video';
            isIncoming?: boolean;
            callId?: string;
            callerId?: string;
            offer?: RTCSessionDescriptionInit;
        };
    };
    navigation: any;
}

type CallState = 'connecting' | 'ringing' | 'connected' | 'ended';

export const CallScreen: React.FC<CallScreenProps> = ({ route, navigation }) => {
    const { conversationId, callType, isIncoming, callId: incomingCallId, callerId, offer } = route.params;
    const { user } = useSelector((state: RootState) => state.auth);

    const [callState, setCallState] = useState<CallState>(isIncoming ? 'ringing' : 'connecting');
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaker, setIsSpeaker] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
    const [isFrontCamera, setIsFrontCamera] = useState(true);
    const [callId, setCallId] = useState(incomingCallId);
    const [localStreamURL, setLocalStreamURL] = useState<any>(null);
    const [remoteStreamURL, setRemoteStreamURL] = useState<any>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [callerInfo, setCallerInfo] = useState<{ name: string; avatarUrl?: string } | null>(null);
    const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'disconnected'>('good');

    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<any>(null);
    const remoteStream = useRef<any>(null);
    const callTimer = useRef<NodeJS.Timeout | null>(null);
    const isCleanedUp = useRef(false);
    const socketListenersAttached = useRef(false);

    useEffect(() => {
        initializeCall();

        return () => {
            cleanup();
        };
    }, []);

    useEffect(() => {
        if (callState === 'connected') {
            startCallTimer();
        }
    }, [callState]);

    const initializeCall = async () => {
        try {
            setIsInitializing(true);
            await callStartFeedback();

            // Check and request permissions
            if (callType === 'video') {
                const permissions = await requestVideoCallPermissions();
                if (!permissions.allGranted) {
                    Alert.alert(
                        'Permissions Required',
                        `Camera and microphone access are required for video calls. ${!permissions.camera ? 'Camera: denied. ' : ''}${!permissions.microphone ? 'Microphone: denied.' : ''}`,
                        [{ text: 'OK', onPress: () => navigation.goBack() }]
                    );
                    return;
                }
            } else {
                const granted = await requestVoiceCallPermissions();
                if (!granted) {
                    Alert.alert(
                        'Permission Required',
                        'Microphone access is required for voice calls.',
                        [{ text: 'OK', onPress: () => navigation.goBack() }]
                    );
                    return;
                }
            }

            // Get WebRTC configuration
            const config = await webrtcApi.getConfig();

            // Create peer connection
            peerConnection.current = new RTCPeerConnection(config);

            // Set up event listeners
            setupPeerConnectionListeners();

            // Get local media stream
            await getLocalStream();

            if (isIncoming && offer) {
                // Handle incoming call
                await handleIncomingCall(offer);
            } else {
                // Initiate outgoing call
                await initiateCall();
            }
        } catch (error: any) {
            console.error('Error initializing call:', error);
            await callFailedFeedback();
            Alert.alert(
                'Call Failed',
                error?.message || 'Failed to initialize call. Please check your permissions and try again.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } finally {
            setIsInitializing(false);
        }
    };

    const getLocalStream = async () => {
        try {
            const constraints: any = {
                audio: true,
                video: callType === 'video' ? {
                    facingMode: isFrontCamera ? 'user' : 'environment',
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 },
                    frameRate: { ideal: 30, max: 30 },
                } : false,
            };

            const stream = await mediaDevices.getUserMedia(constraints);

            localStream.current = stream;
            setLocalStreamURL(stream.toURL());

            // Add stream to peer connection
            stream.getTracks().forEach((track: any) => {
                peerConnection.current?.addTrack(track, stream);
            });
        } catch (error: any) {
            console.error('Error getting local stream:', error);
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                throw new Error('Camera or microphone permission denied. Please enable them in settings.');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                throw new Error('No camera or microphone found on this device.');
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                throw new Error('Camera or microphone is already in use by another application.');
            }
            throw new Error('Failed to access camera or microphone.');
        }
    };

    const setupPeerConnectionListeners = () => {
        if (!peerConnection.current) return;

        // Handle ICE candidates - using property assignment for react-native-webrtc
        (peerConnection.current as any).onicecandidate = (event: any) => {
            if (event.candidate) {
                const currentCallId = callId || incomingCallId;
                if (currentCallId && socketService.isConnected()) {
                    socketService.emit('call:ice-candidate', {
                        callId: currentCallId,
                        candidate: event.candidate,
                    });
                }
            }
        };

        // Handle remote stream
        (peerConnection.current as any).ontrack = (event: any) => {
            if (event.streams && event.streams[0]) {
                remoteStream.current = event.streams[0];
                setRemoteStreamURL(event.streams[0].toURL());
                if (callState !== 'connected') {
                    setCallState('connected');
                    callConnectedFeedback();
                }
            }
        };

        // Handle ICE connection state changes
        (peerConnection.current as any).oniceconnectionstatechange = () => {
            const state = peerConnection.current?.iceConnectionState;
            console.log('ICE connection state:', state);

            switch (state) {
                case 'connected':
                case 'completed':
                    setConnectionQuality('good');
                    break;
                case 'disconnected':
                    setConnectionQuality('poor');
                    triggerMedium();
                    break;
                case 'failed':
                case 'closed':
                    setConnectionQuality('disconnected');
                    if (!isCleanedUp.current) {
                        Alert.alert('Connection Lost', 'The call has been disconnected.');
                        endCall();
                    }
                    break;
            }
        };

        // Handle connection state changes
        (peerConnection.current as any).onconnectionstatechange = () => {
            const state = peerConnection.current?.connectionState;
            console.log('Connection state:', state);

            if (state === 'failed' && !isCleanedUp.current) {
                Alert.alert('Call Failed', 'Failed to establish connection.');
                endCall();
            }
        };
    };

    const initiateCall = async () => {
        try {
            if (!peerConnection.current || !socketService.isConnected()) return;

            // Create offer
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            // Setup socket listeners before sending offer
            if (!socketListenersAttached.current) {
                setupSocketListeners();
                socketListenersAttached.current = true;
            }

            // Send offer via socket
            socketService.emit('call:offer', {
                conversationId,
                calleeIds: callerId ? [callerId] : [],
                callType,
                offer: peerConnection.current.localDescription,
            });
        } catch (error) {
            console.error('Error initiating call:', error);
            await callFailedFeedback();
            throw error;
        }
    };

    const handleIncomingCall = async (offerData: RTCSessionDescriptionInit) => {
        try {
            if (!peerConnection.current) return;

            if (!offerData.sdp) {
                throw new Error('Invalid offer: missing SDP');
            }

            const offerDescription = new RTCSessionDescription({
                type: offerData.type,
                sdp: offerData.sdp,
            });
            await peerConnection.current.setRemoteDescription(offerDescription);

            if (!socketListenersAttached.current) {
                setupSocketListeners();
                socketListenersAttached.current = true;
            }
        } catch (error) {
            console.error('Error handling incoming call:', error);
            await callFailedFeedback();
            throw error;
        }
    };

    const setupSocketListeners = useCallback(() => {
        if (!socketService.isConnected()) return;

        // Listen for call created event
        socketService.on('call:created', (data: { callId: string }) => {
            console.log('Call created:', data.callId);
            setCallId(data.callId);
        });

        // Listen for answer
        socketService.on('call:answered', async (data: any) => {
            const currentCallId = callId || incomingCallId;
            if (data.callId === currentCallId && peerConnection.current) {
                try {
                    const answer = new RTCSessionDescription({
                        type: data.answer.type,
                        sdp: data.answer.sdp,
                    });
                    await peerConnection.current.setRemoteDescription(answer);
                } catch (error) {
                    console.error('Error setting remote description:', error);
                }
            }
        });

        // Listen for call declined
        socketService.on('call:declined', async (data: any) => {
            const currentCallId = callId || incomingCallId;
            if (data.callId === currentCallId) {
                await callFailedFeedback();
                Alert.alert('Call Declined', 'The user declined your call');
                endCall();
            }
        });

        // Listen for ICE candidates
        socketService.on('call:ice-candidate', async (data: any) => {
            const currentCallId = callId || incomingCallId;
            if (data.callId === currentCallId && data.candidate) {
                try {
                    const candidate = new RTCIceCandidate(data.candidate);
                    await peerConnection.current?.addIceCandidate(candidate);
                } catch (error) {
                    console.error('Error adding ICE candidate:', error);
                }
            }
        });

        // Listen for call ended
        socketService.on('call:ended', async (data: any) => {
            const currentCallId = callId || incomingCallId;
            if (data.callId === currentCallId) {
                await callEndedFeedback();
                Alert.alert('Call Ended', 'The call has ended.');
                endCall();
            }
        });
    }, [callId, incomingCallId]);

    const answerCall = async () => {
        try {
            await triggerLight();
            const currentCallId = callId || incomingCallId;
            if (!peerConnection.current || !currentCallId || !socketService.isConnected()) return;

            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            socketService.emit('call:answer', {
                callId: currentCallId,
                answer: peerConnection.current.localDescription,
            });

            setCallState('connecting');
        } catch (error) {
            console.error('Error answering call:', error);
            await callFailedFeedback();
            Alert.alert('Error', 'Failed to answer call');
            endCall();
        }
    };

    const declineCall = async () => {
        await triggerLight();
        const currentCallId = callId || incomingCallId;
        if (currentCallId && socketService.isConnected()) {
            socketService.emit('call:decline', { callId: currentCallId });
        }
        cleanup();
        navigation.goBack();
    };

    const toggleMute = async () => {
        await triggerLight();
        if (localStream.current) {
            localStream.current.getAudioTracks().forEach((track: any) => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleSpeaker = () => {
        // Platform-specific speaker toggle implementation needed
        setIsSpeaker(!isSpeaker);
    };

    const toggleVideo = async () => {
        await triggerLight();
        if (localStream.current && callType === 'video') {
            localStream.current.getVideoTracks().forEach((track: any) => {
                track.enabled = !track.enabled;
            });
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    const switchCamera = async () => {
        if (localStream.current && callType === 'video') {
            try {
                await triggerLight();
                
                // Get current video track
                const currentVideoTrack = localStream.current.getVideoTracks()[0];
                if (!currentVideoTrack) return;

                // Get new video stream with switched camera
                const newStream = await mediaDevices.getUserMedia({
                    audio: false, // Don't request audio again
                    video: {
                        facingMode: !isFrontCamera ? 'user' : 'environment',
                        width: { ideal: 1280, max: 1920 },
                        height: { ideal: 720, max: 1080 },
                        frameRate: { ideal: 30, max: 30 },
                    },
                });

                const newVideoTrack = newStream.getVideoTracks()[0];
                if (!newVideoTrack) {
                    throw new Error('Failed to get new video track');
                }

                // Replace video track in peer connection
                const sender = peerConnection.current?.getSenders().find((s: any) => 
                    s.track?.kind === 'video'
                );
                
                if (sender) {
                    await sender.replaceTrack(newVideoTrack);
                }

                // Stop old video track
                currentVideoTrack.stop();

                // Update local stream
                localStream.current.removeTrack(currentVideoTrack);
                localStream.current.addTrack(newVideoTrack);
                setLocalStreamURL(localStream.current.toURL());
                setIsFrontCamera(!isFrontCamera);
            } catch (error: any) {
                console.error('Error switching camera:', error);
                Alert.alert('Error', error?.message || 'Failed to switch camera');
            }
        }
    };

    const endCall = async () => {
        if (isCleanedUp.current) return;
        
        await callEndedFeedback();
        const currentCallId = callId || incomingCallId;
        if (currentCallId && socketService.isConnected()) {
            try {
                socketService.emit('call:end', {
                    callId: currentCallId,
                    duration: callDuration,
                });
            } catch (error) {
                console.error('Error ending call via socket:', error);
            }
        }

        cleanup();
        navigation.goBack();
    };

    const cleanup = () => {
        if (isCleanedUp.current) return;
        isCleanedUp.current = true;

        // Clear timer
        if (callTimer.current) {
            clearInterval(callTimer.current);
            callTimer.current = null;
        }

        // Stop all tracks
        if (localStream.current) {
            localStream.current.getTracks().forEach((track: any) => {
                track.stop();
            });
            localStream.current = null;
        }

        if (remoteStream.current) {
            remoteStream.current.getTracks().forEach((track: any) => {
                track.stop();
            });
            remoteStream.current = null;
        }

        // Close peer connection
        if (peerConnection.current) {
            // Null out event handlers for react-native-webrtc
            (peerConnection.current as any).onicecandidate = null;
            (peerConnection.current as any).ontrack = null;
            (peerConnection.current as any).oniceconnectionstatechange = null;
            (peerConnection.current as any).onconnectionstatechange = null;
            peerConnection.current.close();
            peerConnection.current = null;
        }

        // Remove socket listeners
        if (socketService.isConnected() && socketListenersAttached.current) {
            socketService.off('call:created');
            socketService.off('call:answered');
            socketService.off('call:declined');
            socketService.off('call:ice-candidate');
            socketService.off('call:ended');
            socketListenersAttached.current = false;
        }
    };

    const startCallTimer = () => {
        callTimer.current = setInterval(() => {
            setCallDuration((prev) => prev + 1);
        }, 1000);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const renderCallState = () => {
        switch (callState) {
            case 'ringing':
                return (
                    <View style={styles.stateContainer}>
                        <Text style={styles.stateText}>Incoming call...</Text>
                        <View style={styles.incomingButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.declineButton]}
                                onPress={declineCall}
                            >
                                <IconButton icon="phone-hangup" size={32} iconColor="white" />
                                <Text style={styles.actionButtonText}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.acceptButton]}
                                onPress={answerCall}
                            >
                                <IconButton icon="phone" size={32} iconColor="white" />
                                <Text style={styles.actionButtonText}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 'connecting':
                return <Text style={styles.stateText}>Connecting...</Text>;
            case 'connected':
                return <Text style={styles.stateText}>{formatDuration(callDuration)}</Text>;
            case 'ended':
                return <Text style={styles.stateText}>Call Ended</Text>;
        }
    };

    return (
        <View style={styles.container}>
            {/* Video Views */}
            {callType === 'video' && callState === 'connected' && (
                <>
                    {/* Remote Video - Full Screen */}
                    {remoteStreamURL && (
                        <RTCView
                            streamURL={remoteStreamURL}
                            style={styles.remoteVideo}
                            objectFit="cover"
                            mirror={false}
                        />
                    )}

                    {/* Local Video - Picture in Picture */}
                    {localStreamURL && isVideoEnabled && (
                        <View style={styles.localVideoContainer}>
                            <RTCView
                                streamURL={localStreamURL}
                                style={styles.localVideo}
                                objectFit="cover"
                                mirror={isFrontCamera}
                            />
                        </View>
                    )}
                </>
            )}

            {/* Connection Quality Indicator */}
            {callState === 'connected' && connectionQuality === 'poor' && (
                <View style={styles.connectionWarning}>
                    <IconButton icon="wifi-strength-1" size={16} iconColor="#FFA500" />
                    <Text style={styles.connectionWarningText}>Poor Connection</Text>
                </View>
            )}

            {/* Loading Indicator */}
            {isInitializing && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.loadingText}>Initializing call...</Text>
                </View>
            )}

            {/* Audio Call UI */}
            {(callType === 'audio' || callState !== 'connected') && (
                <View style={styles.header}>
                    <Image
                        source={{ uri: callerInfo?.avatarUrl || user?.avatarUrl || 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{callerInfo?.name || user?.name || 'User'}</Text>
                    {renderCallState()}
                </View>
            )}

            {callState !== 'ringing' && (
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.controlButton, isMuted && styles.activeControl]}
                        onPress={toggleMute}
                    >
                        <IconButton
                            icon={isMuted ? 'microphone-off' : 'microphone'}
                            size={28}
                            iconColor="white"
                        />
                    </TouchableOpacity>

                    {callType === 'video' && (
                        <>
                            <TouchableOpacity
                                style={[styles.controlButton, !isVideoEnabled && styles.activeControl]}
                                onPress={toggleVideo}
                            >
                                <IconButton
                                    icon={isVideoEnabled ? 'video' : 'video-off'}
                                    size={28}
                                    iconColor="white"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.controlButton}
                                onPress={switchCamera}
                            >
                                <IconButton icon="camera-flip" size={28} iconColor="white" />
                            </TouchableOpacity>
                        </>
                    )}

                    {callType === 'audio' && (
                        <TouchableOpacity
                            style={[styles.controlButton, isSpeaker && styles.activeControl]}
                            onPress={toggleSpeaker}
                        >
                            <IconButton icon="volume-high" size={28} iconColor="white" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
                        <IconButton icon="phone-hangup" size={32} iconColor="white" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    remoteVideo: {
        width: width,
        height: height,
        backgroundColor: '#000',
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
        borderColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    localVideo: {
        width: '100%',
        height: '100%',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    stateContainer: {
        alignItems: 'center',
    },
    stateText: {
        fontSize: 18,
        color: 'white',
        marginTop: 10,
    },
    incomingButtons: {
        flexDirection: 'row',
        marginTop: 40,
        gap: 40,
    },
    actionButton: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 50,
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
    },
    declineButton: {
        backgroundColor: '#F44336',
    },
    actionButtonText: {
        color: 'white',
        marginTop: 8,
        fontSize: 14,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    controlButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeControl: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    endCallButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
        marginTop: 16,
    },
    connectionWarning: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 165, 0, 0.9)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        zIndex: 100,
    },
    connectionWarningText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
});
