import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator, Alert } from 'react-native';
import axios from '../../api/axios';

export const ReadReceiptsSettingsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/settings/read-receipts');
      setReadReceipts(response.data.readReceipts ?? true);
    } catch (error) {
      console.error('Error loading read receipts settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadReceipts = async (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Turn off read receipts?',
        'If you turn off read receipts, you won\'t be able to see read receipts from other people. Read receipts are always sent for group chats.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Turn Off',
            onPress: () => saveSettings(value),
          },
        ]
      );
    } else {
      saveSettings(value);
    }
  };

  const saveSettings = async (value: boolean) => {
    try {
      setSaving(true);
      await axios.put('/users/settings/read-receipts', {
        readReceipts: value,
      });
      setReadReceipts(value);
    } catch (error) {
      console.error('Error saving read receipts settings:', error);
      Alert.alert('Error', 'Failed to update settings');
    } finally {
      setSaving(false);
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
        <Text style={styles.headerText}>Read Receipts</Text>
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Read Receipts</Text>
          <Text style={styles.settingDescription}>
            Show blue ticks when you've read messages
          </Text>
        </View>
        <Switch
          value={readReceipts}
          onValueChange={toggleReadReceipts}
          disabled={saving}
          trackColor={{ false: '#ccc', true: '#25D366' }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>What happens when you turn this off?</Text>
        <Text style={styles.infoText}>
          • You won't send or receive read receipts{'\n'}
          • Blue ticks won't appear for messages you read{'\n'}
          • You won't see blue ticks for messages others read{'\n'}
          • Read receipts are always sent for group chats{'\n'}
          • Voice messages always show blue ticks
        </Text>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Turning off read receipts means you can't see when others have read your messages either.
        </Text>
      </View>

      {saving && (
        <View style={styles.savingIndicator}>
          <ActivityIndicator size="small" color="#25D366" />
          <Text style={styles.savingText}>Saving...</Text>
        </View>
      )}
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
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    lineHeight: 20,
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
    lineHeight: 22,
  },
  warningBox: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#e65100',
    lineHeight: 20,
  },
  savingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  savingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});
