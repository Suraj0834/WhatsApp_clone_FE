import axios from '../axios';
import { User, AuthTokens } from '../../types/models';

export interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export interface LoginData {
    email?: string;
    phone?: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export const authApi = {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await axios.post('/api/auth/register', data);
        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await axios.post('/api/auth/login', data);
        return response.data;
    },

    async refresh(refreshToken: string): Promise<AuthTokens> {
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        return response.data;
    },

    async logout(): Promise<void> {
        await axios.post('/api/auth/logout');
    },
};
