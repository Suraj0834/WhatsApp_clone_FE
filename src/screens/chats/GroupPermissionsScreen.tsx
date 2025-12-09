import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';

interface GroupPermissions {
  sendMessages: 'all' | 'admins';
  editGroupInfo: 'all' | 'admins';
  approveNewMembers: boolean;
}

export const GroupPermissionsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { groupId, groupName } = route.params || {};
  
  const [permissions, setPermissions] = useState<GroupPermissions>({
    sendMessages: 'all',
    editGroupInfo: 'admins',
    approveNewMembers: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/conversations/${groupId}/permissions`);
      setPermissions(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (key: keyof GroupPermissions, value: any) => {
    try {
      setSaving(true);
      const updated = { ...permissions, [key]: value };
      setPermissions(updated);
      
      await axios.put(`/conversations/${groupId}/permissions`, updated);
      
      Alert.alert('Success', 'Permission updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update permission');
      fetchPermissions(); // Revert on error
    } finally {
      setSaving(false);
    }
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
        <Text style={styles.headerIcon}>🔐</Text>
        <Text style={styles.headerText}>Group Permissions</Text>
        <Text style={styles.headerSubText}>{groupName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Messages</Text>
        <View style={styles.option}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>All Members</Text>
            <Text style={styles.optionDescription}>
              Everyone can send messages
            </Text>
          </View>
          <Switch
            value={permissions.sendMessages === 'all'}
            onValueChange={(value) =>
              updatePermission('sendMessages', value ? 'all' : 'admins')
            }
            trackColor={{ false: '#ccc', true: '#25D366' }}
            disabled={saving}
          />
        </View>
        <View style={styles.option}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Only Admins</Text>
            <Text style={styles.optionDescription}>
              Only admins can send messages
            </Text>
          </View>
          <Switch
            value={permissions.sendMessages === 'admins'}
            onValueChange={(value) =>
              updatePermission('sendMessages', value ? 'admins' : 'all')
            }
            trackColor={{ false: '#ccc', true: '#25D366' }}
            disabled={saving}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Edit Group Info</Text>
        <View style={styles.option}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>All Members</Text>
            <Text style={styles.optionDescription}>
              Everyone can edit group subject, icon, and description
            </Text>
          </View>
          <Switch
            value={permissions.editGroupInfo === 'all'}
            onValueChange={(value) =>
              updatePermission('editGroupInfo', value ? 'all' : 'admins')
            }
            trackColor={{ false: '#ccc', true: '#25D366' }}
            disabled={saving}
          />
        </View>
        <View style={styles.option}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Only Admins</Text>
            <Text style={styles.optionDescription}>
              Only admins can edit group info
            </Text>
          </View>
          <Switch
            value={permissions.editGroupInfo === 'admins'}
            onValueChange={(value) =>
              updatePermission('editGroupInfo', value ? 'admins' : 'all')
            }
            trackColor={{ false: '#ccc', true: '#25D366' }}
            disabled={saving}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Member Approval</Text>
        <View style={styles.option}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Approve New Members</Text>
            <Text style={styles.optionDescription}>
              Admins must approve new members before they can join
            </Text>
          </View>
          <Switch
            value={permissions.approveNewMembers}
            onValueChange={(value) => updatePermission('approveNewMembers', value)}
            trackColor={{ false: '#ccc', true: '#25D366' }}
            disabled={saving}
          />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ About Permissions</Text>
        <Text style={styles.infoText}>
          • Only group admins can change permissions{'\n'}
          • Changes apply to all members{'\n'}
          • Admins always have full access{'\n'}
          • Members will be notified of changes
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
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionInfo: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
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
