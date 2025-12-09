import api from '../axios';
import { Conversation, Message } from '../../types/models';

export const chatApi = {
    // Conversations
    createConversation: async (memberIds: string[], type: 'direct' | 'group' = 'direct', title?: string, avatarUrl?: string) => {
        const response = await api.post<{ conversation: Conversation }>('/conversations', {
            memberIds,
            type,
            title,
            avatarUrl,
        });
        return response.data;
    },

    getConversations: async (offset = 0, limit = 20) => {
        const response = await api.get<{
            conversations: Conversation[];
            total: number;
            limit: number;
            offset: number;
        }>('/conversations', {
            params: { offset, limit },
        });
        return response.data;
    },

    pinConversation: async (conversationId: string) => {
        const response = await api.post<{ conversation: Conversation }>(`/conversations/${conversationId}/pin`);
        return response.data;
    },

    unpinConversation: async (conversationId: string) => {
        const response = await api.post<{ conversation: Conversation }>(`/conversations/${conversationId}/unpin`);
        return response.data;
    },

    muteConversation: async (conversationId: string, duration: string) => {
        const response = await api.post<{ conversation: Conversation }>(`/conversations/${conversationId}/mute`, { duration });
        return response.data;
    },

    unmuteConversation: async (conversationId: string) => {
        const response = await api.post<{ conversation: Conversation }>(`/conversations/${conversationId}/unmute`);
        return response.data;
    },

    getConversation: async (id: string) => {
        const response = await api.get<{ conversation: Conversation }>(`/conversations/${id}`);
        return response.data;
    },

    updateConversation: async (id: string, data: { title?: string; avatarUrl?: string; addMembers?: string[]; removeMembers?: string[] }) => {
        const response = await api.patch<{ conversation: Conversation }>(`/conversations/${id}`, data);
        return response.data;
    },

    // Messages
    sendMessage: async (conversationId: string, content: string, type: 'text' | 'image' | 'video' | 'audio' | 'file' = 'text', attachments: any[] = [], replyToMessageId?: string) => {
        const response = await api.post<{ message: Message }>('/messages', {
            conversationId,
            content,
            type,
            attachments,
            replyToMessageId,
        });
        return response.data;
    },

    updateMessage: async (messageId: string, content: string) => {
        const response = await api.patch<{ message: Message }>(`/messages/${messageId}`, { content });
        return response.data;
    },

    deleteMessage: async (messageId: string) => {
        await api.delete(`/messages/${messageId}`);
    },

    getMessages: async (conversationId: string, limit = 50, before?: string, search?: string) => {
        const response = await api.get<{
            messages: Message[];
            hasMore: boolean;
        }>(`/messages/conversation/${conversationId}`, {
            params: { limit, before, search },
        });
        return response.data;
    },

    // Media
    uploadFile: async (file: any) => {
        const formData = new FormData();
        formData.append('file', {
            uri: file.uri,
            name: file.name || 'upload.jpg',
            type: file.type || 'image/jpeg',
        } as any);

        const response = await api.post<{
            url: string;
            mimeType: string;
            size: number;
            filename: string;
        }>('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Reactions
    addReaction: async (messageId: string, emoji: string) => {
        const response = await api.post<{ message: Message }>(`/messages/${messageId}/reactions`, { emoji });
        return response.data;
    },

    removeReaction: async (messageId: string, emoji: string) => {
        const response = await api.delete<{ message: Message }>(`/messages/${messageId}/reactions`, {
            data: { emoji }
        });
        return response.data;
    },
};
