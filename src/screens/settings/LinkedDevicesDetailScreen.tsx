import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import axios from '../../api/axios';

interface LinkedDevice {
  _id: string;
  deviceName: string;
  deviceType: string;
  browser?: string;
  os?: string;
  lastActive: string;
  linkedAt: string;
}

export const LinkedDevicesDetailScreen = () => {
  const [devices, setDevices] = useState<LinkedDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [unlinking, setUnlinking] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/linked-devices');
      setDevices(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load linked devices');
    } finally {
      setLoading(false);
    }
  };

  const unlinkDevice = (deviceId: string) => {
    const device = devices.find((d) => d._id === deviceId);
    
    Alert.alert(
      'Unlink Device',
      `Unlink ${device?.deviceName}? You'll need to scan the QR code again to use WhatsApp on this device.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: async () => {
            try {
              setUnlinking(deviceId);
              await axios.delete(`/users/linked-devices/${deviceId}`);
              setDevices(devices.filter((d) => d._id !== deviceId));
              Alert.alert('Success', 'Device unlinked');
            } catch (error) {
              Alert.alert('Error', 'Failed to unlink device');
            } finally {
              setUnlinking(null);
            }
          },
        },
      ]
    );
  };

  const formatLastActive = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getDeviceIcon = (deviceType: string): { icon: string, color: string } => {
    switch (deviceType.toLowerCase()) {
      case 'desktop':
        return { icon: 'laptop', color: '#2196F3' };
      case 'tablet':
        return { icon: 'tablet', color: '#9C27B0' };
      case 'mobile':
        return { icon: 'cellphone', color: '#4CAF50' };
      default:
        return { icon: 'devices', color: '#607D8B' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.devicesIcon}>
          <IconButton icon="devices" iconColor="#2196F3" size={32} />
        </View>
        <Text style={styles.headerTitle}>Linked Devices</Text>
        <Text style={styles.headerSubtitle}>
          {devices.length} {devices.length === 1 ? 'device' : 'devices'} connected
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#25D366" />
          <Text style={styles.loadingText}>Loading devices...</Text>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <IconButton icon="link-off" iconColor="#8696A0" size={48} />
          </View>
          <Text style={styles.emptyTitle}>No linked devices</Text>
          <Text style={styles.emptyText}>
            Link a device by scanning a QR code from another phone
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.listContainer}>
          <View style={styles.cardContainer}>
            {devices.map((device, index) => {
              const deviceIcon = getDeviceIcon(device.deviceType);
              return (
                <View
                  key={device._id}
                  style={[
                    styles.deviceCard,
                    index === devices.length - 1 && styles.lastCard
                  ]}
                >
                  <View style={styles.deviceLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: `${deviceIcon.color}15` }]}>
                      <IconButton
                        icon={deviceIcon.icon}
                        size={24}
                        iconColor={deviceIcon.color}
                        style={styles.iconButton}
                      />
                    </View>
                    <View style={styles.deviceInfo}>
                      <Text style={styles.deviceName}>{device.deviceName}</Text>
                      <Text style={styles.deviceDetails}>
                        {device.browser && `${device.browser} · `}
                        {device.os}
                      </Text>
                      <Text style={styles.deviceActivity}>
                        Last active: {formatLastActive(device.lastActive)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.unlinkButton}
                    onPress={() => unlinkDevice(device._id)}
                    disabled={unlinking === device._id}
                    activeOpacity={0.8}
                  >
                    {unlinking === device._id ? (
                      <ActivityIndicator size="small" color="#F44336" />
                    ) : (
                      <Text style={styles.unlinkText}>Unlink</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <IconButton icon="information" iconColor="#2196F3" size={20} />
            </View>
            <Text style={styles.infoText}>
              Your messages are end-to-end encrypted on all linked devices
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  devicesIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#667781',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#667781',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#667781',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  lastCard: {
    borderBottomWidth: 0,
  },
  deviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    margin: 0,
  },
  deviceInfo: {
    marginLeft: 14,
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  deviceDetails: {
    fontSize: 13,
    color: '#667781',
    marginBottom: 2,
  },
  deviceActivity: {
    fontSize: 12,
    color: '#8696A0',
  },
  unlinkButton: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  unlinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F44336',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoIconContainer: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#667781',
    lineHeight: 16,
  },
});
