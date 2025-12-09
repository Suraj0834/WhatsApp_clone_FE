import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Button, IconButton, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export const TwoStepVerificationScreen = () => {
    const navigation = useNavigation<any>();
    const [isEnabled, setIsEnabled] = useState(false);
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'setup' | 'create' | 'confirm' | 'email'>('setup');

    const handlePinInput = (value: string, index: number, isConfirm: boolean = false) => {
        if (value.length > 1) return;
        const newPin = isConfirm ? [...confirmPin] : [...pin];
        newPin[index] = value;
        if (isConfirm) {
            setConfirmPin(newPin);
        } else {
            setPin(newPin);
        }
    };

    const handleEnableVerification = () => {
        if (!isEnabled) {
            setStep('create');
        } else {
            Alert.alert(
                'Disable two-step verification',
                'Are you sure you want to turn off two-step verification?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Disable',
                        style: 'destructive',
                        onPress: () => {
                            setIsEnabled(false);
                            setPin(['', '', '', '', '', '']);
                            setConfirmPin(['', '', '', '', '', '']);
                            setEmail('');
                            setStep('setup');
                        },
                    },
                ]
            );
        }
    };

    const handleCreatePin = () => {
        if (pin.some(digit => digit === '')) {
            Alert.alert('Error', 'Please enter all 6 digits');
            return;
        }
        setStep('confirm');
    };

    const handleConfirmPin = () => {
        if (confirmPin.some(digit => digit === '')) {
            Alert.alert('Error', 'Please enter all 6 digits');
            return;
        }
        if (pin.join('') !== confirmPin.join('')) {
            Alert.alert('Error', 'PINs do not match. Please try again.');
            setConfirmPin(['', '', '', '', '', '']);
            return;
        }
        setStep('email');
    };

    const handleComplete = () => {
        if (!email || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        setIsEnabled(true);
        setStep('setup');
        Alert.alert('Success', 'Two-step verification has been enabled');
    };

    const renderPinInput = (pinArray: string[], isConfirm: boolean = false) => (
        <View style={styles.pinContainer}>
            {pinArray.map((digit, index) => (
                <TextInput
                    key={index}
                    style={styles.pinInput}
                    value={digit}
                    onChangeText={(value) => handlePinInput(value, index, isConfirm)}
                    keyboardType="numeric"
                    maxLength={1}
                    secureTextEntry
                    autoFocus={index === 0}
                />
            ))}
        </View>
    );

    const renderSetupView = () => (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.headerCard}>
                <View style={styles.shieldIcon}>
                    <IconButton icon="shield-check" iconColor="#4CAF50" size={32} />
                </View>
                <Text style={styles.headerTitle}>Two-Step Verification</Text>
                <Text style={styles.headerSubtitle}>
                    Add an extra layer of security by requiring a PIN when registering your phone number
                </Text>
            </View>

            {/* Status Card */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Status</Text>
                <View style={styles.cardContainer}>
                    <View style={styles.statusCard}>
                        <View style={styles.statusLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: isEnabled ? '#4CAF5015' : '#FF572215' }]}>
                                <IconButton
                                    icon={isEnabled ? 'check-circle' : 'alert-circle'}
                                    size={24}
                                    iconColor={isEnabled ? '#4CAF50' : '#FF5722'}
                                    style={styles.iconButton}
                                />
                            </View>
                            <View style={styles.statusInfo}>
                                <Text style={styles.statusTitle}>{isEnabled ? 'Enabled' : 'Disabled'}</Text>
                                <Text style={styles.statusSubtitle}>
                                    {isEnabled ? 'Your account is protected' : 'Enable for extra security'}
                                </Text>
                            </View>
                        </View>
                        <Switch value={isEnabled} onValueChange={handleEnableVerification} color="#25D366" />
                    </View>
                </View>
            </View>

            {/* Options (if enabled) */}
            {isEnabled && (
                <>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Settings</Text>
                        <View style={styles.cardContainer}>
                            <TouchableOpacity style={styles.optionCard} onPress={() => setStep('create')} activeOpacity={0.7}>
                                <View style={styles.optionLeft}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#2196F315' }]}>
                                        <IconButton icon="key-variant" size={24} iconColor="#2196F3" style={styles.iconButton} />
                                    </View>
                                    <View style={styles.optionInfo}>
                                        <Text style={styles.optionTitle}>Change PIN</Text>
                                        <Text style={styles.optionSubtitle}>Update your verification PIN</Text>
                                    </View>
                                </View>
                                <IconButton icon="chevron-right" size={20} iconColor="#8696A0" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionCard} onPress={() => setStep('email')} activeOpacity={0.7}>
                                <View style={styles.optionLeft}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#9C27B015' }]}>
                                        <IconButton icon="email" size={24} iconColor="#9C27B0" style={styles.iconButton} />
                                    </View>
                                    <View style={styles.optionInfo}>
                                        <Text style={styles.optionTitle}>Recovery Email</Text>
                                        <Text style={styles.optionSubtitle}>{email || 'Not set'}</Text>
                                    </View>
                                </View>
                                <IconButton icon="chevron-right" size={20} iconColor="#8696A0" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}

            {/* Warning Card */}
            <View style={styles.warningCard}>
                <View style={styles.warningIconContainer}>
                    <IconButton icon="alert" iconColor="#FF9800" size={24} />
                </View>
                <Text style={styles.warningText}>
                    If you forget your PIN, you won't be able to verify your phone number for 7 days
                </Text>
            </View>

            <View style={styles.bottomSpace} />
        </ScrollView>
    );

    const renderCreateView = () => (
        <View style={styles.content}>
            <View style={styles.stepCard}>
                <View style={styles.stepHeader}>
                    <IconButton icon="numeric" iconColor="#2196F3" size={40} />
                </View>
                <Text style={styles.stepTitle}>Create PIN</Text>
                <Text style={styles.stepSubtitle}>
                    Enter a 6-digit PIN that you'll need when registering your phone number
                </Text>
                {renderPinInput(pin)}
                <Button
                    mode="contained"
                    onPress={handleCreatePin}
                    style={styles.button}
                    buttonColor="#25D366"
                    disabled={pin.some(d => d === '')}
                >
                    NEXT
                </Button>
                <Button mode="text" onPress={() => setStep('setup')} style={styles.backButton}>
                    Cancel
                </Button>
            </View>
        </View>
    );

    const renderConfirmView = () => (
        <View style={styles.content}>
            <View style={styles.stepCard}>
                <View style={styles.stepHeader}>
                    <IconButton icon="check-circle" iconColor="#4CAF50" size={40} />
                </View>
                <Text style={styles.stepTitle}>Confirm PIN</Text>
                <Text style={styles.stepSubtitle}>
                    Re-enter your PIN to confirm
                </Text>
                {renderPinInput(confirmPin, true)}
                <Button
                    mode="contained"
                    onPress={handleConfirmPin}
                    style={styles.button}
                    buttonColor="#25D366"
                    disabled={confirmPin.some(d => d === '')}
                >
                    CONFIRM
                </Button>
                <Button mode="text" onPress={() => setStep('create')} style={styles.backButton}>
                    Back
                </Button>
            </View>
        </View>
    );

    const renderEmailView = () => (
        <View style={styles.content}>
            <View style={styles.stepCard}>
                <View style={styles.stepHeader}>
                    <IconButton icon="email" iconColor="#9C27B0" size={40} />
                </View>
                <Text style={styles.stepTitle}>Recovery Email</Text>
                <Text style={styles.stepSubtitle}>
                    Add an email to recover your PIN if you forget it
                </Text>
                <TextInput
                    style={styles.emailInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your.email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Button
                    mode="contained"
                    onPress={handleComplete}
                    style={styles.button}
                    buttonColor="#25D366"
                    disabled={!email}
                >
                    COMPLETE
                </Button>
                <Button mode="text" onPress={() => setStep('confirm')} style={styles.backButton}>
                    Back
                </Button>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {step === 'setup' && renderSetupView()}
            {step === 'create' && renderCreateView()}
            {step === 'confirm' && renderConfirmView()}
            {step === 'email' && renderEmailView()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    content: {
        flex: 1,
    },
    headerCard: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    shieldIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 18,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    statusLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        margin: 0,
    },
    statusInfo: {
        marginLeft: 14,
        flex: 1,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    statusSubtitle: {
        fontSize: 13,
        color: '#667781',
        marginTop: 2,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionInfo: {
        marginLeft: 14,
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    optionSubtitle: {
        fontSize: 13,
        color: '#667781',
        marginTop: 2,
    },
    warningCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF3E0',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 24,
    },
    warningIconContainer: {
        marginRight: 12,
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
    stepCard: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    stepHeader: {
        marginBottom: 16,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
    },
    pinInput: {
        width: 48,
        height: 56,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        backgroundColor: '#F5F7FA',
    },
    emailInput: {
        width: '100%',
        height: 48,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        fontSize: 16,
        paddingHorizontal: 16,
        marginBottom: 24,
        backgroundColor: '#F5F7FA',
    },
    button: {
        width: '100%',
        marginBottom: 12,
    },
    backButton: {
        width: '100%',
    },
    bottomSpace: {
        height: 24,
    },
});
