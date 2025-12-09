import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get API URL based on platform and environment
const getApiUrl = () => {
    // Use environment variable if available
    const envApiUrl = Constants.expoConfig?.extra?.apiUrl;
    if (envApiUrl && !envApiUrl.includes('localhost')) {
        return envApiUrl;
    }

    // Development mode
    if (__DEV__) {
        // For Android emulator
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:3000/api';
        }

        // For iOS simulator and physical devices on same network
        // This gets your local IP from the Expo dev server
        const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
        if (debuggerHost) {
            return `http://${debuggerHost}:3000/api`;
        }

        // Fallback to localhost
        return 'http://localhost:3000/api';
    }

    // Production mode
    return envApiUrl || 'https://your-production-api.com/api';
};

// Socket URL should not include /api prefix
const getSocketUrl = () => {
    const envApiUrl = Constants.expoConfig?.extra?.apiUrl;
    if (envApiUrl && !envApiUrl.includes('localhost')) {
        return envApiUrl.replace('/api', '');
    }

    if (__DEV__) {
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:3000';
        }

        const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
        if (debuggerHost) {
            return `http://${debuggerHost}:3000`;
        }

        return 'http://localhost:3000';
    }

    return envApiUrl?.replace('/api', '') || 'https://your-production-api.com';
};

export const API_URL = getApiUrl();
export const SOCKET_URL = getSocketUrl();

export const COLORS = {
    primary: '#25D366',
    primaryDark: '#1DA851',
    secondary: '#128C7E',
    background: '#FFFFFF',
    backgroundDark: '#0B141A',
    surface: '#F7F8FA',
    surfaceDark: '#1C2A33',
    chatBubbleSent: '#DCF8C6',
    chatBubbleReceived: '#FFFFFF',
    chatBubbleSentDark: '#056162',
    chatBubbleReceivedDark: '#1C2A33',
    text: '#000000',
    textDark: '#E9EDEF',
    textSecondary: '#667781',
    textSecondaryDark: '#8696A0',
    border: '#E5E5E5',
    borderDark: '#2A3942',
    error: '#DC3545',
    success: '#25D366',
    warning: '#FFC107',
    info: '#17A2B8',
    online: '#25D366',
    offline: '#8696A0',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const TYPOGRAPHY = {
    title: {
        fontSize: 20,
        fontWeight: '600' as const,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500' as const,
    },
    body: {
        fontSize: 14,
        fontWeight: '400' as const,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
    },
};

export const MAX_FILE_SIZE = 100 * 1024 * 1024;
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];
export const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
