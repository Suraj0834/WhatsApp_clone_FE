import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import axios from '../../api/axios';

const DELETE_REASONS = [
  'I no longer need WhatsApp',
  "I'm switching to another messaging app",
  'Privacy concerns',
  'Too many notifications',
  'Storage issues',
  'Other',
];

export const DeleteAccountScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason');
      return;
    }

    if (confirmText.toLowerCase() !== 'delete') {
      Alert.alert('Error', 'Please type DELETE to confirm');
      return;
    }

    Alert.alert(
      'Delete Account',
      'Are you absolutely sure? This action cannot be undone. All your messages, media, and account data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await axios.delete('/users/account', {
                data: {
                  phone: phoneNumber,
                  reason: selectedReason === 'Other' ? otherReason : selectedReason,
                },
              });
              
              // Logout user
              // dispatch(logout());
              Alert.alert(
                'Account Deleted',
                'Your account has been permanently deleted.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate to login
                      // navigation.navigate('Login');
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.warningHeader}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningTitle}>Warning: This Cannot Be Undone</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What will be deleted?</Text>
        <View style={styles.deleteList}>
          <Text style={styles.deleteItem}>❌ Your account from WhatsApp</Text>
          <Text style={styles.deleteItem}>❌ All your message history</Text>
          <Text style={styles.deleteItem}>❌ Your backups</Text>
          <Text style={styles.deleteItem}>❌ Media files</Text>
          <Text style={styles.deleteItem}>❌ You'll be removed from all groups</Text>
          <Text style={styles.deleteItem}>❌ Your WhatsApp purchase history</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Confirm Your Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+1 (555) 123-4567"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={15}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why are you deleting your account?</Text>
        {DELETE_REASONS.map((reason) => (
          <TouchableOpacity
            key={reason}
            style={styles.reasonOption}
            onPress={() => setSelectedReason(reason)}
          >
            <View style={[styles.radio, selectedReason === reason && styles.radioSelected]}>
              {selectedReason === reason && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.reasonText}>{reason}</Text>
          </TouchableOpacity>
        ))}
        
        {selectedReason === 'Other' && (
          <TextInput
            style={[styles.input, styles.reasonInput]}
            placeholder="Please specify..."
            value={otherReason}
            onChangeText={setOtherReason}
            multiline
            numberOfLines={3}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Final Confirmation</Text>
        <Text style={styles.confirmText}>Type "DELETE" to confirm:</Text>
        <TextInput
          style={styles.input}
          placeholder="Type DELETE here"
          value={confirmText}
          onChangeText={setConfirmText}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 If you're deleting because of storage issues, try clearing your cache or managing storage instead.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.deleteButton, loading && styles.buttonDisabled]}
        onPress={handleDeleteAccount}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.deleteButtonText}>Delete My Account</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  warningHeader: {
    backgroundColor: '#ffebee',
    padding: 24,
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#c62828',
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
  deleteList: {
    paddingLeft: 8,
  },
  deleteItem: {
    fontSize: 14,
    color: '#c62828',
    marginBottom: 8,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#25D366',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#25D366',
  },
  reasonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  reasonInput: {
    marginTop: 12,
    textAlignVertical: 'top',
  },
  confirmText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  infoBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0d47a1',
    lineHeight: 20,
  },
  deleteButton: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#c62828',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
