import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Share } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import axios from '../../api/axios';

export const GroupInviteLinkScreen = () => {
  const route = useRoute<any>();
  const { groupId, groupName } = route.params || {};
  
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInviteLink();
  }, []);

  const fetchInviteLink = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/conversations/${groupId}/invite-link`);
      setInviteLink(response.data.inviteLink);
    } catch (error) {
      // Group might not have an invite link yet
      setInviteLink(null);
    } finally {
      setLoading(false);
    }
  };

  const generateLink = async () => {
    try {
      setGenerating(true);
      const response = await axios.post(`/conversations/${groupId}/invite-link`);
      setInviteLink(response.data.inviteLink);
      Alert.alert('Success', 'Invite link generated');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate invite link');
    } finally {
      setGenerating(false);
    }
  };

  const revokeLink = () => {
    Alert.alert(
      'Revoke Invite Link',
      'Are you sure? The old link will stop working and you will need to generate a new one.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`/conversations/${groupId}/invite-link`);
              setInviteLink(null);
              Alert.alert('Success', 'Invite link revoked');
            } catch (error) {
              Alert.alert('Error', 'Failed to revoke link');
            }
          },
        },
      ]
    );
  };

  const copyLink = async () => {
    if (inviteLink) {
      await Clipboard.setStringAsync(inviteLink);
      Alert.alert('Copied', 'Invite link copied to clipboard');
    }
  };

  const shareLink = async () => {
    if (inviteLink) {
      try {
        await Share.share({
          message: `Join my group "${groupName}" on WhatsApp: ${inviteLink}`,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to share link');
      }
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
        <Text style={styles.headerIcon}>🔗</Text>
        <Text style={styles.headerText}>Group Invite Link</Text>
        <Text style={styles.headerSubText}>{groupName}</Text>
      </View>

      {inviteLink ? (
        <>
          <View style={styles.linkContainer}>
            <Text style={styles.linkLabel}>Your invite link:</Text>
            <View style={styles.linkBox}>
              <Text style={styles.linkText} numberOfLines={2}>
                {inviteLink}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={copyLink}>
              <Text style={styles.buttonIcon}>📋</Text>
              <Text style={styles.buttonText}>Copy Link</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={shareLink}>
              <Text style={styles.buttonIcon}>📤</Text>
              <Text style={styles.buttonText}>Share Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.revokeButton]}
              onPress={revokeLink}
            >
              <Text style={styles.buttonIcon}>🚫</Text>
              <Text style={[styles.buttonText, styles.revokeButtonText]}>
                Revoke Link
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ About Invite Links</Text>
            <Text style={styles.infoText}>
              • Anyone with this link can join your group{'\n'}
              • Revoking the link will prevent new members from joining{'\n'}
              • Only group admins can generate or revoke links{'\n'}
              • You'll be notified when someone joins via link
            </Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔗</Text>
            <Text style={styles.emptyTitle}>No Invite Link</Text>
            <Text style={styles.emptyDescription}>
              Generate an invite link to allow others to join this group
            </Text>

            <TouchableOpacity
              style={[styles.generateButton, generating && styles.buttonDisabled]}
              onPress={generateLink}
              disabled={generating}
            >
              {generating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.generateButtonText}>Generate Invite Link</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ What is an invite link?</Text>
            <Text style={styles.infoText}>
              An invite link allows anyone to join your group without needing to be added by an admin. Share it with people you trust.
            </Text>
          </View>
        </>
      )}

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Only share invite links with people you trust. Anyone with the link can join your group.
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
  linkContainer: {
    margin: 16,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  linkBox: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  linkText: {
    fontSize: 14,
    color: '#0d8abc',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  revokeButton: {
    backgroundColor: '#ffebee',
  },
  revokeButtonText: {
    color: '#dc3545',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  generateButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#25D366',
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});
