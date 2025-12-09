import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from '../../api/axios';

export const ChatBackgroundScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { conversationId, conversationName } = route.params || {};
  
  const [selectedBg, setSelectedBg] = useState<string>('default');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const defaultBackgrounds = [
    { id: 'default', name: 'Default', color: '#ece5dd' },
    { id: 'dark', name: 'Dark', color: '#0a1014' },
    { id: 'blue', name: 'Blue', color: '#0d8abc' },
    { id: 'green', name: 'Green', color: '#075e54' },
    { id: 'purple', name: 'Purple', color: '#6a1b9a' },
    { id: 'pink', name: 'Pink', color: '#d81b60' },
  ];

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCustomImage(result.assets[0].uri);
      setSelectedBg('custom');
    }
  };

  const applyBackground = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      
      if (selectedBg === 'custom' && customImage) {
        const uri = customImage;
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('background', {
          uri,
          name: filename || 'background.jpg',
          type,
        } as any);
      } else {
        formData.append('backgroundType', selectedBg);
      }

      await axios.put(`/conversations/${conversationId}/background`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Chat background updated', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update background');
    } finally {
      setLoading(false);
    }
  };

  const resetBackground = async () => {
    try {
      setLoading(true);
      
      await axios.delete(`/conversations/${conversationId}/background`);
      setSelectedBg('default');
      setCustomImage(null);
      
      Alert.alert('Success', 'Background reset to default');
    } catch (error) {
      Alert.alert('Error', 'Failed to reset background');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🎨</Text>
        <Text style={styles.headerText}>Chat Background</Text>
        <Text style={styles.headerSubText}>{conversationName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default Backgrounds</Text>
        <View style={styles.backgroundGrid}>
          {defaultBackgrounds.map((bg) => (
            <TouchableOpacity
              key={bg.id}
              style={styles.backgroundItem}
              onPress={() => {
                setSelectedBg(bg.id);
                setCustomImage(null);
              }}
            >
              <View style={[styles.backgroundPreview, { backgroundColor: bg.color }]}>
                {selectedBg === bg.id && (
                  <Text style={styles.selectedIcon}>✓</Text>
                )}
              </View>
              <Text style={styles.backgroundName}>{bg.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Background</Text>
        <TouchableOpacity style={styles.customOption} onPress={pickImage}>
          <Text style={styles.customIcon}>📷</Text>
          <View style={styles.customInfo}>
            <Text style={styles.customTitle}>Choose from Gallery</Text>
            <Text style={styles.customDescription}>Set a photo as background</Text>
          </View>
        </TouchableOpacity>
        
        {customImage && (
          <View style={styles.customPreview}>
            <Image source={{ uri: customImage }} style={styles.customImage} />
            <Text style={styles.customLabel}>Custom Background</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.applyButton, loading && styles.buttonDisabled]}
          onPress={applyBackground}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Apply Background</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={resetBackground}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.resetButtonText]}>Reset to Default</Text>
        </TouchableOpacity>
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
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  backgroundItem: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 16,
  },
  backgroundPreview: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  backgroundName: {
    fontSize: 14,
    color: '#333',
  },
  customOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  customIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  customInfo: {
    flex: 1,
  },
  customTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  customDescription: {
    fontSize: 14,
    color: '#666',
  },
  customPreview: {
    margin: 16,
    alignItems: 'center',
  },
  customImage: {
    width: 200,
    height: 300,
    borderRadius: 8,
    marginBottom: 8,
  },
  customLabel: {
    fontSize: 14,
    color: '#666',
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
  applyButton: {
    backgroundColor: '#25D366',
  },
  resetButton: {
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
  resetButtonText: {
    color: '#dc3545',
  },
});
