import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface SkeletonLoaderProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: any;
}

/**
 * Base skeleton loader component with shimmer animation
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 4,
    style,
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1500,
                easing: Easing.ease,
                useNativeDriver: true,
            })
        ).start();
    }, [animatedValue]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-350, 350],
    });

    return (
        <View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            />
        </View>
    );
};

/**
 * Skeleton loader for chat list items
 */
export const ChatListItemSkeleton: React.FC = () => {
    return (
        <View style={styles.chatListItem}>
            {/* Avatar */}
            <SkeletonLoader width={50} height={50} borderRadius={25} />
            
            <View style={styles.chatListContent}>
                {/* Name */}
                <SkeletonLoader width="60%" height={16} style={styles.chatListName} />
                
                {/* Last message */}
                <SkeletonLoader width="80%" height={14} style={styles.chatListMessage} />
            </View>
            
            <View style={styles.chatListRight}>
                {/* Time */}
                <SkeletonLoader width={40} height={12} />
                
                {/* Badge */}
                <SkeletonLoader width={20} height={20} borderRadius={10} style={styles.chatListBadge} />
            </View>
        </View>
    );
};

/**
 * Skeleton loader for multiple chat list items
 */
export const ChatListSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
    return (
        <View>
            {Array.from({ length: count }).map((_, index) => (
                <ChatListItemSkeleton key={index} />
            ))}
        </View>
    );
};

/**
 * Skeleton loader for message bubbles
 */
export const MessageSkeleton: React.FC<{ isOwnMessage?: boolean }> = ({ isOwnMessage = false }) => {
    return (
        <View
            style={[
                styles.messageBubble,
                isOwnMessage ? styles.messageBubbleRight : styles.messageBubbleLeft,
            ]}
        >
            <SkeletonLoader width={200} height={14} />
            <SkeletonLoader width={150} height={14} style={styles.messageSecondLine} />
        </View>
    );
};

/**
 * Skeleton loader for multiple messages
 */
export const MessageListSkeleton: React.FC<{ count?: number }> = ({ count = 10 }) => {
    return (
        <View style={styles.messageList}>
            {Array.from({ length: count }).map((_, index) => (
                <MessageSkeleton
                    key={index}
                    isOwnMessage={index % 3 === 0} // Mix own and other messages
                />
            ))}
        </View>
    );
};

/**
 * Skeleton loader for contact list items
 */
export const ContactListItemSkeleton: React.FC = () => {
    return (
        <View style={styles.contactListItem}>
            {/* Avatar */}
            <SkeletonLoader width={45} height={45} borderRadius={22.5} />
            
            <View style={styles.contactListContent}>
                {/* Name */}
                <SkeletonLoader width="50%" height={16} />
                
                {/* Status */}
                <SkeletonLoader width="70%" height={12} style={styles.contactListStatus} />
            </View>
        </View>
    );
};

/**
 * Skeleton loader for contact list
 */
export const ContactListSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
    return (
        <View>
            {Array.from({ length: count }).map((_, index) => (
                <ContactListItemSkeleton key={index} />
            ))}
        </View>
    );
};

/**
 * Skeleton loader for call history items
 */
export const CallHistoryItemSkeleton: React.FC = () => {
    return (
        <View style={styles.callHistoryItem}>
            {/* Avatar */}
            <SkeletonLoader width={45} height={45} borderRadius={22.5} />
            
            <View style={styles.callHistoryContent}>
                {/* Name */}
                <SkeletonLoader width="50%" height={16} />
                
                {/* Call info */}
                <SkeletonLoader width="60%" height={12} style={styles.callHistoryInfo} />
            </View>
            
            {/* Call button */}
            <SkeletonLoader width={40} height={40} borderRadius={20} />
        </View>
    );
};

/**
 * Skeleton loader for call history list
 */
export const CallHistoryListSkeleton: React.FC<{ count?: number }> = ({ count = 10 }) => {
    return (
        <View>
            {Array.from({ length: count }).map((_, index) => (
                <CallHistoryItemSkeleton key={index} />
            ))}
        </View>
    );
};

/**
 * Skeleton loader for status/story items
 */
export const StatusItemSkeleton: React.FC = () => {
    return (
        <View style={styles.statusItem}>
            {/* Avatar with circle */}
            <SkeletonLoader width={60} height={60} borderRadius={30} />
            
            {/* Name */}
            <SkeletonLoader width={50} height={12} style={styles.statusName} />
        </View>
    );
};

/**
 * Skeleton loader for horizontal status list
 */
export const StatusListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
    return (
        <View style={styles.statusList}>
            {Array.from({ length: count }).map((_, index) => (
                <StatusItemSkeleton key={index} />
            ))}
        </View>
    );
};

/**
 * Skeleton loader for media grid items
 */
export const MediaGridItemSkeleton: React.FC = () => {
    return <SkeletonLoader width={110} height={110} borderRadius={8} style={styles.mediaGridItem} />;
};

/**
 * Skeleton loader for media grid
 */
export const MediaGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
    return (
        <View style={styles.mediaGrid}>
            {Array.from({ length: count }).map((_, index) => (
                <MediaGridItemSkeleton key={index} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#E0E0E0',
        overflow: 'hidden',
    },
    shimmer: {
        width: '30%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    
    // Chat List Item
    chatListItem: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    chatListContent: {
        flex: 1,
        marginLeft: 12,
    },
    chatListName: {
        marginBottom: 6,
    },
    chatListMessage: {
        marginTop: 4,
    },
    chatListRight: {
        alignItems: 'flex-end',
    },
    chatListBadge: {
        marginTop: 8,
    },
    
    // Message Bubble
    messageBubble: {
        padding: 12,
        borderRadius: 8,
        marginVertical: 4,
        maxWidth: '70%',
    },
    messageBubbleLeft: {
        alignSelf: 'flex-start',
        marginRight: 'auto',
    },
    messageBubbleRight: {
        alignSelf: 'flex-end',
        marginLeft: 'auto',
    },
    messageSecondLine: {
        marginTop: 6,
    },
    messageList: {
        padding: 16,
    },
    
    // Contact List Item
    contactListItem: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    contactListContent: {
        flex: 1,
        marginLeft: 12,
    },
    contactListStatus: {
        marginTop: 6,
    },
    
    // Call History Item
    callHistoryItem: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    callHistoryContent: {
        flex: 1,
        marginLeft: 12,
    },
    callHistoryInfo: {
        marginTop: 6,
    },
    
    // Status Item
    statusItem: {
        alignItems: 'center',
        marginRight: 12,
    },
    statusName: {
        marginTop: 6,
    },
    statusList: {
        flexDirection: 'row',
        padding: 16,
    },
    
    // Media Grid
    mediaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 4,
    },
    mediaGridItem: {
        margin: 4,
    },
});
