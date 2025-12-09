import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

interface FontSizeOption {
    id: FontSize;
    label: string;
    description: string;
    previewSize: number;
}

export const FontSizeSettingsScreen = () => {
    const [selectedSize, setSelectedSize] = useState<FontSize>('medium');

    const fontSizeOptions: FontSizeOption[] = [
        {
            id: 'small',
            label: 'Small',
            description: 'Compact text for more content',
            previewSize: 12,
        },
        {
            id: 'medium',
            label: 'Medium (Default)',
            description: 'Standard text size',
            previewSize: 14,
        },
        {
            id: 'large',
            label: 'Large',
            description: 'Easier to read',
            previewSize: 16,
        },
        {
            id: 'extra-large',
            label: 'Extra Large',
            description: 'Maximum readability',
            previewSize: 18,
        },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.15)' }]}>
                    <IconButton icon="format-size" iconColor="#FF9800" size={32} />
                </View>
                <Text style={styles.headerTitle}>Font Size</Text>
                <Text style={styles.headerSubtitle}>
                    Adjust text size throughout the app
                </Text>
            </View>

            {/* Font Size Options */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Size</Text>

                {fontSizeOptions.map((option) => (
                    <View key={option.id} style={styles.cardContainer}>
                        <TouchableOpacity
                            style={[
                                styles.sizeCard,
                                selectedSize === option.id && styles.sizeCardSelected,
                            ]}
                            onPress={() => setSelectedSize(option.id)}
                        >
                            <View style={styles.sizeContent}>
                                <View style={styles.sizeHeader}>
                                    <Text style={styles.sizeLabel}>{option.label}</Text>
                                    <View style={styles.radioContainer}>
                                        <View style={[
                                            styles.radioOuter,
                                            selectedSize === option.id && styles.radioOuterSelected,
                                        ]}>
                                            {selectedSize === option.id && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.sizeDescription}>{option.description}</Text>
                                
                                {/* Preview */}
                                <View style={styles.previewContainer}>
                                    <Text style={[styles.previewText, { fontSize: option.previewSize }]}>
                                        The quick brown fox jumps over the lazy dog. This is how your text will look in chats.
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Accessibility Info */}
            <View style={styles.section}>
                <View style={styles.cardContainer}>
                    <View style={styles.accessibilityCard}>
                        <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                            <IconButton icon="human" iconColor="#4CAF50" size={24} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>System Font Size</Text>
                            <Text style={styles.settingDescription}>
                                Go to device settings to adjust system-wide font size
                            </Text>
                        </View>
                        <IconButton icon="chevron-right" size={20} iconColor="#667781" />
                    </View>
                </View>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                    <IconButton icon="information" iconColor="#2196F3" size={20} />
                </View>
                <Text style={styles.infoText}>
                    Font size changes will apply to messages, contact names, and other text throughout the app. Some UI elements will maintain their original size for consistency.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerCard: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
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
    headerIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#667781',
        textAlign: 'center',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    sizeCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    sizeCardSelected: {
        borderColor: '#25D366',
        backgroundColor: 'rgba(37, 211, 102, 0.05)',
    },
    sizeContent: {
        gap: 8,
    },
    sizeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sizeLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    sizeDescription: {
        fontSize: 13,
        color: '#667781',
    },
    previewContainer: {
        backgroundColor: '#F5F7FA',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    previewText: {
        color: '#000',
        lineHeight: 22,
    },
    radioContainer: {
        marginLeft: 12,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#BDC3C7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: '#25D366',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#25D366',
    },
    accessibilityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    settingIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingInfo: {
        flex: 1,
        marginLeft: 16,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#667781',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'flex-start',
    },
    infoIconContainer: {
        marginRight: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#2196F3',
        lineHeight: 18,
    },
});
