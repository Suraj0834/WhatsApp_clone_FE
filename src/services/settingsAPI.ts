import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

// Get auth token
const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token;
};

// API client with auth
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to all requests
apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token invalid or expired - clear it
            await AsyncStorage.removeItem('token');
            // You could also redirect to login here if needed
        }
        return Promise.reject(error);
    }
);


export const settingsAPI = {
    // Profile Settings
    profile: {
        get: async () => {
            const response = await apiClient.get('/users/profile');
            return response.data;
        },
        update: async (data: { name?: string; statusMessage?: string; avatarUrl?: string }) => {
            const response = await apiClient.put('/settings/profile', data);
            return response.data;
        },
    },

    // Privacy Settings
    privacy: {
        getAll: async () => {
            const response = await apiClient.get('/privacy/all');
            return response.data;
        },
        updateLastSeen: async (whoCanSee: string) => {
            const response = await apiClient.put('/privacy/last-seen', { whoCanSee });
            return response.data;
        },
        updateProfilePhoto: async (whoCanSee: string) => {
            const response = await apiClient.put('/privacy/profile-photo', { whoCanSee });
            return response.data;
        },
        updateAbout: async (whoCanSee: string) => {
            const response = await apiClient.put('/privacy/about', { whoCanSee });
            return response.data;
        },
        updateReadReceipts: async (enabled: boolean) => {
            const response = await apiClient.put('/privacy/read-receipts', { enabled });
            return response.data;
        },
    },

    // Notification Settings
    notifications: {
        get: async () => {
            const response = await apiClient.get('/settings/notifications');
            return response.data;
        },
        update: async (settings: any) => {
            const response = await apiClient.put('/settings/notifications', settings);
            return response.data;
        },
    },

    // Chat Settings
    chat: {
        get: async () => {
            const response = await apiClient.get('/settings/chat');
            return response.data;
        },
        update: async (settings: any) => {
            const response = await apiClient.put('/settings/chat', settings);
            return response.data;
        },
    },

    // Storage Settings
    storage: {
        getUsage: async () => {
            const response = await apiClient.get('/settings/storage');
            return response.data;
        },
        clearCache: async () => {
            const response = await apiClient.delete('/settings/cache');
            return response.data;
        },
    },

    // Data Usage
    dataUsage: {
        get: async () => {
            const response = await apiClient.get('/settings/data-usage');
            return response.data;
        },
    },

    // Language Settings
    language: {
        update: async (language: string) => {
            const response = await apiClient.put('/settings/language', { language });
            return response.data;
        },
    },

    // Security Settings
    security: {
        enableAppLock: async (pin: string) => {
            const response = await apiClient.post('/security/app-lock', { pin });
            return response.data;
        },
        changeLockPin: async (oldPin: string, newPin: string) => {
            const response = await apiClient.put('/security/app-lock/pin', { oldPin, newPin });
            return response.data;
        },
        enableBiometric: async () => {
            const response = await apiClient.post('/security/biometric');
            return response.data;
        },
        disableBiometric: async () => {
            const response = await apiClient.delete('/security/biometric');
            return response.data;
        },
        enableTwoStep: async (pin: string, email: string) => {
            const response = await apiClient.post('/security/two-step', { pin, email });
            return response.data;
        },
        changeTwoStepPin: async (oldPin: string, newPin: string) => {
            const response = await apiClient.put('/security/two-step/pin', { oldPin, newPin });
            return response.data;
        },
        disableTwoStep: async () => {
            const response = await apiClient.delete('/security/two-step');
            return response.data;
        },
        getNotifications: async () => {
            const response = await apiClient.get('/security/notifications');
            return response.data;
        },
    },

    // Account Settings
    account: {
        getActivity: async () => {
            const response = await apiClient.get('/account/activity');
            return response.data;
        },
        requestInfo: async () => {
            const response = await apiClient.post('/account/info-request');
            return response.data;
        },
        changeNumber: async (newPhone: string) => {
            const response = await apiClient.post('/account/change-number/initiate', { newPhone });
            return response.data;
        },
        verifyChangeNumber: async (otp: string) => {
            const response = await apiClient.post('/account/change-number/verify', { otp });
            return response.data;
        },
        deleteAccount: async (password: string) => {
            const response = await apiClient.delete('/account/delete', { data: { password } });
            return response.data;
        },
        deactivateAccount: async () => {
            const response = await apiClient.post('/account/deactivate');
            return response.data;
        },
    },

    // Media Settings
    media: {
        getGallery: async (conversationId: string) => {
            const response = await apiClient.get(`/media-enhanced/gallery/${conversationId}`);
            return response.data;
        },
        getSharedLinks: async (conversationId: string) => {
            const response = await apiClient.get(`/media-enhanced/links/${conversationId}`);
            return response.data;
        },
        getSharedDocs: async (conversationId: string) => {
            const response = await apiClient.get(`/media-enhanced/docs/${conversationId}`);
            return response.data;
        },
        compressMedia: async (mediaUrl: string, quality: number) => {
            const response = await apiClient.post('/media-enhanced/compress', { mediaUrl, quality });
            return response.data;
        },
        deleteMedia: async (type: string) => {
            const response = await apiClient.delete(`/media-enhanced/${type}`);
            return response.data;
        },
    },
};

export default settingsAPI;
