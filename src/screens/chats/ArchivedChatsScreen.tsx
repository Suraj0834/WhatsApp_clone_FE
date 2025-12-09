import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Searchbar, Chip, Avatar, IconButton } from 'react-native-paper';

interface Contact {
    id: string;
    name: string;
    phoneNumber: string;
    avatar?: string;
}

export const ArchivedChatsScreen = () => {
    const [archivedChats, setArchivedChats] = useState<Contact[]>([
        { id: '1', name: 'John Doe', phoneNumber: '+1 234 567 8900' },
        { id: '2', name: 'Project Team', phoneNumber: 'Group • 12 participants' },
        { id: '3', name: 'Jane Smith', phoneNumber: '+1 234 567 8901' },
        { id: '4', name: 'Mike Johnson', phoneNumber: '+1 234 567 8902' },
        { id: '5', name: 'Family', phoneNumber: 'Group • 8 participants' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredChats = archivedChats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUnarchive = (chatId: string) => {
        setArchivedChats(prev => prev.filter(chat => chat.id !== chatId));
    };

    const renderChatItem = ({ item }: { item: Contact }) => (
        <View style={styles.cardContainer}>
            <TouchableOpacity
                style={styles.chatCard}
                onLongPress={() => handleUnarchive(item.id)}
                activeOpacity={0.7}
            >
                {item.avatar ? (
                    <Avatar.Image size={56} source={{ uri: item.avatar }} />
                ) : (
                    <Avatar.Text
                        size={56}
                        label={item.name.substring(0, 2).toUpperCase()}
                        style={styles.avatarPlaceholder}
                    />
                )}
                <View style={styles.chatInfo}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatMessage} numberOfLines={1}>
                        Tap and hold to unarchive
                    </Text>
                    <Text style={styles.chatTime}>Yesterday</Text>
                </View>
                <IconButton icon="archive-arrow-up" size={24} iconColor="#FF9800" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.15)' }]}>
                    <IconButton icon="archive" iconColor="#FF9800" size={32} />
                </View>
                <Text style={styles.headerTitle}>Archived Chats</Text>
                <Text style={styles.headerSubtitle}>
                    Chats stay archived when you get new messages
                </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search archived chats..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchBar}
                    iconColor="#FF9800"
                    placeholderTextColor="#8696A0"
                />
            </View>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Chip
                        selected
                        onPress={() => {}}
                        style={[styles.filterChip, styles.filterChipSelected]}
                        textStyle={styles.filterChipText}
                    >
                        All
                    </Chip>
                    <Chip
                        onPress={() => {}}
                        style={styles.filterChip}
                        textStyle={styles.filterChipTextInactive}
                    >
                        Unread
                    </Chip>
                    <Chip
                        onPress={() => {}}
                        style={styles.filterChip}
                        textStyle={styles.filterChipTextInactive}
                    >
                        Groups
                    </Chip>
                </ScrollView>
            </View>

            {filteredChats.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>📦</Text>
                    <Text style={styles.emptyStateTitle}>No archived chats</Text>
                    <Text style={styles.emptyStateText}>
                        {searchQuery ? 'No chats match your search' : 'Archive chats to keep your chat list organized'}
                    </Text>
                </View>
            ) : (
                <View style={styles.section}>
                    <FlatList
                        data={filteredChats}
                        renderItem={renderChatItem}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerCard: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    headerIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#667781',
        textAlign: 'center',
    },
    searchContainer: {
        padding: 20,
        paddingBottom: 12,
    },
    searchBar: {
        backgroundColor: '#fff',
        elevation: 0,
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    filterContainer: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    filterChip: {
        marginRight: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E9EDEF',
    },
    filterChipSelected: {
        backgroundColor: '#FF9800',
        borderColor: '#FF9800',
    },
    filterChipText: {
        color: '#fff',
        fontWeight: '600',
    },
    filterChipTextInactive: {
        color: '#667781',
    },
    section: {
        paddingHorizontal: 20,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    avatarPlaceholder: {
        backgroundColor: '#FF9800',
    },
    chatInfo: {
        flex: 1,
        marginLeft: 16,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    chatMessage: {
        fontSize: 14,
        color: '#667781',
        marginBottom: 4,
    },
    chatTime: {
        fontSize: 12,
        color: '#8696A0',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingTop: 60,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 20,
    },
});
