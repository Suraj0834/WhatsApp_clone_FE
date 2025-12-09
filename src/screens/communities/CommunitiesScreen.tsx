import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Searchbar, Avatar, IconButton, Chip } from 'react-native-paper';

interface Community {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    groupCount: number;
    icon: string;
    joined: boolean;
}

export const CommunitiesScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'joined'>('all');

    const [communities, setCommunities] = useState<Community[]>([
        {
            id: '1',
            name: 'Tech Enthusiasts',
            description: 'Community for technology lovers and professionals',
            memberCount: 1250,
            groupCount: 12,
            icon: '💻',
            joined: true,
        },
        {
            id: '2',
            name: 'Sports Fans United',
            description: 'Discuss all sports, games, and matches',
            memberCount: 850,
            groupCount: 8,
            icon: '⚽',
            joined: true,
        },
        {
            id: '3',
            name: 'Book Club',
            description: 'For book lovers and readers',
            memberCount: 420,
            groupCount: 5,
            icon: '📚',
            joined: false,
        },
        {
            id: '4',
            name: 'Fitness & Health',
            description: 'Share workouts, recipes, and wellness tips',
            memberCount: 680,
            groupCount: 7,
            icon: '💪',
            joined: false,
        },
        {
            id: '5',
            name: 'Travel Adventures',
            description: 'Explore the world together',
            memberCount: 920,
            groupCount: 10,
            icon: '✈️',
            joined: true,
        },
        {
            id: '6',
            name: 'Photography Hub',
            description: 'Share and learn photography',
            memberCount: 560,
            groupCount: 6,
            icon: '📷',
            joined: false,
        },
    ]);

    const filteredCommunities = communities.filter((community) => {
        const matchesSearch =
            community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            community.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || community.joined;
        return matchesSearch && matchesFilter;
    });

    const handleJoinCommunity = (communityId: string) => {
        const community = communities.find((c) => c.id === communityId);
        if (!community) return;

        if (community.joined) {
            Alert.alert(
                'Leave Community',
                `Leave ${community.name}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Leave',
                        style: 'destructive',
                        onPress: () => {
                            setCommunities(
                                communities.map((c) =>
                                    c.id === communityId ? { ...c, joined: false } : c
                                )
                            );
                            Alert.alert('Success', `Left ${community.name}`);
                        },
                    },
                ]
            );
        } else {
            Alert.alert(
                'Join Community',
                `Join ${community.name}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Join',
                        onPress: () => {
                            setCommunities(
                                communities.map((c) =>
                                    c.id === communityId ? { ...c, joined: true } : c
                                )
                            );
                            Alert.alert('Success', `Joined ${community.name}`);
                        },
                    },
                ]
            );
        }
    };

    const handleCommunityDetails = (community: Community) => {
        Alert.alert(
            community.name,
            `${community.description}\n\n${community.memberCount} members • ${community.groupCount} groups`,
            [
                { text: 'OK' },
                {
                    text: community.joined ? 'View Groups' : 'Join Community',
                    onPress: () => {
                        if (community.joined) {
                            Alert.alert('Groups', 'View all groups in this community');
                        } else {
                            handleJoinCommunity(community.id);
                        }
                    },
                },
            ]
        );
    };

    const handleCreateCommunity = () => {
        Alert.alert(
            'Create Community',
            'Create a new community to bring groups together',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Create', onPress: () => {} },
            ]
        );
    };

    const joinedCount = communities.filter((c) => c.joined).length;

    const renderCommunity = ({ item }: { item: Community }) => {
        return (
            <TouchableOpacity
                style={styles.communityCard}
                onPress={() => handleCommunityDetails(item)}
            >
                <View style={styles.communityHeader}>
                    <View style={styles.communityIcon}>
                        <Text style={styles.communityIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.communityInfo}>
                        <View style={styles.communityTitleRow}>
                            <Text style={styles.communityName}>{item.name}</Text>
                            {item.joined && (
                                <View style={styles.joinedBadge}>
                                    <Text style={styles.joinedText}>✓ Joined</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.communityDescription} numberOfLines={2}>
                            {item.description}
                        </Text>
                        <View style={styles.communityStats}>
                            <Text style={styles.statText}>
                                👥 {item.memberCount} members
                            </Text>
                            <Text style={styles.statDivider}>•</Text>
                            <Text style={styles.statText}>
                                💬 {item.groupCount} groups
                            </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        item.joined && styles.actionButtonJoined,
                    ]}
                    onPress={() => handleJoinCommunity(item.id)}
                >
                    <Text
                        style={[
                            styles.actionButtonText,
                            item.joined && styles.actionButtonTextJoined,
                        ]}
                    >
                        {item.joined ? 'Leave' : 'Join'}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Communities</Text>
                <Text style={styles.headerSubtitle}>
                    Organize related groups together
                </Text>
            </View>

            <Searchbar
                placeholder="Search communities"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchbar}
            />

            <View style={styles.filters}>
                <Chip
                    selected={filterType === 'all'}
                    onPress={() => setFilterType('all')}
                    style={styles.chip}
                >
                    All ({communities.length})
                </Chip>
                <Chip
                    selected={filterType === 'joined'}
                    onPress={() => setFilterType('joined')}
                    style={styles.chip}
                >
                    Joined ({joinedCount})
                </Chip>
            </View>

            <FlatList
                data={filteredCommunities}
                renderItem={renderCommunity}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>🏘️</Text>
                        <Text style={styles.emptyStateText}>No communities found</Text>
                    </View>
                }
            />

            <TouchableOpacity style={styles.fab} onPress={handleCreateCommunity}>
                <IconButton icon="plus" size={28} iconColor="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        backgroundColor: '#F7F8FA',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#667781',
    },
    searchbar: {
        marginHorizontal: 16,
        marginVertical: 16,
        backgroundColor: '#F7F8FA',
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    chip: {
        marginRight: 8,
    },
    list: {
        paddingBottom: 100,
    },
    communityCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    communityHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    communityIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    communityIconText: {
        fontSize: 32,
    },
    communityInfo: {
        flex: 1,
    },
    communityTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    communityName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        flex: 1,
    },
    joinedBadge: {
        backgroundColor: '#E7F5EC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    joinedText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#25D366',
    },
    communityDescription: {
        fontSize: 14,
        color: '#667781',
        marginBottom: 8,
        lineHeight: 20,
    },
    communityStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 13,
        color: '#667781',
    },
    statDivider: {
        fontSize: 13,
        color: '#667781',
        marginHorizontal: 8,
    },
    actionButton: {
        backgroundColor: '#25D366',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonJoined: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F44336',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    actionButtonTextJoined: {
        color: '#F44336',
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});
