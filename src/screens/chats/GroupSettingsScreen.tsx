import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from '../../api/axios';

interface GroupSettings {
  muteNotifications: boolean;
  showNotifications: boolean;
  customNotifications: boolean;
  saveToGallery: boolean;
  disappearingMessages: boolean;
  disappearingDuration: string;
}

export const GroupSettingsScreen = () => {
  const route = useRoute<any>();
  const { groupId, groupName } = route.params || {};
  
  const [settings, setSettings] = useState<GroupSettings>({
    muteNotifications: false,
    showNotifications: true,
    customNotifications: false,
    saveToGallery: true,
    disappearingMessages: false,
    disappearingDuration: '7d',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/conversations/${groupId}/settings`);
      setSettings(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof GroupSettings, value: any) => {
    try {
      const updated = { ...settings, [key]: value };
      setSettings(updated);
      
      await axios.put(`/conversations/${groupId}/settings`, { [key]: value });
    } catch (error) {
      Alert.alert('Error', 'Failed to update setting');
      fetchSettings();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⚙️</Text>
        <Text style={styles.headerText}>Group Settings</Text>
        <Text style={styles.headerSubText}>{groupName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Mute Notifications</Text>
            <Text style={styles.settingDescription}>
              You won't receive notifications for this group
            </Text>
          </View>
          <Switch
            value={settings.muteNotifications}
            onValueChange={(value) => updateSetting('muteNotifications', value)}
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Show Notifications</Text>
            <Text style={styles.settingDescription}>
              Show message content in notifications
            </Text>
          </View>
          <Switch
            value={settings.showNotifications}
            onValueChange={(value) => updateSetting('showNotifications', value)}
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Custom Notifications</Text>
            <Text style={styles.settingDescription}>
              Use custom notification settings
            </Text>
          </View>
          <Switch
            value={settings.customNotifications}
            onValueChange={(value) => updateSetting('customNotifications', value)}
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Media</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Save to Gallery</Text>
            <Text style={styles.settingDescription}>
              Automatically save media to your gallery
            </Text>
          </View>
          <Switch
            value={settings.saveToGallery}
            onValueChange={(value) => updateSetting('saveToGallery', value)}
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Disappearing Messages</Text>
            <Text style={styles.settingDescription}>
              Messages disappear after {settings.disappearingDuration === '24h' ? '24 hours' : settings.disappearingDuration === '7d' ? '7 days' : '90 days'}
            </Text>
          </View>
          <Switch
            value={settings.disappearingMessages}
            onValueChange={(value) => updateSetting('disappearingMessages', value)}
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Note</Text>
        <Text style={styles.infoText}>
          Some settings can only be changed by group admins. Changes to group-wide settings like disappearing messages will affect all members.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  headerSubText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  infoBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d47a1',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0d47a1',
    lineHeight: 20,
  },
});
