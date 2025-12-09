import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator } from 'react-native';
import axios from '../../api/axios';

export const SecurityNotificationsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [showSecurityNotifications, setShowSecurityNotifications] = useState(true);
  const [codeChangeAlerts, setCodeChangeAlerts] = useState(true);
  const [accountActivityAlerts, setAccountActivityAlerts] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/settings/security-notifications');
      setShowSecurityNotifications(response.data.showSecurityNotifications ?? true);
      setCodeChangeAlerts(response.data.codeChangeAlerts ?? true);
      setAccountActivityAlerts(response.data.accountActivityAlerts ?? true);
    } catch (error) {
      console.error('Error loading security notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: boolean) => {
    try {
      setSaving(true);
      await axios.put('/users/settings/security-notifications', {
        [key]: value,
      });
    } catch (error) {
      console.error('Error updating security notification setting:', error);
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
        <Text style={styles.headerText}>Security Notifications</Text>
        <Text style={styles.subHeaderText}>
          Get notified when security settings change
        </Text>
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Show Security Notifications</Text>
          <Text style={styles.settingDescription}>
            Get notified in chats when security code changes
          </Text>
        </View>
        <Switch
          value={showSecurityNotifications}
          onValueChange={(value) => {
            setShowSecurityNotifications(value);
            updateSetting('showSecurityNotifications', value);
          }}
          disabled={saving}
          trackColor={{ false: '#ccc', true: '#25D366' }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Security Code Changes</Text>
          <Text style={styles.settingDescription}>
            Get notified when a contact's security code changes
          </Text>
        </View>
        <Switch
          value={codeChangeAlerts}
          onValueChange={(value) => {
            setCodeChangeAlerts(value);
            updateSetting('codeChangeAlerts', value);
          }}
          disabled={saving}
          trackColor={{ false: '#ccc', true: '#25D366' }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Account Activity</Text>
          <Text style={styles.settingDescription}>
            Get notified of unusual account activity
          </Text>
        </View>
        <Switch
          value={accountActivityAlerts}
          onValueChange={(value) => {
            setAccountActivityAlerts(value);
            updateSetting('accountActivityAlerts', value);
          }}
          disabled={saving}
          trackColor={{ false: '#ccc', true: '#25D366' }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Why security notifications?</Text>
        <Text style={styles.infoText}>
          • Stay informed about changes to your security{'\n'}
          • Know when someone's security code changes{'\n'}
          • Get alerts for new device registrations{'\n'}
          • Be aware of suspicious account activity{'\n'}
          • Verify security codes after notifications
        </Text>
      </View>

      <View style={styles.encryptionBox}>
        <Text style={styles.encryptionIcon}>🔐</Text>
        <View style={styles.encryptionContent}>
          <Text style={styles.encryptionTitle}>End-to-end Encryption</Text>
          <Text style={styles.encryptionText}>
            All your messages are protected with end-to-end encryption. Security codes help verify encryption.
          </Text>
        </View>
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
    marginBottom: 8,
    color: '#333',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1b5e20',
    lineHeight: 22,
  },
  encryptionBox: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#fff9e6',
    borderRadius: 8,
    flexDirection: 'row',
  },
  encryptionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  encryptionContent: {
    flex: 1,
  },
  encryptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f57f17',
    marginBottom: 4,
  },
  encryptionText: {
    fontSize: 14,
    color: '#f57f17',
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
