import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform, ActivityIndicator } from 'react-native';
import { IconButton } from 'react-native-paper';
import axios from '../../api/axios';

interface PrivacyOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const privacyOptions: PrivacyOption[] = [
  { 
    id: 'everyone', 
    label: 'Everyone', 
    description: 'All WhatsApp users can view',
    icon: 'earth',
    color: '#2196F3',
  },
  { 
    id: 'contacts', 
    label: 'My Contacts', 
    description: 'Only people in your contacts',
    icon: 'account-group',
    color: '#4CAF50',
  },
  { 
    id: 'nobody', 
    label: 'Nobody', 
    description: 'No one can view your status',
    icon: 'eye-off',
    color: '#FF9800',
  },
];

export const StatusPrivacyScreen = () => {
  const [selectedOption, setSelectedOption] = useState<string>('contacts');
  const [excludedContacts, setExcludedContacts] = useState<string[]>([]);
  const [shareWithContacts, setShareWithContacts] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      await axios.put('/users/privacy/status', {
        visibility: selectedOption,
        excludedContacts,
        shareWithContacts,
      });
      
    } catch (error) {
      console.error('Failed to update settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleExceptions = () => {
    // Navigate to contact selection screen
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
          <IconButton icon="shield-account" iconColor="#2196F3" size={32} />
        </View>
        <Text style={styles.headerTitle}>Status Privacy</Text>
        <Text style={styles.headerSubtitle}>
          Control who can see your status updates
        </Text>
      </View>

      {/* Privacy Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Who Can See My Status</Text>
        <View style={styles.cardContainer}>
          {privacyOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                index === privacyOptions.length - 1 && styles.lastCard,
                selectedOption === option.id && styles.selectedCard,
              ]}
              onPress={() => handleOptionSelect(option.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIconContainer, { backgroundColor: `${option.color}26` }]}>
                <IconButton icon={option.icon} iconColor={option.color} size={24} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedOption === option.id && styles.radioButtonSelected
              ]}>
                {selectedOption === option.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Exceptions */}
      {selectedOption === 'contacts' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exceptions</Text>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.exceptionCard}
              onPress={handleExceptions}
              activeOpacity={0.7}
            >
              <View style={styles.exceptionLeft}>
                <View style={[styles.exceptionIconContainer, { backgroundColor: 'rgba(244, 67, 54, 0.15)' }]}>
                  <IconButton icon="account-minus" iconColor="#F44336" size={24} />
                </View>
                <View style={styles.exceptionInfo}>
                  <Text style={styles.exceptionTitle}>My Contacts Except...</Text>
                  <Text style={styles.exceptionDescription}>
                    Exclude specific contacts
                  </Text>
                </View>
              </View>
              <View style={styles.exceptionBadge}>
                <Text style={styles.exceptionCount}>
                  {excludedContacts.length || '0'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selectedOption === 'nobody' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share With</Text>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.exceptionCard}
              onPress={handleExceptions}
              activeOpacity={0.7}
            >
              <View style={styles.exceptionLeft}>
                <View style={[styles.exceptionIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                  <IconButton icon="account-plus" iconColor="#4CAF50" size={24} />
                </View>
                <View style={styles.exceptionInfo}>
                  <Text style={styles.exceptionTitle}>Only Share With...</Text>
                  <Text style={styles.exceptionDescription}>
                    Select specific contacts
                  </Text>
                </View>
              </View>
              <View style={styles.exceptionBadge}>
                <Text style={styles.exceptionCount}>
                  {excludedContacts.length || '0'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Auto Share Setting */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Settings</Text>
        <View style={styles.cardContainer}>
          <View style={styles.settingCard}>
            <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(156, 39, 176, 0.15)' }]}>
              <IconButton icon="share-variant" iconColor="#9C27B0" size={24} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Share to My Contacts</Text>
              <Text style={styles.settingDescription}>
                Automatically share status updates
              </Text>
            </View>
            <Switch
              value={shareWithContacts}
              onValueChange={setShareWithContacts}
              trackColor={{ false: '#ddd', true: '#25D36680' }}
              thumbColor={shareWithContacts ? '#25D366' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={saveSettings}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <IconButton icon="check-circle" iconColor="#fff" size={20} />
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.section}>
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <IconButton icon="information" iconColor="#2196F3" size={20} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>About Status Privacy</Text>
            <Text style={styles.infoText}>
              • Status updates disappear after 24 hours{'\n'}
              • You can see who viewed your status{'\n'}
              • Changes only affect future updates{'\n'}
              • Blocked contacts cannot see your status{'\n'}
              • Your status is end-to-end encrypted
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastCard: {
    borderBottomWidth: 0,
  },
  selectedCard: {
    backgroundColor: '#F5F7FA',
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
    marginLeft: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#25D366',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#25D366',
  },
  exceptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  exceptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exceptionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exceptionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exceptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  exceptionDescription: {
    fontSize: 13,
    color: '#666',
  },
  exceptionBadge: {
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  exceptionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#25D366',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoIconContainer: {
    marginRight: 8,
    marginTop: -4,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 20,
  },
});
