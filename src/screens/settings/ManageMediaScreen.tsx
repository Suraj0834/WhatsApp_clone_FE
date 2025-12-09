import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import axios from '../../api/axios';

interface MediaFile {
  _id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  createdAt: string;
  conversationId: string;
}

export const ManageMediaScreen = () => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'audio' | 'document'>('all');

  useEffect(() => {
    fetchMedia();
  }, [filter]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/media', {
        params: filter !== 'all' ? { type: filter } : undefined,
      });
      setMedia(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number): string => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === media.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(media.map((m) => m._id)));
    }
  };

  const deleteSelected = () => {
    Alert.alert(
      'Delete Media',
      `Delete ${selectedItems.size} ${selectedItems.size === 1 ? 'item' : 'items'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await axios.delete('/media', {
                data: { ids: Array.from(selectedItems) },
              });
              setMedia(media.filter((m) => !selectedItems.has(m._id)));
              setSelectedItems(new Set());
              Alert.alert('Success', 'Media deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete media');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const renderMediaItem = ({ item }: { item: MediaFile }) => {
    const isSelected = selectedItems.has(item._id);
    
    return (
      <TouchableOpacity
        style={[styles.mediaItem, isSelected && styles.mediaItemSelected]}
        onPress={() => toggleSelection(item._id)}
      >
        {item.type === 'image' && (
          <Image source={{ uri: item.url }} style={styles.thumbnail} />
        )}
        {item.type === 'video' && (
          <View style={[styles.thumbnail, styles.videoThumbnail]}>
            <Text style={styles.thumbnailIcon}>🎥</Text>
          </View>
        )}
        {item.type === 'audio' && (
          <View style={[styles.thumbnail, styles.audioThumbnail]}>
            <Text style={styles.thumbnailIcon}>🎵</Text>
          </View>
        )}
        {item.type === 'document' && (
          <View style={[styles.thumbnail, styles.docThumbnail]}>
            <Text style={styles.thumbnailIcon}>📄</Text>
          </View>
        )}
        <View style={styles.mediaInfo}>
          <Text style={styles.mediaSize}>{formatSize(item.size)}</Text>
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Photos', value: 'image' as const },
    { label: 'Videos', value: 'video' as const },
    { label: 'Audio', value: 'audio' as const },
    { label: 'Docs', value: 'document' as const },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterButton, filter === f.value && styles.filterButtonActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedItems.size > 0 && (
        <View style={styles.selectionBar}>
          <TouchableOpacity onPress={selectAll}>
            <Text style={styles.selectionAction}>
              {selectedItems.size === media.length ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.selectionCount}>{selectedItems.size} selected</Text>
          <TouchableOpacity onPress={deleteSelected} disabled={deleting}>
            {deleting ? (
              <ActivityIndicator color="#dc3545" size="small" />
            ) : (
              <Text style={styles.deleteAction}>Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#25D366" />
        </View>
      ) : (
        <FlatList
          data={media}
          keyExtractor={(item) => item._id}
          renderItem={renderMediaItem}
          numColumns={3}
          contentContainerStyle={styles.mediaGrid}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📁</Text>
              <Text style={styles.emptyText}>No media found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectionAction: {
    fontSize: 14,
    color: '#0d8abc',
    fontWeight: '600',
  },
  selectionCount: {
    fontSize: 14,
    color: '#666',
  },
  deleteAction: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaGrid: {
    padding: 4,
  },
  mediaItem: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaItemSelected: {
    borderWidth: 3,
    borderColor: '#25D366',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  videoThumbnail: {
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioThumbnail: {
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docThumbnail: {
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailIcon: {
    fontSize: 32,
  },
  mediaInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
  },
  mediaSize: {
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
