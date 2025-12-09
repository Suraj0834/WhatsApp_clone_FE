import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Searchbar, Text, ActivityIndicator, IconButton, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { searchMessages, clearSearchResults } from '../../store/slices/chatSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { COLORS } from '../../utils/constants';

export const SearchMessagesScreen = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { conversationId } = route.params;
    const { searchResults, isLoading } = useSelector((state: RootState) => state.chat);

    useEffect(() => {
        return () => {
            dispatch(clearSearchResults());
        };
    }, []);

    const handleSearch = () => {
        if (query.trim()) {
            dispatch(searchMessages({ conversationId, query: query.trim() }));
        }
    };

    const handleMessagePress = (messageId: string) => {
        // Navigate back to chat and scroll to message
        // For now, just navigate back. Implementing scroll to message requires more complex logic in ChatScreen
        navigation.navigate('Chat', { conversationId, initialMessageId: messageId });
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.messageCard} onPress={() => handleMessagePress(item.id)}>
                <View style={styles.messageHeader}>
                    <Avatar.Text
                        size={48}
                        label={item.senderId?.name?.charAt(0).toUpperCase() || '?'}
                        style={{ backgroundColor: '#25D366' }}
                    />
                    <View style={styles.messageInfo}>
                        <Text style={styles.senderName}>{item.senderId?.name || 'Unknown'}</Text>
                        <Text style={styles.timestamp}>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}</Text>
                    </View>
                    <IconButton icon="arrow-right" size={20} iconColor="#8696A0" />
                </View>
                <Text numberOfLines={3} style={styles.messageContent}>
                    {item.content}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
                    <IconButton icon="magnify" iconColor="#2196F3" size={32} />
                </View>
                <Text style={styles.headerTitle}>Search Messages</Text>
                <Text style={styles.headerSubtitle}>Find messages in this conversation</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search messages"
                    onChangeText={setQuery}
                    value={query}
                    onSubmitEditing={handleSearch}
                    style={styles.searchBar}
                    autoFocus
                />
            </View>

            {/* Results */}
            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color="#2196F3" size="large" />
                    <Text style={styles.loaderText}>Searching messages...</Text>
                </View>
            ) : (
                <FlatList
                    data={searchResults}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        query.trim() && !isLoading ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateIcon}>🔍</Text>
                                <Text style={styles.emptyStateTitle}>No messages found</Text>
                                <Text style={styles.emptyStateText}>
                                    Try searching with different keywords
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateIcon}>💬</Text>
                                <Text style={styles.emptyStateTitle}>Start Searching</Text>
                                <Text style={styles.emptyStateText}>
                                    Enter keywords to search messages
                                </Text>
                            </View>
                        )
                    }
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
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
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
    messageCard: {
        padding: 16,
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    messageInfo: {
        flex: 1,
        marginLeft: 12,
    },
    senderName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    timestamp: {
        fontSize: 12,
        color: '#8696A0',
    },
    messageContent: {
        fontSize: 14,
        color: '#667781',
        lineHeight: 20,
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    loaderText: {
        marginTop: 12,
        fontSize: 14,
        color: '#667781',
    },
    emptyState: {
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
