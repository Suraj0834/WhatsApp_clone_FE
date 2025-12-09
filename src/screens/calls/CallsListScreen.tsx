import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { IconButton, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { COLORS, SPACING } from '../../utils/constants';
import { format } from 'date-fns';

interface CallLog {
    id: string;
    callerId: string;
    callerName: string;
    callerAvatar?: string;
    callType: 'audio' | 'video';
    status: 'missed' | 'answered' | 'declined' | 'outgoing';
    timestamp: Date;
    duration?: number;
}

export const CallsListScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    // Mock data - will be replaced with real API call
    const [calls, setCalls] = useState<CallLog[]>([
        // Sample data structure
    ]);

    const formatDuration = (seconds?: number) => {
        if (!seconds) return null;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTime = (timestamp: Date) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return format(date, 'HH:mm');
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return format(date, 'EEEE');
        } else {
            return format(date, 'dd/MM/yyyy');
        }
    };

    const getCallIcon = (call: CallLog) => {
        const isIncoming = call.status !== 'outgoing';
        const iconName = call.callType === 'video' ? 'video' : 'phone';

        if (call.status === 'missed') {
            return {
                name: `${iconName}-missed`,
                color: '#F44336',
            };
        } else if (isIncoming) {
            return {
                name: `${iconName}-incoming`,
                color: COLORS.primary,
            };
        } else {
            return {
                name: `${iconName}-outgoing`,
                color: COLORS.textSecondary,
            };
        }
    };

    const renderCallItem = ({ item }: { item: CallLog }) => {
        const callIcon = getCallIcon(item);
        const timeText = formatTime(item.timestamp);
        const duration = formatDuration(item.duration);

        return (
            <TouchableOpacity
                style={styles.callItem}
                onPress={() => {
                    // Navigate to call screen or show call details
                }}
            >
                <Image
                    source={{
                        uri: item.callerAvatar ||
                            `https://ui-avatars.com/api/?name=${item.callerName}&background=25D366&color=fff`
                    }}
                    style={styles.avatar}
                />
                <View style={styles.callInfo}>
                    <Text style={[
                        styles.callerName,
                        item.status === 'missed' && styles.missedCall
                    ]}>
                        {item.callerName}
                    </Text>
                    <View style={styles.callDetails}>
                        <IconButton
                            icon={callIcon.name}
                            size={16}
                            iconColor={callIcon.color}
                            style={styles.callTypeIcon}
                        />
                        <Text style={[
                            styles.callTime,
                            item.status === 'missed' && { color: '#F44336' }
                        ]}>
                            {timeText}
                            {duration && ` (${duration})`}
                        </Text>
                    </View>
                </View>
                <IconButton
                    icon={item.callType === 'video' ? 'video' : 'phone'}
                    size={24}
                    iconColor={COLORS.primary}
                    onPress={() => {
                        // Initiate call
                        console.log('Call', item.callerName);
                    }}
                />
            </TouchableOpacity>
        );
    };

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <IconButton
                icon="phone"
                size={80}
                iconColor="#E5E5E5"
            />
            <Text style={styles.emptyText}>No calls yet</Text>
            <Text style={styles.emptySubtext}>
                Your call history will appear here
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={calls}
                renderItem={renderCallItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={renderEmptyList}
                contentContainerStyle={calls.length === 0 && styles.emptyListContent}
            />
            <FAB
                style={[styles.fab, { backgroundColor: COLORS.primary }]}
                icon="phone-plus"
                color="white"
                label="New Call"
                onPress={() => navigation.navigate('NewChat')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    callItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    callInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    callerName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    missedCall: {
        color: '#F44336',
    },
    callDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    callTypeIcon: {
        margin: 0,
        padding: 0,
        marginRight: -8,
    },
    callTime: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyListContent: {
        flexGrow: 1,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '500',
        color: COLORS.textSecondary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
