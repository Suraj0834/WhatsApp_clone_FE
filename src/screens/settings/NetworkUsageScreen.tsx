import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { List, Switch, Divider } from 'react-native-paper';

export const NetworkUsageScreen = () => {
    const [autoDownloadMobile, setAutoDownloadMobile] = useState(true);
    const [autoDownloadWiFi, setAutoDownloadWiFi] = useState(true);
    const [lowDataMode, setLowDataMode] = useState(false);

    const [networkStats] = useState({
        mobile: {
            sent: 245,
            received: 876,
            calls: 124,
            total: 1245,
        },
        wifi: {
            sent: 520,
            received: 1890,
            calls: 45,
            total: 2455,
        },
        roaming: {
            sent: 12,
            received: 34,
            calls: 5,
            total: 51,
        },
    });

    const formatBytes = (mb: number) => {
        if (mb >= 1024) {
            return `${(mb / 1024).toFixed(2)} GB`;
        }
        return `${mb} MB`;
    };

    const handleResetStats = () => {
        Alert.alert(
            'Reset Statistics',
            'Reset all network usage statistics?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Success', 'Statistics reset');
                    },
                },
            ]
        );
    };

    const handleViewDetailedStats = (networkType: string) => {
        const stats =
            networkType === 'mobile'
                ? networkStats.mobile
                : networkType === 'wifi'
                ? networkStats.wifi
                : networkStats.roaming;

        Alert.alert(
            `${networkType.toUpperCase()} Usage Details`,
            `Messages Sent: ${formatBytes(stats.sent)}\n` +
                `Messages Received: ${formatBytes(stats.received)}\n` +
                `Calls: ${formatBytes(stats.calls)}\n` +
                `Total: ${formatBytes(stats.total)}`,
            [{ text: 'OK' }]
        );
    };

    const totalUsage =
        networkStats.mobile.total + networkStats.wifi.total + networkStats.roaming.total;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Network Usage</Text>
                <Text style={styles.headerSubtitle}>Monitor data consumption</Text>
            </View>

            <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total Data Usage</Text>
                <Text style={styles.totalValue}>{formatBytes(totalUsage)}</Text>
                <TouchableOpacity onPress={handleResetStats}>
                    <Text style={styles.resetLink}>Reset Statistics</Text>
                </TouchableOpacity>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Breakdown by Network</Text>

                <TouchableOpacity
                    style={styles.networkCard}
                    onPress={() => handleViewDetailedStats('mobile')}
                >
                    <View style={styles.networkHeader}>
                        <Text style={styles.networkIcon}>📱</Text>
                        <View style={styles.networkInfo}>
                            <Text style={styles.networkName}>Mobile Data</Text>
                            <Text style={styles.networkTotal}>
                                {formatBytes(networkStats.mobile.total)}
                            </Text>
                        </View>
                        <Text style={styles.chevron}>→</Text>
                    </View>
                    <View style={styles.networkDetails}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Sent</Text>
                            <Text style={styles.detailValue}>
                                {formatBytes(networkStats.mobile.sent)}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Received</Text>
                            <Text style={styles.detailValue}>
                                {formatBytes(networkStats.mobile.received)}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Calls</Text>
                            <Text style={styles.detailValue}>
                                {formatBytes(networkStats.mobile.calls)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.networkCard}
                    onPress={() => handleViewDetailedStats('wifi')}
                >
                    <View style={styles.networkHeader}>
                        <Text style={styles.networkIcon}>📶</Text>
                        <View style={styles.networkInfo}>
                            <Text style={styles.networkName}>Wi-Fi</Text>
                            <Text style={styles.networkTotal}>
                                {formatBytes(networkStats.wifi.total)}
                            </Text>
                        </View>
                        <Text style={styles.chevron}>→</Text>
                    </View>
                    <View style={styles.networkDetails}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Sent</Text>
                            <Text style={styles.detailValue}>
                                {formatBytes(networkStats.wifi.sent)}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Received</Text>
                            <Text style={styles.detailValue}>
                                {formatBytes(networkStats.wifi.received)}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Calls</Text>
                            <Text style={styles.detailValue}>
                                {formatBytes(networkStats.wifi.calls)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.networkCard}
                    onPress={() => handleViewDetailedStats('roaming')}
                >
                    <View style={styles.networkHeader}>
                        <Text style={styles.networkIcon}>🌍</Text>
                        <View style={styles.networkInfo}>
                            <Text style={styles.networkName}>Roaming</Text>
                            <Text style={styles.networkTotal}>
                                {formatBytes(networkStats.roaming.total)}
                            </Text>
                        </View>
                        <Text style={styles.chevron}>→</Text>
                    </View>
                    <View style={styles.networkDetails}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Sent</Text>
                            <Text style={styles.detailValue}>
                                {formatBytes(networkStats.roaming.sent)}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Received</Text>
                            <Text style={styles.detailValue}>
                                {formatBytes(networkStats.roaming.received)}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Calls</Text>
                            <Text style={styles.detailValue}>
                                {formatBytes(networkStats.roaming.calls)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Network Settings</Text>

                <List.Item
                    title="Auto-download on mobile"
                    description="Download media on mobile data"
                    left={() => <List.Icon icon="download" color="#25D366" />}
                    right={() => (
                        <Switch
                            value={autoDownloadMobile}
                            onValueChange={setAutoDownloadMobile}
                        />
                    )}
                />

                <List.Item
                    title="Auto-download on Wi-Fi"
                    description="Download media on Wi-Fi"
                    left={() => <List.Icon icon="wifi" color="#25D366" />}
                    right={() => (
                        <Switch
                            value={autoDownloadWiFi}
                            onValueChange={setAutoDownloadWiFi}
                        />
                    )}
                />

                <List.Item
                    title="Low data mode"
                    description="Reduce data usage"
                    left={() => <List.Icon icon="cellphone-arrow-down" color="#25D366" />}
                    right={() => (
                        <Switch value={lowDataMode} onValueChange={setLowDataMode} />
                    )}
                />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    ℹ️ Statistics are calculated from the last reset. Network usage is
                    approximate and may vary from your carrier's data records.
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
    header: {
        padding: 16,
        backgroundColor: '#F7F8FA',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#667781',
    },
    totalCard: {
        margin: 16,
        padding: 24,
        backgroundColor: '#E7F5EC',
        borderRadius: 12,
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 14,
        color: '#667781',
        marginBottom: 8,
    },
    totalValue: {
        fontSize: 36,
        fontWeight: '700',
        color: '#25D366',
        marginBottom: 12,
    },
    resetLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F44336',
    },
    divider: {
        height: 8,
        backgroundColor: '#F7F8FA',
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    networkCard: {
        marginBottom: 12,
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    networkHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    networkIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    networkInfo: {
        flex: 1,
    },
    networkName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    networkTotal: {
        fontSize: 20,
        fontWeight: '700',
        color: '#25D366',
    },
    chevron: {
        fontSize: 20,
        color: '#667781',
    },
    networkDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#667781',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    infoBox: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFF9E6',
        borderRadius: 8,
        marginBottom: 32,
    },
    infoText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
});
