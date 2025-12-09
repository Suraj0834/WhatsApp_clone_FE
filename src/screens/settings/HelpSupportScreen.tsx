import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity, Linking } from 'react-native';
import { IconButton, Chip } from 'react-native-paper';

export const HelpSupportScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const categories = ['Account', 'Chats', 'Security', 'Privacy', 'Calls', 'Groups'];

    const faqItems = [
        { category: 'Account', question: 'How do I change my phone number?', answer: 'Go to Settings > Account > Change number' },
        { category: 'Account', question: 'How do I delete my account?', answer: 'Go to Settings > Account > Delete my account' },
        { category: 'Security', question: 'How do I enable two-step verification?', answer: 'Go to Settings > Account > Two-step verification' },
        { category: 'Privacy', question: 'Who can see my last seen?', answer: 'Go to Settings > Privacy > Last seen' },
        { category: 'Chats', question: 'How do I backup my chats?', answer: 'Go to Settings > Chats > Chat backup' },
        { category: 'Groups', question: 'How many people can I add to a group?', answer: 'You can add up to 1024 participants' },
    ];

    const filteredFaqs = faqItems.filter(item => {
        const matchesCategory = !selectedCategory || item.category === selectedCategory;
        const matchesSearch = !searchQuery || 
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const openURL = (url: string) => {
        Linking.openURL(url).catch(() => {});
    };

    const QuickLinkCard = ({ icon, title, description, onPress }: any) => (
        <TouchableOpacity style={styles.quickCard} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
                <IconButton icon={icon.name} size={24} iconColor={icon.color} style={styles.iconButton} />
            </View>
            <View style={styles.quickCardInfo}>
                <Text style={styles.quickCardTitle}>{title}</Text>
                <Text style={styles.quickCardDescription}>{description}</Text>
            </View>
            <IconButton icon="open-in-new" size={20} iconColor="#8696A0" />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.headerCard}>
                <View style={styles.helpIcon}>
                    <IconButton icon="help-circle" iconColor="#00BCD4" size={32} />
                </View>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <Text style={styles.headerSubtitle}>Get answers to your questions</Text>
            </View>

            {/* Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
            >
                {categories.map(category => (
                    <Chip
                        key={category}
                        selected={selectedCategory === category}
                        onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
                        style={[styles.categoryChip, selectedCategory === category && styles.categoryChipSelected]}
                        textStyle={[styles.categoryChipText, selectedCategory === category && styles.categoryChipTextSelected]}
                    >
                        {category}
                    </Chip>
                ))}
            </ScrollView>

            {/* FAQ Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                <View style={styles.cardContainer}>
                    {filteredFaqs.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.faqCard}
                            onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.faqHeader}>
                                <Text style={styles.faqQuestion}>{item.question}</Text>
                                <IconButton 
                                    icon={expandedFaq === index ? 'chevron-up' : 'chevron-down'} 
                                    size={20} 
                                    iconColor="#8696A0" 
                                />
                            </View>
                            {expandedFaq === index && (
                                <Text style={styles.faqAnswer}>{item.answer}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Quick Links */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Links</Text>
                <View style={styles.cardContainer}>
                    <QuickLinkCard
                        icon={{ name: 'web', color: '#4CAF50' }}
                        title="Help Center"
                        description="Browse help articles"
                        onPress={() => openURL('https://faq.whatsapp.com')}
                    />
                    <QuickLinkCard
                        icon={{ name: 'email', color: '#2196F3' }}
                        title="Contact Us"
                        description="Send feedback or report issues"
                        onPress={() => openURL('mailto:support@whatsapp.com')}
                    />
                    <QuickLinkCard
                        icon={{ name: 'twitter', color: '#1DA1F2' }}
                        title="Follow on Twitter"
                        description="@WhatsApp"
                        onPress={() => openURL('https://twitter.com/whatsapp')}
                    />
                </View>
            </View>

            <View style={styles.bottomSpace} />
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
    helpIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E0F7FA',
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
    },
    categoriesContainer: {
        marginBottom: 20,
    },
    categoriesContent: {
        paddingHorizontal: 20,
        gap: 8,
    },
    categoryChip: {
        backgroundColor: '#fff',
        borderColor: '#E0E0E0',
        borderWidth: 1,
    },
    categoryChipSelected: {
        backgroundColor: '#25D366',
        borderColor: '#25D366',
    },
    categoryChipText: {
        color: '#667781',
    },
    categoryChipTextSelected: {
        color: '#fff',
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
    faqCard: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        flex: 1,
    },
    faqAnswer: {
        fontSize: 13,
        color: '#667781',
        marginTop: 8,
        lineHeight: 18,
    },
    quickCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
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
    quickCardInfo: {
        marginLeft: 14,
        flex: 1,
    },
    quickCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    quickCardDescription: {
        fontSize: 13,
        color: '#667781',
        marginTop: 2,
    },
    bottomSpace: {
        height: 24,
    },
});
