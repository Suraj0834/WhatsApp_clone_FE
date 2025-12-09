import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { Searchbar, Avatar, ActivityIndicator, IconButton } from 'react-native-paper';
import { userApi } from '../../api/endpoints/user';
import { chatApi } from '../../api/endpoints/chat';
import { User } from '../../types/models';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store';
import { setCurrentConversation } from '../../store/slices/chatSlice';

export const NewChatScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (searchQuery.length > 2) {
            const delayDebounceFn = setTimeout(() => {
                searchUsers();
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setUsers([]);
        }
    }, [searchQuery]);

    const searchUsers = async () => {
        setLoading(true);
        try {
            const data = await userApi.searchUsers(searchQuery);
            setUsers(data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const startChat = async (user: User) => {
        try {
            const data = await chatApi.createConversation([user.id], 'direct');
            dispatch(setCurrentConversation(data.conversation));
            navigation.replace('Chat', {
                conversationId: data.conversation.id,
                title: user.name
            });
        } catch (error) {
            console.error(error);
        }
    };

    const renderUserCard = ({ item }: { item: User }) => (
        <View style={styles.cardContainer}>
            <TouchableOpacity
                style={styles.userCard}
                onPress={() => startChat(item)}
                activeOpacity={0.7}
            >
                <Avatar.Image
                    size={56}
                    source={{ uri: item.avatarUrl || `https://ui-avatars.com/api/?name=${item.name}&background=25D366&color=fff` }}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    {item.statusMessage && (
                        <Text style={styles.userStatus} numberOfLines={1}>
                            {item.statusMessage}
                        </Text>
                    )}
                </View>
                <IconButton icon="chat" size={24} iconColor="#25D366" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(37, 211, 102, 0.15)' }]}>
                    <IconButton icon="account-plus" iconColor="#25D366" size={32} />
                </View>
                <Text style={styles.headerTitle}>New Chat</Text>
                <Text style={styles.headerSubtitle}>
                    Search for users to start chatting
                </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search users by name..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    iconColor="#25D366"
                    placeholderTextColor="#8696A0"
                />
            </View>

            {/* New Group Card */}
            <View style={styles.section}>
                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.newGroupCard}
                        onPress={() => navigation.navigate('NewGroupParticipants')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.groupIconContainer, { backgroundColor: 'rgba(37, 211, 102, 0.15)' }]}>
                            <IconButton icon="account-group" iconColor="#25D366" size={28} />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>New Group</Text>
                            <Text style={styles.userStatus}>Create a group chat</Text>
                        </View>
                        <IconButton icon="chevron-right" size={24} iconColor="#8696A0" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Users List */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#25D366" />
                    <Text style={styles.loaderText}>Searching users...</Text>
                </View>
            ) : users.length > 0 ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Search Results</Text>
                    <FlatList
                        data={users}
                        keyExtractor={item => item.id}
                        renderItem={renderUserCard}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            ) : searchQuery.length > 2 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>🔍</Text>
                    <Text style={styles.emptyStateTitle}>No users found</Text>
                    <Text style={styles.emptyStateText}>
                        Try searching with a different name
                    </Text>
                </View>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>💬</Text>
                    <Text style={styles.emptyStateTitle}>Start Searching</Text>
                    <Text style={styles.emptyStateText}>
                        Enter at least 3 characters to search for users
                    </Text>
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
    section: {
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
        paddingHorizontal: 4,
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
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    newGroupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    groupIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userInfo: {
        flex: 1,
        marginLeft: 16,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    userStatus: {
        fontSize: 13,
        color: '#667781',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    loaderText: {
        fontSize: 15,
        color: '#8696A0',
        marginTop: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 40,
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
        textAlign: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 20,
    },
});
