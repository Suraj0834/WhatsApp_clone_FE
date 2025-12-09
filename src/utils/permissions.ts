import { Platform, Alert, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export type PermissionType = 'camera' | 'microphone' | 'media-library' | 'camera-and-microphone';

export interface PermissionResult {
    granted: boolean;
    canAskAgain: boolean;
    message?: string;
}

/**
 * Request camera permission
 */
export async function requestCameraPermission(): Promise<PermissionResult> {
    try {
        const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
        
        if (status === 'granted') {
            return { granted: true, canAskAgain: true };
        }
        
        if (status === 'denied' && !canAskAgain) {
            return {
                granted: false,
                canAskAgain: false,
                message: 'Camera permission was denied. Please enable it in Settings.',
            };
        }
        
        return {
            granted: false,
            canAskAgain,
            message: 'Camera permission is required to take photos and videos.',
        };
    } catch (error) {
        console.error('Error requesting camera permission:', error);
        return {
            granted: false,
            canAskAgain: false,
            message: 'Failed to request camera permission.',
        };
    }
}

/**
 * Request microphone permission
 */
export async function requestMicrophonePermission(): Promise<PermissionResult> {
    try {
        const { status, canAskAgain } = await Camera.getMicrophonePermissionsAsync();
        
        if (status !== 'granted') {
            const response = await Camera.requestMicrophonePermissionsAsync();
            if (response.status === 'granted') {
                return { granted: true, canAskAgain: true };
            }
            
            if (response.status === 'denied' && !response.canAskAgain) {
                return {
                    granted: false,
                    canAskAgain: false,
                    message: 'Microphone permission was denied. Please enable it in Settings.',
                };
            }
            
            return {
                granted: false,
                canAskAgain: response.canAskAgain,
                message: 'Microphone permission is required for voice messages and calls.',
            };
        }
        
        return { granted: true, canAskAgain: true };
    } catch (error) {
        console.error('Error requesting microphone permission:', error);
        return {
            granted: false,
            canAskAgain: false,
            message: 'Failed to request microphone permission.',
        };
    }
}

/**
 * Request media library permission
 */
export async function requestMediaLibraryPermission(): Promise<PermissionResult> {
    try {
        // Request media library permissions
        const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
        
        if (status === 'granted') {
            return { granted: true, canAskAgain: true };
        }
        
        if (status === 'denied' && !canAskAgain) {
            return {
                granted: false,
                canAskAgain: false,
                message: 'Media library permission was denied. Please enable it in Settings.',
            };
        }
        
        return {
            granted: false,
            canAskAgain,
            message: 'Media library permission is required to access photos and videos.',
        };
    } catch (error) {
        console.error('Error requesting media library permission:', error);
        return {
            granted: false,
            canAskAgain: false,
            message: 'Failed to request media library permission.',
        };
    }
}

/**
 * Request both camera and microphone permissions (for video calls)
 */
export async function requestCameraAndMicrophonePermissions(): Promise<PermissionResult> {
    try {
        const [cameraResult, microphoneResult] = await Promise.all([
            requestCameraPermission(),
            requestMicrophonePermission(),
        ]);
        
        if (cameraResult.granted && microphoneResult.granted) {
            return { granted: true, canAskAgain: true };
        }
        
        if (!cameraResult.granted && !microphoneResult.granted) {
            return {
                granted: false,
                canAskAgain: cameraResult.canAskAgain || microphoneResult.canAskAgain,
                message: 'Camera and microphone permissions are required for video calls.',
            };
        }
        
        if (!cameraResult.granted) {
            return {
                granted: false,
                canAskAgain: cameraResult.canAskAgain,
                message: cameraResult.message,
            };
        }
        
        return {
            granted: false,
            canAskAgain: microphoneResult.canAskAgain,
            message: microphoneResult.message,
        };
    } catch (error) {
        console.error('Error requesting camera and microphone permissions:', error);
        return {
            granted: false,
            canAskAgain: false,
            message: 'Failed to request permissions.',
        };
    }
}

/**
 * Check if camera permission is granted
 */
export async function checkCameraPermission(): Promise<boolean> {
    try {
        const { status } = await Camera.getCameraPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Error checking camera permission:', error);
        return false;
    }
}

/**
 * Check if microphone permission is granted
 */
export async function checkMicrophonePermission(): Promise<boolean> {
    try {
        const { status } = await Camera.getMicrophonePermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Error checking microphone permission:', error);
        return false;
    }
}

/**
 * Check if media library permission is granted
 */
export async function checkMediaLibraryPermission(): Promise<boolean> {
    try {
        const { status } = await MediaLibrary.getPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Error checking media library permission:', error);
        return false;
    }
}

/**
 * Show alert when permission is permanently denied
 * Offers to open app settings
 */
export function showPermissionDeniedAlert(permissionType: PermissionType) {
    const permissionNames: Record<PermissionType, string> = {
        'camera': 'Camera',
        'microphone': 'Microphone',
        'media-library': 'Media Library',
        'camera-and-microphone': 'Camera and Microphone',
    };
    
    const name = permissionNames[permissionType];
    
    Alert.alert(
        `${name} Permission Required`,
        `${name} access is required for this feature. Would you like to open settings to enable it?`,
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Open Settings',
                onPress: () => {
                    if (Platform.OS === 'ios') {
                        Linking.openURL('app-settings:');
                    } else {
                        Linking.openSettings();
                    }
                },
            },
        ]
    );
}

/**
 * Request permission with user-friendly flow
 * Shows alert if permission is denied
 */
export async function requestPermissionWithAlert(
    permissionType: PermissionType
): Promise<boolean> {
    let result: PermissionResult;
    
    switch (permissionType) {
        case 'camera':
            result = await requestCameraPermission();
            break;
        case 'microphone':
            result = await requestMicrophonePermission();
            break;
        case 'media-library':
            result = await requestMediaLibraryPermission();
            break;
        case 'camera-and-microphone':
            result = await requestCameraAndMicrophonePermissions();
            break;
        default:
            return false;
    }
    
    if (!result.granted) {
        if (!result.canAskAgain) {
            showPermissionDeniedAlert(permissionType);
        } else if (result.message) {
            Alert.alert('Permission Required', result.message);
        }
    }
    
    return result.granted;
}

/**
 * Request all required permissions for video calls
 */
export async function requestVideoCallPermissions(): Promise<{
    camera: boolean;
    microphone: boolean;
    allGranted: boolean;
}> {
    const cameraGranted = await checkCameraPermission() || await requestPermissionWithAlert('camera');
    const microphoneGranted = await checkMicrophonePermission() || await requestPermissionWithAlert('microphone');
    
    return {
        camera: cameraGranted,
        microphone: microphoneGranted,
        allGranted: cameraGranted && microphoneGranted,
    };
}

/**
 * Request all required permissions for voice calls
 */
export async function requestVoiceCallPermissions(): Promise<boolean> {
    const granted = await checkMicrophonePermission();
    if (granted) return true;
    
    return await requestPermissionWithAlert('microphone');
}

/**
 * Request all required permissions for taking photos
 */
export async function requestPhotoPermissions(): Promise<{
    camera: boolean;
    mediaLibrary: boolean;
    allGranted: boolean;
}> {
    const cameraGranted = await checkCameraPermission() || await requestPermissionWithAlert('camera');
    const mediaLibraryGranted = await checkMediaLibraryPermission() || await requestPermissionWithAlert('media-library');
    
    return {
        camera: cameraGranted,
        mediaLibrary: mediaLibraryGranted,
        allGranted: cameraGranted && mediaLibraryGranted,
    };
}

/**
 * Request permission for accessing media library
 */
export async function requestGalleryPermissions(): Promise<boolean> {
    const granted = await checkMediaLibraryPermission();
    if (granted) return true;
    
    return await requestPermissionWithAlert('media-library');
}
