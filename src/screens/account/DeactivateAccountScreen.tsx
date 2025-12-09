import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from '../../api/axios';

export const DeactivateAccountScreen = () => {
  const [deactivating, setDeactivating] = useState(false);

  const deactivateAccount = async () => {
    Alert.alert(
      'Deactivate Account',
      'Your account will be temporarily deactivated. You can reactivate it by logging in again within 30 days. After 30 days, your account will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeactivating(true);
              await axios.post('/users/account/deactivate');
              Alert.alert(
                'Account Deactivated',
                'Your account has been temporarily deactivated. You can reactivate it by logging in again within 30 days.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to deactivate account');
            } finally {
              setDeactivating(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⏸️</Text>
        <Text style={styles.headerText}>Deactivate Account</Text>
        <Text style={styles.headerSubText}>
          Temporarily deactivate your account
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What happens when you deactivate?</Text>
        <View style={styles.infoList}>
          <Text style={styles.infoItem}>• Your profile will be hidden</Text>
          <Text style={styles.infoItem}>• People can't message you</Text>
          <Text style={styles.infoItem}>• You'll be removed from groups</Text>
          <Text style={styles.infoItem}>• Your data is preserved</Text>
          <Text style={styles.infoItem}>• You can reactivate anytime within 30 days</Text>
        </View>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>⚠️ Important</Text>
        <Text style={styles.warningText}>
          If you don't reactivate within 30 days, your account will be permanently deleted and you won't be able to recover your data.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to reactivate</Text>
        <Text style={styles.reactivateText}>
          Simply log in with your phone number and verify with SMS. All your messages and groups will be restored.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.deactivateButton, deactivating && styles.buttonDisabled]}
        onPress={deactivateAccount}
        disabled={deactivating}
      >
        {deactivating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.deactivateButtonText}>Deactivate My Account</Text>
        )}
      </TouchableOpacity>
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
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  warningBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#e65100',
    lineHeight: 20,
  },
  reactivateText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  deactivateButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ff9800',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  deactivateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
