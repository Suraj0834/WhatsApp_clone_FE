import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices, MediaStream, isWebRTCAvailable } from '../utils/webrtcPolyfill';
import { socketService } from './socketService';

class WebRTCService {
    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;
    private callId: string | null = null;
    private isCaller: boolean = false;

    // ICE servers configuration (using free STUN servers)
    private configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
        ],
    };

    // Callbacks
    onLocalStream?: (stream: MediaStream) => void;
    onRemoteStream?: (stream: MediaStream) => void;
    onCallEnded?: () => void;
    onError?: (error: string) => void;

    async initCall(conversationId: string, calleeIds: string[], callType: 'audio' | 'video'): Promise<void> {
        if (!isWebRTCAvailable()) {
            const error = new Error('WebRTC is not available. Development build required.');
            if (this.onError) {
                this.onError(error.message);
            }
            throw error;
        }

        try {
            this.isCaller = true;

            // Get user media
            const stream = await this.getUserMedia(callType === 'video');
            this.localStream = stream;

            if (this.onLocalStream) {
                this.onLocalStream(stream);
            }

            // Create peer connection
            this.createPeerConnection();

            // Add local stream tracks
            stream.getTracks().forEach(track => {
                this.peerConnection?.addTrack(track, stream);
            });

            // Create offer
            const offer = await this.peerConnection?.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: callType === 'video',
            });

            await this.peerConnection?.setLocalDescription(offer);

            // Send offer via socket
            socketService.emit('call:offer', {
                conversationId,
                calleeIds,
                callType,
                offer: offer?.toJSON(),
            });

            // Listen for call created event to get callId
            socketService.on('call:created', (data: { callId: string }) => {
                this.callId = data.callId;
            });

            this.setupSocketListeners();

        } catch (error: any) {
            console.error('Error initiating call:', error);
            if (this.onError) {
                this.onError(error.message || 'Failed to start call');
            }
        }
    }

    async answerCall(callId: string, offer: any, callType: 'audio' | 'video'): Promise<void> {
        if (!isWebRTCAvailable()) {
            const error = new Error('WebRTC is not available. Development build required.');
            if (this.onError) {
                this.onError(error.message);
            }
            throw error;
        }

        try {
            this.callId = callId;
            this.isCaller = false;

            // Get user media
            const stream = await this.getUserMedia(callType === 'video');
            this.localStream = stream;

            if (this.onLocalStream) {
                this.onLocalStream(stream);
            }

            // Create peer connection
            this.createPeerConnection();

            // Add local stream tracks
            stream.getTracks().forEach(track => {
                this.peerConnection?.addTrack(track, stream);
            });

            // Set remote description (offer)
            await this.peerConnection?.setRemoteDescription(
                new RTCSessionDescription(offer)
            );

            // Create answer
            const answer = await this.peerConnection?.createAnswer();
            await this.peerConnection?.setLocalDescription(answer);

            // Send answer via socket
            socketService.emit('call:answer', {
                callId,
                answer: answer?.toJSON(),
            });

            this.setupSocketListeners();

        } catch (error: any) {
            console.error('Error answering call:', error);
            if (this.onError) {
                this.onError(error.message || 'Failed to answer call');
            }
        }
    }

    private createPeerConnection(): void {
        this.peerConnection = new RTCPeerConnection(this.configuration);

        // Handle ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate && this.callId) {
                socketService.emit('call:ice-candidate', {
                    callId: this.callId,
                    candidate: event.candidate.toJSON(),
                });
            }
        };

        // Handle remote stream
        this.peerConnection.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                this.remoteStream = event.streams[0];
                if (this.onRemoteStream) {
                    this.onRemoteStream(event.streams[0]);
                }
            }
        };

        // Handle connection state
        this.peerConnection.onconnectionstatechange = () => {
            console.log('Connection state:', this.peerConnection?.connectionState);

            if (this.peerConnection?.connectionState === 'failed' ||
                this.peerConnection?.connectionState === 'disconnected' ||
                this.peerConnection?.connectionState === 'closed') {
                this.handleCallEnd();
            }
        };
    }

    private setupSocketListeners(): void {
        // Handle answer from callee
        socketService.on('call:answered', async (data: { callId: string; answer: any }) => {
            if (data.callId === this.callId && this.isCaller) {
                try {
                    await this.peerConnection?.setRemoteDescription(
                        new RTCSessionDescription(data.answer)
                    );
                } catch (error) {
                    console.error('Error setting remote description:', error);
                }
            }
        });

        // Handle ICE candidates
        socketService.on('call:ice-candidate', async (data: { callId: string; candidate: any }) => {
            if (data.callId === this.callId) {
                try {
                    await this.peerConnection?.addIceCandidate(
                        new RTCIceCandidate(data.candidate)
                    );
                } catch (error) {
                    console.error('Error adding ICE candidate:', error);
                }
            }
        });

        // Handle call ended
        socketService.on('call:ended', () => {
            this.handleCallEnd();
        });

        // Handle call declined
        socketService.on('call:declined', () => {
            this.handleCallEnd();
        });
    }

    private async getUserMedia(video: boolean): Promise<MediaStream> {
        const constraints = {
            audio: true,
            video: video ? {
                mandatory: {
                    minWidth: 640,
                    minHeight: 480,
                    minFrameRate: 30,
                },
                facingMode: 'user',
            } : false,
        };

        return await mediaDevices.getUserMedia(constraints);
    }

    toggleMute(): boolean {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                return !audioTrack.enabled; // Return muted state
            }
        }
        return false;
    }

    toggleVideo(): boolean {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                return !videoTrack.enabled; // Return video off state
            }
        }
        return false;
    }

    async switchCamera(): Promise<void> {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                // @ts-ignore - _switchCamera is a react-native-webrtc specific method
                videoTrack._switchCamera();
            }
        }
    }

    endCall(duration?: number): void {
        if (this.callId) {
            socketService.emit('call:end', {
                callId: this.callId,
                duration,
            });
        }
        this.cleanup();
    }

    declineCall(callId: string): void {
        socketService.emit('call:decline', { callId });
        this.cleanup();
    }

    private handleCallEnd(): void {
        this.cleanup();
        if (this.onCallEnded) {
            this.onCallEnded();
        }
    }

    private cleanup(): void {
        // Stop all tracks
        this.localStream?.getTracks().forEach(track => track.stop());
        this.remoteStream?.getTracks().forEach(track => track.stop());

        // Close peer connection
        this.peerConnection?.close();

        // Clear references
        this.localStream = null;
        this.remoteStream = null;
        this.peerConnection = null;
        this.callId = null;

        // Remove socket listeners
        socketService.off('call:answered');
        socketService.off('call:ice-candidate');
        socketService.off('call:ended');
        socketService.off('call:declined');
        socketService.off('call:created');
    }

    getLocalStream(): MediaStream | null {
        return this.localStream;
    }

    getRemoteStream(): MediaStream | null {
        return this.remoteStream;
    }
}

export const webRTCService = new WebRTCService();
