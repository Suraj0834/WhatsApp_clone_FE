import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';

export const OTPVerificationScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useDispatch();
    const { phoneNumber, countryCode } = route.params;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all digits entered
        if (index === 5 && value) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (otpCode: string) => {
        setLoading(true);
        try {
            // In real app, verify OTP with backend
            // For now, accept any 6-digit OTP
            if (otpCode.length === 6) {
                // Check if user exists, if not go to registration
                // For OTP verification, use the OTP as password or skip login and go directly to registration
                // await dispatch(login({ phone: phoneNumber, password: otpCode }) as any);
                navigation.replace('UserRegistration', { phoneNumber });
            } else {
                Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        if (timer === 0) {
            setTimer(60);
            Alert.alert('OTP Sent', 'A new OTP has been sent to your phone number');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Verify {phoneNumber}</Text>
                <Text style={styles.subtitle}>
                    We've sent a 6-digit code to your phone number.
                </Text>
                <Text style={styles.subtitle}>Enter the code below:</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.link}>Wrong number?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => { inputRefs.current[index] = ref; }}
                        style={styles.otpInput}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                    />
                ))}
            </View>

            {loading && (
                <ActivityIndicator size="large" color="#25D366" style={styles.loader} />
            )}

            <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                <Text style={[styles.resendText, timer > 0 && styles.resendDisabled]}>
                    {timer > 0 ? `Resend code in ${timer}s` : 'Resend code'}
                </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() => handleVerify(otp.join(''))}
                    style={styles.verifyButton}
                    labelStyle={styles.verifyButtonText}
                    disabled={otp.join('').length !== 6 || loading}
                >
                    VERIFY
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
        marginBottom: 60,
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
        marginBottom: 4,
    },
    link: {
        fontSize: 14,
        color: '#00A884',
        fontWeight: '500',
        marginTop: 12,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    otpInput: {
        width: 45,
        height: 45,
        borderWidth: 2,
        borderColor: '#25D366',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        marginHorizontal: 4,
        color: '#000',
    },
    loader: {
        marginVertical: 20,
    },
    resendText: {
        fontSize: 14,
        color: '#00A884',
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 20,
    },
    resendDisabled: {
        color: '#8696A0',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    verifyButton: {
        backgroundColor: '#25D366',
    },
    verifyButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
