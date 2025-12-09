import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import axios from '../../api/axios';

type CallPrivacyOption = 'everyone' | 'contacts' | 'nobody';

export const CallsPrivacyScreen = () => {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<CallPrivacyOption>('everyone');
  const [silenceUnknown, setSilenceUnknown] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/privacy/calls');
      setSelectedOption(response.data.callsPrivacy || 'everyone');
      setSilenceUnknown(response.data.silenceUnknownCallers || false);
    } catch (error) {
      console.error('Error loading calls privacy:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySetting = async (option: CallPrivacyOption) => {
    try {
      setSaving(true);
      await axios.put('/users/privacy/calls', {
        callsPrivacy: option,
        silenceUnknown,
      });
      setSelectedOption(option);
    } catch (error) {
      console.error('Error saving calls privacy:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSilenceUnknown = async (value: boolean) => {
    try {
      setSaving(true);
      await axios.put('/users/privacy/calls', {
        callsPrivacy: selectedOption,
        silenceUnknownCallers: value,
      });
      setSilenceUnknown(value);
    } catch (error) {
      console.error('Error saving silence unknown callers:', error);
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
        <Text style={styles.headerText}>Who can call me</Text>
        <Text style={styles.subHeaderText}>
          Control who can call you on WhatsApp
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => savePrivacySetting('everyone')}
          disabled={saving}
        >
          <Text style={styles.optionText}>Everyone</Text>
          {selectedOption === 'everyone' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => savePrivacySetting('contacts')}
          disabled={saving}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionText}>My Contacts</Text>
            <Text style={styles.optionSubText}>Only your saved contacts</Text>
          </View>
          {selectedOption === 'contacts' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => savePrivacySetting('nobody')}
          disabled={saving}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionText}>Nobody</Text>
            <Text style={styles.optionSubText}>Turn off all incoming calls</Text>
          </View>
          {selectedOption === 'nobody' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Silence Unknown Callers</Text>
            <Text style={styles.settingDescription}>
              Mute calls from people not in your contacts. They'll see you're busy and can leave a voice message
            </Text>
          </View>
          <Switch
            value={silenceUnknown}
            onValueChange={toggleSilenceUnknown}
            disabled={saving}
            trackColor={{ false: '#ccc', true: '#25D366' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>About Call Privacy</Text>
        <Text style={styles.infoText}>
          • Calls you decline will appear in your calls list{'\n'}
          • Silenced calls won't ring but will appear as missed{'\n'}
          • You can still call people who can't call you{'\n'}
          • Group call privacy is controlled by group admins
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
  optionsContainer: {
    marginTop: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  optionSubText: {
    fontSize: 13,
    color: '#666',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
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
