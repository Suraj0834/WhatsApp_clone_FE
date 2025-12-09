import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export const AddStatusScreen = () => {
    const navigation = useNavigation<any>();
    const [media, setMedia] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [textStatus, setTextStatus] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#075E54');

    const colors = ['#075E54', '#128C7E', '#25D366', '#34B7F1', '#F44336', '#9C27B0', '#FF9800'];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setMedia(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setMedia(result.assets[0].uri);
        }
    };

    const handlePost = () => {
        Alert.alert('Status Posted', 'Your status has been posted successfully!');
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {media ? (
                <View style={styles.mediaContainer}>
                    <Image source={{ uri: media }} style={styles.mediaPreview} />
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setMedia(null)}
                    >
                        <IconButton icon="close" size={24} iconColor="#fff" />
                    </TouchableOpacity>
                    <View style={styles.captionContainer}>
                        <TextInput
                            style={styles.captionInput}
                            placeholder="Add a caption..."
                            placeholderTextColor="#fff"
                            value={caption}
                            onChangeText={setCaption}
                            multiline
                        />
                    </View>
                </View>
            ) : (
                <View style={[styles.textStatusContainer, { backgroundColor }]}>
                    <TextInput
                        style={styles.textStatusInput}
                        placeholder="Type a status"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={textStatus}
                        onChangeText={setTextStatus}
                        multiline
                        maxLength={700}
                    />
                    <View style={styles.colorPicker}>
                        {colors.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[styles.colorOption, { backgroundColor: color }]}
                                onPress={() => setBackgroundColor(color)}
                            />
                        ))}
                    </View>
                </View>
            )}

            <View style={styles.footer}>
                {!media && (
                    <View style={styles.mediaButtons}>
                        <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
                            <IconButton icon="camera" size={28} iconColor="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
                            <IconButton icon="image" size={28} iconColor="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
                <Button
                    mode="contained"
                    onPress={handlePost}
                    style={styles.postButton}
                    labelStyle={styles.postButtonText}
                    disabled={!media && !textStatus}
                >
                    POST
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    mediaContainer: {
        flex: 1,
    },
    mediaPreview: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    captionContainer: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    captionInput: {
        fontSize: 16,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 12,
        borderRadius: 8,
        maxHeight: 100,
    },
    textStatusContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    textStatusInput: {
        fontSize: 28,
        color: '#fff',
        textAlign: 'center',
        width: '100%',
    },
    colorPicker: {
        flexDirection: 'row',
        marginTop: 40,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 6,
        borderWidth: 2,
        borderColor: '#fff',
    },
    footer: {
        padding: 20,
    },
    mediaButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    mediaButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 28,
        marginHorizontal: 8,
    },
    postButton: {
        backgroundColor: '#25D366',
    },
    postButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
