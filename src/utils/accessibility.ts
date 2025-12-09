import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Accessibility utilities for screen readers and assistive technologies
 */

export interface AccessibilityProps {
    accessible?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityRole?: AccessibilityRole;
    accessibilityState?: AccessibilityState;
    accessibilityValue?: AccessibilityValue;
    accessibilityActions?: AccessibilityAction[];
    onAccessibilityAction?: (event: { nativeEvent: { actionName: string } }) => void;
}

type AccessibilityRole =
    | 'none'
    | 'button'
    | 'link'
    | 'search'
    | 'image'
    | 'keyboardkey'
    | 'text'
    | 'adjustable'
    | 'imagebutton'
    | 'header'
    | 'summary'
    | 'alert'
    | 'checkbox'
    | 'combobox'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'scrollbar'
    | 'spinbutton'
    | 'switch'
    | 'tab'
    | 'tablist'
    | 'timer'
    | 'toolbar';

interface AccessibilityState {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
}

interface AccessibilityValue {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
}

interface AccessibilityAction {
    name: string;
    label?: string;
}

/**
 * Check if screen reader is enabled
 */
export async function isScreenReaderEnabled(): Promise<boolean> {
    try {
        return await AccessibilityInfo.isScreenReaderEnabled();
    } catch (error) {
        console.error('Error checking screen reader status:', error);
        return false;
    }
}

/**
 * Announce message to screen reader
 */
export function announceForAccessibility(message: string): void {
    AccessibilityInfo.announceForAccessibility(message);
}

/**
 * Add listener for screen reader state changes
 */
export function addScreenReaderChangeListener(
    callback: (enabled: boolean) => void
): () => void {
    const subscription = AccessibilityInfo.addEventListener(
        'screenReaderChanged',
        callback
    );

    return () => {
        subscription.remove();
    };
}

/**
 * Message bubble accessibility props
 */
export function getMessageAccessibilityProps(
    senderName: string,
    messageText: string,
    timestamp: Date,
    isSent: boolean,
    status?: 'sending' | 'sent' | 'delivered' | 'read'
): AccessibilityProps {
    const timeString = formatTimeForAccessibility(timestamp);
    const statusString = status ? `, ${status}` : '';
    
    return {
        accessible: true,
        accessibilityLabel: `${isSent ? 'You' : senderName} said: ${messageText}, at ${timeString}${statusString}`,
        accessibilityRole: 'text',
        accessibilityHint: 'Double tap to view message options',
    };
}

/**
 * Chat list item accessibility props
 */
export function getChatListItemAccessibilityProps(
    contactName: string,
    lastMessage: string,
    unreadCount: number,
    timestamp: Date,
    isOnline: boolean
): AccessibilityProps {
    const unreadText = unreadCount > 0 ? `, ${unreadCount} unread messages` : '';
    const onlineStatus = isOnline ? ', online' : '';
    const timeString = formatTimeForAccessibility(timestamp);
    
    return {
        accessible: true,
        accessibilityLabel: `Chat with ${contactName}${onlineStatus}. Last message: ${lastMessage}, ${timeString}${unreadText}`,
        accessibilityRole: 'button',
        accessibilityHint: 'Double tap to open chat',
    };
}

/**
 * Contact list item accessibility props
 */
export function getContactAccessibilityProps(
    name: string,
    phone: string,
    isOnline: boolean
): AccessibilityProps {
    const onlineStatus = isOnline ? ', online' : ', offline';
    
    return {
        accessible: true,
        accessibilityLabel: `${name}, ${phone}${onlineStatus}`,
        accessibilityRole: 'button',
        accessibilityHint: 'Double tap to start chat',
    };
}

/**
 * Call button accessibility props
 */
export function getCallButtonAccessibilityProps(
    type: 'voice' | 'video',
    contactName?: string
): AccessibilityProps {
    const action = contactName ? `Call ${contactName}` : 'Start call';
    
    return {
        accessible: true,
        accessibilityLabel: `${type === 'video' ? 'Video' : 'Voice'} call`,
        accessibilityRole: 'button',
        accessibilityHint: `Double tap to ${action}`,
    };
}

/**
 * Call history item accessibility props
 */
export function getCallHistoryAccessibilityProps(
    contactName: string,
    callType: 'incoming' | 'outgoing' | 'missed',
    duration: number,
    timestamp: Date
): AccessibilityProps {
    const durationText = formatDurationForAccessibility(duration);
    const timeString = formatTimeForAccessibility(timestamp);
    
    return {
        accessible: true,
        accessibilityLabel: `${callType} call with ${contactName}, ${durationText}, ${timeString}`,
        accessibilityRole: 'button',
        accessibilityHint: 'Double tap to call back',
    };
}

/**
 * Media attachment accessibility props
 */
export function getMediaAccessibilityProps(
    type: 'image' | 'video' | 'audio' | 'document',
    filename?: string,
    duration?: number
): AccessibilityProps {
    let label = type;
    
    if (filename) {
        label += `, ${filename}`;
    }
    
    if (duration && (type === 'video' || type === 'audio')) {
        label += `, duration ${formatDurationForAccessibility(duration)}`;
    }
    
    return {
        accessible: true,
        accessibilityLabel: label,
        accessibilityRole: type === 'image' ? 'image' : 'button',
        accessibilityHint: `Double tap to ${type === 'image' ? 'view' : 'play'} ${type}`,
    };
}

/**
 * Button accessibility props
 */
export function getButtonAccessibilityProps(
    label: string,
    hint?: string,
    disabled?: boolean
): AccessibilityProps {
    return {
        accessible: true,
        accessibilityLabel: label,
        accessibilityRole: 'button',
        accessibilityHint: hint,
        accessibilityState: {
            disabled: disabled || false,
        },
    };
}

/**
 * Text input accessibility props
 */
export function getTextInputAccessibilityProps(
    label: string,
    value: string,
    placeholder?: string
): AccessibilityProps {
    return {
        accessible: true,
        accessibilityLabel: label,
        accessibilityValue: {
            text: value || placeholder || '',
        },
    };
}

/**
 * Switch/Toggle accessibility props
 */
export function getSwitchAccessibilityProps(
    label: string,
    isEnabled: boolean,
    hint?: string
): AccessibilityProps {
    return {
        accessible: true,
        accessibilityLabel: label,
        accessibilityRole: 'switch',
        accessibilityState: {
            checked: isEnabled,
        },
        accessibilityHint: hint,
    };
}

/**
 * Loading indicator accessibility props
 */
export function getLoadingAccessibilityProps(message?: string): AccessibilityProps {
    return {
        accessible: true,
        accessibilityLabel: message || 'Loading',
        accessibilityRole: 'progressbar',
        accessibilityState: {
            busy: true,
        },
    };
}

/**
 * Alert/Error accessibility props
 */
export function getAlertAccessibilityProps(
    message: string,
    type: 'error' | 'warning' | 'info' | 'success'
): AccessibilityProps {
    return {
        accessible: true,
        accessibilityLabel: `${type}: ${message}`,
        accessibilityRole: 'alert',
    };
}

/**
 * Format time for accessibility announcement
 */
function formatTimeForAccessibility(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return 'just now';
    }

    if (diffMins < 60) {
        return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    }

    if (diffHours < 24) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }

    if (diffDays === 1) {
        return 'yesterday';
    }

    if (diffDays < 7) {
        return `${diffDays} days ago`;
    }

    // Format as full date
    return date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}

/**
 * Format duration for accessibility announcement
 */
function formatDurationForAccessibility(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts: string[] = [];

    if (hours > 0) {
        parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    }

    if (minutes > 0) {
        parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    }

    if (secs > 0 || parts.length === 0) {
        parts.push(`${secs} ${secs === 1 ? 'second' : 'seconds'}`);
    }

    return parts.join(' and ');
}

/**
 * Reducer for bold text accessibility setting
 */
export function getAccessibleFontSize(baseFontSize: number, scaleFactor: number = 1): number {
    return Math.round(baseFontSize * scaleFactor);
}

/**
 * Get high contrast colors for accessibility
 */
export interface HighContrastColors {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    error: string;
    success: string;
}

export function getHighContrastColors(isDarkMode: boolean): HighContrastColors {
    if (isDarkMode) {
        return {
            background: '#000000',
            foreground: '#FFFFFF',
            primary: '#00FF00',
            secondary: '#FFFF00',
            error: '#FF0000',
            success: '#00FF00',
        };
    }

    return {
        background: '#FFFFFF',
        foreground: '#000000',
        primary: '#0000FF',
        secondary: '#000080',
        error: '#FF0000',
        success: '#008000',
    };
}

/**
 * Reduce motion for accessibility
 */
export function shouldReduceMotion(isReduceMotionEnabled: boolean): boolean {
    return isReduceMotionEnabled;
}

/**
 * Get animation duration based on reduce motion setting
 */
export function getAccessibleAnimationDuration(
    baseDuration: number,
    isReduceMotionEnabled: boolean
): number {
    return isReduceMotionEnabled ? 0 : baseDuration;
}
