import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity } from 'react-native';
import { IconButton, Switch } from 'react-native-paper';

export const DataUsageScreen = () => {
    const [autoDownloadPhotos, setAutoDownloadPhotos] = useState(true);
    const [autoDownloadAudio, setAutoDownloadAudio] = useState(true);
    const [autoDownloadVideos, setAutoDownloadVideos] = useState(false);
    const [autoDownloadDocs, setAutoDownloadDocs] = useState(false);
    const [lowDataMode, setLowDataMode] = useState(false);

    const MediaCard = ({ icon, title, value, onValueChange }: any) => (
        <View style={styles.mediaCard}>
            <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
                    <IconButton icon={icon.name} size={24} iconColor={icon.color} style={styles.iconButton} />
                </View>
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <Switch value={value} onValueChange={onValueChange} color="#25D366" />
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Usage Summary */}
            <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                    <View style={styles.summaryIcon}>
                        <IconButton icon="chart-bar" iconColor="#2196F3" size={28} />
                    </View>
                    <Text style={styles.summaryTitle}>Data Usage</Text>
                </View>
                <View style={styles.summaryStats}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>245 MB</Text>
                        <Text style={styles.statLabel}>Sent</Text>
                        <View style={[styles.statIndicator, { backgroundColor: '#4CAF50' }]} />
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>1.2 GB</Text>
                        <Text style={styles.statLabel}>Received</Text>
                        <View style={[styles.statIndicator, { backgroundColor: '#2196F3' }]} />
                    </View>
                </View>
                <TouchableOpacity style={styles.resetButton} activeOpacity={0.8}>
                    <IconButton icon="refresh" iconColor="#fff" size={18} />
                    <Text style={styles.resetButtonText}>Reset Statistics</Text>
                </TouchableOpacity>
            </View>

            {/* Mobile Data */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>When using mobile data</Text>
                <View style={styles.cardContainer}>
                    <MediaCard
                        icon={{ name: 'image', color: '#2196F3' }}
                        title="Photos"
                        value={autoDownloadPhotos}
                        onValueChange={setAutoDownloadPhotos}
                    />
                    <MediaCard
                        icon={{ name: 'music', color: '#9C27B0' }}
                        title="Audio"
                        value={autoDownloadAudio}
                        onValueChange={setAutoDownloadAudio}
                    />
                    <MediaCard
                        icon={{ name: 'video', color: '#F44336' }}
                        title="Videos"
                        value={autoDownloadVideos}
                        onValueChange={setAutoDownloadVideos}
                    />
                    <MediaCard
                        icon={{ name: 'file-document', color: '#FF9800' }}
                        title="Documents"
                        value={autoDownloadDocs}
                        onValueChange={setAutoDownloadDocs}
                    />
                </View>
            </View>

            {/* Wi-Fi */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>When using Wi-Fi</Text>
                <View style={styles.cardContainer}>
                    <MediaCard
                        icon={{ name: 'image', color: '#2196F3' }}
                        title="Photos"
                        value={true}
                        onValueChange={() => {}}
                    />
                    <MediaCard
                        icon={{ name: 'music', color: '#9C27B0' }}
                        title="Audio"
                        value={true}
                        onValueChange={() => {}}
                    />
                    <MediaCard
                        icon={{ name: 'video', color: '#F44336' }}
                        title="Videos"
                        value={true}
                        onValueChange={() => {}}
                    />
                    <MediaCard
                        icon={{ name: 'file-document', color: '#FF9800' }}
                        title="Documents"
                        value={true}
                        onValueChange={() => {}}
                    />
                </View>
            </View>

            {/* Roaming */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>When roaming</Text>
                <View style={styles.cardContainer}>
                    <MediaCard
                        icon={{ name: 'image', color: '#2196F3' }}
                        title="Photos"
                        value={false}
                        onValueChange={() => {}}
                    />
                    <MediaCard
                        icon={{ name: 'music', color: '#9C27B0' }}
                        title="Audio"
                        value={false}
                        onValueChange={() => {}}
                    />
                    <MediaCard
                        icon={{ name: 'video', color: '#F44336' }}
                        title="Videos"
                        value={false}
                        onValueChange={() => {}}
                    />
                    <MediaCard
                        icon={{ name: 'file-document', color: '#FF9800' }}
                        title="Documents"
                        value={false}
                        onValueChange={() => {}}
                    />
                </View>
            </View>

            {/* Low Data Mode */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Saver</Text>
                <View style={styles.cardContainer}>
                    <View style={styles.mediaCard}>
                        <View style={styles.cardLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#4CAF5015' }]}>
                                <IconButton icon="speedometer" size={24} iconColor="#4CAF50" style={styles.iconButton} />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle}>Low data mode</Text>
                                <Text style={styles.cardDescription}>Reduce data usage</Text>
                            </View>
                        </View>
                        <Switch value={lowDataMode} onValueChange={setLowDataMode} color="#25D366" />
                    </View>
                </View>
            </View>

            {/* Info */}
            <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                    <IconButton icon="information" iconColor="#2196F3" size={20} />
                </View>
                <Text style={styles.infoText}>
                    Voice messages are always automatically downloaded to ensure you don't miss important messages
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
    summaryCard: {
        backgroundColor: '#fff',
        padding: 24,
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
    summaryHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    summaryIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
    },
    summaryStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#000',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#667781',
        marginBottom: 8,
    },
    statIndicator: {
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    statDivider: {
        width: 1,
        height: 50,
        backgroundColor: '#E0E0E0',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF5722',
        borderRadius: 12,
        paddingVertical: 12,
    },
    resetButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
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
    mediaCard: {
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
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginLeft: 14,
    },
    cardInfo: {
        marginLeft: 14,
        flex: 1,
    },
    cardDescription: {
        fontSize: 13,
        color: '#667781',
        marginTop: 2,
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
