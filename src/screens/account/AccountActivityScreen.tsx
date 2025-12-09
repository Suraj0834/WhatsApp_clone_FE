import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import axios from '../../api/axios';

interface ActivityLog {
  id: string;
  type: 'login' | 'logout' | 'password_change' | 'device_linked' | 'security_change';
  timestamp: string;
  device: string;
  location: string;
  ipAddress: string;
}

export const AccountActivityScreen = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/account/activity');
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error('Error loading account activity:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return '🔓';
      case 'logout':
        return '🔒';
      case 'password_change':
        return '🔑';
      case 'device_linked':
        return '📱';
      case 'security_change':
        return '🛡️';
      default:
        return '📋';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'login':
        return 'Logged in';
      case 'logout':
        return 'Logged out';
      case 'password_change':
        return 'Password changed';
      case 'device_linked':
        return 'Device linked';
      case 'security_change':
        return 'Security setting changed';
      default:
        return 'Activity';
    }
  };

  const formatTimestamp = (timestamp: string) => {
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

  if (loading && activities.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadActivity(); }} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Account Activity</Text>
        <Text style={styles.headerSubText}>
          Recent security and login activity on your account
        </Text>
      </View>

      {activities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No recent activity</Text>
        </View>
      ) : (
        <View style={styles.activityList}>
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityLabel}>{getActivityLabel(activity.type)}</Text>
                <Text style={styles.activityDevice}>{activity.device}</Text>
                <Text style={styles.activityLocation}>
                  {activity.location} • {activity.ipAddress}
                </Text>
                <Text style={styles.activityTime}>{formatTimestamp(activity.timestamp)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Stay Secure</Text>
        <Text style={styles.infoText}>
          Review your account activity regularly. If you see anything suspicious, change your password immediately and enable two-step verification.
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
    color: '#333',
    marginBottom: 8,
  },
  headerSubText: {
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
    fontSize: 16,
    color: '#666',
  },
  activityList: {
    paddingTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  activityIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDevice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  activityLocation: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
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
    lineHeight: 20,
  },
});
