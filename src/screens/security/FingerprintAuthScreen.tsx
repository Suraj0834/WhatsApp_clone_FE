import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from '../../api/axios';

export const FingerprintAuthScreen = () => {
  const [loading, setLoading] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkFingerprintAvailability();
    loadSettings();
  }, []);

  const checkFingerprintAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      const fingerprintSupported = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
      setIsAvailable(compatible && enrolled && fingerprintSupported);
    } catch (error) {
      console.error('Error checking fingerprint availability:', error);
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/settings/fingerprint');
      setFingerprintEnabled(response.data.fingerprintEnabled || false);
    } catch (error) {
      console.error('Error loading fingerprint settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const testFingerprint = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Test Fingerprint Authentication',
        fallbackLabel: 'Use passcode',
      });

      if (result.success) {
        Alert.alert('Success', 'Fingerprint authentication successful!');
      } else {
        Alert.alert('Failed', 'Fingerprint authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Error testing fingerprint:', error);
      Alert.alert('Error', 'Failed to test fingerprint');
    }
  };

  const toggleFingerprint = async (value: boolean) => {
    if (value) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable fingerprint',
        fallbackLabel: 'Use passcode',
      });

      if (!result.success) {
        Alert.alert('Authentication Failed', 'Please try again');
        return;
      }
    }

    try {
      setSaving(true);
      await axios.put('/users/settings/fingerprint', {
        fingerprintEnabled: value,
      });
      setFingerprintEnabled(value);
    } catch (error) {
      console.error('Error toggling fingerprint:', error);
      Alert.alert('Error', 'Failed to update fingerprint settings');
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
        <Text style={styles.headerText}>Fingerprint Authentication</Text>
        <Text style={styles.subHeaderText}>
          Use your fingerprint to unlock WhatsApp
        </Text>
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Use Fingerprint</Text>
          <Text style={styles.settingDescription}>
            Unlock app with your fingerprint
          </Text>
        </View>
        <Switch
          value={fingerprintEnabled}
          onValueChange={toggleFingerprint}
          disabled={saving || !isAvailable}
          trackColor={{ false: '#ccc', true: '#25D366' }}
          thumbColor="#fff"
        />
      </View>

      {!isAvailable && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Fingerprint authentication is not available on this device. Please set up fingerprint in your device settings.
          </Text>
        </View>
      )}

      {isAvailable && (
        <TouchableOpacity
          style={styles.testButton}
          onPress={testFingerprint}
        >
          <Text style={styles.testButtonIcon}>👆</Text>
          <Text style={styles.testButtonText}>Test Fingerprint</Text>
        </TouchableOpacity>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          • Place your finger on the fingerprint sensor{'\n'}
          • Your fingerprint data never leaves your device{'\n'}
          • WhatsApp doesn't have access to your fingerprint{'\n'}
          • You can use your passcode as a fallback{'\n'}
          • Works with App Lock feature
        </Text>
      </View>

      <View style={styles.securityBox}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Your fingerprint is stored securely on your device and is never sent to WhatsApp servers
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
  testButton: {
    margin: 16,
    padding: 20,
    backgroundColor: '#25D366',
    borderRadius: 12,
    alignItems: 'center',
  },
  testButtonIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
  securityBox: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
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
