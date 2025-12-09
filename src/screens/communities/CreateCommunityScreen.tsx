import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from '../../api/axios';

export const CreateCommunityScreen = () => {
  const navigation = useNavigation();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const pickIcon = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIcon(result.assets[0].uri);
    }
  };

  const createCommunity = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a community name');
      return;
    }

    try {
      setCreating(true);

      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());

      if (icon) {
        const uri = icon;
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('icon', {
          uri,
          name: filename || 'community-icon.jpg',
          type,
        } as any);
      }

      const response = await axios.post('/communities', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Community created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create community');
    } finally {
      setCreating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🏘️</Text>
        <Text style={styles.headerText}>Create Community</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>✨ What are communities?</Text>
        <Text style={styles.infoText}>
          Communities bring together multiple groups under one umbrella to better organize conversations around a common topic.
        </Text>
      </View>

      <View style={styles.form}>
        <TouchableOpacity style={styles.iconPicker} onPress={pickIcon}>
          {icon ? (
            <Image source={{ uri: icon }} style={styles.iconImage} />
          ) : (
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconPlaceholderText}>📷</Text>
              <Text style={styles.iconPlaceholderLabel}>Add Icon</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Community Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter community name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
          <Text style={styles.characterCount}>{name.length}/50</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe what your community is about..."
            placeholderTextColor="#999"
            multiline
            value={description}
            onChangeText={setDescription}
            maxLength={200}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>{description.length}/200</Text>
        </View>
      </View>

      <View style={styles.featuresBox}>
        <Text style={styles.featuresTitle}>🎯 Community Features</Text>
        <Text style={styles.featuresText}>
          • Organize multiple groups{'\n'}
          • Share announcements with all members{'\n'}
          • Manage groups from one place{'\n'}
          • Control who can join{'\n'}
          • Set community guidelines
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.createButton, creating && styles.buttonDisabled]}
        onPress={createCommunity}
        disabled={creating || !name.trim()}
      >
        {creating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.createButtonText}>Create Community</Text>
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
    fontSize: 48,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  infoBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d47a1',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0d47a1',
    lineHeight: 20,
  },
  form: {
    padding: 16,
  },
  iconPicker: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    overflow: 'hidden',
  },
  iconImage: {
    width: '100%',
    height: '100%',
  },
  iconPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  iconPlaceholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  iconPlaceholderLabel: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    maxHeight: 150,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  featuresBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14532d',
    marginBottom: 8,
  },
  featuresText: {
    fontSize: 14,
    color: '#14532d',
    lineHeight: 22,
  },
  createButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#25D366',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
