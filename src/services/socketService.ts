import io, { Socket } from 'socket.io-client';
import { store } from '../store';
import { addMessage, updateMessageStatus, updateMessage, setTypingUser } from '../store/slices/chatSlice';
import { offlineService } from './offlineService';

class SocketService {
    private socket: Socket | null = null;

    connect(url: string, token: string) {
        if (this.socket?.connected) {
            return; // Already connected
        }

        this.socket = io(url, {
            auth: { token },
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('message:new', (message) => {
            offlineService.saveMessage(message);
            store.dispatch(addMessage(message));
        });

        this.socket.on('message:update', (message) => {
            store.dispatch(updateMessage(message));
        });

        this.socket.on('typing:update', (data) => {
            store.dispatch(setTypingUser(data));
        });

        this.socket.on('message:read', (data) => {
            // data: { conversationId, messageIds, userId }
            // We need to update status of these messages to 'read'
            data.messageIds.forEach((id: string) => {
                store.dispatch(updateMessageStatus({ messageId: id, status: 'read' }));
            });
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }

    joinConversation(conversationId: string) {
        this.socket?.emit('join_conversation', { conversationId });
    }

    leaveConversation(conversationId: string) {
        this.socket?.emit('leave_conversation', { conversationId });
    }

    sendTyping(conversationId: string, isTyping: boolean) {
        this.socket?.emit('typing', { conversationId, isTyping });
    }

    markMessagesAsRead(conversationId: string, messageIds: string[]) {
        this.socket?.emit('read_messages', { conversationId, messageIds });
    }

    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
    }

    // Public methods for external socket operations
    emit(event: string, data?: any) {
        this.socket?.emit(event, data);
    }

    on(event: string, callback: (...args: any[]) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string) {
        this.socket?.off(event);
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export const socketService = new SocketService();
