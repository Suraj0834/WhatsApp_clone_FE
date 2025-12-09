import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert, Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from '../../api/axios';

export const FaceIDAuthScreen = () => {
  const [loading, setLoading] = useState(false);
  const [faceIDEnabled, setFaceIDEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkFaceIDAvailability();
    loadSettings();
  }, []);

  const checkFaceIDAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      const faceIDSupported = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
      setIsAvailable(compatible && enrolled && faceIDSupported && Platform.OS === 'ios');
    } catch (error) {
      console.error('Error checking Face ID availability:', error);
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/settings/face-id');
      setFaceIDEnabled(response.data.faceIDEnabled || false);
    } catch (error) {
      console.error('Error loading Face ID settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const testFaceID = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Test Face ID Authentication',
        fallbackLabel: 'Use passcode',
      });

      if (result.success) {
        Alert.alert('Success', 'Face ID authentication successful!');
      } else {
        Alert.alert('Failed', 'Face ID authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Error testing Face ID:', error);
      Alert.alert('Error', 'Failed to test Face ID');
    }
  };

  const toggleFaceID = async (value: boolean) => {
    if (value) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable Face ID',
        fallbackLabel: 'Use passcode',
      });

      if (!result.success) {
        Alert.alert('Authentication Failed', 'Please try again');
        return;
      }
    }

    try {
      setSaving(true);
      await axios.put('/users/settings/face-id', {
        faceIDEnabled: value,
      });
      setFaceIDEnabled(value);
    } catch (error) {
      console.error('Error toggling Face ID:', error);
      Alert.alert('Error', 'Failed to update Face ID settings');
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
        <Text style={styles.headerText}>Face ID Authentication</Text>
        <Text style={styles.subHeaderText}>
          Use Face ID to unlock WhatsApp
        </Text>
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Use Face ID</Text>
          <Text style={styles.settingDescription}>
            Unlock app with Face ID
          </Text>
        </View>
        <Switch
          value={faceIDEnabled}
          onValueChange={toggleFaceID}
          disabled={saving || !isAvailable}
          trackColor={{ false: '#ccc', true: '#25D366' }}
          thumbColor="#fff"
        />
      </View>

      {!isAvailable && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Face ID is not available on this device. {Platform.OS === 'android' ? 'Face ID is only available on iOS devices.' : 'Please set up Face ID in your device settings.'}
          </Text>
        </View>
      )}

      {isAvailable && (
        <TouchableOpacity
          style={styles.testButton}
          onPress={testFaceID}
        >
          <Text style={styles.testButtonIcon}>😊</Text>
          <Text style={styles.testButtonText}>Test Face ID</Text>
        </TouchableOpacity>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          • Look at your device to unlock{'\n'}
          • Your face data never leaves your device{'\n'}
          • WhatsApp doesn't have access to Face ID{'\n'}
          • You can use your passcode as a fallback{'\n'}
          • Works with App Lock feature{'\n'}
          • Requires Face ID to be set up in Settings
        </Text>
      </View>

      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>💡 Tips</Text>
        <Text style={styles.tipsText}>
          • Make sure your face is clearly visible{'\n'}
          • Remove anything covering your face{'\n'}
          • Hold your device at a natural angle{'\n'}
          • Ensure good lighting conditions
        </Text>
      </View>

      <View style={styles.securityBox}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Your Face ID data is stored securely in the Secure Enclave on your device and is never sent to WhatsApp servers
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
  tipsBox: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#fff9e6',
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f57f17',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#f57f17',
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
