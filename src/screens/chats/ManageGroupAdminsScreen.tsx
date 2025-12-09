import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from '../../api/axios';

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  isAdmin: boolean;
}

export const ManageGroupAdminsScreen = () => {
  const route = useRoute<any>();
  const { groupId, groupName } = route.params || {};
  
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/conversations/${groupId}/participants`);
      setMembers(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    const action = currentIsAdmin ? 'remove' : 'promote';
    const actionText = currentIsAdmin ? 'remove admin rights from' : 'promote to admin';
    const member = members.find((m) => m._id === userId);

    Alert.alert(
      `${currentIsAdmin ? 'Remove Admin' : 'Promote to Admin'}`,
      `Are you sure you want to ${actionText} ${member?.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'promote' ? 'Promote' : 'Remove',
          style: action === 'remove' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              setProcessing(userId);
              
              await axios.put(`/conversations/${groupId}/admins`, {
                userId,
                action,
              });

              // Update local state
              setMembers(
                members.map((m) =>
                  m._id === userId ? { ...m, isAdmin: !currentIsAdmin } : m
                )
              );

              Alert.alert('Success', `${member?.username} ${action === 'promote' ? 'is now an admin' : 'is no longer an admin'}`);
            } catch (error) {
              Alert.alert('Error', `Failed to ${actionText} member`);
            } finally {
              setProcessing(null);
            }
          },
        },
      ]
    );
  };

  const renderMember = ({ item }: { item: User }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{item.username}</Text>
          {item.isAdmin && <Text style={styles.adminBadge}>Group Admin</Text>}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          item.isAdmin ? styles.removeButton : styles.promoteButton,
          processing === item._id && styles.buttonDisabled,
        ]}
        onPress={() => toggleAdmin(item._id, item.isAdmin)}
        disabled={processing === item._id}
      >
        {processing === item._id ? (
          <ActivityIndicator color={item.isAdmin ? '#dc3545' : '#25D366'} size="small" />
        ) : (
          <Text
            style={[
              styles.actionButtonText,
              item.isAdmin ? styles.removeButtonText : styles.promoteButtonText,
            ]}
          >
            {item.isAdmin ? 'Remove Admin' : 'Make Admin'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  const admins = members.filter((m) => m.isAdmin);
  const nonAdmins = members.filter((m) => !m.isAdmin);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>👑</Text>
        <Text style={styles.headerText}>Manage Admins</Text>
        <Text style={styles.headerSubText}>{groupName}</Text>
        <Text style={styles.countText}>
          {admins.length} {admins.length === 1 ? 'admin' : 'admins'} • {members.length} total members
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Admin Privileges</Text>
        <Text style={styles.infoText}>
          • Change group subject, icon, and description{'\n'}
          • Add/remove members{'\n'}
          • Promote/demote admins{'\n'}
          • Change group settings{'\n'}
          • Send messages (when restricted to admins)
        </Text>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item._id}
        renderItem={renderMember}
        ListHeaderComponent={
          <View>
            {admins.length > 0 && (
              <Text style={styles.sectionTitle}>ADMINS ({admins.length})</Text>
            )}
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
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
    marginBottom: 4,
  },
  countText: {
    fontSize: 12,
    color: '#999',
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  memberInfo: {
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
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  adminBadge: {
    fontSize: 12,
    color: '#25D366',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  promoteButton: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#25D366',
  },
  removeButton: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  promoteButtonText: {
    color: '#25D366',
  },
  removeButtonText: {
    color: '#dc3545',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 76,
  },
});
