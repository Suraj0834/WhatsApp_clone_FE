import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface OnlineStatusIndicatorProps {
    online: boolean;
    size?: number;
    showOffline?: boolean;
    style?: ViewStyle;
}

/**
 * Online status indicator (green/gray dot)
 */
export const OnlineStatusIndicator: React.FC<OnlineStatusIndicatorProps> = ({
    online,
    size = 12,
    showOffline = true,
    style,
}) => {
    if (!online && !showOffline) {
        return null;
    }

    return (
        <View
            style={[
                styles.statusIndicator,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: online ? '#25D366' : '#9E9E9E',
                },
                style,
            ]}
        />
    );
};

interface TypingIndicatorProps {
    style?: ViewStyle;
}

/**
 * Animated typing indicator (three dots)
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ style }) => {
    return (
        <View style={[styles.typingContainer, style]}>
            <View style={styles.typingDot} />
            <View style={[styles.typingDot, styles.typingDotMiddle]} />
            <View style={styles.typingDot} />
        </View>
    );
};

interface LastSeenTextProps {
    lastSeen?: Date;
    online: boolean;
    typing?: boolean;
    style?: any;
}

/**
 * Last seen text with smart formatting
 */
export const LastSeenText: React.FC<LastSeenTextProps> = ({
    lastSeen,
    online,
    typing,
    style,
}) => {
    if (typing) {
        return <Text style={[styles.lastSeenText, styles.typingText, style]}>typing...</Text>;
    }

    if (online) {
        return <Text style={[styles.lastSeenText, styles.onlineText, style]}>online</Text>;
    }

    if (!lastSeen) {
        return null;
    }

    const text = formatLastSeen(lastSeen);
    return <Text style={[styles.lastSeenText, style]}>{text}</Text>;
};

/**
 * Format last seen date to human-readable text
 */
function formatLastSeen(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return 'last seen just now';
    }

    if (diffMins < 60) {
        return `last seen ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    }

    if (diffHours < 24) {
        return `last seen ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }

    if (diffDays === 1) {
        return 'last seen yesterday';
    }

    if (diffDays < 7) {
        return `last seen ${diffDays} days ago`;
    }

    // Format as date for older entries
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
    };

    return `last seen ${date.toLocaleDateString(undefined, options)}`;
}

interface UserPresenceAvatarProps {
    avatarUrl?: string;
    name: string;
    online: boolean;
    size?: number;
    showOnlineIndicator?: boolean;
}

/**
 * Avatar with online status indicator
 */
export const UserPresenceAvatar: React.FC<UserPresenceAvatarProps> = ({
    avatarUrl,
    name,
    online,
    size = 50,
    showOnlineIndicator = true,
}) => {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <View style={{ width: size, height: size }}>
            <View
                style={[
                    styles.avatar,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                    },
                ]}
            >
                {avatarUrl ? (
                    <Text>Image: {avatarUrl}</Text> // Replace with actual Image component
                ) : (
                    <Text style={[styles.avatarInitials, { fontSize: size / 2.5 }]}>{initials}</Text>
                )}
            </View>

            {showOnlineIndicator && (
                <OnlineStatusIndicator
                    online={online}
                    size={size / 4}
                    style={{
                        ...styles.avatarOnlineIndicator,
                        right: 0,
                        bottom: 0,
                    }}
                />
            )}
        </View>
    );
};

interface ChatHeaderPresenceProps {
    name: string;
    online: boolean;
    lastSeen?: Date;
    typing?: boolean;
    style?: ViewStyle;
}

/**
 * Complete presence info for chat header
 */
export const ChatHeaderPresence: React.FC<ChatHeaderPresenceProps> = ({
    name,
    online,
    lastSeen,
    typing,
    style,
}) => {
    return (
        <View style={[styles.chatHeaderPresence, style]}>
            <Text style={styles.chatHeaderName}>{name}</Text>
            <View style={styles.chatHeaderStatus}>
                <OnlineStatusIndicator online={online} size={8} showOffline={false} />
                {(online || typing) && <View style={styles.spacer} />}
                <LastSeenText lastSeen={lastSeen} online={online} typing={typing} />
            </View>
        </View>
    );
};

interface ChatListItemPresenceProps {
    online: boolean;
    lastSeen?: Date;
    unreadCount?: number;
    style?: ViewStyle;
}

/**
 * Presence info for chat list items
 */
export const ChatListItemPresence: React.FC<ChatListItemPresenceProps> = ({
    online,
    lastSeen,
    unreadCount,
    style,
}) => {
    return (
        <View style={[styles.chatListItemPresence, style]}>
            <OnlineStatusIndicator online={online} size={10} />
            
            {unreadCount && unreadCount > 0 ? (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                </View>
            ) : lastSeen ? (
                <Text style={styles.lastSeenCompact}>{formatLastSeenCompact(lastSeen)}</Text>
            ) : null}
        </View>
    );
};

/**
 * Compact last seen format for list items
 */
function formatLastSeenCompact(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return `${diffMins}m`;
    }

    if (diffHours < 24) {
        return `${diffHours}h`;
    }

    if (diffDays < 7) {
        return `${diffDays}d`;
    }

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
    statusIndicator: {
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#9E9E9E',
    },
    typingDotMiddle: {
        marginHorizontal: 4,
    },
    
    lastSeenText: {
        fontSize: 12,
        color: '#757575',
    },
    onlineText: {
        color: '#25D366',
    },
    typingText: {
        color: '#25D366',
        fontStyle: 'italic',
    },
    
    avatar: {
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarInitials: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    avatarOnlineIndicator: {
        position: 'absolute',
    },
    
    chatHeaderPresence: {
        flex: 1,
    },
    chatHeaderName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    chatHeaderStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    spacer: {
        width: 6,
    },
    
    chatListItemPresence: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        minHeight: 40,
    },
    lastSeenCompact: {
        fontSize: 11,
        color: '#9E9E9E',
        marginTop: 4,
    },
    unreadBadge: {
        backgroundColor: '#25D366',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginTop: 4,
    },
    unreadBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
});
