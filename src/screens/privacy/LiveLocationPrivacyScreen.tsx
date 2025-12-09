import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from '../../api/axios';

interface ActiveLocationShare {
  id: string;
  conversationId: string;
  conversationName: string;
  expiresAt: string;
  duration: number;
}

export const LiveLocationPrivacyScreen = () => {
  const [loading, setLoading] = useState(false);
  const [activeShares, setActiveShares] = useState<ActiveLocationShare[]>([]);

  useEffect(() => {
    loadActiveShares();
  }, []);

  const loadActiveShares = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/live-location/active');
      setActiveShares(response.data.activeShares || []);
    } catch (error) {
      console.error('Error loading active location shares:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopSharing = async (shareId: string, conversationName: string) => {
    Alert.alert(
      'Stop Sharing',
      `Stop sharing your live location with ${conversationName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`/users/live-location/${shareId}`);
              setActiveShares(activeShares.filter((s) => s.id !== shareId));
            } catch (error) {
              console.error('Error stopping location share:', error);
              Alert.alert('Error', 'Failed to stop sharing location');
            }
          },
        },
      ]
    );
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} minutes remaining`;
    }
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m remaining`;
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
        <Text style={styles.headerText}>Live Location Sharing</Text>
        <Text style={styles.subHeaderText}>
          You're sharing your live location with the following chats
        </Text>
      </View>

      {activeShares.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyText}>No active location shares</Text>
          <Text style={styles.emptySubText}>
            Share your live location from any chat to see it here
          </Text>
        </View>
      ) : (
        <View style={styles.sharesContainer}>
          {activeShares.map((share) => (
            <View key={share.id} style={styles.shareItem}>
              <View style={styles.shareInfo}>
                <Text style={styles.conversationName}>{share.conversationName}</Text>
                <Text style={styles.timeRemaining}>{formatTimeRemaining(share.expiresAt)}</Text>
              </View>
              <TouchableOpacity
                style={styles.stopButton}
                onPress={() => stopSharing(share.id, share.conversationName)}
              >
                <Text style={styles.stopButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>About Live Location</Text>
        <Text style={styles.infoText}>
          • Your live location is end-to-end encrypted{'\n'}
          • You can choose who to share with and for how long{'\n'}
          • You can stop sharing at any time{'\n'}
          • Location is updated every few seconds
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  sharesContainer: {
    marginTop: 16,
  },
  shareItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  shareInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  timeRemaining: {
    fontSize: 14,
    color: '#666',
  },
  stopButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1b5e20',
    lineHeight: 22,
  },
});
