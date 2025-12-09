import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';

export const GroupDescriptionScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { groupId, groupName } = route.params || {};
  
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const maxLength = 512;

  useEffect(() => {
    fetchDescription();
  }, []);

  const fetchDescription = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/conversations/${groupId}`);
      setDescription(response.data.description || '');
    } catch (error) {
      Alert.alert('Error', 'Failed to load description');
    } finally {
      setLoading(false);
    }
  };

  const saveDescription = async () => {
    try {
      setSaving(true);
      
      await axios.put(`/conversations/${groupId}`, {
        description: description.trim(),
      });

      Alert.alert('Success', 'Group description updated', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update description');
    } finally {
      setSaving(false);
    }
  };

  const clearDescription = () => {
    Alert.alert(
      'Clear Description',
      'Are you sure you want to remove the group description?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setDescription('');
          },
        },
      ]
    );
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
        <Text style={styles.headerIcon}>📝</Text>
        <Text style={styles.headerText}>Group Description</Text>
        <Text style={styles.headerSubText}>{groupName}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Add a description to help members understand what this group is about.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter group description..."
          placeholderTextColor="#999"
          multiline
          value={description}
          onChangeText={setDescription}
          maxLength={maxLength}
          textAlignVertical="top"
        />
        <Text style={styles.characterCount}>
          {description.length}/{maxLength}
        </Text>
      </View>

      <View style={styles.examplesBox}>
        <Text style={styles.examplesTitle}>💡 Examples:</Text>
        <Text style={styles.exampleText}>
          • "Family group for sharing updates and photos"{'\n'}
          • "Project team - Daily standups at 9 AM"{'\n'}
          • "Book club - Currently reading: The Great Gatsby"{'\n'}
          • "Friends trip to Paris - Planning for June 2024"
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton, saving && styles.buttonDisabled]}
          onPress={saveDescription}
          disabled={saving || description.trim().length === 0}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Description</Text>
          )}
        </TouchableOpacity>

        {description.length > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearDescription}
            disabled={saving}
          >
            <Text style={[styles.buttonText, styles.clearButtonText]}>Clear Description</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ All group members can see the description. Only admins can edit it.
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputContainer: {
    margin: 16,
    marginTop: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    maxHeight: 200,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  examplesBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#25D366',
  },
  clearButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  clearButtonText: {
    color: '#dc3545',
  },
  warningBox: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#e65100',
    lineHeight: 20,
  },
});
