import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../utils/constants';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async config => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Transform MongoDB _id to id
const transformResponse = (obj: any): any => {
    if (!obj) return obj;

    if (Array.isArray(obj)) {
        return obj.map(transformResponse);
    }

    if (typeof obj === 'object') {
        const transformed: any = {};
        for (const key in obj) {
            if (key === '_id') {
                transformed.id = obj[key];
                transformed._id = obj[key]; // Keep both for compatibility
            } else if (typeof obj[key] === 'object') {
                transformed[key] = transformResponse(obj[key]);
            } else {
                transformed[key] = obj[key];
            }
        }
        return transformed;
    }

    return obj;
};

axiosInstance.interceptors.response.use(
    response => {
        if (response.data) {
            response.data = transformResponse(response.data);
        }
        return response;
    },
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                await SecureStore.setItemAsync('accessToken', accessToken);
                await SecureStore.setItemAsync('refreshToken', newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
