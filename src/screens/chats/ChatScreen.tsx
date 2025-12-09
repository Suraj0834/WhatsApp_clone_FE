import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme, IconButton, Menu, Avatar, Badge, Chip, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchMessages } from '../../store/slices/chatSlice';
import { MessageBubble } from '../../components/MessageBubble';
import { socketService } from '../../services/socketService';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MessageComposer } from '../../components/MessageComposer';

const ChatHeader = ({ currentConversation, conversationId, navigation }: any) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const getOtherMember = () => {
        if (!currentConversation || currentConversation.type === 'group') return null;
        // Get the other member (not the current user)
        return currentConversation.members?.find((m: any) => m.id !== currentConversation.currentUserId) || currentConversation.members?.[0];
    };

    const handleVoiceCall = () => {
        const otherMember = getOtherMember();
        if (!otherMember) {
            Alert.alert('Error', 'Could not find conversation member');
            return;
        }

        Alert.alert(
            'Development Build Required',
            'Voice/Video calls require WebRTC which is not available in Expo Go. You need to create a development build to test calling features.\n\nRun: npx expo run:android or npx expo run:ios',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Continue Anyway',
                    onPress: () => {
                        navigation.navigate('OutgoingCall', {
                            callType: 'audio',
                            calleeIds: [otherMember.id],
                            calleeName: otherMember.name,
                            calleeAvatar: otherMember.avatarUrl,
                            conversationId,
                        });
                    }
                }
            ]
        );
    };

    const handleVideoCall = () => {
        const otherMember = getOtherMember();
        if (!otherMember) {
            Alert.alert('Error', 'Could not find conversation member');
            return;
        }

        Alert.alert(
            'Development Build Required',
            'Voice/Video calls require WebRTC which is not available in Expo Go. You need to create a development build to test calling features.\n\nRun: npx expo run:android or npx expo run:ios',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Continue Anyway',
                    onPress: () => {
                        navigation.navigate('OutgoingCall', {
                            callType: 'video',
                            calleeIds: [otherMember.id],
                            calleeName: otherMember.name,
                            calleeAvatar: otherMember.avatarUrl,
                            conversationId,
                        });
                    }
                }
            ]
        );
    };

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <View style={styles.headerRight}>
            {currentConversation?.type !== 'group' && (
                <>
                    <IconButton
                        icon="phone"
                        iconColor="#fff"
                        size={22}
                        onPress={handleVoiceCall}
                        style={styles.headerButton}
                    />
                    <IconButton
                        icon="video"
                        iconColor="#fff"
                        size={22}
                        onPress={handleVideoCall}
                        style={styles.headerButton}
                    />
                </>
            )}

            {currentConversation?.type === 'group' ? (
                <>
                    <IconButton
                        icon="phone"
                        iconColor="#fff"
                        size={22}
                        onPress={handleVoiceCall}
                        style={styles.headerButton}
                    />
                    <IconButton
                        icon="video"
                        iconColor="#fff"
                        size={22}
                        onPress={handleVideoCall}
                        style={styles.headerButton}
                    />
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <IconButton
                                icon="dots-vertical"
                                iconColor="#fff"
                                size={22}
                                onPress={openMenu}
                                style={styles.headerButton}
                            />
                        }
                        anchorPosition="bottom"
                        contentStyle={styles.menuContent}
                    >
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('GroupInfo', { conversationId });
                            }}
                            title="Group info"
                            leadingIcon="information"
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('SearchMessages', { conversationId });
                            }}
                            title="Search"
                            leadingIcon="magnify"
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('MediaLinks', { conversationId });
                            }}
                            title="Media, links & docs"
                            leadingIcon="image-multiple"
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('StarredMessages', { conversationId });
                            }}
                            title="Starred messages"
                            leadingIcon="star"
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('MuteChat', { conversationId });
                            }}
                            title="Mute notifications"
                            leadingIcon="volume-off"
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('ChatWallpaper', { conversationId });
                            }}
                            title="Wallpaper"
                            leadingIcon="image"
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('DisappearingMessages', { conversationId });
                            }}
                            title="Disappearing messages"
                            leadingIcon="timer-sand"
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('LiveLocation', { conversationId });
                            }}
                            title="Live location"
                            leadingIcon="map-marker"
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('GroupAdmin', { conversationId });
                            }}
                            title="Group settings"
                            leadingIcon="cog"
                        />
                        <Divider />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('ExportChat', { conversationId });
                            }}
                            title="Export chat"
                            leadingIcon="export"
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('ClearChat', { conversationId });
                            }}
                            title="Clear chat"
                            leadingIcon="broom"
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate('ReportGroup', { conversationId });
                            }}
                            title="Report group"
                            leadingIcon="alert-circle"
                            titleStyle={{ color: '#d32f2f' }}
                        />
                    </Menu>
                </>
            ) : (
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={
                        <IconButton
                            icon="dots-vertical"
                            iconColor="#fff"
                            size={22}
                            onPress={openMenu}
                            style={styles.headerButton}
                        />
                    }
                    anchorPosition="bottom"
                    contentStyle={styles.menuContent}
                >
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('ContactProfile', { conversationId });
                        }}
                        title="View contact"
                        leadingIcon="account"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('SearchMessages', { conversationId });
                        }}
                        title="Search"
                        leadingIcon="magnify"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('MediaLinks', { conversationId });
                        }}
                        title="Media, links & docs"
                        leadingIcon="image-multiple"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('StarredMessages', { conversationId });
                        }}
                        title="Starred messages"
                        leadingIcon="star"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('MuteChat', { conversationId });
                        }}
                        title="Mute notifications"
                        leadingIcon="volume-off"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('ChatWallpaper', { conversationId });
                        }}
                        title="Wallpaper"
                        leadingIcon="image"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('DisappearingMessages', { conversationId });
                        }}
                        title="Disappearing messages"
                        leadingIcon="timer-sand"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('LiveLocation', { conversationId });
                        }}
                        title="Live location"
                        leadingIcon="map-marker"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('CustomNotification', { conversationId });
                        }}
                        title="Custom notifications"
                        leadingIcon="bell"
                    />
                    <Divider />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('ExportChat', { conversationId });
                        }}
                        title="Export chat"
                        leadingIcon="export"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('ClearChat', { conversationId });
                        }}
                        title="Clear chat"
                        leadingIcon="broom"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            const otherMember = getOtherMember();
                            navigation.navigate('ReportContact', {
                                conversationId,
                                contactName: otherMember?.name || 'Contact',
                                contactId: otherMember?.id,
                            });
                        }}
                        title="Report"
                        leadingIcon="alert-circle"
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            const otherMember = getOtherMember();
                            navigation.navigate('BlockContact', {
                                conversationId,
                                contactName: otherMember?.name || 'Contact',
                                contactId: otherMember?.id,
                            });
                        }}
                        title="Block"
                        leadingIcon="block-helper"
                        titleStyle={{ color: '#d32f2f' }}
                    />
                </Menu>
            )}
        </View>
    );
};

export const ChatScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { conversationId } = route.params;
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();
    const { messages, isLoading, hasMoreMessages, typingUsers, currentConversation } = useSelector((state: RootState) => state.chat);
    const { user } = useSelector((state: RootState) => state.auth);
    const flatListRef = useRef<FlatList>(null);
    const [replyingTo, setReplyingTo] = useState<any | null>(null);
    const [editingMessage, setEditingMessage] = useState<any | null>(null);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <ChatHeader
                    currentConversation={currentConversation}
                    conversationId={conversationId}
                    navigation={navigation}
                />
            ),
            title: currentConversation?.type === 'group' ? currentConversation.title : route.params.title,
        });
    }, [navigation, currentConversation, conversationId]);

    useEffect(() => {
        loadMessages();
        socketService.joinConversation(conversationId);

        return () => {
            socketService.leaveConversation(conversationId);
        };
    }, [conversationId]);

    useEffect(() => {
        // Mark unread messages as read
        const unreadMessageIds = messages
            .filter(m => m.senderId !== user?.id && m.status !== 'read')
            .map(m => m.id);

        if (unreadMessageIds.length > 0) {
            socketService.markMessagesAsRead(conversationId, unreadMessageIds);
        }
    }, [messages, conversationId]);

    const loadMessages = async () => {
        await dispatch(fetchMessages({ conversationId }));
    };

    const handleReply = (message: any) => {
        setReplyingTo(message);
        setEditingMessage(null);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
    };

    const handleEdit = (message: any) => {
        setEditingMessage(message);
        setReplyingTo(null);
    };

    const handleCancelEdit = () => {
        setEditingMessage(null);
    };

    const renderItem = ({ item }: { item: any }) => {
        const isOwn = item.senderId === user?.id || (typeof item.senderId === 'object' && item.senderId._id === user?.id);
        let senderName;
        if (!isOwn && currentConversation?.type === 'group') {
            const senderId = typeof item.senderId === 'object' ? item.senderId._id : item.senderId;
            const member = currentConversation.members.find((m: any) => (m._id || m.id) === senderId);
            senderName = member?.name;
        }

        return (
            <MessageBubble
                message={item}
                isOwn={isOwn}
                senderName={senderName}
                onReply={handleReply}
                onEdit={handleEdit}
            />
        );
    };

    const isTyping = typingUsers.length > 0;

    const handleForwardMessages = () => {
        if (selectedMessages.length > 0) {
            navigation.navigate('ForwardMessage', {
                messageIds: selectedMessages,
                conversationId
            });
            setSelectedMessages([]);
        }
    };

    const handleDeleteMessages = () => {
        if (selectedMessages.length > 0) {
            Alert.alert(
                'Delete messages',
                `Delete ${selectedMessages.length} message${selectedMessages.length > 1 ? 's' : ''}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            // Implement delete logic here
                            setSelectedMessages([]);
                        }
                    }
                ]
            );
        }
    };

    const handleStarMessages = () => {
        if (selectedMessages.length > 0) {
            // Implement star logic here
            Alert.alert('Success', `${selectedMessages.length} message${selectedMessages.length > 1 ? 's' : ''} starred`);
            setSelectedMessages([]);
        }
    };

    return (
        <View style={styles.container}>
            {/* Quick Actions Bar - New Feature */}
            {showQuickActions && (
                <View style={styles.quickActionsBar}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsContent}>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => {
                                navigation.navigate('CreatePoll', { conversationId });
                                setShowQuickActions(false);
                            }}
                        >
                            <IconButton icon="poll" size={20} iconColor="#25D366" />
                            <Text style={styles.quickActionText}>Poll</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => {
                                navigation.navigate('LiveLocation', { conversationId });
                                setShowQuickActions(false);
                            }}
                        >
                            <IconButton icon="map-marker" size={20} iconColor="#25D366" />
                            <Text style={styles.quickActionText}>Location</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => {
                                navigation.navigate('SelectContact', {
                                    mode: 'share',
                                    conversationId,
                                });
                                setShowQuickActions(false);
                            }}
                        >
                            <IconButton icon="account" size={20} iconColor="#25D366" />
                            <Text style={styles.quickActionText}>Contact</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => {
                                navigation.navigate('SearchMessages', { conversationId });
                                setShowQuickActions(false);
                            }}
                        >
                            <IconButton icon="magnify" size={20} iconColor="#25D366" />
                            <Text style={styles.quickActionText}>Search</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => {
                                navigation.navigate('MediaLinks', { conversationId });
                                setShowQuickActions(false);
                            }}
                        >
                            <IconButton icon="image-multiple" size={20} iconColor="#25D366" />
                            <Text style={styles.quickActionText}>Media</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeQuickActions}
                        onPress={() => setShowQuickActions(false)}
                    >
                        <IconButton icon="close" size={18} iconColor="#666" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Selection Actions Bar - New Feature */}
            {selectedMessages.length > 0 && (
                <View style={styles.selectionBar}>
                    <Text style={styles.selectionCount}>{selectedMessages.length} selected</Text>
                    <View style={styles.selectionActions}>
                        <IconButton
                            icon="star-outline"
                            size={22}
                            iconColor="#fff"
                            onPress={handleStarMessages}
                        />
                        <IconButton
                            icon="share"
                            size={22}
                            iconColor="#fff"
                            onPress={handleForwardMessages}
                        />
                        <IconButton
                            icon="delete-outline"
                            size={22}
                            iconColor="#fff"
                            onPress={handleDeleteMessages}
                        />
                        <IconButton
                            icon="close"
                            size={22}
                            iconColor="#fff"
                            onPress={() => setSelectedMessages([])}
                        />
                    </View>
                </View>
            )}

            {/* Chat Info Banner - New Feature */}
            {(currentConversation as any)?.encrypted && (
                <View style={styles.encryptionBanner}>
                    <IconButton icon="lock" size={14} iconColor="#666" style={styles.bannerIcon} />
                    <Text style={styles.bannerText}>
                        Messages are end-to-end encrypted
                    </Text>
                </View>
            )}

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                inverted={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onEndReached={() => {
                    if (hasMoreMessages && !isLoading) {
                        dispatch(fetchMessages({ conversationId, before: messages[0]?.id }));
                    }
                }}
                onEndReachedThreshold={0.1}
            />
            {isTyping && (
                <View style={styles.typingIndicator}>
                    <View style={styles.typingDots}>
                        <View style={[styles.typingDot, styles.typingDot1]} />
                        <View style={[styles.typingDot, styles.typingDot2]} />
                        <View style={[styles.typingDot, styles.typingDot3]} />
                    </View>
                    <Text style={styles.typingText}>
                        {typingUsers.length === 1 ? `${typingUsers[0]} is typing` : `${typingUsers.length} people are typing`}
                    </Text>
                </View>
            )}
            
            {/* Scroll to Bottom FAB - New Feature */}
            {messages.length > 20 && (
                <TouchableOpacity
                    style={styles.scrollToBottomButton}
                    onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
                >
                    <IconButton icon="chevron-down" size={24} iconColor="#fff" />
                </TouchableOpacity>
            )}
            
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <MessageComposer
                    conversationId={conversationId}
                    replyingTo={replyingTo}
                    onCancelReply={handleCancelReply}
                    editingMessage={editingMessage}
                    onCancelEdit={handleCancelEdit}
                    onToggleQuickActions={() => setShowQuickActions(!showQuickActions)}
                />
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECE5DD', // Modern WhatsApp background
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Platform.OS === 'ios' ? 0 : -8,
    },
    headerButton: {
        margin: 0,
    },
    menuContent: {
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'android' ? 45 : 40,
        borderRadius: 8,
        minWidth: 220,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    listContent: {
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    // Modern Typing Indicator
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    typingDots: {
        flexDirection: 'row',
        marginRight: 8,
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#25D366',
        marginHorizontal: 2,
    },
    typingDot1: {
        opacity: 0.4,
    },
    typingDot2: {
        opacity: 0.7,
    },
    typingDot3: {
        opacity: 1,
    },
    typingText: {
        fontSize: 13,
        color: '#666',
        fontStyle: 'italic',
    },
    // Quick Actions Bar
    quickActionsBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    quickActionsContent: {
        paddingHorizontal: 8,
    },
    quickActionButton: {
        alignItems: 'center',
        marginHorizontal: 8,
        paddingVertical: 4,
    },
    quickActionText: {
        fontSize: 11,
        color: '#666',
        marginTop: -4,
    },
    closeQuickActions: {
        justifyContent: 'center',
        paddingRight: 8,
    },
    // Selection Bar
    selectionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#25D366',
        paddingHorizontal: 16,
        paddingVertical: 8,
        elevation: 4,
    },
    selectionCount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    selectionActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // Encryption Banner
    encryptionBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF8DC',
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    bannerIcon: {
        margin: 0,
        marginRight: -8,
    },
    bannerText: {
        fontSize: 12,
        color: '#666',
    },
    // Scroll to Bottom Button
    scrollToBottomButton: {
        position: 'absolute',
        right: 20,
        bottom: 90,
        backgroundColor: '#25D366',
        borderRadius: 28,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 8,
        fontSize: 16,
        maxHeight: 100,
    },
});
