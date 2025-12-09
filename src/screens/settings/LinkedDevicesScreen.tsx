import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { List, Switch, Divider, Button } from 'react-native-paper';

export const LinkedDevicesScreen = () => {
    const [multiDeviceEnabled, setMultiDeviceEnabled] = useState(true);
    
    const [linkedDevices] = useState([
        {
            id: '1',
            name: 'MacBook Pro',
            type: 'desktop',
            lastActive: new Date('2024-12-08T14:30:00'),
        },
        {
            id: '2',
            name: 'Chrome Browser',
            type: 'web',
            lastActive: new Date('2024-12-07T10:15:00'),
        },
    ]);

    const formatLastActive = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Active now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'desktop':
                return 'laptop';
            case 'web':
                return 'web';
            case 'tablet':
                return 'tablet';
            default:
                return 'devices';
        }
    };

    const handleLinkDevice = () => {
        Alert.alert(
            'Link a device',
            'Scan QR code from WhatsApp on another device',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Scanner', onPress: () => {} },
            ]
        );
    };

    const handleLogoutDevice = (deviceId: string, deviceName: string) => {
        Alert.alert(
            'Log out',
            `Log out from ${deviceName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log out',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Success', `Logged out from ${deviceName}`);
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>📱</Text>
                <Text style={styles.infoTitle}>Use WhatsApp on other devices</Text>
                <Text style={styles.infoText}>
                    Link up to 4 devices to your WhatsApp account. Your personal messages,
                    media and calls are end-to-end encrypted.
                </Text>
            </View>

            <Button
                mode="contained"
                onPress={handleLinkDevice}
                style={styles.linkButton}
                icon="qrcode-scan"
                labelStyle={styles.linkButtonText}
            >
                LINK A DEVICE
            </Button>

            <Divider style={styles.divider} />

            <View style={styles.header}>
                <Text style={styles.headerText}>LINKED DEVICES ({linkedDevices.length}/4)</Text>
            </View>

            {linkedDevices.length > 0 ? (
                <View style={styles.section}>
                    {linkedDevices.map((device) => (
                        <TouchableOpacity
                            key={device.id}
                            style={styles.deviceItem}
                            onLongPress={() => handleLogoutDevice(device.id, device.name)}
                        >
                            <List.Icon icon={getDeviceIcon(device.type)} color="#25D366" />
                            <View style={styles.deviceInfo}>
                                <Text style={styles.deviceName}>{device.name}</Text>
                                <Text style={styles.deviceStatus}>
                                    {formatLastActive(device.lastActive)}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleLogoutDevice(device.id, device.name)}
                            >
                                <Text style={styles.logoutText}>Log out</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No linked devices</Text>
                </View>
            )}

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <List.Item
                    title="Multi-device beta"
                    description="Use WhatsApp on up to 4 linked devices at the same time"
                    left={() => <List.Icon icon="beta" color="#25D366" />}
                    right={() => (
                        <Switch
                            value={multiDeviceEnabled}
                            onValueChange={setMultiDeviceEnabled}
                        />
                    )}
                />
            </View>

            <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                    ℹ️ To maintain security, you'll be automatically logged out of all devices if
                    you don't use WhatsApp on this phone for 14 days.
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
    infoCard: {
        margin: 16,
        padding: 20,
        backgroundColor: '#E7F5EC',
        borderRadius: 12,
        alignItems: 'center',
    },
    infoIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 20,
    },
    linkButton: {
        marginHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#25D366',
    },
    linkButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    divider: {
        height: 8,
        backgroundColor: '#F7F8FA',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F7F8FA',
    },
    headerText: {
        fontSize: 13,
        color: '#667781',
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#fff',
        paddingVertical: 8,
    },
    deviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    deviceInfo: {
        flex: 1,
        marginLeft: 12,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    deviceStatus: {
        fontSize: 13,
        color: '#667781',
    },
    logoutText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F44336',
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
    },
    warningBox: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFF9E6',
        borderRadius: 8,
    },
    warningText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
});
