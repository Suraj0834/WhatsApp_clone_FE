import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
} from 'react-native';
import { IconButton } from 'react-native-paper';

interface Language {
    code: string;
    name: string;
    nativeName: string;
    icon: string;
}

export const LanguageScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const languages: Language[] = [
        { code: 'en', name: 'English', nativeName: 'English', icon: '🇬🇧' },
        { code: 'es', name: 'Spanish', nativeName: 'Español', icon: '🇪🇸' },
        { code: 'fr', name: 'French', nativeName: 'Français', icon: '🇫🇷' },
        { code: 'de', name: 'German', nativeName: 'Deutsch', icon: '🇩🇪' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano', icon: '🇮🇹' },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português', icon: '🇵🇹' },
        { code: 'ru', name: 'Russian', nativeName: 'Русский', icon: '🇷🇺' },
        { code: 'zh', name: 'Chinese', nativeName: '中文', icon: '🇨🇳' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語', icon: '🇯🇵' },
        { code: 'ko', name: 'Korean', nativeName: '한국어', icon: '🇰🇷' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية', icon: '🇸🇦' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', icon: '🇮🇳' },
        { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', icon: '🇧🇩' },
        { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', icon: '🇹🇷' },
        { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', icon: '🇻🇳' },
        { code: 'th', name: 'Thai', nativeName: 'ไทย', icon: '🇹🇭' },
        { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', icon: '🇮🇩' },
        { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', icon: '🇲🇾' },
        { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', icon: '🇳🇱' },
        { code: 'pl', name: 'Polish', nativeName: 'Polski', icon: '🇵🇱' },
    ];

    const filteredLanguages = languages.filter((lang) =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectLanguage = (code: string) => {
        setSelectedLanguage(code);
    };

    return (
        <View style={styles.container}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
                    <IconButton icon="translate" iconColor="#2196F3" size={32} />
                </View>
                <Text style={styles.headerTitle}>App Language</Text>
                <Text style={styles.headerSubtitle}>
                    Choose your preferred language
                </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.section}>
                <View style={styles.searchContainer}>
                    <IconButton icon="magnify" iconColor="#666" size={20} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search languages"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <IconButton icon="close-circle" iconColor="#999" size={20} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Language List */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <View style={styles.cardContainer}>
                        {filteredLanguages.map((language, index) => (
                            <TouchableOpacity
                                key={language.code}
                                style={[
                                    styles.languageCard,
                                    index === filteredLanguages.length - 1 && styles.lastCard,
                                ]}
                                onPress={() => handleSelectLanguage(language.code)}
                            >
                                <Text style={styles.flagIcon}>{language.icon}</Text>
                                <View style={styles.languageInfo}>
                                    <Text style={styles.languageName}>{language.name}</Text>
                                    <Text style={styles.nativeName}>{language.nativeName}</Text>
                                </View>
                                <View style={[
                                    styles.radioButton,
                                    selectedLanguage === language.code && styles.radioButtonSelected
                                ]}>
                                    {selectedLanguage === language.code && (
                                        <View style={styles.radioButtonInner} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}

                        {filteredLanguages.length === 0 && (
                            <View style={styles.emptyState}>
                                <IconButton icon="translate-off" iconColor="#999" size={48} />
                                <Text style={styles.emptyStateText}>No languages found</Text>
                                <Text style={styles.emptyStateSubtext}>Try a different search term</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.section}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoIconContainer}>
                            <IconButton icon="information" iconColor="#2196F3" size={20} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoText}>
                                App language changes will be applied after restart
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerCard: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
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
    headerIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 4,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    searchIcon: {
        margin: 0,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
        paddingVertical: 12,
    },
    scrollView: {
        flex: 1,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    languageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    lastCard: {
        borderBottomWidth: 0,
    },
    flagIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    languageInfo: {
        flex: 1,
    },
    languageName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    nativeName: {
        fontSize: 13,
        color: '#666',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: '#25D366',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#25D366',
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 12,
    },
    emptyStateSubtext: {
        fontSize: 13,
        color: '#999',
        marginTop: 4,
    },
    infoCard: {
        backgroundColor: '#E3F2FD',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    infoIconContainer: {
        marginRight: 8,
        marginTop: -4,
    },
    infoContent: {
        flex: 1,
    },
    infoText: {
        fontSize: 13,
        color: '#1976D2',
        lineHeight: 18,
    },
});
