import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import axios from '../../api/axios';

interface QuickReply {
  _id: string;
  shortcut: string;
  message: string;
  createdAt: string;
}

export const QuickRepliesScreen = () => {
  const [replies, setReplies] = useState<QuickReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [shortcut, setShortcut] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReplies();
  }, []);

  const fetchReplies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/business/quick-replies');
      setReplies(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load quick replies');
    } finally {
      setLoading(false);
    }
  };

  const saveReply = async () => {
    if (!shortcut.trim() || !message.trim()) {
      Alert.alert('Error', 'Please enter both shortcut and message');
      return;
    }

    try {
      if (editing) {
        await axios.put(`/business/quick-replies/${editing}`, {
          shortcut: shortcut.trim(),
          message: message.trim(),
        });
      } else {
        await axios.post('/business/quick-replies', {
          shortcut: shortcut.trim(),
          message: message.trim(),
        });
      }
      
      fetchReplies();
      setEditing(null);
      setShortcut('');
      setMessage('');
      Alert.alert('Success', editing ? 'Quick reply updated' : 'Quick reply created');
    } catch (error) {
      Alert.alert('Error', 'Failed to save quick reply');
    }
  };

  const deleteReply = (id: string) => {
    Alert.alert('Delete Quick Reply', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`/business/quick-replies/${id}`);
            setReplies(replies.filter((r) => r._id !== id));
            Alert.alert('Success', 'Quick reply deleted');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete quick reply');
          }
        },
      },
    ]);
  };

  const editReply = (reply: QuickReply) => {
    setEditing(reply._id);
    setShortcut(reply.shortcut);
    setMessage(reply.message);
  };

  const renderReply = ({ item }: { item: QuickReply }) => (
    <View style={styles.replyItem}>
      <View style={styles.replyContent}>
        <View style={styles.shortcutBadge}>
          <Text style={styles.shortcutText}>/{item.shortcut}</Text>
        </View>
        <Text style={styles.replyMessage}>{item.message}</Text>
      </View>
      <View style={styles.replyActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => editReply(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteReply(item._id)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⚡</Text>
        <Text style={styles.headerText}>Quick Replies</Text>
        <Text style={styles.headerSubText}>
          {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {editing ? 'Edit Quick Reply' : 'New Quick Reply'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Shortcut (e.g., hello, thanks)"
          placeholderTextColor="#999"
          value={shortcut}
          onChangeText={setShortcut}
          maxLength={20}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Message text..."
          placeholderTextColor="#999"
          multiline
          value={message}
          onChangeText={setMessage}
          maxLength={500}
          textAlignVertical="top"
        />
        <View style={styles.formButtons}>
          {editing && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setEditing(null);
                setShortcut('');
                setMessage('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={saveReply}
          >
            <Text style={styles.saveButtonText}>
              {editing ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 How to use</Text>
        <Text style={styles.infoText}>
          Type "/" followed by your shortcut in any chat to quickly insert saved messages.
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#25D366" />
        </View>
      ) : replies.length > 0 ? (
        <FlatList
          data={replies}
          keyExtractor={(item) => item._id}
          renderItem={renderReply}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⚡</Text>
          <Text style={styles.emptyText}>No quick replies yet</Text>
        </View>
      )}
    </View>
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
  formContainer: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    maxHeight: 120,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#25D366',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    margin: 16,
    marginBottom: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  replyItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  replyContent: {
    marginBottom: 12,
  },
  shortcutBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  shortcutText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  replyMessage: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e8f5e9',
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#25D366',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  deleteButtonText: {
    color: '#dc3545',
  },
  separator: {
    height: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
