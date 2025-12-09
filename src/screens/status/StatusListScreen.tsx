import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';
import { FAB, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../../utils/constants';

interface Status {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    timestamp: Date;
    viewed: boolean;
    isMine: boolean;
}

export const StatusListScreen = () => {
    const navigation = useNavigation<any>();
    const [statuses, setStatuses] = useState<Status[]>([
        // Mock data - will be replaced with real data from backend
    ]);

    const myStatus = statuses.filter(s => s.isMine);
    const recentStatuses = statuses.filter(s => !s.isMine && !s.viewed);
    const viewedStatuses = statuses.filter(s => !s.isMine && s.viewed);

    const renderMyStatus = () => (
        <TouchableOpacity
            style={styles.myStatusContainer}
            onPress={() => Alert.alert('My Status', 'View your status updates')}
        >
            <View style={styles.statusAvatarContainer}>
                <Image
                    source={{ uri: 'https://ui-avatars.com/api/?name=You&background=25D366&color=fff' }}
                    style={styles.statusAvatar}
                />
                <View style={styles.addIconContainer}>
                    <Text style={styles.addIcon}>+</Text>
                </View>
            </View>
            <View style={styles.statusInfo}>
                <Text style={styles.statusName}>My status</Text>
                <Text style={styles.statusTime}>
                    {myStatus.length > 0 ? 'Tap to view updates' : 'Tap to add status update'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderStatusItem = ({ item }: { item: Status }) => {
        const timeDiff = Date.now() - new Date(item.timestamp).getTime();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const timeText = hours < 1 ? 'Just now' :
            hours < 24 ? `${hours}h ago` :
                `${Math.floor(hours / 24)}d ago`;

        return (
            <TouchableOpacity
                style={styles.statusItem}
                onPress={() => Alert.alert('Status', `View ${item.userName}'s status`)}
            >
                <View style={[
                    styles.statusAvatarBorder,
                    item.viewed && styles.statusAvatarBorderViewed
                ]}>
                    <Image
                        source={{
                            uri: item.userAvatar ||
                                `https://ui-avatars.com/api/?name=${item.userName}&background=25D366&color=fff`
                        }}
                        style={styles.statusAvatar}
                    />
                </View>
                <View style={styles.statusInfo}>
                    <Text style={styles.statusName}>{item.userName}</Text>
                    <Text style={styles.statusTime}>{timeText}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={
                    <>
                        {renderMyStatus()}
                        {recentStatuses.length > 0 && (
                            <>
                                <Divider />
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Recent updates</Text>
                                </View>
                            </>
                        )}
                    </>
                }
                data={recentStatuses}
                renderItem={renderStatusItem}
                keyExtractor={item => item.id}
                ListFooterComponent={
                    viewedStatuses.length > 0 ? (
                        <>
                            <Divider />
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Viewed updates</Text>
                            </View>
                            {viewedStatuses.map(item => (
                                <View key={item.id}>
                                    {renderStatusItem({ item })}
                                </View>
                            ))}
                        </>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No status updates</Text>
                        <Text style={styles.emptySubtext}>
                            Status updates from your contacts will appear here
                        </Text>
                    </View>
                }
            />
            <FAB
                style={[styles.fab, { backgroundColor: COLORS.primary }]}
                icon="camera"
                color="white"
                onPress={() => Alert.alert('Status', 'Create new status')}
            />
            <FAB
                style={[styles.fabPencil, { backgroundColor: COLORS.surface }]}
                icon="pencil"
                color={COLORS.textSecondary}
                small
                onPress={() => Alert.alert('Status', 'Create text status')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    myStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: '#fff',
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
    },
    statusAvatarContainer: {
        position: 'relative',
    },
    statusAvatarBorder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 3,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusAvatarBorderViewed: {
        borderColor: '#E5E5E5',
    },
    statusAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    addIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    addIcon: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    statusName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    statusTime: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    sectionHeader: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: '#F7F8FA',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    fabPencil: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 80,
    },
});
