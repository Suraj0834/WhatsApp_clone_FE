import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';

type PrivacyOption = 'everyone' | 'contacts' | 'contacts_except' | 'nobody';

interface ExceptionContact {
  id: string;
  name: string;
  phone: string;
}

export const ProfilePhotoPrivacyScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PrivacyOption>('everyone');
  const [exceptions, setExceptions] = useState<ExceptionContact[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/privacy/profile-photo');
      setSelectedOption(response.data.profilePhotoPrivacy || 'everyone');
      setExceptions(response.data.profilePhotoExceptions || []);
    } catch (error) {
      console.error('Error loading profile photo privacy:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySetting = async (option: PrivacyOption) => {
    try {
      setSaving(true);
      await axios.put('/users/privacy/profile-photo', {
        profilePhotoPrivacy: option,
        profilePhotoExceptions: option === 'contacts_except' ? exceptions : [],
      });
      setSelectedOption(option);
    } catch (error) {
      console.error('Error saving profile photo privacy:', error);
    } finally {
      setSaving(false);
    }
  };

  const addException = () => {
    // @ts-ignore
    navigation.navigate('SelectContact', {
      multiple: true,
      onSelect: (contacts: ExceptionContact[]) => {
        setExceptions(contacts);
      },
    });
  };

  const removeException = (contactId: string) => {
    setExceptions(exceptions.filter((c) => c.id !== contactId));
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
        <Text style={styles.headerText}>
          Who can see my profile photo
        </Text>
        <Text style={styles.subHeaderText}>
          Changes to your privacy settings won't affect messages you've already sent
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
          <Text style={styles.optionText}>My Contacts</Text>
          {selectedOption === 'contacts' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => savePrivacySetting('contacts_except')}
          disabled={saving}
        >
          <Text style={styles.optionText}>My Contacts Except...</Text>
          {selectedOption === 'contacts_except' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        {selectedOption === 'contacts_except' && (
          <View style={styles.exceptionsContainer}>
            <Text style={styles.exceptionsHeader}>
              {exceptions.length} contact{exceptions.length !== 1 ? 's' : ''} excluded
            </Text>
            {exceptions.map((contact) => (
              <View key={contact.id} style={styles.exceptionItem}>
                <Text style={styles.exceptionName}>{contact.name}</Text>
                <TouchableOpacity onPress={() => removeException(contact.id)}>
                  <Text style={styles.removeButton}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addException}>
              <Text style={styles.addButtonText}>Add Exception</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.option}
          onPress={() => savePrivacySetting('nobody')}
          disabled={saving}
        >
          <Text style={styles.optionText}>Nobody</Text>
          {selectedOption === 'nobody' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
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
  optionText: {
    fontSize: 16,
    color: '#333',
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
  exceptionsContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  exceptionsHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  exceptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  exceptionName: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    fontSize: 14,
    color: '#ff3b30',
  },
  addButton: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: '#25D366',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
