import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import axios from '../../api/axios';

interface StatusReply {
  _id: string;
  statusId: string;
  fromUser: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  replyText: string;
  createdAt: string;
  statusPreview: string;
}

export const StatusRepliesScreen = () => {
  const [replies, setReplies] = useState<StatusReply[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReplies();
  }, []);

  const fetchReplies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/status/replies');
      setReplies(response.data);
    } catch (error) {
      console.error('Failed to fetch replies');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderReply = ({ item }: { item: StatusReply }) => (
    <TouchableOpacity style={styles.replyItem}>
      <View style={styles.replyHeader}>
        <View style={styles.avatar}>
          {item.fromUser.profilePicture ? (
            <Image source={{ uri: item.fromUser.profilePicture }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {item.fromUser.username.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.replyHeaderInfo}>
          <Text style={styles.username}>{item.fromUser.username}</Text>
          <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
      
      <View style={styles.statusPreview}>
        <Text style={styles.statusPreviewLabel}>Replied to your status:</Text>
        <Text style={styles.statusPreviewText} numberOfLines={2}>
          {item.statusPreview}
        </Text>
      </View>

      <View style={styles.replyContent}>
        <Text style={styles.replyText}>{item.replyText}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && replies.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>💬</Text>
        <Text style={styles.headerText}>Status Replies</Text>
        <Text style={styles.headerSubText}>
          {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
        </Text>
      </View>

      {replies.length > 0 ? (
        <FlatList
          data={replies}
          keyExtractor={(item) => item._id}
          renderItem={renderReply}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No Replies Yet</Text>
          <Text style={styles.emptyDescription}>
            Replies to your status updates will appear here
          </Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ About Status Replies</Text>
        <Text style={styles.infoText}>
          • Only you can see replies to your status{'\n'}
          • Replies are private messages{'\n'}
          • They don't appear in the status thread{'\n'}
          • Status must be visible to reply
        </Text>
      </View>
    </View>
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
  listContent: {
    paddingVertical: 8,
  },
  replyItem: {
    padding: 16,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  replyHeaderInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  statusPreview: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#25D366',
    marginBottom: 12,
  },
  statusPreviewLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statusPreviewText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  replyContent: {
    backgroundColor: '#dcf8c6',
    padding: 12,
    borderRadius: 8,
  },
  replyText: {
    fontSize: 16,
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
});
