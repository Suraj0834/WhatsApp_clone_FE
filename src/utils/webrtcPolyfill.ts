// WebRTC Polyfill for Expo Go compatibility
// This provides fallback implementations when react-native-webrtc is not available

let webrtc: any = null;
let isAvailable = false;

try {
  webrtc = require('react-native-webrtc');
  isAvailable = true;
} catch (error) {
  console.log('react-native-webrtc not available, using polyfills');
  isAvailable = false;
}

// Export availability checker
export const isWebRTCAvailable = (): boolean => {
  return isAvailable;
};

// Mock MediaStream for development
class MockMediaStream {
  private _id: string;

  constructor() {
    this._id = Math.random().toString(36).substr(2, 9);
  }

  toURL() {
    return '';
  }

  getTracks() {
    return [];
  }

  getAudioTracks() {
    return [];
  }

  getVideoTracks() {
    return [];
  }

  addTrack() { }
  removeTrack() { }
}

// Export real or mock implementations
export const RTCPeerConnection = isAvailable ? webrtc.RTCPeerConnection : class MockRTCPeerConnection {
  constructor(config: any) {
    console.warn('MockRTCPeerConnection: WebRTC not available');
  }

  createOffer() {
    return Promise.resolve({ type: 'offer', sdp: '' });
  }

  createAnswer() {
    return Promise.resolve({ type: 'answer', sdp: '' });
  }

  setLocalDescription() {
    return Promise.resolve();
  }

  setRemoteDescription() {
    return Promise.resolve();
  }

  addIceCandidate() {
    return Promise.resolve();
  }

  addTrack() { }
  close() { }
};

export const RTCSessionDescription = isAvailable ? webrtc.RTCSessionDescription : class MockRTCSessionDescription {
  constructor(desc: any) { }
  toJSON() {
    return { type: 'offer', sdp: '' };
  }
};

export const RTCIceCandidate = isAvailable ? webrtc.RTCIceCandidate : class MockRTCIceCandidate {
  constructor(candidate: any) { }
  toJSON() {
    return {};
  }
};

export const MediaStream = isAvailable ? webrtc.MediaStream : MockMediaStream;

export const mediaDevices = isAvailable ? webrtc.mediaDevices : {
  getUserMedia: () => Promise.reject(new Error('WebRTC not available')),
  enumerateDevices: () => Promise.resolve([]),
};

export const RTCView = isAvailable ? webrtc.RTCView : ({ streamURL, style, ...props }: any) => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return React.createElement(View, {
    style: [style, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]
  }, React.createElement(Text, { style: { color: '#fff' } }, 'Video Unavailable\nDevelopment Build Required'));
};

export default {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
  mediaDevices,
  RTCView,
  isWebRTCAvailable,
};
