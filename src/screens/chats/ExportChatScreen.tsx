import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';
import axios from '../../api/axios';

export const ExportChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { conversationId, conversationName } = route.params || {};
  
  const [includeMedia, setIncludeMedia] = useState(false);
  const [format, setFormat] = useState<'txt' | 'pdf'>('txt');
  const [exporting, setExporting] = useState(false);

  const exportChat = async () => {
    try {
      setExporting(true);
      
      const response = await axios.post(`/conversations/${conversationId}/export`, {
        includeMedia,
        format,
      });

      const { exportUrl, filename } = response.data;

      // Open email composer with the export file
      const isAvailable = await MailComposer.isAvailableAsync();
      
      if (isAvailable) {
        await MailComposer.composeAsync({
          subject: `WhatsApp Chat Export - ${conversationName}`,
          body: 'Attached is your WhatsApp chat export.',
          attachments: [exportUrl],
        });
      } else {
        Alert.alert('Success', `Chat exported to: ${filename}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export chat');
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📤</Text>
        <Text style={styles.headerText}>Export Chat</Text>
        <Text style={styles.headerSubText}>{conversationName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export Format</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => setFormat('txt')}
        >
          <Text style={styles.optionText}>Text File (.txt)</Text>
          {format === 'txt' && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => setFormat('pdf')}
        >
          <Text style={styles.optionText}>PDF Document (.pdf)</Text>
          {format === 'pdf' && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Include Media</Text>
            <Text style={styles.settingDescription}>
              Export photos, videos, and documents
            </Text>
          </View>
          <Switch
            value={includeMedia}
            onValueChange={setIncludeMedia}
            trackColor={{ false: '#ccc', true: '#25D366' }}
          />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>What gets exported?</Text>
        <Text style={styles.infoText}>
          • All text messages{'\n'}
          • Message timestamps{'\n'}
          • Sender information{'\n'}
          {includeMedia && '• Media files (photos, videos, documents)'}
        </Text>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Exported chats are not end-to-end encrypted. Keep them secure.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.exportButton, exporting && styles.buttonDisabled]}
        onPress={exportChat}
        disabled={exporting}
      >
        {exporting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.exportButtonText}>Export Chat</Text>
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
    paddingHorizontal: 16,
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
    lineHeight: 22,
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
  exportButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#25D366',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
