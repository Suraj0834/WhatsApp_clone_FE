import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Alert,
    Share,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';

export const QRCodeScreen = ({ route }: any) => {
    const mode = route?.params?.mode || 'show'; // 'show' | 'scan'
    
    const userInfo = {
        name: 'John Doe',
        phone: '+1 234 567 8900',
        qrCode: 'whatsapp://contact?phone=+12345678900&name=John%20Doe',
    };

    const [scannedData, setScannedData] = useState<string | null>(null);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Add me on WhatsApp: ${userInfo.qrCode}`,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share QR code');
        }
    };

    const handleDownload = () => {
        Alert.alert('Download', 'QR code saved to gallery');
    };

    const handleScan = () => {
        // Mock scanning
        setTimeout(() => {
            setScannedData('whatsapp://contact?phone=+10987654321&name=Jane%20Smith');
            Alert.alert(
                'Contact Found',
                'Jane Smith\n+1 098 765 4321\n\nAdd this contact?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Add Contact',
                        onPress: () => {
                            Alert.alert('Success', 'Contact added successfully');
                        },
                    },
                ]
            );
        }, 2000);
    };

    if (mode === 'scan') {
        return (
            <View style={styles.container}>
                <View style={styles.scannerContainer}>
                    <Text style={styles.title}>Scan QR Code</Text>
                    <Text style={styles.subtitle}>
                        Position the QR code within the frame to scan
                    </Text>

                    <View style={styles.scannerFrame}>
                        <View style={styles.cornerTopLeft} />
                        <View style={styles.cornerTopRight} />
                        <View style={styles.cornerBottomLeft} />
                        <View style={styles.cornerBottomRight} />
                        
                        <Text style={styles.scannerText}>📷</Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleScan}
                        style={styles.scanButton}
                        labelStyle={styles.scanButtonText}
                    >
                        START SCANNING
                    </Button>

                    {scannedData && (
                        <View style={styles.scannedInfo}>
                            <Text style={styles.scannedText}>✓ Contact scanned</Text>
                        </View>
                    )}
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        ℹ️ Point your camera at a WhatsApp QR code to instantly add a contact
                        or join a group
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.qrContainer}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {userInfo.name.substring(0, 2).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.name}>{userInfo.name}</Text>
                    <Text style={styles.phone}>{userInfo.phone}</Text>
                </View>

                <View style={styles.qrCodeWrapper}>
                    <View style={styles.qrCodePlaceholder}>
                        <Text style={styles.qrPlaceholderText}>QR</Text>
                    </View>
                </View>

                <Text style={styles.instruction}>
                    Scan this code to add me on WhatsApp
                </Text>

                <View style={styles.actions}>
                    <IconButton
                        icon="share-variant"
                        size={28}
                        iconColor="#25D366"
                        onPress={handleShare}
                        style={styles.actionButton}
                    />
                    <IconButton
                        icon="download"
                        size={28}
                        iconColor="#25D366"
                        onPress={handleDownload}
                        style={styles.actionButton}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="outlined"
                    onPress={() => {}}
                    style={styles.footerButton}
                    icon="qrcode-scan"
                >
                    Scan QR Code
                </Button>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    ℹ️ Your QR code is personal and secure. Only share it with people you
                    trust.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    qrContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 32,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    phone: {
        fontSize: 16,
        color: '#667781',
    },
    qrCodeWrapper: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 24,
    },
    qrCodePlaceholder: {
        width: 250,
        height: 250,
        backgroundColor: '#F7F8FA',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    qrPlaceholderText: {
        fontSize: 48,
        fontWeight: '700',
        color: '#667781',
    },
    instruction: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
        marginBottom: 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    actionButton: {
        marginHorizontal: 8,
        backgroundColor: '#F7F8FA',
    },
    footer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    footerButton: {
        borderColor: '#25D366',
    },
    scannerContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 32,
    },
    scannerFrame: {
        width: 280,
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        position: 'relative',
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#25D366',
        borderTopLeftRadius: 8,
    },
    cornerTopRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: '#25D366',
        borderTopRightRadius: 8,
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#25D366',
        borderBottomLeftRadius: 8,
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: '#25D366',
        borderBottomRightRadius: 8,
    },
    scannerText: {
        fontSize: 64,
        opacity: 0.3,
    },
    scanButton: {
        backgroundColor: '#25D366',
        marginHorizontal: 32,
    },
    scanButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    scannedInfo: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#E7F5EC',
        borderRadius: 8,
    },
    scannedText: {
        fontSize: 14,
        color: '#25D366',
        fontWeight: '600',
    },
    infoBox: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFF9E6',
        borderRadius: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
});
