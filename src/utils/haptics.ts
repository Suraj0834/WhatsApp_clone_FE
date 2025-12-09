import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptic feedback types mapped to expo-haptics
 */
export type HapticFeedbackType =
    | 'light'
    | 'medium'
    | 'heavy'
    | 'success'
    | 'warning'
    | 'error'
    | 'selection';

/**
 * Trigger light haptic feedback
 * Use for: Button taps, toggle switches
 */
export async function triggerLight(): Promise<void> {
    try {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    } catch (error) {
        console.warn('Haptic feedback not available:', error);
    }
}

/**
 * Trigger medium haptic feedback
 * Use for: Swipe actions, pull to refresh
 */
export async function triggerMedium(): Promise<void> {
    try {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    } catch (error) {
        console.warn('Haptic feedback not available:', error);
    }
}

/**
 * Trigger heavy haptic feedback
 * Use for: Important actions, delete confirmations
 */
export async function triggerHeavy(): Promise<void> {
    try {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    } catch (error) {
        console.warn('Haptic feedback not available:', error);
    }
}

/**
 * Trigger success haptic feedback
 * Use for: Message sent successfully, call connected
 */
export async function triggerSuccess(): Promise<void> {
    try {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    } catch (error) {
        console.warn('Haptic feedback not available:', error);
    }
}

/**
 * Trigger warning haptic feedback
 * Use for: Low battery during call, poor connection
 */
export async function triggerWarning(): Promise<void> {
    try {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    } catch (error) {
        console.warn('Haptic feedback not available:', error);
    }
}

/**
 * Trigger error haptic feedback
 * Use for: Message failed to send, call disconnected
 */
export async function triggerError(): Promise<void> {
    try {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    } catch (error) {
        console.warn('Haptic feedback not available:', error);
    }
}

/**
 * Trigger selection haptic feedback
 * Use for: Scrolling through pickers, selecting items
 */
export async function triggerSelection(): Promise<void> {
    try {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await Haptics.selectionAsync();
        }
    } catch (error) {
        console.warn('Haptic feedback not available:', error);
    }
}

/**
 * Generic haptic feedback trigger
 * Use when you want to programmatically choose feedback type
 */
export async function triggerHaptic(type: HapticFeedbackType): Promise<void> {
    switch (type) {
        case 'light':
            return triggerLight();
        case 'medium':
            return triggerMedium();
        case 'heavy':
            return triggerHeavy();
        case 'success':
            return triggerSuccess();
        case 'warning':
            return triggerWarning();
        case 'error':
            return triggerError();
        case 'selection':
            return triggerSelection();
        default:
            return triggerLight();
    }
}

/**
 * Haptic feedback for sending a message
 */
export async function messageSentFeedback(): Promise<void> {
    await triggerLight();
}

/**
 * Haptic feedback for receiving a message
 */
export async function messageReceivedFeedback(): Promise<void> {
    await triggerLight();
}

/**
 * Haptic feedback for starting a call
 */
export async function callStartFeedback(): Promise<void> {
    await triggerMedium();
}

/**
 * Haptic feedback for call connected
 */
export async function callConnectedFeedback(): Promise<void> {
    await triggerSuccess();
}

/**
 * Haptic feedback for call ended
 */
export async function callEndedFeedback(): Promise<void> {
    await triggerMedium();
}

/**
 * Haptic feedback for call failed/rejected
 */
export async function callFailedFeedback(): Promise<void> {
    await triggerError();
}

/**
 * Haptic feedback for delete action
 */
export async function deleteFeedback(): Promise<void> {
    await triggerHeavy();
}

/**
 * Haptic feedback for recording audio
 */
export async function recordingStartFeedback(): Promise<void> {
    await triggerMedium();
}

/**
 * Haptic feedback for stopping audio recording
 */
export async function recordingStopFeedback(): Promise<void> {
    await triggerMedium();
}

/**
 * Haptic feedback for taking a photo
 */
export async function photoCaptureFeedback(): Promise<void> {
    await triggerHeavy();
}

/**
 * Haptic feedback for typing indicator (debounced, don't call too frequently)
 */
export async function typingFeedback(): Promise<void> {
    await triggerLight();
}

/**
 * Haptic feedback for pull to refresh
 */
export async function refreshFeedback(): Promise<void> {
    await triggerMedium();
}

/**
 * Haptic feedback for swipe actions (archive, delete, pin)
 */
export async function swipeActionFeedback(): Promise<void> {
    await triggerMedium();
}

/**
 * Haptic feedback for long press
 */
export async function longPressFeedback(): Promise<void> {
    await triggerMedium();
}

/**
 * Haptic feedback for selecting an item
 */
export async function selectItemFeedback(): Promise<void> {
    await triggerSelection();
}

/**
 * Haptic feedback for notifications
 */
export async function notificationFeedback(): Promise<void> {
    await triggerMedium();
}
