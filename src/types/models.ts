export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    statusMessage?: string;
    online?: boolean;
    lastSeen?: Date;
}

export interface Conversation {
    id: string;
    type: 'direct' | 'group';
    members: User[];
    adminIds?: string[];
    title?: string;
    avatarUrl?: string;
    lastMessage?: {
        text: string;
        senderId: string;
        timestamp: Date;
        messageId: string;
    };
    unreadCount?: number;
    pinned?: boolean;
    pinnedBy?: string[];
    muted?: boolean;
    mutedUntil?: { [userId: string]: Date };
    createdAt: Date;
    updatedAt: Date;
}

export interface Attachment {
    url: string;
    mimeType: string;
    size: number;
    name?: string;
    thumbnailUrl?: string;
    duration?: number;
}

export interface Reaction {
    userId: string;
    emoji: string;
    timestamp: Date;
}

export interface LinkPreview {
    title?: string;
    description?: string;
    image?: string;
    url: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'system';
    content: string;
    attachments?: Attachment[];
    status: 'pending' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
    deliveredTo?: string[];
    readBy?: string[];
    reactions?: Reaction[];
    replyToMessageId?: string;
    editedAt?: Date;
    deletedAt?: Date;
    previewData?: LinkPreview;
    createdAt: Date;
    updatedAt: Date;
    tempId?: string;
}

export interface CallLog {
    id: string;
    callerId: string;
    calleeIds: string[];
    conversationId: string;
    callType: 'audio' | 'video';
    duration: number;
    status: 'missed' | 'answered' | 'declined' | 'failed';
    startedAt: Date;
    endedAt?: Date;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
