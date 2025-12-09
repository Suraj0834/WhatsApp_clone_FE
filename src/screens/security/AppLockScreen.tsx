import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from '../../api/axios';

type LockTimeout = 'immediately' | '1min' | '30min';

export const AppLockScreen = () => {
  const [loading, setLoading] = useState(false);
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [lockTimeout, setLockTimeout] = useState<LockTimeout>('immediately');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    loadSettings();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setBiometricAvailable(compatible && enrolled);
      
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Fingerprint');
      } else {
        setBiometricType('Biometric');
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/settings/app-lock');
      setAppLockEnabled(response.data.appLockEnabled || false);
      setLockTimeout(response.data.lockTimeout || 'immediately');
    } catch (error) {
      console.error('Error loading app lock settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAppLock = async (value: boolean) => {
    if (value && biometricAvailable) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable App Lock',
        fallbackLabel: 'Use passcode',
      });

      if (!result.success) {
        Alert.alert('Authentication Failed', 'Please try again');
        return;
      }
    }

    try {
      setSaving(true);
      await axios.put('/users/settings/app-lock', {
        appLockEnabled: value,
        lockTimeout,
      });
      setAppLockEnabled(value);
    } catch (error) {
      console.error('Error toggling app lock:', error);
      Alert.alert('Error', 'Failed to update app lock settings');
    } finally {
      setSaving(false);
    }
  };

  const updateLockTimeout = async (timeout: LockTimeout) => {
    try {
      setSaving(true);
      await axios.put('/users/settings/app-lock', {
        appLockEnabled,
        lockTimeout: timeout,
      });
      setLockTimeout(timeout);
    } catch (error) {
      console.error('Error updating lock timeout:', error);
      Alert.alert('Error', 'Failed to update timeout');
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
        <Text style={styles.headerText}>App Lock</Text>
        <Text style={styles.subHeaderText}>
          Secure your app with {biometricType || 'authentication'}
        </Text>
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>App Lock</Text>
          <Text style={styles.settingDescription}>
            {biometricAvailable
              ? `Use ${biometricType} to unlock WhatsApp`
              : 'Require authentication to open WhatsApp'}
          </Text>
        </View>
        <Switch
          value={appLockEnabled}
          onValueChange={toggleAppLock}
          disabled={saving || !biometricAvailable}
          trackColor={{ false: '#ccc', true: '#25D366' }}
          thumbColor="#fff"
        />
      </View>

      {!biometricAvailable && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ {biometricType} is not set up on this device. Please configure it in your device settings.
          </Text>
        </View>
      )}

      {appLockEnabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automatically Lock</Text>
          <Text style={styles.sectionDescription}>
            If you haven't used WhatsApp for this amount of time
          </Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() => updateLockTimeout('immediately')}
            disabled={saving}
          >
            <Text style={styles.optionText}>Immediately</Text>
            {lockTimeout === 'immediately' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => updateLockTimeout('1min')}
            disabled={saving}
          >
            <Text style={styles.optionText}>After 1 minute</Text>
            {lockTimeout === '1min' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => updateLockTimeout('30min')}
            disabled={saving}
          >
            <Text style={styles.optionText}>After 30 minutes</Text>
            {lockTimeout === '30min' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>About App Lock</Text>
        <Text style={styles.infoText}>
          • Your messages are always end-to-end encrypted{'\n'}
          • App Lock adds an extra layer of security{'\n'}
          • You can still answer calls when locked{'\n'}
          • Notifications will still show message previews
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
  warningBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#e65100',
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
