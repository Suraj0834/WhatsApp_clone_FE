import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

type ThemeOption = 'light' | 'dark' | 'auto';

interface ThemeChoice {
    id: ThemeOption;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export const ThemeSettingsScreen = () => {
    const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('auto');

    const themeOptions: ThemeChoice[] = [
        {
            id: 'light',
            title: 'Light',
            description: 'Use light theme at all times',
            icon: 'white-balance-sunny',
            color: '#FFA726',
        },
        {
            id: 'dark',
            title: 'Dark',
            description: 'Use dark theme at all times',
            icon: 'moon-waning-crescent',
            color: '#5E35B1',
        },
        {
            id: 'auto',
            title: 'System Default',
            description: 'Follow device system theme',
            icon: 'cellphone',
            color: '#26A69A',
        },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(156, 39, 176, 0.15)' }]}>
                    <IconButton icon="palette" iconColor="#9C27B0" size={32} />
                </View>
                <Text style={styles.headerTitle}>App Theme</Text>
                <Text style={styles.headerSubtitle}>
                    Choose how you want the app to look
                </Text>
            </View>

            {/* Theme Options */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Theme</Text>

                {themeOptions.map((theme) => (
                    <View key={theme.id} style={styles.cardContainer}>
                        <TouchableOpacity
                            style={[
                                styles.themeCard,
                                selectedTheme === theme.id && styles.themeCardSelected,
                            ]}
                            onPress={() => setSelectedTheme(theme.id)}
                        >
                            <View style={[styles.themeIconContainer, { backgroundColor: theme.color + '26' }]}>
                                <IconButton icon={theme.icon} iconColor={theme.color} size={28} />
                            </View>

                            <View style={styles.themeInfo}>
                                <Text style={styles.themeTitle}>{theme.title}</Text>
                                <Text style={styles.themeDescription}>{theme.description}</Text>
                            </View>

                            <View style={styles.radioContainer}>
                                <View style={[
                                    styles.radioOuter,
                                    selectedTheme === theme.id && styles.radioOuterSelected,
                                ]}>
                                    {selectedTheme === theme.id && (
                                        <View style={styles.radioInner} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                    <IconButton icon="information" iconColor="#2196F3" size={20} />
                </View>
                <Text style={styles.infoText}>
                    Theme changes will apply immediately to the entire app.
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
    themeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    themeCardSelected: {
        borderColor: '#25D366',
        backgroundColor: 'rgba(37, 211, 102, 0.05)',
    },
    themeIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeInfo: {
        flex: 1,
        marginLeft: 16,
    },
    themeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    themeDescription: {
        fontSize: 13,
        color: '#667781',
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
    infoCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
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
