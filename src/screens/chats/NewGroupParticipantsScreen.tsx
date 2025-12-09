import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Searchbar, Avatar, ActivityIndicator, FAB, Text, IconButton } from 'react-native-paper';
import { userApi } from '../../api/endpoints/user';
import { User } from '../../types/models';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../utils/constants';

export const NewGroupParticipantsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();

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
            // Filter out already selected users from search results to avoid duplicates in list if needed
            // But usually we just show checkmark.
            setUsers(data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserSelection = (user: User) => {
        if (selectedUsers.find(u => u.id === user.id)) {
            setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleNext = () => {
        navigation.navigate('NewGroupInfo', { participants: selectedUsers });
    };

    const renderSelectedUser = (user: User) => (
        <View style={styles.selectedUserItem} key={user.id}>
            <Avatar.Image size={40} source={{ uri: user.avatarUrl || 'https://via.placeholder.com/40' }} />
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => toggleUserSelection(user)}
            >
                <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.selectedUserName} numberOfLines={1}>{user.name.split(' ')[0]}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {selectedUsers.length > 0 && (
                <View style={styles.selectedContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedList}>
                        {selectedUsers.map(renderSelectedUser)}
                    </ScrollView>
                </View>
            )}

            <Searchbar
                placeholder="Search users..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#25D366" />
                    <Text style={styles.loaderText}>Searching users...</Text>
                </View>
            ) : users.length > 0 ? (
                <FlatList
                    data={users}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => {
                        const isSelected = selectedUsers.some(u => u.id === item.id);
                        return (
                            <View style={styles.cardContainer}>
                                <TouchableOpacity
                                    style={[styles.userCard, isSelected && styles.selectedCard]}
                                    onPress={() => toggleUserSelection(item)}
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
                                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                                        {isSelected && (
                                            <IconButton icon="check" size={18} iconColor="#fff" style={{ margin: 0 }} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            ) : searchQuery.length > 2 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>🔍</Text>
                    <Text style={styles.emptyStateTitle}>No users found</Text>
                    <Text style={styles.emptyStateText}>Try a different search term</Text>
                </View>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>👥</Text>
                    <Text style={styles.emptyStateTitle}>Add Participants</Text>
                    <Text style={styles.emptyStateText}>Search for users to add to your group</Text>
                </View>
            )}

            {selectedUsers.length > 0 && (
                <FAB
                    style={styles.fab}
                    icon="arrow-right"
                    color="#fff"
                    label={`Next (${selectedUsers.length})`}
                    onPress={handleNext}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    searchBar: {
        margin: 16,
        backgroundColor: '#fff',
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
    selectedContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E9EDEF',
        paddingVertical: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    selectedList: {
        paddingHorizontal: 16,
    },
    selectedUserItem: {
        alignItems: 'center',
        marginRight: 12,
        width: 50,
    },
    selectedUserName: {
        fontSize: 10,
        marginTop: 4,
        textAlign: 'center',
        color: '#000',
    },
    removeButton: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#F44336',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        borderWidth: 2,
        borderColor: '#fff',
    },
    removeButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: -2,
    },
    listContainer: {
        padding: 20,
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
    selectedCard: {
        backgroundColor: 'rgba(37, 211, 102, 0.05)',
        borderWidth: 2,
        borderColor: '#25D366',
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
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#BDC3C7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#25D366',
        borderColor: '#25D366',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#25D366',
    },
});
