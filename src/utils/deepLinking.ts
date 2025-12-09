import * as Linking from 'expo-linking';
import { NavigationContainerRef } from '@react-navigation/native';

/**
 * Deep linking configuration for the app
 */
export const deepLinkConfig = {
    prefixes: [
        'whatsapp://',
        'exp://127.0.0.1:8081',
        'https://whatsapp.com',
        'https://*.whatsapp.com',
    ],
    config: {
        screens: {
            Auth: {
                screens: {
                    Login: 'login',
                    Register: 'register',
                },
            },
            Main: {
                screens: {
                    Chats: {
                        screens: {
                            ChatsList: 'chats',
                            Chat: 'chat/:conversationId',
                            NewChat: 'new-chat',
                            NewGroup: 'new-group',
                            NewGroupParticipants: 'new-group/participants',
                            NewGroupInfo: 'new-group/info',
                            GroupInfo: 'group/:conversationId/info',
                            SearchMessages: 'chat/:conversationId/search',
                        },
                    },
                    Contacts: {
                        screens: {
                            ContactsList: 'contacts',
                        },
                    },
                    Calls: {
                        screens: {
                            CallsList: 'calls',
                            IncomingCall: 'call/incoming/:callId',
                            ActiveCall: 'call/active/:callId',
                        },
                    },
                    Settings: {
                        screens: {
                            SettingsHome: 'settings',
                            Profile: 'settings/profile',
                            Notifications: 'settings/notifications',
                            Privacy: 'settings/privacy',
                            Storage: 'settings/storage',
                            Help: 'settings/help',
                        },
                    },
                },
            },
        },
    },
};

/**
 * Deep link URL patterns
 */
export const DeepLinkPatterns = {
    // Chat-related
    CHAT: 'whatsapp://chat/:conversationId',
    NEW_CHAT: 'whatsapp://new-chat',
    NEW_GROUP: 'whatsapp://new-group',
    GROUP_INFO: 'whatsapp://group/:conversationId/info',
    SEARCH_MESSAGES: 'whatsapp://chat/:conversationId/search',
    
    // Call-related
    INCOMING_CALL: 'whatsapp://call/incoming/:callId',
    ACTIVE_CALL: 'whatsapp://call/active/:callId',
    
    // Settings
    SETTINGS: 'whatsapp://settings',
    NOTIFICATIONS: 'whatsapp://settings/notifications',
    PROFILE: 'whatsapp://settings/profile',
    
    // Auth
    LOGIN: 'whatsapp://login',
    REGISTER: 'whatsapp://register',
};

/**
 * Navigation reference for deep linking
 */
let navigationRef: NavigationContainerRef<any> | null = null;

/**
 * Set navigation reference for deep linking
 */
export function setNavigationRef(ref: NavigationContainerRef<any>) {
    navigationRef = ref;
}

/**
 * Navigate to a screen using deep link
 */
export function navigateFromDeepLink(url: string) {
    if (!navigationRef) {
        console.warn('Navigation ref not set. Call setNavigationRef first.');
        return false;
    }

    const parsed = Linking.parse(url);
    const { path, queryParams } = parsed;

    if (!path) {
        return false;
    }

    // Handle different deep link patterns
    if (path.startsWith('chat/')) {
        const conversationId = path.split('/')[1];
        navigationRef.navigate('Main', {
            screen: 'Chats',
            params: {
                screen: 'Chat',
                params: { conversationId, ...queryParams },
            },
        });
        return true;
    }

    if (path.startsWith('call/incoming/')) {
        const callId = path.split('/')[2];
        navigationRef.navigate('Main', {
            screen: 'Calls',
            params: {
                screen: 'IncomingCall',
                params: { callId, ...queryParams },
            },
        });
        return true;
    }

    if (path.startsWith('call/active/')) {
        const callId = path.split('/')[2];
        navigationRef.navigate('Main', {
            screen: 'Calls',
            params: {
                screen: 'ActiveCall',
                params: { callId, ...queryParams },
            },
        });
        return true;
    }

    if (path === 'new-chat') {
        navigationRef.navigate('Main', {
            screen: 'Chats',
            params: { screen: 'NewChat' },
        });
        return true;
    }

    if (path === 'new-group') {
        navigationRef.navigate('Main', {
            screen: 'Chats',
            params: { screen: 'NewGroup' },
        });
        return true;
    }

    if (path === 'settings') {
        navigationRef.navigate('Main', {
            screen: 'Settings',
            params: { screen: 'SettingsHome' },
        });
        return true;
    }

    if (path === 'settings/notifications') {
        navigationRef.navigate('Main', {
            screen: 'Settings',
            params: { screen: 'Notifications' },
        });
        return true;
    }

    // Add more patterns as needed

    console.warn('Unknown deep link path:', path);
    return false;
}

/**
 * Build deep link URL for a conversation
 */
export function buildChatDeepLink(conversationId: string, params?: Record<string, string>): string {
    const baseUrl = `whatsapp://chat/${conversationId}`;
    
    if (!params || Object.keys(params).length === 0) {
        return baseUrl;
    }

    const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    
    return `${baseUrl}?${queryString}`;
}

/**
 * Build deep link URL for a call
 */
export function buildCallDeepLink(callId: string, type: 'incoming' | 'active'): string {
    return `whatsapp://call/${type}/${callId}`;
}

/**
 * Build deep link URL for settings
 */
export function buildSettingsDeepLink(page?: 'notifications' | 'profile' | 'privacy' | 'storage' | 'help'): string {
    if (!page) {
        return 'whatsapp://settings';
    }
    return `whatsapp://settings/${page}`;
}

/**
 * Handle notification tap and navigate to appropriate screen
 */
export interface NotificationData {
    type: 'message' | 'call' | 'group_invite' | 'system';
    conversationId?: string;
    callId?: string;
    messageId?: string;
    userId?: string;
    [key: string]: any;
}

export function handleNotificationTap(data: NotificationData): boolean {
    if (!navigationRef) {
        console.warn('Navigation ref not set. Call setNavigationRef first.');
        return false;
    }

    switch (data.type) {
        case 'message':
            if (data.conversationId) {
                const url = buildChatDeepLink(data.conversationId, {
                    messageId: data.messageId || '',
                    highlight: 'true',
                });
                return navigateFromDeepLink(url);
            }
            break;

        case 'call':
            if (data.callId) {
                const url = buildCallDeepLink(data.callId, 'incoming');
                return navigateFromDeepLink(url);
            }
            break;

        case 'group_invite':
            if (data.conversationId) {
                const url = `whatsapp://group/${data.conversationId}/info`;
                return navigateFromDeepLink(url);
            }
            break;

        case 'system':
            // Navigate to settings or home
            navigationRef.navigate('Main', {
                screen: 'Chats',
                params: { screen: 'ChatsList' },
            });
            return true;

        default:
            console.warn('Unknown notification type:', data.type);
            return false;
    }

    return false;
}

/**
 * Get initial URL from app launch
 */
export async function getInitialUrl(): Promise<string | null> {
    try {
        return await Linking.getInitialURL();
    } catch (error) {
        console.error('Error getting initial URL:', error);
        return null;
    }
}

/**
 * Listen for deep link URL changes
 */
export function addDeepLinkListener(callback: (url: string) => void): () => void {
    const subscription = Linking.addEventListener('url', ({ url }) => {
        callback(url);
    });

    return () => {
        subscription.remove();
    };
}

/**
 * Initialize deep linking
 */
export async function initializeDeepLinking(
    nav: NavigationContainerRef<any>,
    onUrlReceived?: (url: string) => void
): Promise<() => void> {
    setNavigationRef(nav);

    // Handle initial URL (app opened from terminated state)
    const initialUrl = await getInitialUrl();
    if (initialUrl) {
        if (onUrlReceived) {
            onUrlReceived(initialUrl);
        } else {
            navigateFromDeepLink(initialUrl);
        }
    }

    // Listen for deep link changes (app in background/foreground)
    const removeListener = addDeepLinkListener((url) => {
        if (onUrlReceived) {
            onUrlReceived(url);
        } else {
            navigateFromDeepLink(url);
        }
    });

    return removeListener;
}
