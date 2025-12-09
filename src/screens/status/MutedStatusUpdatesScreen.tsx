import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import axios from '../../api/axios';

interface MutedStatus {
  userId: string;
  username: string;
  profilePicture?: string;
  mutedAt: string;
}

export const MutedStatusUpdatesScreen = () => {
  const [mutedUsers, setMutedUsers] = useState<MutedStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [unmuting, setUnmuting] = useState<string | null>(null);

  useEffect(() => {
    fetchMutedUsers();
  }, []);

  const fetchMutedUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/status/muted');
      setMutedUsers(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load muted status updates');
    } finally {
      setLoading(false);
    }
  };

  const unmuteUser = async (userId: string) => {
    try {
      setUnmuting(userId);
      
      await axios.delete(`/status/${userId}/mute`);
      
      setMutedUsers(mutedUsers.filter((u) => u.userId !== userId));
      Alert.alert('Success', 'Status updates unmuted');
    } catch (error) {
      Alert.alert('Error', 'Failed to unmute status updates');
    } finally {
      setUnmuting(null);
    }
  };

  const unmuteAll = () => {
    Alert.alert(
      'Unmute All',
      'Unmute status updates from all contacts?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unmute All',
          onPress: async () => {
            try {
              setLoading(true);
              
              await axios.delete('/status/mute/all');
              
              setMutedUsers([]);
              Alert.alert('Success', 'All status updates unmuted');
            } catch (error) {
              Alert.alert('Error', 'Failed to unmute all');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderMutedUser = ({ item }: { item: MutedStatus }) => (
    <View style={styles.userItem}>
      <View style={styles.userLeft}>
        <View style={styles.avatar}>
          {item.profilePicture ? (
            <Image source={{ uri: item.profilePicture }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.mutedText}>
            Muted {new Date(item.mutedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.unmuteButton, unmuting === item.userId && styles.buttonDisabled]}
        onPress={() => unmuteUser(item.userId)}
        disabled={unmuting === item.userId}
      >
        {unmuting === item.userId ? (
          <ActivityIndicator color="#25D366" size="small" />
        ) : (
          <Text style={styles.unmuteButtonText}>Unmute</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading && mutedUsers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🔕</Text>
        <Text style={styles.headerText}>Muted Status Updates</Text>
        <Text style={styles.headerSubText}>
          {mutedUsers.length} {mutedUsers.length === 1 ? 'contact' : 'contacts'} muted
        </Text>
      </View>

      {mutedUsers.length > 0 ? (
        <>
          <FlatList
            data={mutedUsers}
            keyExtractor={(item) => item.userId}
            renderItem={renderMutedUser}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
          />
          <TouchableOpacity style={styles.unmuteAllButton} onPress={unmuteAll}>
            <Text style={styles.unmuteAllButtonText}>Unmute All</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👀</Text>
          <Text style={styles.emptyTitle}>No Muted Status Updates</Text>
          <Text style={styles.emptyDescription}>
            You haven't muted anyone's status updates yet
          </Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ About Muting</Text>
        <Text style={styles.infoText}>
          • Muted contacts won't know they're muted{'\n'}
          • You can still view their status manually{'\n'}
          • Their statuses won't appear in your feed{'\n'}
          • Unmute anytime to see their updates again
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
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  mutedText: {
    fontSize: 12,
    color: '#999',
  },
  unmuteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#25D366',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  unmuteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#25D366',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 76,
  },
  unmuteAllButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#25D366',
    borderRadius: 8,
    alignItems: 'center',
  },
  unmuteAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
