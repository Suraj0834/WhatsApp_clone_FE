import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from '../../api/axios';

interface Community {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  createdBy: string;
  memberCount: number;
  groupCount: number;
  createdAt: string;
}
export const CommunityInfoScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { communityId } = route.params || {};
  
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchCommunityInfo();
  }, []);

  const fetchCommunityInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/communities/${communityId}`);
      setCommunity(response.data.community);
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      Alert.alert('Error', 'Failed to load community info');
    } finally {
      setLoading(false);
    }
  };

  const leaveCommunity = () => {
    Alert.alert(
      'Leave Community',
      `Leave ${community?.name}? You will also leave all groups in this community.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.post(`/communities/${communityId}/leave`);
              Alert.alert('Success', 'Left community', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to leave community');
            }
          },
        },
      ]
    );
  };

  if (loading || !community) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {community.icon ? (
            <Image source={{ uri: community.icon }} style={styles.icon} />
          ) : (
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconPlaceholderText}>🏘️</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{community.name}</Text>
        {community.description && (
          <Text style={styles.description}>{community.description}</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{community.memberCount}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{community.groupCount}</Text>
          <Text style={styles.statLabel}>Groups</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Options</Text>
        {isAdmin && (
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('CommunitySettings', { communityId })}
          >
            <Text style={styles.optionIcon}>⚙️</Text>
            <Text style={styles.optionText}>Community Settings</Text>
            <Text style={styles.arrow}>›</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>View Members</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionIcon}>📢</Text>
          <Text style={styles.optionText}>Announcements</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionIcon}>🏘️</Text>
          <Text style={styles.optionText}>Community Groups</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionIcon}>📋</Text>
          <Text style={styles.optionText}>Community Guidelines</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ About Communities</Text>
        <Text style={styles.infoText}>
          • Created: {new Date(community.createdAt).toLocaleDateString()}{'\n'}
          • All members can view community info{'\n'}
          • Only admins can manage settings{'\n'}
          • Groups can be linked to communities
        </Text>
      </View>

      <TouchableOpacity style={styles.leaveButton} onPress={leaveCommunity}>
        <Text style={styles.leaveButtonText}>Leave Community</Text>
      </TouchableOpacity>
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
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  iconPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholderText: {
    fontSize: 48,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#25D366',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
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
  leaveButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  leaveButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
});
