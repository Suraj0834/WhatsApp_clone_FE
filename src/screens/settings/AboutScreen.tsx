import React from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity, Linking } from 'react-native';
import { IconButton } from 'react-native-paper';

export const AboutScreen = () => {
    const appVersion = '2.24.1';
    const buildNumber = '12345';
    const releaseDate = 'December 9, 2024';

    const openURL = (url: string) => {
        Linking.openURL(url).catch(() => {});
    };

    const InfoCard = ({ icon, title, description, onPress, external }: any) => (
        <TouchableOpacity style={styles.infoCard} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
                    <IconButton icon={icon.name} size={24} iconColor={icon.color} style={styles.iconButton} />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    {description && <Text style={styles.cardDescription}>{description}</Text>}
                </View>
            </View>
            <IconButton icon={external ? 'open-in-new' : 'chevron-right'} size={20} iconColor="#8696A0" />
        </TouchableOpacity>
    );

    const SocialButton = ({ icon, label, url, color }: any) => (
        <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: `${color}15` }]}
            onPress={() => openURL(url)}
            activeOpacity={0.8}
        >
            <IconButton icon={icon} iconColor={color} size={24} />
            <Text style={[styles.socialLabel, { color }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* App Header */}
            <View style={styles.headerCard}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoIcon}>💬</Text>
                </View>
                <Text style={styles.appName}>WhatsApp</Text>
                <Text style={styles.tagline}>Simple. Secure. Reliable messaging.</Text>
            </View>

            {/* Version Info */}
            <View style={styles.versionCard}>
                <View style={styles.versionRow}>
                    <View style={styles.versionItem}>
                        <Text style={styles.versionLabel}>Version</Text>
                        <Text style={styles.versionValue}>{appVersion}</Text>
                    </View>
                    <View style={styles.versionDivider} />
                    <View style={styles.versionItem}>
                        <Text style={styles.versionLabel}>Build</Text>
                        <Text style={styles.versionValue}>{buildNumber}</Text>
                    </View>
                </View>
                <Text style={styles.releaseDate}>Released on {releaseDate}</Text>
            </View>

            {/* Legal */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Legal & Policies</Text>
                <View style={styles.cardContainer}>
                    <InfoCard
                        icon={{ name: 'shield-lock', color: '#4CAF50' }}
                        title="Privacy Policy"
                        description="How we handle your data"
                        onPress={() => openURL('https://www.whatsapp.com/legal/privacy-policy')}
                        external
                    />
                    <InfoCard
                        icon={{ name: 'file-document', color: '#2196F3' }}
                        title="Terms of Service"
                        description="Agreement and conditions"
                        onPress={() => openURL('https://www.whatsapp.com/legal/terms-of-service')}
                        external
                    />
                    <InfoCard
                        icon={{ name: 'license', color: '#FF9800' }}
                        title="Open Source Licenses"
                        description="Third-party software"
                        onPress={() => {}}
                    />
                </View>
            </View>

            {/* Support */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support & Information</Text>
                <View style={styles.cardContainer}>
                    <InfoCard
                        icon={{ name: 'help-circle', color: '#00BCD4' }}
                        title="Help Center"
                        description="FAQs and troubleshooting"
                        onPress={() => openURL('https://faq.whatsapp.com')}
                        external
                    />
                    <InfoCard
                        icon={{ name: 'email', color: '#9C27B0' }}
                        title="Contact Us"
                        description="Send feedback or report issues"
                        onPress={() => openURL('mailto:support@whatsapp.com')}
                        external
                    />
                    <InfoCard
                        icon={{ name: 'information', color: '#607D8B' }}
                        title="App Information"
                        description="Detailed app details"
                        onPress={() => {}}
                    />
                </View>
            </View>

            {/* Social Media */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Follow Us</Text>
                <View style={styles.socialContainer}>
                    <SocialButton
                        icon="twitter"
                        label="Twitter"
                        url="https://twitter.com/whatsapp"
                        color="#1DA1F2"
                    />
                    <SocialButton
                        icon="facebook"
                        label="Facebook"
                        url="https://facebook.com/whatsapp"
                        color="#1877F2"
                    />
                    <SocialButton
                        icon="instagram"
                        label="Instagram"
                        url="https://instagram.com/whatsapp"
                        color="#E4405F"
                    />
                    <SocialButton
                        icon="youtube"
                        label="YouTube"
                        url="https://youtube.com/whatsapp"
                        color="#FF0000"
                    />
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2024 WhatsApp LLC</Text>
                <Text style={styles.footerSubtext}>A Meta Company</Text>
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
        padding: 32,
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
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#25D36615',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoIcon: {
        fontSize: 40,
    },
    appName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#25D366',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
    },
    versionCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 24,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
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
    versionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    versionItem: {
        alignItems: 'center',
        flex: 1,
    },
    versionLabel: {
        fontSize: 12,
        color: '#8696A0',
        marginBottom: 4,
    },
    versionValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    versionDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E0E0E0',
    },
    releaseDate: {
        fontSize: 12,
        color: '#667781',
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
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    cardLeft: {
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
    cardInfo: {
        marginLeft: 14,
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    cardDescription: {
        fontSize: 13,
        color: '#667781',
        marginTop: 2,
    },
    socialContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        minWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
    },
    socialLabel: {
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    footerText: {
        fontSize: 13,
        color: '#667781',
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: 12,
        color: '#8696A0',
    },
    bottomSpace: {
        height: 24,
    },
});
