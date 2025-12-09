import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatsListScreen } from '../screens/chats/ChatsListScreen';
import { StatusListScreen } from '../screens/status/StatusListScreen';
import { CallsListScreen } from '../screens/calls/CallsListScreen';
import { ContactsListScreen } from '../screens/contacts/ContactsListScreen';
import { SelectContactScreen } from '../screens/contacts/SelectContactScreen';
import { ChatScreen } from '../screens/chats/ChatScreen';
import { NewChatScreen } from '../screens/chats/NewChatScreen';
import { NewGroupParticipantsScreen } from '../screens/chats/NewGroupParticipantsScreen';
import { NewGroupInfoScreen } from '../screens/chats/NewGroupInfoScreen';
import { GroupInfoScreen } from '../screens/chats/GroupInfoScreen';
import { SearchMessagesScreen } from '../screens/chats/SearchMessagesScreen';
import { IncomingCallScreen } from '../screens/calls/IncomingCallScreen';
import { OutgoingCallScreen } from '../screens/calls/OutgoingCallScreen';
import { ActiveCallScreen } from '../screens/calls/ActiveCallScreen';

// Privacy Screens
import { LastSeenPrivacyScreen } from '../screens/privacy/LastSeenPrivacyScreen';
import { ProfilePhotoPrivacyScreen } from '../screens/privacy/ProfilePhotoPrivacyScreen';
import { AboutPrivacyScreen } from '../screens/privacy/AboutPrivacyScreen';
import { GroupsPrivacyScreen } from '../screens/privacy/GroupsPrivacyScreen';
import { LiveLocationPrivacyScreen } from '../screens/privacy/LiveLocationPrivacyScreen';
import { ReadReceiptsSettingsScreen } from '../screens/privacy/ReadReceiptsSettingsScreen';
import { CallsPrivacyScreen } from '../screens/privacy/CallsPrivacyScreen';
import { StatusPrivacyScreen } from '../screens/settings/StatusPrivacyScreen';

// Security Screens
import { AppLockScreen } from '../screens/security/AppLockScreen';
import { FingerprintAuthScreen } from '../screens/security/FingerprintAuthScreen';
import { FaceIDAuthScreen } from '../screens/security/FaceIDAuthScreen';
import { SecurityNotificationsScreen } from '../screens/security/SecurityNotificationsScreen';
import { EncryptionInfoScreen } from '../screens/security/EncryptionInfoScreen';

// Account Screens
import { ChangeNumberScreen } from '../screens/account/ChangeNumberScreen';
import { DeleteAccountScreen } from '../screens/account/DeleteAccountScreen';
import { RequestAccountInfoScreen } from '../screens/account/RequestAccountInfoScreen';
import { DeactivateAccountScreen } from '../screens/account/DeactivateAccountScreen';
import { AccountActivityScreen } from '../screens/account/AccountActivityScreen';
import { VerifyAccountScreen } from '../screens/account/VerifyAccountScreen';

// Chat Feature Screens
import { CustomNotificationScreen } from '../screens/chats/CustomNotificationScreen';
import { ExportChatScreen } from '../screens/chats/ExportChatScreen';
import { ClearChatScreen } from '../screens/chats/ClearChatScreen';
import { DisappearingMessagesScreen } from '../screens/chats/DisappearingMessagesScreen';
import { MessageTimerScreen } from '../screens/chats/MessageTimerScreen';
import { ChatBackgroundScreen } from '../screens/chats/ChatBackgroundScreen';
import { ChatThemeScreen } from '../screens/chats/ChatThemeScreen';
import { ArchivedChatsScreen } from '../screens/chats/ArchivedChatsScreen';
import { StarredMessagesScreen } from '../screens/chats/StarredMessagesScreen';
import { ChatWallpaperScreen } from '../screens/chats/ChatWallpaperScreen';
import { ChatLabelsScreen } from '../screens/chats/ChatLabelsScreen';
import { MuteChatScreen } from '../screens/chats/MuteChatScreen';
import { PinChatScreen } from '../screens/chats/PinChatScreen';
import { MediaLinksScreen } from '../screens/chats/MediaLinksScreen';
import { LiveLocationScreen } from '../screens/chats/LiveLocationScreen';
import { ForwardMessageScreen } from '../screens/chats/ForwardMessageScreen';
import { CreatePollScreen } from '../screens/chats/CreatePollScreen';
import { ViewPollScreen } from '../screens/chats/ViewPollScreen';
import { BroadcastListScreen } from '../screens/chats/BroadcastListScreen';
import { MessageRequestsScreen } from '../screens/chats/MessageRequestsScreen';
import { SearchAllChatsScreen } from '../screens/chats/SearchAllChatsScreen';

// Group Management Screens
import { GroupPermissionsScreen } from '../screens/chats/GroupPermissionsScreen';
import { GroupSettingsScreen } from '../screens/chats/GroupSettingsScreen';
import { GroupDescriptionScreen } from '../screens/chats/GroupDescriptionScreen';
import { ManageGroupAdminsScreen } from '../screens/chats/ManageGroupAdminsScreen';
import { GroupInviteLinkScreen } from '../screens/chats/GroupInviteLinkScreen';
import { ReportGroupScreen } from '../screens/chats/ReportGroupScreen';
import { GroupAdminScreen } from '../screens/chats/GroupAdminScreen';
import { AddGroupMembersScreen } from '../screens/chats/AddGroupMembersScreen';

// Storage Screens
import { StorageBreakdownScreen } from '../screens/settings/StorageBreakdownScreen';
import { ManageMediaScreen } from '../screens/settings/ManageMediaScreen';
import { CacheManagementScreen } from '../screens/settings/CacheManagementScreen';

// Status Screens
import { MutedStatusUpdatesScreen } from '../screens/status/MutedStatusUpdatesScreen';
import { StatusRepliesScreen } from '../screens/status/StatusRepliesScreen';

// Business Screens
import { BusinessToolsScreen } from '../screens/business/BusinessToolsScreen';
import { BusinessStatisticsScreen } from '../screens/business/BusinessStatisticsScreen';
import { QuickRepliesScreen } from '../screens/business/QuickRepliesScreen';

// Community Screens
import { CreateCommunityScreen } from '../screens/communities/CreateCommunityScreen';
import { CommunityInfoScreen } from '../screens/communities/CommunityInfoScreen';
import { CommunitySettingsScreen } from '../screens/communities/CommunitySettingsScreen';

// Device Screens
import { LinkedDevicesDetailScreen } from '../screens/settings/LinkedDevicesDetailScreen';
import { LinkNewDeviceScreen } from '../screens/settings/LinkNewDeviceScreen';

// Contact Screens
import { ContactProfileScreen } from '../screens/contacts/ContactProfileScreen';
import { ReportContactScreen } from '../screens/contacts/ReportContactScreen';
import { BlockContactScreen } from '../screens/contacts/BlockContactScreen';

// Settings Hub Screens
import { PrivacySettingsScreen } from '../screens/settings/PrivacySettingsScreen';
import { SecuritySettingsScreen } from '../screens/settings/SecuritySettingsScreen';
import { AccountSettingsScreen } from '../screens/settings/AccountSettingsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { BlockedContactsScreen } from '../screens/settings/BlockedContactsScreen';
import { TwoStepVerificationScreen } from '../screens/settings/TwoStepVerificationScreen';
import { EditProfileScreen } from '../screens/settings/EditProfileScreen';
import { ChatSettingsScreen } from '../screens/settings/ChatSettingsScreen';
import { HelpSupportScreen } from '../screens/settings/HelpSupportScreen';
import { NotificationSettingsScreen } from '../screens/settings/NotificationSettingsScreen';
import { StorageSettingsScreen } from '../screens/settings/StorageSettingsScreen';
import { DataUsageScreen } from '../screens/settings/DataUsageScreen';
import { AboutScreen } from '../screens/settings/AboutScreen';
import { ThemeSettingsScreen } from '../screens/settings/ThemeSettingsScreen';
import { WallpaperSettingsScreen } from '../screens/settings/WallpaperSettingsScreen';
import { FontSizeSettingsScreen } from '../screens/settings/FontSizeSettingsScreen';
import { BackupSettingsScreen } from '../screens/settings/BackupSettingsScreen';

import { COLORS } from '../utils/constants';
import { IconButton, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ChatStackMenu = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();

    return (
        <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
                <IconButton
                    icon="dots-vertical"
                    iconColor="#fff"
                    onPress={() => setMenuVisible(true)}
                />
            }
            contentStyle={{ backgroundColor: '#fff' }}
        >
            <Menu.Item
                onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('NewGroupParticipants');
                }}
                title="New group"
                leadingIcon="account-group"
            />
            <Menu.Item
                onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('NewChat');
                }}
                title="New chat"
                leadingIcon="message-plus"
            />
            <Menu.Item
                onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('BroadcastList');
                }}
                title="New broadcast"
                leadingIcon="bullhorn"
            />
            <Menu.Item
                onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('StarredMessages');
                }}
                title="Starred messages"
                leadingIcon="star"
            />
            <Menu.Item
                onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('ArchivedChats');
                }}
                title="Archived"
                leadingIcon="archive"
            />
            <Menu.Item
                onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('MessageRequests');
                }}
                title="Message requests"
                leadingIcon="message-alert"
            />
            <Menu.Item
                onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('Settings');
                }}
                title="Settings"
                leadingIcon="cog"
            />
            <Menu.Item
                onPress={() => {
                    setMenuVisible(false);
                    Alert.alert(
                        'Logout',
                        'Are you sure you want to logout?',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Logout',
                                style: 'destructive',
                                onPress: () => dispatch(logout())
                            },
                        ]
                    );
                }}
                title="Logout"
                leadingIcon="logout"
            />
        </Menu>
    );
};

const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            Alert.alert('Success', 'Photo taken! Upload feature coming soon.');
        }
    } else {
        Alert.alert('Permission Required', 'Camera permission is required');
    }
};

const handleSearch = (navigation: any) => {
    navigation.navigate('SearchMessages', { conversationId: 'all' });
};

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="ChatsList"
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: '#8696A0',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5E5',
                    height: Platform.OS === 'ios' ? 85 : 65,
                    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
                    paddingTop: 8,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: -4,
                },
                headerStyle: {
                    backgroundColor: COLORS.primary,
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    height: Platform.OS === 'ios' ? 110 : 56,
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 20,
                },
            }}
        >
            <Tab.Screen
                name="ChatsList"
                component={ChatsListScreen}
                options={({ navigation }) => ({
                    title: 'WhatsApp',
                    tabBarIcon: ({ color, size }) => (
                        <IconButton icon="forum" iconColor={color} size={size - 6} style={{ margin: 0 }} />
                    ),
                    tabBarLabel: 'Chats',
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', marginRight: -8 }}>
                            <IconButton
                                icon="camera-outline"
                                iconColor="#fff"
                                size={24}
                                onPress={handleCamera}
                            />
                            <IconButton
                                icon="magnify"
                                iconColor="#fff"
                                size={24}
                                onPress={() => handleSearch(navigation)}
                            />
                            <ChatStackMenu />
                        </View>
                    ),
                })}
            />
            <Tab.Screen
                name="Status"
                component={StatusListScreen}
                options={({ navigation }) => ({
                    title: 'WhatsApp',
                    tabBarIcon: ({ color, size }) => (
                        <IconButton icon="circle-slice-8" iconColor={color} size={size - 6} style={{ margin: 0 }} />
                    ),
                    tabBarLabel: 'Status',
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', marginRight: -8 }}>
                            <IconButton
                                icon="magnify"
                                iconColor="#fff"
                                size={24}
                                onPress={() => Alert.alert('Search', 'Search statuses')}
                            />
                            <ChatStackMenu />
                        </View>
                    ),
                })}
            />
            <Tab.Screen
                name="Calls"
                component={CallsListScreen}
                options={({ navigation }) => ({
                    title: 'WhatsApp',
                    tabBarIcon: ({ color, size }) => (
                        <IconButton icon="phone" iconColor={color} size={size - 6} style={{ margin: 0 }} />
                    ),
                    tabBarLabel: 'Calls',
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', marginRight: -8 }}>
                            <IconButton
                                icon="magnify"
                                iconColor="#fff"
                                size={24}
                                onPress={() => Alert.alert('Search', 'Search calls')}
                            />
                            <ChatStackMenu />
                        </View>
                    ),
                })}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <IconButton icon="cog" iconColor={color} size={size - 6} style={{ margin: 0 }} />
                    ),
                    tabBarLabel: 'Settings',
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                    headerTintColor: '#fff',
                }}
            />
        </Tab.Navigator>
    );
};

export const MainNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Stack.Screen
                name="MainTabs"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Chat"
                component={ChatScreen}
            />
            <Stack.Screen
                name="NewChat"
                component={ContactsListScreen}
                options={{
                    title: 'Select Contact',
                }}
            />
            <Stack.Screen
                name="NewGroupParticipants"
                component={NewGroupParticipantsScreen}
                options={{
                    title: 'New Group',
                }}
            />
            <Stack.Screen
                name="NewGroupInfo"
                component={NewGroupInfoScreen}
                options={{
                    title: 'New Group',
                }}
            />
            <Stack.Screen
                name="GroupInfo"
                component={GroupInfoScreen}
                options={{
                    title: 'Group Info',
                }}
            />
            <Stack.Screen
                name="SearchMessages"
                component={SearchMessagesScreen}
                options={{
                    title: 'Search',
                }}
            />
            <Stack.Screen
                name="IncomingCall"
                component={IncomingCallScreen}
                options={{
                    headerShown: false,
                    presentation: 'fullScreenModal',
                }}
            />
            <Stack.Screen
                name="OutgoingCall"
                component={OutgoingCallScreen}
                options={{
                    headerShown: false,
                    presentation: 'fullScreenModal',
                }}
            />
            <Stack.Screen
                name="ActiveCall"
                component={ActiveCallScreen}
                options={{
                    headerShown: false,
                    presentation: 'fullScreenModal',
                    gestureEnabled: false,
                }}
            />

            {/* Settings Hub Screens */}
            <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} options={{ title: 'Privacy' }} />
            <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} options={{ title: 'Security' }} />
            <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ title: 'Account' }} />
            <Stack.Screen name="ProfileSettings" component={EditProfileScreen} options={{ title: 'Profile' }} />
            <Stack.Screen name="ChatSettings" component={ChatSettingsScreen} options={{ title: 'Chats' }} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: 'Notifications' }} />
            <Stack.Screen name="StorageSettings" component={StorageSettingsScreen} options={{ title: 'Storage and Data' }} />
            <Stack.Screen name="BackupSettings" component={BackupSettingsScreen} options={{ title: 'Backup' }} />
            <Stack.Screen name="DataUsage" component={DataUsageScreen} options={{ title: 'Data Usage' }} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ title: 'Help' }} />
            <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />

            {/* Privacy Screens */}
            <Stack.Screen name="LastSeenPrivacy" component={LastSeenPrivacyScreen} options={{ title: 'Last Seen' }} />
            <Stack.Screen name="ProfilePhotoPrivacy" component={ProfilePhotoPrivacyScreen} options={{ title: 'Profile Photo' }} />
            <Stack.Screen name="AboutPrivacy" component={AboutPrivacyScreen} options={{ title: 'About' }} />
            <Stack.Screen name="GroupsPrivacy" component={GroupsPrivacyScreen} options={{ title: 'Groups' }} />
            <Stack.Screen name="LiveLocationPrivacy" component={LiveLocationPrivacyScreen} options={{ title: 'Live Location' }} />
            <Stack.Screen name="ReadReceiptsSettings" component={ReadReceiptsSettingsScreen} options={{ title: 'Read Receipts' }} />
            <Stack.Screen name="CallsPrivacy" component={CallsPrivacyScreen} options={{ title: 'Calls' }} />
            <Stack.Screen name="StatusPrivacy" component={StatusPrivacyScreen} options={{ title: 'Status Privacy' }} />
            <Stack.Screen name="BlockedContacts" component={BlockedContactsScreen} options={{ title: 'Blocked Contacts' }} />

            {/* Security Screens */}
            <Stack.Screen name="AppLock" component={AppLockScreen} options={{ title: 'App Lock' }} />
            <Stack.Screen name="FingerprintAuth" component={FingerprintAuthScreen} options={{ title: 'Fingerprint' }} />
            <Stack.Screen name="FaceIDAuth" component={FaceIDAuthScreen} options={{ title: 'Face ID' }} />
            <Stack.Screen name="SecurityNotifications" component={SecurityNotificationsScreen} options={{ title: 'Security Notifications' }} />
            <Stack.Screen name="EncryptionInfo" component={EncryptionInfoScreen} options={{ title: 'Encryption' }} />
            <Stack.Screen name="TwoStepVerification" component={TwoStepVerificationScreen} options={{ title: 'Two-Step Verification' }} />

            {/* Account Screens */}
            <Stack.Screen name="ChangeNumber" component={ChangeNumberScreen} options={{ title: 'Change Number' }} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ title: 'Delete Account' }} />
            <Stack.Screen name="RequestAccountInfo" component={RequestAccountInfoScreen} options={{ title: 'Request Account Info' }} />
            <Stack.Screen name="DeactivateAccount" component={DeactivateAccountScreen} options={{ title: 'Deactivate Account' }} />
            <Stack.Screen name="AccountActivity" component={AccountActivityScreen} options={{ title: 'Account Activity' }} />
            <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} options={{ title: 'Verify Account' }} />

            {/* Chat Feature Screens */}
            <Stack.Screen name="CustomNotification" component={CustomNotificationScreen} options={{ title: 'Custom Notifications' }} />
            <Stack.Screen name="ExportChat" component={ExportChatScreen} options={{ title: 'Export Chat' }} />
            <Stack.Screen name="ClearChat" component={ClearChatScreen} options={{ title: 'Clear Chat' }} />
            <Stack.Screen name="DisappearingMessages" component={DisappearingMessagesScreen} options={{ title: 'Disappearing Messages' }} />
            <Stack.Screen name="MessageTimer" component={MessageTimerScreen} options={{ title: 'Message Timer' }} />
            <Stack.Screen name="ChatBackground" component={ChatBackgroundScreen} options={{ title: 'Chat Background' }} />
            <Stack.Screen name="ChatTheme" component={ChatThemeScreen} options={{ title: 'Chat Theme' }} />
            <Stack.Screen name="ThemeSettings" component={ThemeSettingsScreen} options={{ title: 'Theme' }} />
            <Stack.Screen name="WallpaperSettings" component={WallpaperSettingsScreen} options={{ title: 'Wallpaper' }} />
            <Stack.Screen name="FontSizeSettings" component={FontSizeSettingsScreen} options={{ title: 'Font Size' }} />
            <Stack.Screen name="ArchivedChats" component={ArchivedChatsScreen} options={{ title: 'Archived Chats' }} />
            <Stack.Screen name="StarredMessages" component={StarredMessagesScreen} options={{ title: 'Starred Messages' }} />
            <Stack.Screen name="ChatWallpaper" component={ChatWallpaperScreen} options={{ title: 'Wallpaper' }} />
            <Stack.Screen name="ChatLabels" component={ChatLabelsScreen} options={{ title: 'Labels' }} />
            <Stack.Screen name="MuteChat" component={MuteChatScreen} options={{ title: 'Mute Notifications' }} />
            <Stack.Screen name="PinChat" component={PinChatScreen} options={{ title: 'Pin Chat' }} />
            <Stack.Screen name="MediaLinks" component={MediaLinksScreen} options={{ title: 'Media, Links, and Docs' }} />
            <Stack.Screen name="LiveLocation" component={LiveLocationScreen} options={{ title: 'Live Location' }} />
            <Stack.Screen name="ForwardMessage" component={ForwardMessageScreen} options={{ title: 'Forward To' }} />
            <Stack.Screen name="CreatePoll" component={CreatePollScreen} options={{ title: 'Create Poll' }} />
            <Stack.Screen name="ViewPoll" component={ViewPollScreen} options={{ title: 'Poll Results' }} />
            <Stack.Screen name="BroadcastList" component={BroadcastListScreen} options={{ title: 'Broadcast List' }} />
            <Stack.Screen name="MessageRequests" component={MessageRequestsScreen} options={{ title: 'Message Requests' }} />
            <Stack.Screen name="SearchAllChats" component={SearchAllChatsScreen} options={{ title: 'Search' }} />

            {/* Group Management Screens */}
            <Stack.Screen name="GroupPermissions" component={GroupPermissionsScreen} options={{ title: 'Group Permissions' }} />
            <Stack.Screen name="GroupSettings" component={GroupSettingsScreen} options={{ title: 'Group Settings' }} />
            <Stack.Screen name="GroupDescription" component={GroupDescriptionScreen} options={{ title: 'Group Description' }} />
            <Stack.Screen name="ManageGroupAdmins" component={ManageGroupAdminsScreen} options={{ title: 'Manage Admins' }} />
            <Stack.Screen name="GroupInviteLink" component={GroupInviteLinkScreen} options={{ title: 'Invite Link' }} />
            <Stack.Screen name="ReportGroup" component={ReportGroupScreen} options={{ title: 'Report Group' }} />
            <Stack.Screen name="GroupAdmin" component={GroupAdminScreen} options={{ title: 'Group Admin' }} />
            <Stack.Screen name="AddGroupMembers" component={AddGroupMembersScreen} options={{ title: 'Add Members' }} />

            {/* Storage Screens */}
            <Stack.Screen name="StorageBreakdown" component={StorageBreakdownScreen} options={{ title: 'Storage Usage' }} />
            <Stack.Screen name="ManageMedia" component={ManageMediaScreen} options={{ title: 'Manage Media' }} />
            <Stack.Screen name="CacheManagement" component={CacheManagementScreen} options={{ title: 'Cache Management' }} />

            {/* Status Screens */}
            <Stack.Screen name="MutedStatusUpdates" component={MutedStatusUpdatesScreen} options={{ title: 'Muted Status' }} />
            <Stack.Screen name="StatusReplies" component={StatusRepliesScreen} options={{ title: 'Status Replies' }} />

            {/* Business Screens */}
            <Stack.Screen name="BusinessTools" component={BusinessToolsScreen} options={{ title: 'Business Tools' }} />
            <Stack.Screen name="BusinessStatistics" component={BusinessStatisticsScreen} options={{ title: 'Statistics' }} />
            <Stack.Screen name="QuickReplies" component={QuickRepliesScreen} options={{ title: 'Quick Replies' }} />

            {/* Community Screens */}
            <Stack.Screen name="CreateCommunity" component={CreateCommunityScreen} options={{ title: 'Create Community' }} />
            <Stack.Screen name="CommunityInfo" component={CommunityInfoScreen} options={{ title: 'Community Info' }} />
            <Stack.Screen name="CommunitySettings" component={CommunitySettingsScreen} options={{ title: 'Community Settings' }} />

            {/* Device Screens */}
            <Stack.Screen name="LinkedDevicesDetail" component={LinkedDevicesDetailScreen} options={{ title: 'Linked Devices' }} />
            <Stack.Screen name="LinkNewDevice" component={LinkNewDeviceScreen} options={{ title: 'Link Device' }} />

            {/* Contact Screens */}
            <Stack.Screen name="ContactProfile" component={ContactProfileScreen} options={{ title: 'Contact Info' }} />
            <Stack.Screen name="ReportContact" component={ReportContactScreen} options={{ title: 'Report Contact' }} />
            <Stack.Screen name="BlockContact" component={BlockContactScreen} options={{ title: 'Block Contact' }} />
            <Stack.Screen name="SelectContact" component={SelectContactScreen} options={{ title: 'Select Contact' }} />
        </Stack.Navigator>
    );
};
