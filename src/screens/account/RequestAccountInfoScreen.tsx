import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from '../../api/axios';

export const RequestAccountInfoScreen = () => {
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const requestAccountInfo = async () => {
    try {
      setRequesting(true);
      await axios.post('/users/account/request-info');
      setRequested(true);
      Alert.alert(
        'Request Submitted',
        'Your account information request has been submitted. You will receive an email within 3 days with a download link.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to request account information');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📋</Text>
        <Text style={styles.headerText}>Request Account Info</Text>
        <Text style={styles.headerSubText}>
          Create a report of your WhatsApp account information and settings
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's included?</Text>
        <View style={styles.infoList}>
          <Text style={styles.infoItem}>✓ Profile information</Text>
          <Text style={styles.infoItem}>✓ Groups you're in</Text>
          <Text style={styles.infoItem}>✓ Blocked contacts</Text>
          <Text style={styles.infoItem}>✓ Settings and preferences</Text>
          <Text style={styles.infoItem}>✓ Account creation date</Text>
          <Text style={styles.infoItem}>✓ Device information</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Not included</Text>
        <View style={styles.infoList}>
          <Text style={styles.excludeItem}>✗ Message content</Text>
          <Text style={styles.excludeItem}>✗ Contacts list</Text>
          <Text style={styles.excludeItem}>✗ Media files</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          1. We'll prepare a report of your account info{'\n'}
          2. You'll receive an email when it's ready (usually within 3 days){'\n'}
          3. The report will be available for 30 days{'\n'}
          4. Download the report from the link in the email
        </Text>
      </View>

      <View style={styles.securityBox}>
        <Text style={styles.securityIcon}>🔒</Text>
        <View style={styles.securityContent}>
          <Text style={styles.securityTitle}>Your Privacy</Text>
          <Text style={styles.securityText}>
            Your account information is end-to-end encrypted and only accessible by you
          </Text>
        </View>
      </View>

      {!requested ? (
        <TouchableOpacity
          style={[styles.requestButton, requesting && styles.buttonDisabled]}
          onPress={requestAccountInfo}
          disabled={requesting}
        >
          {requesting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.requestButtonText}>Request Report</Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successText}>Request submitted successfully!</Text>
          <Text style={styles.successSubText}>
            Check your email in 3 days for the download link
          </Text>
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
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  headerSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoList: {
    paddingLeft: 8,
  },
  infoItem: {
    fontSize: 15,
    color: '#25D366',
    marginBottom: 8,
    lineHeight: 22,
  },
  excludeItem: {
    fontSize: 15,
    color: '#999',
    marginBottom: 8,
    lineHeight: 22,
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
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    flexDirection: 'row',
  },
  securityIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 4,
  },
  securityText: {
    fontSize: 14,
    color: '#1b5e20',
    lineHeight: 20,
  },
  requestButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#25D366',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successBox: {
    margin: 16,
    padding: 24,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    color: '#25D366',
    marginBottom: 12,
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 8,
  },
  successSubText: {
    fontSize: 14,
    color: '#1b5e20',
    textAlign: 'center',
  },
});
