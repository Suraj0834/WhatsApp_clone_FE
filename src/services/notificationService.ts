import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import axios from '../api/axios';

class NotificationService {
    private pushToken: string | null = null;
    private isHandlerConfigured: boolean = false;

    /**
     * Configure notification handler (call once at app start)
     */
    configureHandler() {
        if (this.isHandlerConfigured) return;
        
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });
        
        this.isHandlerConfigured = true;
    }

    /**
     * Register for push notifications
     */
    async registerForPushNotifications(): Promise<string | null> {
        try {
            if (!Device.isDevice) {
                console.log('Push notifications only work on physical devices');
                return null;
            }

            // Check existing permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // Request permissions if not granted
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return null;
            }

            // Get push token
            const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId: 'your-project-id', // Replace with your Expo project ID
            });

            this.pushToken = tokenData.data;

            // Configure notification channel for Android
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });

                // Call notification channel
                await Notifications.setNotificationChannelAsync('calls', {
                    name: 'Calls',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 500, 500, 500],
                });
            }

            // Register token with backend
            await this.registerTokenWithBackend(this.pushToken);

            return this.pushToken;
        } catch (error) {
            console.error('Error registering for push notifications:', error);
            return null;
        }
    }

    /**
     * Register push token with backend
     */
    async registerTokenWithBackend(token: string): Promise<void> {
        try {
            await axios.post('/notifications/token', { pushToken: token });
            console.log('Push token registered with backend');
        } catch (error) {
            console.error('Error registering token with backend:', error);
        }
    }

    /**
     * Unregister push token
     */
    async unregisterPushToken(): Promise<void> {
        try {
            await axios.delete('/notifications/token');
            this.pushToken = null;
            console.log('Push token unregistered');
        } catch (error) {
            console.error('Error unregistering push token:', error);
        }
    }

    /**
     * Add notification received listener
     */
    addNotificationReceivedListener(
        callback: (notification: Notifications.Notification) => void
    ): Notifications.Subscription {
        return Notifications.addNotificationReceivedListener(callback);
    }

    /**
     * Add notification response listener
     */
    addNotificationResponseListener(
        callback: (response: Notifications.NotificationResponse) => void
    ): Notifications.Subscription {
        return Notifications.addNotificationResponseReceivedListener(callback);
    }

    /**
     * Get all notifications
     */
    async getAllNotifications(): Promise<Notifications.Notification[]> {
        return await Notifications.getPresentedNotificationsAsync();
    }

    /**
     * Dismiss notification
     */
    async dismissNotification(notificationId: string): Promise<void> {
        await Notifications.dismissNotificationAsync(notificationId);
    }

    /**
     * Dismiss all notifications
     */
    async dismissAllNotifications(): Promise<void> {
        await Notifications.dismissAllNotificationsAsync();
    }

    /**
     * Schedule local notification
     */
    async scheduleNotification(
        title: string,
        body: string,
        data?: any,
        trigger?: Notifications.NotificationTriggerInput
    ): Promise<string> {
        return await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: 'default',
            },
            trigger: trigger || null,
        });
    }

    /**
     * Cancel scheduled notification
     */
    async cancelScheduledNotification(notificationId: string): Promise<void> {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    }

    /**
     * Get badge count
     */
    async getBadgeCount(): Promise<number> {
        return await Notifications.getBadgeCountAsync();
    }

    /**
     * Set badge count
     */
    async setBadgeCount(count: number): Promise<void> {
        await Notifications.setBadgeCountAsync(count);
    }

    /**
     * Get current push token
     */
    getPushToken(): string | null {
        return this.pushToken;
    }
}

export const notificationService = new NotificationService();
