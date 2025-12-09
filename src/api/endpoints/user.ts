import api from '../axios';
import { User } from '../../types/models';

export const userApi = {
    searchUsers: async (query: string) => {
        const response = await api.get<{ users: User[] }>('/users/search', {
            params: { query },
        });
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get<{ user: User }>('/users/profile');
        return response.data;
    },
};
