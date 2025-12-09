import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from '../../api/axios';

interface StorageData {
  total: number;
  used: number;
  breakdown: {
    photos: number;
    videos: number;
    audio: number;
    documents: number;
    other: number;
  };
}

export const StorageBreakdownScreen = () => {
  const [storage, setStorage] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStorageData();
  }, []);

  const fetchStorageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/storage');
      setStorage(response.data);
    } catch (error) {
      console.error('Failed to fetch storage');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPercentage = (value: number, total: number): number => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  if (loading || !storage) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  const categories = [
    { key: 'photos', label: 'Photos', icon: '📷', color: '#3b82f6' },
    { key: 'videos', label: 'Videos', icon: '🎥', color: '#f59e0b' },
    { key: 'audio', label: 'Audio', icon: '🎵', color: '#10b981' },
    { key: 'documents', label: 'Documents', icon: '📄', color: '#8b5cf6' },
    { key: 'other', label: 'Other', icon: '📦', color: '#6b7280' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>💾</Text>
        <Text style={styles.headerText}>Storage Breakdown</Text>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Storage Used</Text>
        <Text style={styles.totalValue}>{formatSize(storage.used)}</Text>
        <Text style={styles.totalSubtext}>
          of {formatSize(storage.total)} total
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${getPercentage(storage.used, storage.total)}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage by Type</Text>
        {categories.map((category) => {
          const size = storage.breakdown[category.key as keyof typeof storage.breakdown];
          const percentage = getPercentage(size, storage.used);
          
          return (
            <View key={category.key} style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                  <View style={styles.categoryBar}>
                    <View
                      style={[
                        styles.categoryBarFill,
                        { width: `${percentage}%`, backgroundColor: category.color },
                      ]}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.categoryRight}>
                <Text style={styles.categorySize}>{formatSize(size)}</Text>
                <Text style={styles.categoryPercent}>{percentage.toFixed(1)}%</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Free Up Space</Text>
        <Text style={styles.infoText}>
          • Delete unwanted media files{'\n'}
          • Clear chats you no longer need{'\n'}
          • Disable auto-download for media{'\n'}
          • Review and delete large files
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
  },
  totalContainer: {
    alignItems: 'center',
    padding: 24,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  totalSubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#25D366',
    borderRadius: 4,
  },
  section: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
    marginRight: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  categoryBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categorySize: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryPercent: {
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
});
