import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message } from '../../types/models';
import { chatApi } from '../../api/endpoints/chat';

interface ChatState {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    hasMoreMessages: boolean;
    typingUsers: string[]; // List of user names typing
    searchResults: Message[];
}

const initialState: ChatState = {
    conversations: [],
    currentConversation: null,
    messages: [],
    isLoading: false,
    error: null,
    hasMoreMessages: true,
    typingUsers: [],
    searchResults: [],
};

export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async ({ offset, limit }: { offset?: number; limit?: number } = {}, { rejectWithValue }) => {
        try {
            return await chatApi.getConversations(offset, limit);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch conversations');
        }
    }
);

import { offlineService } from '../../services/offlineService';

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async ({ conversationId, limit, before }: { conversationId: string; limit?: number; before?: string }, { rejectWithValue }) => {
        try {
            const response = await chatApi.getMessages(conversationId, limit, before);
            // Cache messages
            response.messages.forEach(msg => offlineService.saveMessage(msg));
            return response;
        } catch (error: any) {
            // If fetch fails, try loading from offline DB
            if (!before) {
                const offlineMessages = await offlineService.getMessages(conversationId);
                if (offlineMessages.length > 0) {
                    return { messages: offlineMessages, hasMore: false };
                }
            }
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch messages');
        }
    }
);

export const searchMessages = createAsyncThunk(
    'chat/searchMessages',
    async ({ conversationId, query }: { conversationId: string; query: string }, { rejectWithValue }) => {
        try {
            const response = await chatApi.getMessages(conversationId, 50, undefined, query);
            return response.messages;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to search messages');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ conversationId, content, type, attachments, replyToMessageId }: { conversationId: string; content: string; type?: any; attachments?: any[]; replyToMessageId?: string }, { rejectWithValue }) => {
        try {
            return await chatApi.sendMessage(conversationId, content, type, attachments, replyToMessageId);
        } catch (error: any) {
            // Queue message if failed
            const tempId = Date.now().toString();
            const message = {
                tempId,
                conversationId,
                content,
                type: type || 'text',
                attachments,
                createdAt: new Date(),
                status: 'pending',
                replyToMessageId
            };
            await offlineService.queueMessage(message);
            return rejectWithValue({ error: 'Message queued offline', message });
        }
    }
);

export const syncPendingMessages = createAsyncThunk(
    'chat/syncPendingMessages',
    async (_, { dispatch }) => {
        const pending = await offlineService.getPendingMessages();
        for (const msg of pending) {
            try {
                await chatApi.sendMessage(msg.conversationId, msg.content, msg.type, msg.attachments);
                await offlineService.removePendingMessage(msg.id);
            } catch (e) {
                console.error('Failed to sync message:', e);
            }
        }
    }
);

export const retryMessage = createAsyncThunk(
    'chat/retryMessage',
    async (message: Message, { dispatch }) => {
        // Remove failed message from offline queue if exists
        await offlineService.removePendingMessage(message.id);
        // Resend
        await dispatch(sendMessage({
            conversationId: message.conversationId,
            content: message.content,
            type: message.type,
            attachments: message.attachments
        }));
        // We could remove the old failed message from state here if sendMessage adds a new one
        // But sendMessage uses tempId.
        // Ideally we should update the existing message status to pending.
        // For now, let's just let sendMessage handle it.
    }
);

export const addReaction = createAsyncThunk(
    'chat/addReaction',
    async ({ messageId, emoji }: { messageId: string; emoji: string }, { rejectWithValue }) => {
        try {
            return await chatApi.addReaction(messageId, emoji);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to add reaction');
        }
    }
);

export const removeReaction = createAsyncThunk(
    'chat/removeReaction',
    async ({ messageId, emoji }: { messageId: string; emoji: string }, { rejectWithValue }) => {
        try {
            return await chatApi.removeReaction(messageId, emoji);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to remove reaction');
        }
    }
);

export const editMessage = createAsyncThunk(
    'chat/editMessage',
    async ({ messageId, content }: { messageId: string; content: string }, { rejectWithValue }) => {
        try {
            return await chatApi.updateMessage(messageId, content);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to edit message');
        }
    }
);

export const deleteMessage = createAsyncThunk(
    'chat/deleteMessage',
    async (messageId: string, { rejectWithValue }) => {
        try {
            await chatApi.deleteMessage(messageId);
            return messageId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete message');
        }
    }
);

export const togglePinConversation = createAsyncThunk(
    'chat/togglePinConversation',
    async ({ conversationId, isPinned }: { conversationId: string; isPinned: boolean }, { rejectWithValue }) => {
        try {
            if (isPinned) {
                return await chatApi.unpinConversation(conversationId);
            } else {
                return await chatApi.pinConversation(conversationId);
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to toggle pin');
        }
    }
);

export const muteConversation = createAsyncThunk(
    'chat/muteConversation',
    async ({ conversationId, duration }: { conversationId: string; duration: string }, { rejectWithValue }) => {
        try {
            return await chatApi.muteConversation(conversationId, duration);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to mute conversation');
        }
    }
);

export const unmuteConversation = createAsyncThunk(
    'chat/unmuteConversation',
    async (conversationId: string, { rejectWithValue }) => {
        try {
            return await chatApi.unmuteConversation(conversationId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to unmute conversation');
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
            state.currentConversation = action.payload;
            state.messages = [];
            state.hasMoreMessages = true;
            state.searchResults = [];
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            // Only add if it belongs to current conversation
            if (state.currentConversation && action.payload.conversationId === state.currentConversation.id) {
                // Check for duplicate
                if (!state.messages.some(m => m.id === action.payload.id)) {
                    state.messages.push(action.payload);
                }
            }

            // Update last message in conversation list
            const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
            if (conversation) {
                conversation.lastMessage = {
                    text: action.payload.content,
                    senderId: action.payload.senderId,
                    timestamp: action.payload.createdAt,
                    messageId: action.payload.id,
                };
                conversation.updatedAt = action.payload.createdAt;
                // Move to top
                state.conversations = [conversation, ...state.conversations.filter(c => c.id !== conversation.id)];
            }
        },
        updateMessageStatus: (state, action: PayloadAction<{ messageId: string; status: any }>) => {
            const message = state.messages.find(m => m.id === action.payload.messageId);
            if (message) {
                message.status = action.payload.status;
            }
        },
        updateMessage: (state, action: PayloadAction<Message>) => {
            const index = state.messages.findIndex(m => m.id === action.payload.id);
            if (index !== -1) {
                state.messages[index] = action.payload;
            }
        },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter(m => m.id !== action.payload);
        },
        setTypingUser: (state, action: PayloadAction<{ userId: string; isTyping: boolean; userName: string }>) => {
            if (action.payload.isTyping) {
                if (!state.typingUsers.includes(action.payload.userName)) {
                    state.typingUsers.push(action.payload.userName);
                }
            } else {
                state.typingUsers = state.typingUsers.filter(name => name !== action.payload.userName);
            }
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Conversations
            .addCase(fetchConversations.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.meta.arg.offset === 0) {
                    state.conversations = action.payload.conversations;
                } else {
                    state.conversations = [...state.conversations, ...action.payload.conversations];
                }
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch Messages
            .addCase(fetchMessages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.meta.arg.before) {
                    state.messages = [...action.payload.messages, ...state.messages];
                } else {
                    state.messages = action.payload.messages;
                }
                state.hasMoreMessages = action.payload.hasMore;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Search Messages
            .addCase(searchMessages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(searchMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Send Message
            .addCase(sendMessage.fulfilled, (state, action) => {
                // Optimistic update handled by addMessage reducer via socket or manual call
                // But we can ensure it's here
                const message = action.payload.message;
                if (state.currentConversation && message.conversationId === state.currentConversation.id) {
                    if (!state.messages.some(m => m.id === message.id)) {
                        state.messages.push(message);
                    }
                }
            })
            .addCase(sendMessage.rejected, (state, action: any) => {
                if (action.payload?.message) {
                    // Optimistic add for offline message
                    const message = action.payload.message;
                    if (state.currentConversation && message.conversationId === state.currentConversation.id) {
                        state.messages.push(message);
                    }
                } else {
                    state.error = action.payload as string;
                }
            })
            // Reactions
            .addCase(addReaction.fulfilled, (state, action) => {
                const index = state.messages.findIndex(m => m.id === action.payload.message.id);
                if (index !== -1) {
                    state.messages[index] = action.payload.message;
                }
            })
            .addCase(removeReaction.fulfilled, (state, action) => {
                const index = state.messages.findIndex(m => m.id === action.payload.message.id);
                if (index !== -1) {
                    state.messages[index] = action.payload.message;
                }
            })
            // Edit Message
            .addCase(editMessage.fulfilled, (state, action) => {
                const index = state.messages.findIndex(m => m.id === action.payload.message.id);
                if (index !== -1) {
                    state.messages[index] = action.payload.message;
                }
            })
            // Delete Message
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter(m => m.id !== action.payload);
            })
            // Toggle Pin
            .addCase(togglePinConversation.fulfilled, (state, action) => {
                const index = state.conversations.findIndex(c => c.id === action.payload.conversation.id);
                if (index !== -1) {
                    state.conversations[index] = action.payload.conversation;
                    // Re-sort: Pinned first, then updatedAt
                    // Since we don't have current user ID here easily to check pinnedBy array order,
                    // we rely on backend sort or just update the item.
                    // Ideally we should re-sort the array.
                    // Let's assume the backend returns the updated conversation object correctly.
                    // To sort properly we need to know if it's pinned for THIS user.
                    // The conversation object has pinnedBy array.
                    // We can't easily access userId here without passing it or storing it in slice.
                    // For now, let's just update the item. The list might not re-sort immediately until refresh.
                    // Actually, we can try to re-sort if we assume the action payload has the updated state.
                }
            })
            // Mute/Unmute
            .addCase(muteConversation.fulfilled, (state, action) => {
                const index = state.conversations.findIndex(c => c.id === action.payload.conversation.id);
                if (index !== -1) {
                    state.conversations[index] = action.payload.conversation;
                }
            })
            .addCase(unmuteConversation.fulfilled, (state, action) => {
                const index = state.conversations.findIndex(c => c.id === action.payload.conversation.id);
                if (index !== -1) {
                    state.conversations[index] = action.payload.conversation;
                }
            });
    },
});

export const { setCurrentConversation, addMessage, updateMessageStatus, updateMessage, removeMessage, setTypingUser, clearSearchResults } = chatSlice.actions;
export default chatSlice.reducer;
