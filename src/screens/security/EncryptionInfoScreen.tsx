import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const EncryptionInfoScreen = () => {
  const navigation = useNavigation();

  const viewSecurityCode = () => {
    // Navigate to security code verification screen
    // This would show a QR code and 60-digit number
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔐</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>End-to-End Encryption</Text>
        <Text style={styles.description}>
          Your personal messages and calls are secured with end-to-end encryption. This means only you and the person you're communicating with can read or listen to them, and nobody in between, not even WhatsApp.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How it works</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Automatic Protection</Text>
            <Text style={styles.featureText}>
              All messages are encrypted automatically. No settings to turn on.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Security Codes</Text>
            <Text style={styles.featureText}>
              Each chat has a unique security code to verify encryption.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Complete Privacy</Text>
            <Text style={styles.featureText}>
              Even WhatsApp can't read your messages or listen to your calls.
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Media Protection</Text>
            <Text style={styles.featureText}>
              Photos, videos, documents, and voice messages are also encrypted.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's encrypted</Text>
        <View style={styles.encryptedList}>
          <Text style={styles.encryptedItem}>• Text messages</Text>
          <Text style={styles.encryptedItem}>• Voice messages</Text>
          <Text style={styles.encryptedItem}>• Voice calls</Text>
          <Text style={styles.encryptedItem}>• Video calls</Text>
          <Text style={styles.encryptedItem}>• Photos and videos</Text>
          <Text style={styles.encryptedItem}>• Documents</Text>
          <Text style={styles.encryptedItem}>• Location sharing</Text>
          <Text style={styles.encryptedItem}>• Status updates</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.codeButton}
        onPress={viewSecurityCode}
      >
        <Text style={styles.codeButtonText}>View Security Code</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Verify Encryption</Text>
        <Text style={styles.infoText}>
          You can verify that your messages are encrypted by comparing security codes with your contacts. Tap "View Security Code" to see your code.
        </Text>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningText}>
          Backup: Messages backed up to cloud services may not be end-to-end encrypted unless you enable encrypted backups.
        </Text>
      </View>

      <View style={styles.learnMoreBox}>
        <Text style={styles.learnMoreTitle}>Learn more about encryption</Text>
        <Text style={styles.learnMoreText}>
          WhatsApp uses the Signal Protocol for end-to-end encryption. This technology is widely recognized as the gold standard for secure messaging.
        </Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Read White Paper →</Text>
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
  iconContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#f0f0f0',
  },
  icon: {
    fontSize: 80,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    color: '#25D366',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  encryptedList: {
    paddingLeft: 8,
  },
  encryptedItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  codeButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#25D366',
    borderRadius: 8,
    alignItems: 'center',
  },
  codeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    margin: 16,
    marginTop: 0,
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
  warningBox: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    flexDirection: 'row',
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#e65100',
    lineHeight: 20,
  },
  learnMoreBox: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  learnMoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  learnMoreText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkButtonText: {
    fontSize: 14,
    color: '#25D366',
    fontWeight: '600',
  },
});
