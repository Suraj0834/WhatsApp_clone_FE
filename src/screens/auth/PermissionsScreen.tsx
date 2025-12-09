import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';

interface Permission {
    id: string;
    title: string;
    description: string;
    icon: string;
    granted: boolean;
}

export const PermissionsScreen = () => {
    const navigation = useNavigation<any>();
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
    const [permissions, setPermissions] = useState<Permission[]>([
        {
            id: 'camera',
            title: 'Camera',
            description: 'Take photos and videos to share with your contacts',
            icon: 'camera',
            granted: false,
        },
        {
            id: 'microphone',
            title: 'Microphone',
            description: 'Record voice messages and make voice/video calls',
            icon: 'microphone',
            granted: false,
        },
        {
            id: 'storage',
            title: 'Photos & Media',
            description: 'Save and share photos, videos, and files',
            icon: 'folder-image',
            granted: false,
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Get notified about new messages and calls',
            icon: 'bell',
            granted: false,
        },
    ]);

    const requestPermission = async (permissionId: string) => {
        let granted = false;
        try {
            switch (permissionId) {
                case 'camera':
                    const cameraResult = await requestCameraPermission();
                    granted = cameraResult?.status === 'granted';
                    break;
                case 'microphone':
                    const micResult = await requestMicrophonePermission();
                    granted = micResult?.status === 'granted';
                    break;
                case 'storage':
                    break;
                case 'storage':
                    const storageResult = await MediaLibrary.requestPermissionsAsync();
                    granted = storageResult.status === 'granted';
                    break;
                case 'notifications':
                    const notifResult = await Notifications.requestPermissionsAsync();
                    granted = notifResult.status === 'granted';
                    break;
            }

            setPermissions((prev) =>
                prev.map((p) => (p.id === permissionId ? { ...p, granted } : p))
            );

            if (!granted) {
                Alert.alert(
                    'Permission Denied',
                    'You can enable this permission later in Settings',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
            }
        } catch (error) {
            console.error('Permission error:', error);
        }
    };

    const requestAllPermissions = async () => {
        for (const permission of permissions) {
            if (!permission.granted) {
                await requestPermission(permission.id);
            }
        }
    };

    const handleContinue = () => {
        navigation.replace('Main');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="shield-check" size={60} iconColor="#25D366" />
                <Text style={styles.title}>Enable permissions</Text>
                <Text style={styles.subtitle}>
                    WhatsApp needs access to the following features for the best experience
                </Text>
            </View>

            <ScrollView style={styles.permissionsList} contentContainerStyle={styles.permissionsContent}>
                {permissions.map((permission) => (
                    <TouchableOpacity
                        key={permission.id}
                        style={styles.permissionItem}
                        onPress={() => requestPermission(permission.id)}
                    >
                        <View style={styles.permissionIcon}>
                            <IconButton
                                icon={permission.icon}
                                size={24}
                                iconColor={permission.granted ? '#25D366' : '#8696A0'}
                            />
                        </View>
                        <View style={styles.permissionInfo}>
                            <Text style={styles.permissionTitle}>{permission.title}</Text>
                            <Text style={styles.permissionDescription}>{permission.description}</Text>
                        </View>
                        {permission.granted ? (
                            <IconButton icon="check-circle" size={24} iconColor="#25D366" />
                        ) : (
                            <IconButton icon="chevron-right" size={24} iconColor="#8696A0" />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="outlined"
                    onPress={requestAllPermissions}
                    style={styles.allowAllButton}
                    labelStyle={styles.allowAllButtonText}
                >
                    ALLOW ALL
                </Button>
                <Button
                    mode="contained"
                    onPress={handleContinue}
                    style={styles.continueButton}
                    labelStyle={styles.continueButtonText}
                >
                    CONTINUE
                </Button>
                <TouchableOpacity onPress={handleContinue}>
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 60,
        marginBottom: 30,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#075E54',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 20,
    },
    permissionsList: {
        flex: 1,
    },
    permissionsContent: {
        paddingHorizontal: 20,
    },
    permissionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    permissionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    permissionInfo: {
        flex: 1,
    },
    permissionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    permissionDescription: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    allowAllButton: {
        borderColor: '#25D366',
        marginBottom: 12,
    },
    allowAllButtonText: {
        color: '#25D366',
        fontSize: 14,
        fontWeight: '700',
    },
    continueButton: {
        backgroundColor: '#25D366',
        marginBottom: 12,
    },
    continueButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    skipText: {
        fontSize: 14,
        color: '#8696A0',
        textAlign: 'center',
        paddingVertical: 8,
    },
});
