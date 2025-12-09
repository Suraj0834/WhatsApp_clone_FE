import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';

export const MessageTimerScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { conversationId, conversationName } = route.params || {};
  
  const [selectedTimer, setSelectedTimer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const timerOptions = [
    { value: 'off', label: 'Off', description: 'Messages never disappear', icon: '🚫' },
    { value: '1m', label: '1 minute', description: 'Messages disappear after 1 minute', icon: '⏱️' },
    { value: '5m', label: '5 minutes', description: 'Messages disappear after 5 minutes', icon: '⏱️' },
    { value: '1h', label: '1 hour', description: 'Messages disappear after 1 hour', icon: '⏰' },
    { value: '8h', label: '8 hours', description: 'Messages disappear after 8 hours', icon: '⏰' },
    { value: '24h', label: '24 hours', description: 'Messages disappear after 24 hours', icon: '📆' },
    { value: '7d', label: '7 days', description: 'Messages disappear after 7 days', icon: '📆' },
    { value: '90d', label: '90 days', description: 'Messages disappear after 90 days', icon: '📆' },
  ];

  const setTimer = async (timerValue: string) => {
    try {
      setLoading(true);
      setSelectedTimer(timerValue);
      
      await axios.put(`/conversations/${conversationId}/message-timer`, {
        timer: timerValue === 'off' ? null : timerValue,
      });

      Alert.alert(
        'Timer Set',
        timerValue === 'off'
          ? 'Disappearing messages turned off'
          : `Messages will now disappear after ${timerOptions.find((t) => t.value === timerValue)?.label}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to set message timer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⏱️</Text>
        <Text style={styles.headerText}>Message Timer</Text>
        <Text style={styles.headerSubText}>{conversationName}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Set a timer to automatically delete messages after they're sent. The countdown starts when you send the message.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Timer</Text>
        {timerOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => setTimer(option.value)}
            disabled={loading}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </View>
            {selectedTimer === option.value && loading && (
              <ActivityIndicator color="#25D366" />
            )}
            {selectedTimer === option.value && !loading && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>⚠️ Important</Text>
        <Text style={styles.warningText}>
          • Once sent, messages can't be unsent{'\n'}
          • Recipients can still screenshot or save messages{'\n'}
          • Forwarded messages won't disappear{'\n'}
          • Timer doesn't apply to starred messages{'\n'}
          • Both you and the recipient can see the timer
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
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    fontSize: 18,
    color: '#25D366',
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
    lineHeight: 22,
  },
});
