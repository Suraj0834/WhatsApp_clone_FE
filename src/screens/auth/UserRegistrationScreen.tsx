import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { register } from '../../store/slices/authSlice';

export const UserRegistrationScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useDispatch();
    const { phoneNumber } = route.params;

    const [name, setName] = useState('');
    const [about, setAbout] = useState('Hey there! I am using WhatsApp.');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant photo library permission');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleCameraCapture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant camera permission');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        if (!name.trim()) {
            Alert.alert('Required', 'Please enter your name');
            return;
        }

        setLoading(true);
        try {
            await dispatch(register({
                phone: phoneNumber,
                name: name.trim(),
                about: about.trim(),
                profileImage,
            }) as any);
            
            navigation.replace('Permissions');
        } catch (error) {
            Alert.alert('Error', 'Failed to create profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Profile info</Text>
                <Text style={styles.subtitle}>
                    Please provide your name and an optional profile photo
                </Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={() => {
                        Alert.alert(
                            'Profile Photo',
                            'Choose an option',
                            [
                                { text: 'Camera', onPress: handleCameraCapture },
                                { text: 'Gallery', onPress: handleImagePick },
                                { text: 'Cancel', style: 'cancel' },
                            ]
                        );
                    }}
                >
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.placeholder}>
                            <IconButton icon="camera" size={40} iconColor="#8696A0" />
                        </View>
                    )}
                    <View style={styles.editIconContainer}>
                        <IconButton icon="camera" size={16} iconColor="#fff" />
                    </View>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your name here"
                        placeholderTextColor="#8696A0"
                        value={name}
                        onChangeText={setName}
                        maxLength={25}
                    />
                    <IconButton
                        icon="emoticon-happy-outline"
                        size={24}
                        iconColor="#8696A0"
                        style={styles.emojiButton}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="About"
                        placeholderTextColor="#8696A0"
                        value={about}
                        onChangeText={setAbout}
                        maxLength={139}
                    />
                    <IconButton
                        icon="emoticon-happy-outline"
                        size={24}
                        iconColor="#8696A0"
                        style={styles.emojiButton}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleRegister}
                    style={styles.nextButton}
                    labelStyle={styles.nextButtonText}
                    loading={loading}
                    disabled={!name.trim() || loading}
                >
                    NEXT
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 40,
        marginBottom: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#075E54',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 20,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 40,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#25D366',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 12,
    },
    emojiButton: {
        margin: 0,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    nextButton: {
        backgroundColor: '#25D366',
    },
    nextButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
