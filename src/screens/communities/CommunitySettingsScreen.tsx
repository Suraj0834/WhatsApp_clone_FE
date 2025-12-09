import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import axios from '../../api/axios';

interface CommunitySettings {
  name: string;
  description: string;
  allowMemberInvites: boolean;
  requireAdminApproval: boolean;
  allowGroupCreation: boolean;
  showMemberCount: boolean;
}

export const CommunitySettingsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp<any>>();
  const { communityId } = route.params || {};
  
  const [settings, setSettings] = useState<CommunitySettings>({
    name: '',
    description: '',
    allowMemberInvites: true,
    requireAdminApproval: false,
    allowGroupCreation: false,
    showMemberCount: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/communities/${communityId}/settings`);
      setSettings(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      await axios.put(`/communities/${communityId}/settings`, settings);
      
      Alert.alert('Success', 'Settings updated', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const deleteCommunity = () => {
    Alert.alert(
      'Delete Community',
      'Are you sure? This will delete the community and remove all members. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`/communities/${communityId}`);
              Alert.alert('Success', 'Community deleted', [
                { text: 'OK', onPress: () => navigation.navigate('ChatsList') },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete community');
            }
          },
        },
      ]
    );
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
        <Text style={styles.headerText}>Community Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Community Name</Text>
          <TextInput
            style={styles.input}
            value={settings.name}
            onChangeText={(text) => setSettings({ ...settings, name: text })}
            maxLength={50}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={settings.description}
            onChangeText={(text) => setSettings({ ...settings, description: text })}
            multiline
            maxLength={200}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Permissions</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Allow Member Invites</Text>
            <Text style={styles.settingDescription}>
              Members can invite others to join
            </Text>
          </View>
          <Switch
            value={settings.allowMemberInvites}
            onValueChange={(value) =>
              setSettings({ ...settings, allowMemberInvites: value })
            }
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Require Admin Approval</Text>
            <Text style={styles.settingDescription}>
              New members must be approved by admins
            </Text>
          </View>
          <Switch
            value={settings.requireAdminApproval}
            onValueChange={(value) =>
              setSettings({ ...settings, requireAdminApproval: value })
            }
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Allow Group Creation</Text>
            <Text style={styles.settingDescription}>
              Members can create groups in this community
            </Text>
          </View>
          <Switch
            value={settings.allowGroupCreation}
            onValueChange={(value) =>
              setSettings({ ...settings, allowGroupCreation: value })
            }
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Show Member Count</Text>
            <Text style={styles.settingDescription}>
              Display total member count publicly
            </Text>
          </View>
          <Switch
            value={settings.showMemberCount}
            onValueChange={(value) =>
              setSettings({ ...settings, showMemberCount: value })
            }
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.buttonDisabled]}
        onPress={saveSettings}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Settings</Text>
        )}
      </TouchableOpacity>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>⚠️ Danger Zone</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={deleteCommunity}>
          <Text style={styles.deleteButtonText}>Delete Community</Text>
        </TouchableOpacity>
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
  inputContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    maxHeight: 120,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  saveButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#25D366',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerZone: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 12,
  },
  deleteButton: {
    padding: 12,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
