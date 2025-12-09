import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';

export const ReportGroupScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { groupId, groupName } = route.params || {};
  
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [blockGroup, setBlockGroup] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reportReasons = [
    {
      id: 'spam',
      title: 'Spam',
      description: 'Unwanted messages or advertisements',
      icon: '🚫',
    },
    {
      id: 'harassment',
      title: 'Harassment or Bullying',
      description: 'Threats, intimidation, or abusive behavior',
      icon: '😡',
    },
    {
      id: 'inappropriate',
      title: 'Inappropriate Content',
      description: 'Adult content or violence',
      icon: '🔞',
    },
    {
      id: 'scam',
      title: 'Scam or Fraud',
      description: 'Fake offers or phishing attempts',
      icon: '🎣',
    },
    {
      id: 'hate_speech',
      title: 'Hate Speech',
      description: 'Content promoting hate or discrimination',
      icon: '⚠️',
    },
    {
      id: 'violence',
      title: 'Violence or Threats',
      description: 'Violent content or credible threats',
      icon: '⚔️',
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Something else',
      icon: '📝',
    },
  ];

  const submitReport = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for reporting');
      return;
    }

    Alert.alert(
      'Report Group',
      `Are you sure you want to report "${groupName}"?${blockGroup ? ' You will also be removed from and block this group.' : ''}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: async () => {
            try {
              setSubmitting(true);

              await axios.post(`/conversations/${groupId}/report`, {
                reason: selectedReason,
                additionalInfo: additionalInfo.trim(),
                blockGroup,
              });

              Alert.alert(
                'Report Submitted',
                'Thank you for reporting. We will review this group and take appropriate action.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      if (blockGroup) {
                        // Navigate back to chats list
                        navigation.navigate('ChatsList');
                      } else {
                        navigation.goBack();
                      }
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to submit report. Please try again.');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🚨</Text>
        <Text style={styles.headerText}>Report Group</Text>
        <Text style={styles.headerSubText}>{groupName}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Your report is anonymous and will help us keep WhatsApp safe. We'll review this group and take appropriate action.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why are you reporting this group?</Text>
        {reportReasons.map((reason) => (
          <TouchableOpacity
            key={reason.id}
            style={[
              styles.reasonOption,
              selectedReason === reason.id && styles.reasonOptionSelected,
            ]}
            onPress={() => setSelectedReason(reason.id)}
          >
            <View style={styles.reasonLeft}>
              <Text style={styles.reasonIcon}>{reason.icon}</Text>
              <View style={styles.reasonInfo}>
                <Text style={styles.reasonTitle}>{reason.title}</Text>
                <Text style={styles.reasonDescription}>{reason.description}</Text>
              </View>
            </View>
            {selectedReason === reason.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information (Optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Provide more details about your report..."
          placeholderTextColor="#999"
          multiline
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          maxLength={500}
          textAlignVertical="top"
        />
        <Text style={styles.characterCount}>
          {additionalInfo.length}/500
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.blockOption}
          onPress={() => setBlockGroup(!blockGroup)}
        >
          <View style={styles.blockInfo}>
            <Text style={styles.blockTitle}>Block and Exit Group</Text>
            <Text style={styles.blockDescription}>
              Leave this group and prevent it from contacting you
            </Text>
          </View>
          <View style={[styles.checkbox, blockGroup && styles.checkboxSelected]}>
            {blockGroup && <Text style={styles.checkboxIcon}>✓</Text>}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.buttonDisabled]}
        onPress={submitReport}
        disabled={submitting || !selectedReason}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Report</Text>
        )}
      </TouchableOpacity>

      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>⚠️ Important</Text>
        <Text style={styles.warningText}>
          • False reports may result in action against your account{'\n'}
          • Reports are reviewed by WhatsApp's trust and safety team{'\n'}
          • We may contact you for additional information{'\n'}
          • Group admins will not be notified of your report
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
    marginBottom: 4,
  },
  headerSubText: {
    fontSize: 14,
    color: '#666',
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
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  reasonOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  reasonOptionSelected: {
    backgroundColor: '#f0f9ff',
  },
  reasonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reasonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  reasonInfo: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  reasonDescription: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    fontSize: 18,
    color: '#25D366',
  },
  textArea: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    maxHeight: 150,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
    marginRight: 16,
  },
  blockOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  blockInfo: {
    flex: 1,
    marginRight: 16,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  blockDescription: {
    fontSize: 14,
    color: '#666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
  checkboxIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningBox: {
    margin: 16,
    marginTop: 0,
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
    lineHeight: 22,
  },
});
