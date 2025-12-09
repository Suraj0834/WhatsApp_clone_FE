import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { COLORS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

export const SplashScreen = () => {
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const bottomTextOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animate logo
        Animated.sequence([
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 10,
                    friction: 2,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 500,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.timing(bottomTextOpacity, {
                toValue: 1,
                duration: 500,
                delay: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* WhatsApp Logo */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: logoOpacity,
                            transform: [{ scale: logoScale }],
                        },
                    ]}
                >
                    <View style={styles.logo}>
                        <View style={styles.logoInner}>
                            <Text style={styles.logoIcon}>💬</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* App Title */}
                <Animated.Text
                    style={[
                        styles.title,
                        { opacity: textOpacity },
                    ]}
                >
                    WhatsApp Clone
                </Animated.Text>

                <Animated.Text
                    style={[
                        styles.subtitle,
                        { opacity: textOpacity },
                    ]}
                >
                    Fast • Simple • Secure
                </Animated.Text>
            </View>

            {/* Bottom Text */}
            <Animated.View
                style={[
                    styles.bottomContainer,
                    { opacity: bottomTextOpacity },
                ]}
            >
                <Text style={styles.bottomText}>from</Text>
                <Text style={styles.companyName}>YOUR COMPANY</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 30,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    logoInner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoIcon: {
        fontSize: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 20,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: 8,
        letterSpacing: 1,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    bottomText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 5,
    },
    companyName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
        letterSpacing: 2,
    },
});
