import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { loadStoredAuth } from '../../store/slices/authSlice';

export const SplashScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.3);

    useEffect(() => {
        // Animate logo
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();

        // Check auth and navigate
        checkAuthAndNavigate();
    }, []);

    const checkAuthAndNavigate = async () => {
        try {
            await dispatch(loadStoredAuth());
            
            setTimeout(() => {
                if (isAuthenticated) {
                    navigation.replace('Main');
                } else {
                    navigation.replace('Onboarding');
                }
            }, 2000);
        } catch (error) {
            console.error('Auth check error:', error);
            navigation.replace('Onboarding');
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <Image
                    source={require('../../assets/images/whatsapp-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
            <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
                WhatsApp
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#075E54',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    appName: {
        fontSize: 28,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: 1,
    },
});
