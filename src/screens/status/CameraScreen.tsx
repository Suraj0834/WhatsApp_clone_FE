import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    TextInput,
    ScrollView,
} from 'react-native';
import { IconButton, Button } from 'react-native-paper';

type CameraMode = 'photo' | 'video' | 'text';

export const CameraScreen = ({ route }: any) => {
    const initialMode: CameraMode = (route?.params?.mode as CameraMode) || 'photo';
    
    const [mode, setMode] = useState<CameraMode>(initialMode);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('auto');
    const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
    const [textStatus, setTextStatus] = useState('');
    const [textBackgroundColor, setTextBackgroundColor] = useState('#075E54');

    const backgroundColors = [
        '#075E54', '#25D366', '#F44336', '#2196F3', '#FF9800',
        '#9C27B0', '#E91E63', '#00BCD4', '#4CAF50', '#FFC107',
    ];

    const handleCapture = () => {
        if (mode === 'photo') {
            Alert.alert('Photo Captured', 'Photo saved successfully');
        }
    };

    const handleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            setRecordingDuration(0);
            Alert.alert('Video Saved', 'Video recorded successfully');
        } else {
            setIsRecording(true);
            // Start recording timer
        }
    };

    const handlePostTextStatus = () => {
        if (!textStatus.trim()) {
            Alert.alert('Error', 'Please enter some text for your status');
            return;
        }
        Alert.alert('Status Posted', 'Your text status has been posted');
    };

    const toggleFlash = () => {
        const modes: ('off' | 'on' | 'auto')[] = ['off', 'on', 'auto'];
        const currentIndex = modes.indexOf(flashMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setFlashMode(modes[nextIndex]);
    };

    const toggleCamera = () => {
        setCameraFacing(cameraFacing === 'front' ? 'back' : 'front');
    };

    const getFlashIcon = () => {
        switch (flashMode) {
            case 'on':
                return 'flash';
            case 'off':
                return 'flash-off';
            case 'auto':
                return 'flash-auto';
        }
    };

    if (mode === 'text') {
        return (
            <View style={[styles.container, { backgroundColor: textBackgroundColor }]}>
                <View style={styles.topBar}>
                    <IconButton
                        icon="close"
                        size={28}
                        iconColor="#fff"
                        onPress={() => Alert.alert('Cancel', 'Discard status?')}
                    />
                    <View style={styles.colorPicker}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {backgroundColors.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        textBackgroundColor === color && styles.selectedColor,
                                    ]}
                                    onPress={() => setTextBackgroundColor(color)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.textStatusContainer}>
                    <TextInput
                        style={styles.textStatusInput}
                        placeholder="Type a status"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={textStatus}
                        onChangeText={setTextStatus}
                        multiline
                        textAlign="center"
                        maxLength={700}
                    />
                </View>

                <View style={styles.bottomBar}>
                    <Text style={styles.characterCount}>{textStatus.length}/700</Text>
                    <IconButton
                        icon="send"
                        size={32}
                        iconColor="#fff"
                        style={styles.sendButton}
                        onPress={handlePostTextStatus}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.cameraPreview}>
                <Text style={styles.cameraPlaceholder}>
                    📷 {cameraFacing === 'front' ? 'Front' : 'Back'} Camera
                </Text>
            </View>

            <View style={styles.topBar}>
                <IconButton
                    icon="close"
                    size={28}
                    iconColor="#fff"
                    onPress={() => Alert.alert('Cancel')}
                />
                <View style={styles.topBarRight}>
                    <IconButton
                        icon={getFlashIcon()}
                        size={28}
                        iconColor="#fff"
                        onPress={toggleFlash}
                    />
                    <IconButton
                        icon="cog"
                        size={28}
                        iconColor="#fff"
                        onPress={() => Alert.alert('Settings')}
                    />
                </View>
            </View>

            <View style={styles.modeSelector}>
                <TouchableOpacity
                    style={[styles.modeButton, mode === 'photo' && styles.modeButtonActive]}
                    onPress={() => setMode('photo')}
                >
                    <Text style={[styles.modeText, mode === 'photo' && styles.modeTextActive]}>
                        PHOTO
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeButton, mode === 'video' && styles.modeButtonActive]}
                    onPress={() => setMode('video')}
                >
                    <Text style={[styles.modeText, mode === 'video' && styles.modeTextActive]}>
                        VIDEO
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeButton, (mode as string) === 'text' && styles.modeButtonActive]}
                    onPress={() => setMode('text')}
                >
                    <Text style={[styles.modeText, (mode as string) === 'text' && styles.modeTextActive]}>
                        TEXT
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomBar}>
                <IconButton
                    icon="image"
                    size={32}
                    iconColor="#fff"
                    onPress={() => Alert.alert('Gallery')}
                />

                <TouchableOpacity
                    style={[
                        styles.captureButton,
                        isRecording && styles.captureButtonRecording,
                    ]}
                    onPress={mode === 'video' ? handleRecording : handleCapture}
                >
                    {isRecording && (
                        <Text style={styles.recordingDot} />
                    )}
                </TouchableOpacity>

                <IconButton
                    icon="camera-flip"
                    size={32}
                    iconColor="#fff"
                    onPress={toggleCamera}
                />
            </View>

            {isRecording && (
                <View style={styles.recordingIndicator}>
                    <View style={styles.recordingDotSmall} />
                    <Text style={styles.recordingText}>
                        {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    cameraPreview: {
        flex: 1,
        backgroundColor: '#1F2C33',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraPlaceholder: {
        fontSize: 32,
        color: '#8696A0',
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 8,
    },
    topBarRight: {
        flexDirection: 'row',
    },
    modeSelector: {
        position: 'absolute',
        top: 120,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
    },
    modeButtonActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#25D366',
    },
    modeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8696A0',
    },
    modeTextActive: {
        color: '#fff',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 40,
        paddingHorizontal: 16,
    },
    captureButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#fff',
        borderWidth: 4,
        borderColor: '#8696A0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonRecording: {
        backgroundColor: '#F44336',
        borderColor: '#fff',
    },
    recordingDot: {
        width: 24,
        height: 24,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    recordingIndicator: {
        position: 'absolute',
        top: 120,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    recordingDotSmall: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F44336',
        marginRight: 8,
    },
    recordingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    textStatusContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    textStatusInput: {
        fontSize: 28,
        fontWeight: '600',
        color: '#fff',
        textAlignVertical: 'center',
    },
    colorPicker: {
        flex: 1,
        marginLeft: 16,
    },
    colorOption: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginHorizontal: 4,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: '#fff',
    },
    characterCount: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.7,
    },
    sendButton: {
        backgroundColor: '#25D366',
    },
});
