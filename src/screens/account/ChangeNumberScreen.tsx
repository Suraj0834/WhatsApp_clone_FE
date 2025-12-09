import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';

type Step = 'old_number' | 'new_number' | 'verify_otp' | 'notify_contacts';

export const ChangeNumberScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState<Step>('old_number');
  const [oldNumber, setOldNumber] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [notifyContacts, setNotifyContacts] = useState(true);
  const [loading, setLoading] = useState(false);

  const verifyOldNumber = async () => {
    if (!oldNumber || oldNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/auth/verify-current-number', { phone: oldNumber });
      setCurrentStep('new_number');
    } catch (error) {
      Alert.alert('Error', 'Failed to verify current number');
    } finally {
      setLoading(false);
    }
  };

  const sendOTPToNewNumber = async () => {
    if (!newNumber || newNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (newNumber === oldNumber) {
      Alert.alert('Error', 'New number must be different from current number');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/auth/send-otp-change-number', { 
        oldPhone: oldNumber,
        newPhone: newNumber 
      });
      setCurrentStep('verify_otp');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP to new number');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndChange = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/auth/change-number', {
        oldPhone: oldNumber,
        newPhone: newNumber,
        otp,
        notifyContacts,
      });
      
      Alert.alert(
        'Success',
        'Your phone number has been changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP or failed to change number');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'old_number':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 1: Verify Current Number</Text>
            <Text style={styles.stepDescription}>
              Enter your current phone number to begin the process
            </Text>
            <TextInput
              style={styles.input}
              placeholder="+1 (555) 123-4567"
              value={oldNumber}
              onChangeText={setOldNumber}
              keyboardType="phone-pad"
              maxLength={15}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={verifyOldNumber}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        );

      case 'new_number':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 2: Enter New Number</Text>
            <Text style={styles.stepDescription}>
              Enter your new phone number. We'll send a verification code to this number.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="+1 (555) 987-6543"
              value={newNumber}
              onChangeText={setNewNumber}
              keyboardType="phone-pad"
              maxLength={15}
            />
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Make sure you can receive SMS on this new number
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={sendOTPToNewNumber}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Code</Text>
              )}
            </TouchableOpacity>
          </View>
        );

      case 'verify_otp':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 3: Verify New Number</Text>
            <Text style={styles.stepDescription}>
              Enter the 6-digit code sent to {newNumber}
            </Text>
            <TextInput
              style={[styles.input, styles.otpInput]}
              placeholder="000000"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity style={styles.resendButton}>
              <Text style={styles.resendButtonText}>Resend Code</Text>
            </TouchableOpacity>
            
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setNotifyContacts(!notifyContacts)}
              >
                <View style={[styles.checkboxBox, notifyContacts && styles.checkboxChecked]}>
                  {notifyContacts && <Text style={styles.checkboxIcon}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  Notify my contacts about this number change
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={verifyOTPAndChange}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Change Number</Text>
              )}
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Change Number</Text>
        <Text style={styles.headerSubText}>
          Changing your phone number will migrate your account info, groups and settings.
        </Text>
      </View>

      <View style={styles.stepsIndicator}>
        <View style={[styles.stepDot, currentStep === 'old_number' && styles.stepDotActive]} />
        <View style={styles.stepLine} />
        <View style={[styles.stepDot, currentStep === 'new_number' && styles.stepDotActive]} />
        <View style={styles.stepLine} />
        <View style={[styles.stepDot, currentStep === 'verify_otp' && styles.stepDotActive]} />
      </View>

      {renderStepContent()}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>What happens when you change your number?</Text>
        <Text style={styles.infoText}>
          • Your chats will be transferred to the new number{'\n'}
          • Your groups will continue with the new number{'\n'}
          • Your contacts will see your new number{'\n'}
          • Your old number will be disconnected
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  headerSubText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  stepsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  stepDotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#25D366',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#ccc',
  },
  stepContainer: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
  },
  button: {
    backgroundColor: '#25D366',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendButtonText: {
    color: '#25D366',
    fontSize: 14,
    fontWeight: '600',
  },
  checkboxContainer: {
    marginBottom: 24,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
  checkboxIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  warningBox: {
    padding: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#e65100',
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
});
