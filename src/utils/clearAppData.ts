import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';

/**
 * Clear all stored data and reset the app to fresh state
 * Use this when Redux state gets corrupted or after major updates
 */
export const clearAppData = async () => {
    try {
        console.log('Clearing app data...');

        // Clear all SecureStore items
        await SecureStore.deleteItemAsync('accessToken').catch(() => { });
        await SecureStore.deleteItemAsync('refreshToken').catch(() => { });
        await SecureStore.deleteItemAsync('user').catch(() => { });

        // Clear SQLite database
        try {
            const db = SQLite.openDatabaseSync('whatsapp_clone.db');
            await db.execAsync('DROP TABLE IF EXISTS messages;');
            await db.execAsync('DROP TABLE IF EXISTS pending_messages;');
            console.log('Database cleared');
        } catch (dbError) {
            console.log('Database clear error (safe to ignore):', dbError);
        }

        console.log('App data cleared successfully');
        return true;
    } catch (error) {
        console.error('Error clearing app data:', error);
        return false;
    }
};

/**
 * Reset Redux state to initial values
 */
export const getInitialState = () => ({
    auth: {
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    },
    chat: {
        conversations: [],
        currentConversation: null,
        messages: [],
        isLoading: false,
        error: null,
        hasMoreMessages: true,
        typingUsers: [],
        searchResults: [],
    },
});
