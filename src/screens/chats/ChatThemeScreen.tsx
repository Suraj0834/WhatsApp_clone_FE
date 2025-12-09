import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    bubble: string;
  };
}

export const ChatThemeScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { conversationId, conversationName } = route.params || {};
  
  const [selectedTheme, setSelectedTheme] = useState<string>('default');
  const [loading, setLoading] = useState(false);

  const themes: ThemeOption[] = [
    {
      id: 'default',
      name: 'Classic WhatsApp',
      description: 'Traditional green theme',
      colors: {
        primary: '#25D366',
        secondary: '#128C7E',
        background: '#ece5dd',
        text: '#000',
        bubble: '#dcf8c6',
      },
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Easy on the eyes',
      colors: {
        primary: '#00a884',
        secondary: '#008069',
        background: '#0b141a',
        text: '#fff',
        bubble: '#005c4b',
      },
    },
    {
      id: 'ocean',
      name: 'Ocean Blue',
      description: 'Calm blue tones',
      colors: {
        primary: '#0d8abc',
        secondary: '#075985',
        background: '#e0f2fe',
        text: '#0c4a6e',
        bubble: '#bae6fd',
      },
    },
    {
      id: 'sunset',
      name: 'Sunset Orange',
      description: 'Warm and vibrant',
      colors: {
        primary: '#f97316',
        secondary: '#ea580c',
        background: '#fff7ed',
        text: '#7c2d12',
        bubble: '#fed7aa',
      },
    },
    {
      id: 'lavender',
      name: 'Lavender Dream',
      description: 'Soft purple shades',
      colors: {
        primary: '#a855f7',
        secondary: '#7e22ce',
        background: '#faf5ff',
        text: '#581c87',
        bubble: '#e9d5ff',
      },
    },
    {
      id: 'forest',
      name: 'Forest Green',
      description: 'Natural earthy tones',
      colors: {
        primary: '#22c55e',
        secondary: '#15803d',
        background: '#f0fdf4',
        text: '#14532d',
        bubble: '#bbf7d0',
      },
    },
  ];

  const applyTheme = async () => {
    try {
      setLoading(true);
      
      await axios.put(`/conversations/${conversationId}/theme`, {
        themeId: selectedTheme,
      });

      Alert.alert('Success', 'Chat theme updated', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update theme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🎨</Text>
        <Text style={styles.headerText}>Chat Theme</Text>
        <Text style={styles.headerSubText}>{conversationName}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Personalize your chat with custom colors. Changes only apply to this conversation.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose a Theme</Text>
        {themes.map((theme) => (
          <TouchableOpacity
            key={theme.id}
            style={[
              styles.themeOption,
              selectedTheme === theme.id && styles.themeOptionSelected,
            ]}
            onPress={() => setSelectedTheme(theme.id)}
          >
            <View style={styles.themeInfo}>
              <Text style={styles.themeName}>{theme.name}</Text>
              <Text style={styles.themeDescription}>{theme.description}</Text>
            </View>
            
            <View style={styles.colorPalette}>
              <View style={[styles.colorCircle, { backgroundColor: theme.colors.primary }]} />
              <View style={[styles.colorCircle, { backgroundColor: theme.colors.secondary }]} />
              <View style={[styles.colorCircle, { backgroundColor: theme.colors.bubble }]} />
            </View>

            {selectedTheme === theme.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.previewBox}>
        <Text style={styles.previewTitle}>Preview</Text>
        <View style={[styles.preview, { backgroundColor: themes.find((t) => t.id === selectedTheme)?.colors.background }]}>
          <View style={[styles.receivedBubble, { backgroundColor: '#fff' }]}>
            <Text style={styles.bubbleText}>Hey! How are you?</Text>
          </View>
          <View style={[styles.sentBubble, { backgroundColor: themes.find((t) => t.id === selectedTheme)?.colors.bubble }]}>
            <Text style={styles.bubbleText}>I'm doing great! Thanks for asking 😊</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.applyButton, loading && styles.buttonDisabled]}
        onPress={applyTheme}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.applyButtonText}>Apply Theme</Text>
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
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  themeOptionSelected: {
    backgroundColor: '#f0f9ff',
  },
  themeInfo: {
    flex: 1,
    marginRight: 12,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 14,
    color: '#666',
  },
  colorPalette: {
    flexDirection: 'row',
    marginRight: 12,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  checkmark: {
    fontSize: 18,
    color: '#25D366',
  },
  previewBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  preview: {
    padding: 12,
    borderRadius: 8,
    minHeight: 120,
  },
  receivedBubble: {
    alignSelf: 'flex-start',
    maxWidth: '70%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  sentBubble: {
    alignSelf: 'flex-end',
    maxWidth: '70%',
    padding: 10,
    borderRadius: 8,
  },
  bubbleText: {
    fontSize: 14,
    color: '#000',
  },
  applyButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#25D366',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
