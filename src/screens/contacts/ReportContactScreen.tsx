import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { List, Button, Checkbox, Text, Divider } from 'react-native-paper';

export const ReportContactScreen = ({ route, navigation }: any) => {
    const { conversationId, contactName = 'Contact' } = route.params || {};
    const [reasons, setReasons] = useState({
        spam: false,
        inappropriate: false,
        violence: false,
        harassment: false,
        other: false,
    });
    const [blockContact, setBlockContact] = useState(true);

    const handleReport = () => {
        const selectedReasons = Object.entries(reasons)
            .filter(([_, selected]) => selected)
            .map(([reason]) => reason);

        if (selectedReasons.length === 0) {
            Alert.alert('Error', 'Please select at least one reason');
            return;
        }

        Alert.alert(
            'Report Submitted',
            `Thank you for your report. We have received your feedback about ${contactName}.${
                blockContact ? ' This contact has been blocked.' : ''
            }`,
            [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Report {contactName} to WhatsApp
                </Text>
                <Text style={styles.subHeaderText}>
                    Last 5 messages from this contact will be forwarded to WhatsApp.
                    This contact won't be notified.
                </Text>
            </View>

            <Divider />

            <List.Section>
                <List.Subheader>Select reason(s)</List.Subheader>
                
                <List.Item
                    title="Spam"
                    description="Unwanted messages or promotional content"
                    left={() => (
                        <Checkbox
                            status={reasons.spam ? 'checked' : 'unchecked'}
                            onPress={() => setReasons({ ...reasons, spam: !reasons.spam })}
                        />
                    )}
                    onPress={() => setReasons({ ...reasons, spam: !reasons.spam })}
                />

                <List.Item
                    title="Inappropriate content"
                    description="Offensive or adult content"
                    left={() => (
                        <Checkbox
                            status={reasons.inappropriate ? 'checked' : 'unchecked'}
                            onPress={() =>
                                setReasons({ ...reasons, inappropriate: !reasons.inappropriate })
                            }
                        />
                    )}
                    onPress={() =>
                        setReasons({ ...reasons, inappropriate: !reasons.inappropriate })
                    }
                />

                <List.Item
                    title="Violence or threats"
                    description="Threatening or violent messages"
                    left={() => (
                        <Checkbox
                            status={reasons.violence ? 'checked' : 'unchecked'}
                            onPress={() =>
                                setReasons({ ...reasons, violence: !reasons.violence })
                            }
                        />
                    )}
                    onPress={() => setReasons({ ...reasons, violence: !reasons.violence })}
                />

                <List.Item
                    title="Harassment"
                    description="Bullying or harassment"
                    left={() => (
                        <Checkbox
                            status={reasons.harassment ? 'checked' : 'unchecked'}
                            onPress={() =>
                                setReasons({ ...reasons, harassment: !reasons.harassment })
                            }
                        />
                    )}
                    onPress={() => setReasons({ ...reasons, harassment: !reasons.harassment })}
                />

                <List.Item
                    title="Other"
                    description="Other issues"
                    left={() => (
                        <Checkbox
                            status={reasons.other ? 'checked' : 'unchecked'}
                            onPress={() => setReasons({ ...reasons, other: !reasons.other })}
                        />
                    )}
                    onPress={() => setReasons({ ...reasons, other: !reasons.other })}
                />
            </List.Section>

            <Divider style={styles.divider} />

            <List.Item
                title="Block contact"
                description="They won't be able to call or message you"
                left={() => (
                    <Checkbox
                        status={blockContact ? 'checked' : 'unchecked'}
                        onPress={() => setBlockContact(!blockContact)}
                    />
                )}
                onPress={() => setBlockContact(!blockContact)}
            />

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleReport}
                    style={styles.reportButton}
                    buttonColor="#d32f2f"
                >
                    Report Contact
                </Button>
                <Button mode="text" onPress={() => navigation.goBack()} style={styles.cancelButton}>
                    Cancel
                </Button>
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
        backgroundColor: '#f5f5f5',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    subHeaderText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    divider: {
        marginVertical: 16,
    },
    footer: {
        padding: 16,
        paddingBottom: 40,
    },
    reportButton: {
        marginBottom: 12,
    },
    cancelButton: {
        marginTop: 8,
    },
});
