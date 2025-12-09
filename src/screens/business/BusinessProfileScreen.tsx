import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
} from 'react-native';
import { List, Switch, Divider, Button, Chip } from 'react-native-paper';

interface BusinessProfile {
    businessName: string;
    category: string;
    description: string;
    address: string;
    email: string;
    website: string;
    hours: string;
}

export const BusinessProfileScreen = () => {
    const [isBusinessAccount, setIsBusinessAccount] = useState(true);
    const [showBusinessInfo, setShowBusinessInfo] = useState(true);
    const [awayMessage, setAwayMessage] = useState(false);

    const [profile, setProfile] = useState<BusinessProfile>({
        businessName: 'Tech Solutions Inc.',
        category: 'Technology Services',
        description: 'Professional IT consulting and software development services',
        address: '123 Tech Street, San Francisco, CA 94105',
        email: 'contact@techsolutions.com',
        website: 'www.techsolutions.com',
        hours: 'Mon-Fri: 9AM-6PM',
    });

    const categories = [
        'Retail',
        'Food & Beverage',
        'Technology Services',
        'Healthcare',
        'Education',
        'Professional Services',
        'Entertainment',
        'Other',
    ];

    const handleEditProfile = () => {
        Alert.alert(
            'Edit Business Profile',
            'Edit your business information',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Edit', onPress: () => {} },
            ]
        );
    };

    const handleChangeCategory = () => {
        Alert.alert(
            'Business Category',
            'Choose your business category',
            [
                ...categories.map((cat) => ({
                    text: cat,
                    onPress: () => {
                        setProfile({ ...profile, category: cat });
                        Alert.alert('Success', `Category changed to ${cat}`);
                    },
                })),
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleViewCatalog = () => {
        Alert.alert('Product Catalog', 'View and manage your product catalog');
    };

    const handleBusinessTools = () => {
        Alert.alert('Business Tools', 'Access business analytics and insights');
    };

    const handleMessagingStats = () => {
        Alert.alert(
            'Messaging Statistics',
            'Messages sent: 1,234\nMessages received: 2,456\nResponse rate: 95%\nAverage response time: 2 minutes',
            [{ text: 'OK' }]
        );
    };

    const handleLabels = () => {
        Alert.alert('Labels', 'Create and manage conversation labels');
    };

    const handleQuickReplies = () => {
        Alert.alert('Quick Replies', 'Set up quick reply messages');
    };

    const handleAwayMessage = () => {
        if (!awayMessage) {
            Alert.alert(
                'Away Message',
                'Set an automatic away message',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Set Message',
                        onPress: () => {
                            setAwayMessage(true);
                            Alert.alert('Success', 'Away message activated');
                        },
                    },
                ]
            );
        } else {
            setAwayMessage(false);
        }
    };

    const handleVerification = () => {
        Alert.alert(
            'Business Verification',
            'Verify your business to get a green checkmark',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Start Verification', onPress: () => {} },
            ]
        );
    };

    const handleConvertToPersonal = () => {
        Alert.alert(
            'Convert to Personal Account',
            'Convert this business account to a personal account? Business features will be disabled.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Convert',
                    style: 'destructive',
                    onPress: () => {
                        setIsBusinessAccount(false);
                        Alert.alert('Success', 'Converted to personal account');
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.businessBadge}>
                    <Text style={styles.businessBadgeText}>💼 Business Account</Text>
                </View>
                {isBusinessAccount && (
                    <TouchableOpacity onPress={handleVerification}>
                        <Text style={styles.verifyLink}>Get Verified ✓</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Business Information</Text>
                    <TouchableOpacity onPress={handleEditProfile}>
                        <Text style={styles.editLink}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Business Name</Text>
                        <Text style={styles.infoValue}>{profile.businessName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Category</Text>
                        <TouchableOpacity onPress={handleChangeCategory}>
                            <Text style={styles.infoValueLink}>{profile.category} →</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Description</Text>
                        <Text style={styles.infoValue} numberOfLines={2}>
                            {profile.description}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Address</Text>
                        <Text style={styles.infoValue} numberOfLines={2}>
                            {profile.address}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{profile.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Website</Text>
                        <Text style={styles.infoValue}>{profile.website}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Business Hours</Text>
                        <Text style={styles.infoValue}>{profile.hours}</Text>
                    </View>
                </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <List.Item
                    title="Show business info"
                    description="Display business details in profile"
                    left={() => <List.Icon icon="information" color="#25D366" />}
                    right={() => (
                        <Switch
                            value={showBusinessInfo}
                            onValueChange={setShowBusinessInfo}
                        />
                    )}
                />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <List.Item
                    title="Product Catalog"
                    description="Manage your products and services"
                    left={() => <List.Icon icon="shopping" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={handleViewCatalog}
                />

                <List.Item
                    title="Business Tools"
                    description="Analytics and insights"
                    left={() => <List.Icon icon="chart-bar" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={handleBusinessTools}
                />

                <List.Item
                    title="Messaging Statistics"
                    description="View your messaging metrics"
                    left={() => <List.Icon icon="message-text" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={handleMessagingStats}
                />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <List.Item
                    title="Labels"
                    description="Organize conversations with labels"
                    left={() => <List.Icon icon="label" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={handleLabels}
                />

                <List.Item
                    title="Quick Replies"
                    description="Create quick response templates"
                    left={() => <List.Icon icon="reply" color="#25D366" />}
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={handleQuickReplies}
                />

                <List.Item
                    title="Away Message"
                    description={awayMessage ? 'Currently active' : 'Set automatic replies'}
                    left={() => <List.Icon icon="clock-alert" color="#25D366" />}
                    right={() => (
                        <Switch value={awayMessage} onValueChange={handleAwayMessage} />
                    )}
                />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>This Month's Performance</Text>
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>1,234</Text>
                        <Text style={styles.statLabel}>Messages Sent</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>95%</Text>
                        <Text style={styles.statLabel}>Response Rate</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>2m</Text>
                        <Text style={styles.statLabel}>Avg Response</Text>
                    </View>
                </View>
            </View>

            <View style={styles.dangerZone}>
                <Text style={styles.dangerZoneTitle}>Account Type</Text>
                <TouchableOpacity
                    style={styles.dangerButton}
                    onPress={handleConvertToPersonal}
                >
                    <Text style={styles.dangerButtonText}>
                        Convert to Personal Account
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        backgroundColor: '#E7F5EC',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    businessBadge: {
        backgroundColor: '#25D366',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    businessBadgeText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    verifyLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#25D366',
    },
    divider: {
        height: 8,
        backgroundColor: '#F7F8FA',
    },
    section: {
        backgroundColor: '#fff',
        paddingVertical: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    editLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#25D366',
    },
    infoCard: {
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
    },
    infoRow: {
        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 13,
        color: '#667781',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 15,
        color: '#000',
        fontWeight: '500',
    },
    infoValueLink: {
        fontSize: 15,
        color: '#25D366',
        fontWeight: '600',
    },
    statsCard: {
        margin: 16,
        padding: 20,
        backgroundColor: '#E7F5EC',
        borderRadius: 12,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#25D366',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#667781',
        textAlign: 'center',
    },
    dangerZone: {
        margin: 16,
        padding: 20,
        backgroundColor: '#FFF9E6',
        borderRadius: 12,
        marginBottom: 32,
    },
    dangerZoneTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    dangerButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#F44336',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    dangerButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#F44336',
    },
});
