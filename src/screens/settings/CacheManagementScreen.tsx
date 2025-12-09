import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
import axios from '../../api/axios';

export const CacheManagementScreen = () => {
  const [clearing, setClearing] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const cacheTypes = [
    {
      id: 'images',
      title: 'Image Cache',
      description: 'Cached photos and profile pictures',
      icon: 'image-multiple',
      color: '#2196F3',
      estimatedSize: '250 MB',
      sizeBytes: 262144000,
    },
    {
      id: 'videos',
      title: 'Video Cache',
      description: 'Cached video thumbnails and previews',
      icon: 'video',
      color: '#9C27B0',
      estimatedSize: '180 MB',
      sizeBytes: 188743680,
    },
    {
      id: 'audio',
      title: 'Audio Cache',
      description: 'Cached voice messages',
      icon: 'music',
      color: '#FF9800',
      estimatedSize: '45 MB',
      sizeBytes: 47185920,
    },
    {
      id: 'stickers',
      title: 'Stickers & GIFs',
      description: 'Downloaded stickers and GIFs',
      icon: 'sticker-emoji',
      color: '#E91E63',
      estimatedSize: '120 MB',
      sizeBytes: 125829120,
    },
    {
      id: 'documents',
      title: 'Document Cache',
      description: 'Cached document previews',
      icon: 'file-document',
      color: '#00BCD4',
      estimatedSize: '95 MB',
      sizeBytes: 99614720,
    },
    {
      id: 'database',
      title: 'Database Cache',
      description: 'Temporary database files',
      icon: 'database',
      color: '#4CAF50',
      estimatedSize: '35 MB',
      sizeBytes: 36700160,
    },
  ];

  const totalSize = cacheTypes.reduce((acc, cache) => acc + cache.sizeBytes, 0);

  const clearCache = async (cacheId: string) => {
    const cache = cacheTypes.find((c) => c.id === cacheId);
    
    try {
      setClearing(cacheId);
      
      await axios.delete(`/cache/${cacheId}`);
      
      setShowConfirm(null);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setClearing(null);
    }
  };

  const clearAllCache = async () => {
    try {
      setClearing('all');
      
      await axios.delete('/cache/all');
      
      setShowConfirm(null);
    } catch (error) {
      console.error('Failed to clear all cache:', error);
    } finally {
      setClearing(null);
    }
  };

  const formatBytes = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  };

  const getPercentage = (bytes: number) => {
    return ((bytes / totalSize) * 100).toFixed(0);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
          <IconButton icon="delete-sweep" iconColor="#4CAF50" size={32} />
        </View>
        <Text style={styles.headerTitle}>Cache Management</Text>
        <Text style={styles.headerSubtitle}>
          Clear temporary files to free up space
        </Text>
        <View style={styles.totalSizeCard}>
          <Text style={styles.totalSizeLabel}>Total Cache Size</Text>
          <Text style={styles.totalSizeValue}>{formatBytes(totalSize)}</Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.section}>
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <IconButton icon="information" iconColor="#2196F3" size={20} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>What is cache?</Text>
            <Text style={styles.infoText}>
              Cache stores temporary files to make WhatsApp faster. Clearing cache will not delete your messages, media, or settings.
            </Text>
          </View>
        </View>
      </View>

      {/* Cache Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clear by Type</Text>
        <View style={styles.cardContainer}>
          {cacheTypes.map((cache, index) => (
            <View key={cache.id}>
              {showConfirm === cache.id ? (
                <View style={styles.confirmCard}>
                  <Text style={styles.confirmTitle}>Clear {cache.title}?</Text>
                  <Text style={styles.confirmText}>
                    This will free up {cache.estimatedSize} of space.
                  </Text>
                  <View style={styles.confirmButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setShowConfirm(null)}
                      disabled={clearing === cache.id}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmButton, clearing === cache.id && styles.buttonDisabled]}
                      onPress={() => clearCache(cache.id)}
                      disabled={clearing === cache.id}
                    >
                      {clearing === cache.id ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.confirmButtonText}>Clear</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.cacheCard,
                    index === cacheTypes.length - 1 && styles.lastCard
                  ]}
                  onPress={() => setShowConfirm(cache.id)}
                  disabled={clearing !== null}
                >
                  <View style={[styles.cacheIconContainer, { backgroundColor: `${cache.color}26` }]}>
                    <IconButton icon={cache.icon} iconColor={cache.color} size={24} />
                  </View>
                  <View style={styles.cacheInfo}>
                    <Text style={styles.cacheTitle}>{cache.title}</Text>
                    <Text style={styles.cacheDescription}>{cache.description}</Text>
                    <View style={styles.sizeRow}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${getPercentage(cache.sizeBytes)}%` as any, backgroundColor: cache.color }
                          ]} 
                        />
                      </View>
                      <Text style={styles.sizeText}>{cache.estimatedSize}</Text>
                    </View>
                  </View>
                  <IconButton icon="delete-outline" iconColor="#666" size={20} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Clear All Button */}
      {showConfirm === 'all' ? (
        <View style={[styles.section, { paddingTop: 0 }]}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Clear All Cache?</Text>
            <Text style={styles.confirmText}>
              This will clear all cached data and free up approximately {formatBytes(totalSize)}. Your messages and media will not be deleted.
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirm(null)}
                disabled={clearing === 'all'}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, clearing === 'all' && styles.buttonDisabled]}
                onPress={clearAllCache}
                disabled={clearing === 'all'}
              >
                {clearing === 'all' ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmButtonText}>Clear All</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.clearAllButton, clearing !== null && styles.buttonDisabled]}
            onPress={() => setShowConfirm('all')}
            disabled={clearing !== null}
          >
            <IconButton icon="delete-sweep" iconColor="#fff" size={20} />
            <Text style={styles.clearAllButtonText}>Clear All Cache</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Warning Card */}
      <View style={styles.section}>
        <View style={styles.warningCard}>
          <View style={styles.warningIconContainer}>
            <IconButton icon="alert-circle" iconColor="#FF9800" size={20} />
          </View>
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Important Notes</Text>
            <Text style={styles.warningText}>
              • Clearing cache will temporarily slow down WhatsApp{'\n'}
              • Media will be re-downloaded when viewed{'\n'}
              • Profile pictures will reload{'\n'}
              • App may take longer to open initially
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
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
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  totalSizeCard: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  totalSizeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  totalSizeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoIconContainer: {
    marginRight: 8,
    marginTop: -4,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cacheCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastCard: {
    borderBottomWidth: 0,
  },
  cacheIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cacheInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cacheTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cacheDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  sizeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    minWidth: 60,
    textAlign: 'right',
  },
  confirmCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#dc3545',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  clearAllButton: {
    backgroundColor: '#dc3545',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  clearAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  warningIconContainer: {
    marginRight: 8,
    marginTop: -4,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 6,
  },
  warningText: {
    fontSize: 13,
    color: '#F57C00',
    lineHeight: 20,
  },
});
