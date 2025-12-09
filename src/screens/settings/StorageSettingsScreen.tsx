import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { IconButton, ProgressBar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import settingsAPI from '../../services/settingsAPI';

interface StorageItem {
    type: string;
    icon: string;
    size: number;
    count: number;
    color: string;
}

export const StorageSettingsScreen = () => {
    const navigation = useNavigation<any>();
    const [totalStorage, setTotalStorage] = useState(0);
    const [usedStorage, setUsedStorage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isClearing, setIsClearing] = useState(false);
    const [storageItems, setStorageItems] = useState<StorageItem[]>([]);

    useEffect(() => {
        loadStorageData();
    }, []);

    const loadStorageData = async () => {
        try {
            setIsLoading(true);
            const usage = await settingsAPI.storage.getUsage();

            setTotalStorage(usage.total / (1024 * 1024)); // Convert to MB
            setUsedStorage(usage.used / (1024 * 1024));

            // Convert breakdown to storage items
            const breakdown = usage.breakdown || {};
            const items: StorageItem[] = [
                { type: 'Photos', icon: 'image', size: (breakdown.photos || 0) / (1024 * 1024), count: 0, color: '#2196F3' },
                { type: 'Videos', icon: 'video', size: (breakdown.videos || 0) / (1024 * 1024), count: 0, color: '#F44336' },
                { type: 'Documents', icon: 'file-document', size: (breakdown.documents || 0) / (1024 * 1024), count: 0, color: '#FF9800' },
                { type: 'Voice Messages', icon: 'microphone', size: (breakdown.voice || 0) / (1024 * 1024), count: 0, color: '#9C27B0' },
            ];
            setStorageItems(items.filter(item => item.size > 0));
        } catch (error: any) {
            console.error('Error loading storage:', error);
            // Only show alert if it's not a 401 (not logged in)
            if (error.response?.status !== 401) {
                Alert.alert('Error', 'Failed to load storage data');
            }
            // Fallback to mock data
            setTotalStorage(2070);
            setUsedStorage(1345);
            setStorageItems([
                { type: 'Photos', icon: 'image', size: 450, count: 245, color: '#2196F3' },
                { type: 'Videos', icon: 'video', size: 1200, count: 89, color: '#F44336' },
                { type: 'Documents', icon: 'file-document', size: 120, count: 34, color: '#FF9800' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearCache = async () => {
        try {
            setIsClearing(true);
            const result = await settingsAPI.storage.clearCache();
            Alert.alert('Success', `Cache cleared! Freed ${formatSize(result.freedSpace / (1024 * 1024))}`);
            loadStorageData(); // Reload data
        } catch (error) {
            console.error('Error clearing cache:', error);
            Alert.alert('Error', 'Failed to clear cache');
        } finally {
            setIsClearing(false);
        }
    };

    const formatSize = (mb: number) => {
        if (mb >= 1024) {
            return `${(mb / 1024).toFixed(1)} GB`;
        }
        return `${mb.toFixed(0)} MB`;
    };

    const AutoDownloadCard = ({ icon, title, description, onPress }: any) => (
        <TouchableOpacity style={styles.downloadCard} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
                    <IconButton icon={icon.name} size={24} iconColor={icon.color} style={styles.iconButton} />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardDescription}>{description}</Text>
                </View>
            </View>
            <IconButton icon="chevron-right" size={20} iconColor="#8696A0" />
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#25D366" />
                <Text style={{ marginTop: 16, color: '#666' }}>Loading storage data...</Text>
            </View>
        );
    }

    const storagePercentage = totalStorage > 0 ? (usedStorage / totalStorage) : 0.65;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Card with Summary */}
            <View style={styles.headerCard}>
                <View style={styles.storageIcon}>
                    <IconButton icon="database" iconColor="#607D8B" size={32} />
                </View>
                <Text style={styles.headerTitle}>Storage Usage</Text>
                <Text style={styles.totalSize}>{formatSize(usedStorage)}</Text>
                <ProgressBar progress={storagePercentage} color="#4CAF50" style={styles.summaryProgress} />
                <Text style={styles.summaryText}>{(storagePercentage * 100).toFixed(0)}% of available space</Text>
            </View>

            {/* Storage Breakdown */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Storage Breakdown</Text>
                <View style={styles.cardContainer}>
                    {storageItems.map((item, index) => {
                        const percentage = (item.size / totalStorage) * 100;
                        return (
                            <TouchableOpacity
                                key={item.type}
                                style={[
                                    styles.storageCard,
                                    index === storageItems.length - 1 && styles.lastCard
                                ]}
                                activeOpacity={0.7}
                            >
                                <View style={styles.storageCardLeft}>
                                    <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                                        <IconButton icon={item.icon} size={24} iconColor={item.color} style={styles.iconButton} />
                                    </View>
                                    <View style={styles.storageInfo}>
                                        <View style={styles.storageHeader}>
                                            <Text style={styles.storageType}>{item.type}</Text>
                                            <Text style={styles.storageSize}>{formatSize(item.size)}</Text>
                                        </View>
                                        <ProgressBar
                                            progress={percentage / 100}
                                            color={item.color}
                                            style={styles.storageProgress}
                                        />
                                        <Text style={styles.storageCount}>{item.count} items · {percentage.toFixed(1)}%</Text>
                                    </View>
                                </View>
                                <IconButton icon="chevron-right" size={20} iconColor="#8696A0" />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Network Usage */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Network Usage</Text>
                <View style={styles.cardContainer}>
                    <AutoDownloadCard
                        icon={{ name: 'chart-line', color: '#00BCD4' }}
                        title="Network usage"
                        description="View data usage statistics"
                        onPress={() => { }}
                    />
                </View>
            </View>

            {/* Auto-Download Media */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Auto-Download Media</Text>
                <View style={styles.cardContainer}>
                    <AutoDownloadCard
                        icon={{ name: 'cellphone', color: '#2196F3' }}
                        title="When using mobile data"
                        description="Photos only"
                        onPress={() => { }}
                    />
                    <AutoDownloadCard
                        icon={{ name: 'wifi', color: '#4CAF50' }}
                        title="When using Wi-Fi"
                        description="All media"
                        onPress={() => { }}
                    />
                    <AutoDownloadCard
                        icon={{ name: 'airplane', color: '#FF9800' }}
                        title="When roaming"
                        description="No media"
                        onPress={() => { }}
                    />
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
                <TouchableOpacity
                    style={styles.manageButton}
                    onPress={() => navigation.navigate('ManageStorage')}
                    activeOpacity={0.8}
                >
                    <IconButton icon="folder-cog" iconColor="#fff" size={20} />
                    <Text style={styles.manageButtonText}>Manage Storage</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={handleClearCache}
                    disabled={isClearing}
                    activeOpacity={0.8}
                >
                    <IconButton icon="delete-sweep" iconColor="#F44336" size={20} />
                    <Text style={styles.clearButtonText}>
                        {isClearing ? 'Clearing...' : 'Clear Cache'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                    <IconButton icon="information" iconColor="#2196F3" size={20} />
                </View>
                <Text style={styles.infoText}>
                    Free up space by deleting items that have been forwarded many times or are larger than a certain size
                </Text>
            </View>

            <View style={styles.bottomSpace} />
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
    storageIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ECEFF1',
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
    totalSize: {
        fontSize: 32,
        fontWeight: '800',
        color: '#4CAF50',
        marginBottom: 16,
    },
    summaryProgress: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    summaryText: {
        fontSize: 13,
        color: '#667781',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
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
    storageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    lastCard: {
        borderBottomWidth: 0,
    },
    storageCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        margin: 0,
    },
    storageInfo: {
        marginLeft: 14,
        flex: 1,
    },
    storageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    storageType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    storageSize: {
        fontSize: 15,
        fontWeight: '700',
        color: '#000',
    },
    storageProgress: {
        height: 6,
        borderRadius: 3,
        marginBottom: 6,
    },
    storageCount: {
        fontSize: 12,
        color: '#8696A0',
    },
    downloadCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardInfo: {
        marginLeft: 14,
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    cardDescription: {
        fontSize: 13,
        color: '#667781',
        marginTop: 2,
    },
    actionSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
        gap: 12,
    },
    manageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 16,
        paddingVertical: 14,
        ...Platform.select({
            ios: {
                shadowColor: '#4CAF50',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    manageButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginLeft: 8,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 14,
        borderWidth: 2,
        borderColor: '#F44336',
    },
    clearButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F44336',
        marginLeft: 8,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
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
    bottomSpace: {
        height: 24,
    },
});
