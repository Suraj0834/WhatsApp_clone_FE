import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const countryCodes = [
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
];

export const PhoneInputScreen = () => {
    const navigation = useNavigation<any>();
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[2]); // India default
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const handleContinue = () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            Alert.alert('Invalid Number', 'Please enter a valid phone number');
            return;
        }

        navigation.navigate('OTPVerification', {
            phoneNumber: selectedCountry.code + phoneNumber,
            countryCode: selectedCountry.code,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Enter your phone number</Text>
                <Text style={styles.subtitle}>
                    WhatsApp will send an SMS message to verify your phone number.
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.link}>What's my number?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setShowCountryPicker(!showCountryPicker)}
                >
                    <Text style={styles.flag}>{selectedCountry.flag}</Text>
                    <Text style={styles.countryText}>{selectedCountry.country}</Text>
                    <IconButton icon="chevron-down" size={20} />
                </TouchableOpacity>

                {showCountryPicker && (
                    <ScrollView style={styles.countryList}>
                        {countryCodes.map((country) => (
                            <TouchableOpacity
                                key={country.code}
                                style={styles.countryItem}
                                onPress={() => {
                                    setSelectedCountry(country);
                                    setShowCountryPicker(false);
                                }}
                            >
                                <Text style={styles.flag}>{country.flag}</Text>
                                <Text style={styles.countryItemText}>{country.country}</Text>
                                <Text style={styles.codeText}>{country.code}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                <View style={styles.phoneInputRow}>
                    <View style={styles.codeInput}>
                        <Text style={styles.codeInputText}>{selectedCountry.code}</Text>
                    </View>
                    <TextInput
                        style={styles.phoneInput}
                        placeholder="phone number"
                        placeholderTextColor="#8696A0"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleContinue}
                    style={styles.continueButton}
                    labelStyle={styles.continueButtonText}
                    disabled={!phoneNumber}
                >
                    CONTINUE
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
        marginBottom: 8,
    },
    link: {
        fontSize: 14,
        color: '#00A884',
        fontWeight: '500',
    },
    inputContainer: {
        paddingHorizontal: 20,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    flag: {
        fontSize: 24,
        marginRight: 12,
    },
    countryText: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    countryList: {
        maxHeight: 300,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
        marginVertical: 8,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    countryItemText: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        marginLeft: 12,
    },
    codeText: {
        fontSize: 14,
        color: '#8696A0',
    },
    phoneInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    codeInput: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#25D366',
        marginRight: 8,
    },
    codeInputText: {
        fontSize: 18,
        color: '#000',
        fontWeight: '500',
    },
    phoneInput: {
        flex: 1,
        fontSize: 18,
        color: '#000',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#25D366',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    continueButton: {
        backgroundColor: '#25D366',
    },
    continueButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
