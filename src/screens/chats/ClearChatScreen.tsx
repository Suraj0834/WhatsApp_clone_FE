import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';

export const ClearChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { conversationId, conversationName } = route.params || {};
  
  const [clearOption, setClearOption] = useState<'all' | 'media' | 'starred'>('all');
  const [clearing, setClearing] = useState(false);

  const clearOptions = [
    {
      id: 'all' as const,
      title: 'Clear All Messages',
      description: 'Delete all messages in this chat',
      icon: '🗑️',
    },
    {
      id: 'media' as const,
      title: 'Clear Media Only',
      description: 'Delete photos, videos, and documents',
      icon: '📷',
    },
    {
      id: 'starred' as const,
      title: 'Clear Except Starred',
      description: 'Keep starred messages',
      icon: '⭐',
    },
  ];

  const confirmClear = () => {
    const option = clearOptions.find((opt) => opt.id === clearOption);
    
    Alert.alert(
      'Clear Chat',
      `Are you sure you want to ${option?.title.toLowerCase()}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearChat },
      ]
    );
  };

  const clearChat = async () => {
    try {
      setClearing(true);
      
      await axios.delete(`/conversations/${conversationId}/messages`, {
        params: { clearOption },
      });

      Alert.alert('Success', 'Chat cleared successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to clear chat');
    } finally {
      setClearing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🗑️</Text>
        <Text style={styles.headerText}>Clear Chat</Text>
        <Text style={styles.headerSubText}>{conversationName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Option</Text>
        {clearOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.option}
            onPress={() => setClearOption(option.id)}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </View>
            {clearOption === option.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>⚠️ Warning</Text>
        <Text style={styles.warningText}>
          • Messages will be deleted only on this device{'\n'}
          • This action cannot be undone{'\n'}
          • Media will remain in your phone's gallery{'\n'}
          • Chat will remain in your chat list
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.clearButton, clearing && styles.buttonDisabled]}
        onPress={confirmClear}
        disabled={clearing}
      >
        {clearing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.clearButtonText}>Clear Chat</Text>
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
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c62828',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#c62828',
    lineHeight: 22,
  },
  clearButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
