import * as SQLite from 'expo-sqlite';
import { Message } from '../types/models';

let db: SQLite.SQLiteDatabase | null = null;
let isInitialized = false;

const initDB = () => {
    if (!db) {
        db = SQLite.openDatabaseSync('whatsapp_clone.db');
    }
    return db;
};

export const offlineService = {
    init: async () => {
        if (isInitialized) {
            return;
        }

        try {
            const database = initDB();

            // Create tables using execAsync instead of execSync
            await database.execAsync(`
                CREATE TABLE IF NOT EXISTS messages (
                    id TEXT PRIMARY KEY,
                    conversationId TEXT,
                    senderId TEXT,
                    content TEXT,
                    type TEXT,
                    createdAt TEXT,
                    status TEXT,
                    jsonData TEXT
                );
            `);

            await database.execAsync(`
                CREATE TABLE IF NOT EXISTS pending_messages (
                    id TEXT PRIMARY KEY,
                    conversationId TEXT,
                    content TEXT,
                    type TEXT,
                    attachments TEXT,
                    createdAt TEXT
                );
            `);

            isInitialized = true;
            // Offline DB ready for message caching
        } catch (error) {
            console.error('Failed to init offline DB:', error);
            // Don't throw - allow app to continue without offline support
            isInitialized = false;
        }
    },

    saveMessage: async (message: Message) => {
        try {
            const database = initDB();
            if (!isInitialized) {
                await offlineService.init();
            }
            await database.runAsync(
                `INSERT OR REPLACE INTO messages (id, conversationId, senderId, content, type, createdAt, status, jsonData) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    message.id,
                    message.conversationId,
                    typeof message.senderId === 'object' ? (message.senderId as any)._id : message.senderId,
                    message.content,
                    message.type,
                    new Date(message.createdAt).toISOString(),
                    message.status,
                    JSON.stringify(message),
                ]
            );
        } catch (error) {
            console.error('Failed to save message offline:', error);
        }
    },

    getMessages: async (conversationId: string): Promise<Message[]> => {
        try {
            const database = initDB();
            if (!isInitialized) {
                await offlineService.init();
            }
            const result = await database.getAllAsync(
                `SELECT jsonData FROM messages WHERE conversationId = ? ORDER BY createdAt DESC LIMIT 50;`,
                [conversationId]
            );

            return result.map((row: any) => JSON.parse(row.jsonData));
        } catch (error) {
            console.error('Failed to get offline messages:', error);
            return [];
        }
    },

    queueMessage: async (message: any) => {
        try {
            const database = initDB();
            if (!isInitialized) {
                await offlineService.init();
            }
            await database.runAsync(
                `INSERT INTO pending_messages (id, conversationId, content, type, attachments, createdAt) VALUES (?, ?, ?, ?, ?, ?);`,
                [
                    message.tempId,
                    message.conversationId,
                    message.content,
                    message.type,
                    JSON.stringify(message.attachments || []),
                    new Date().toISOString(),
                ]
            );
        } catch (error) {
            console.error('Failed to queue message:', error);
        }
    },

    getPendingMessages: async () => {
        try {
            const database = initDB();
            if (!isInitialized) {
                await offlineService.init();
            }
            const result = await database.getAllAsync(`SELECT * FROM pending_messages ORDER BY createdAt ASC;`);
            return result.map((row: any) => ({
                ...row,
                attachments: JSON.parse(row.attachments),
            }));
        } catch (error) {
            console.error('Failed to get pending messages:', error);
            return [];
        }
    },

    removePendingMessage: async (id: string) => {
        try {
            const database = initDB();
            if (!isInitialized) {
                await offlineService.init();
            }
            await database.runAsync(`DELETE FROM pending_messages WHERE id = ?;`, [id]);
        } catch (error) {
            console.error('Failed to remove pending message:', error);
        }
    },

    searchMessages: async (conversationId: string, query: string): Promise<Message[]> => {
        try {
            const database = initDB();
            if (!isInitialized) {
                await offlineService.init();
            }
            const result = await database.getAllAsync(
                `SELECT jsonData FROM messages WHERE conversationId = ? AND content LIKE ? ORDER BY createdAt DESC;`,
                [conversationId, `%${query}%`]
            );
            return result.map((row: any) => JSON.parse(row.jsonData));
        } catch (error) {
            console.error('Failed to search offline messages:', error);
            return [];
        }
    },
};
