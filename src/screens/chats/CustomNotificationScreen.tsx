import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRoute } from '@react-navigation/native';
import axios from '../../api/axios';

export const CustomNotificationScreen = () => {
  const route = useRoute<any>();
  const { conversationId, conversationName } = route.params || {};
  
  const [customSound, setCustomSound] = useState('default');
  const [vibrate, setVibrate] = useState(true);
  const [highPriority, setHighPriority] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const soundOptions = [
    { label: 'Default', value: 'default' },
    { label: 'None', value: 'none' },
    { label: 'Pop', value: 'pop' },
    { label: 'Chime', value: 'chime' },
    { label: 'Bell', value: 'bell' },
  ];

  const saveSettings = async () => {
    try {
      await axios.put(`/conversations/${conversationId}/notifications`, {
        customSound,
        vibrate,
        highPriority,
        showPreview,
      });
      Alert.alert('Success', 'Notification settings saved');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Custom Notifications</Text>
        <Text style={styles.headerSubText}>{conversationName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Tone</Text>
        {soundOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => setCustomSound(option.value)}
          >
            <Text style={styles.optionText}>{option.label}</Text>
            {customSound === option.value && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Vibrate</Text>
          <Switch
            value={vibrate}
            onValueChange={setVibrate}
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>High Priority Notifications</Text>
          <Switch
            value={highPriority}
            onValueChange={setHighPriority}
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Show Message Preview</Text>
          <Switch
            value={showPreview}
            onValueChange={setShowPreview}
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
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
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  headerSubText: {
    fontSize: 14,
    color: '#666',
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
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  checkmark: {
    fontSize: 18,
    color: '#25D366',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#25D366',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
