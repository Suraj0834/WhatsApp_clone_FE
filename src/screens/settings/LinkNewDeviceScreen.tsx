import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';

export const LinkNewDeviceScreen = () => {
  const navigation = useNavigation();
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [expiresIn, setExpiresIn] = useState(60);

  useEffect(() => {
    generateQRCode();
  }, []);

  useEffect(() => {
    if (expiresIn > 0 && qrCode) {
      const timer = setTimeout(() => setExpiresIn(expiresIn - 1), 1000);
      return () => clearTimeout(timer);
    } else if (expiresIn === 0) {
      generateQRCode();
    }
  }, [expiresIn, qrCode]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/users/generate-qr-code');
      setQrCode(response.data.qrCode);
      setExpiresIn(60);
      
      // Start polling for device link
      pollForDeviceLink(response.data.linkId);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const pollForDeviceLink = async (linkId: string) => {
    setLinking(true);
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`/users/check-device-link/${linkId}`);
        
        if (response.data.linked) {
          clearInterval(pollInterval);
          setLinking(false);
          
          Alert.alert(
            'Success',
            `Device linked successfully!\n\n${response.data.deviceName}`,
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ]
          );
        }
      } catch (error) {
        // Continue polling
      }
    }, 2000);

    // Stop polling after 60 seconds
    setTimeout(() => {
      clearInterval(pollInterval);
      setLinking(false);
    }, 60000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📱</Text>
        <Text style={styles.headerText}>Link a Device</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.qrContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#25D366" />
          ) : (
            <>
              <View style={styles.qrCodePlaceholder}>
                <Text style={styles.qrCodeText}>{qrCode || 'QR CODE'}</Text>
                <Text style={styles.qrCodeNote}>
                  Scan this code with your device
                </Text>
              </View>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                  Expires in: {expiresIn}s
                </Text>
              </View>
            </>
          )}
        </View>

        {linking && (
          <View style={styles.linkingContainer}>
            <ActivityIndicator size="small" color="#25D366" />
            <Text style={styles.linkingText}>Waiting for device to scan...</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.refreshButton, loading && styles.buttonDisabled]}
          onPress={generateQRCode}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>🔄 Refresh QR Code</Text>
        </TouchableOpacity>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>How to Link a Device</Text>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>
              Open WhatsApp on your other device
            </Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>
              Tap Menu or Settings and select Linked Devices
            </Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>
              Tap "Link a Device" and scan this QR code
            </Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>
              Keep your phone unlocked during the process
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ About Device Linking</Text>
          <Text style={styles.infoText}>
            • Use WhatsApp on up to 4 devices simultaneously{'\n'}
            • Your messages are synced across all devices{'\n'}
            • End-to-end encryption is maintained{'\n'}
            • Devices can work without phone connection{'\n'}
            • Your phone must be connected to the internet
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  content: {
    flex: 1,
    padding: 16,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  qrCodePlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#25D366',
  },
  qrCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    padding: 16,
  },
  qrCodeNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  timerContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  linkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginBottom: 16,
  },
  linkingText: {
    fontSize: 14,
    color: '#0d47a1',
    marginLeft: 8,
  },
  refreshButton: {
    padding: 16,
    backgroundColor: '#25D366',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  instructions: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#25D366',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 28,
  },
  infoBox: {
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
});
