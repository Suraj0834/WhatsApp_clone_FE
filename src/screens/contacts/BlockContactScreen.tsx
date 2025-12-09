import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { List, Button, Text, Divider, Dialog, Portal } from 'react-native-paper';

export const BlockContactScreen = ({ route, navigation }: any) => {
    const { conversationId, contactName = 'Contact', contactId } = route.params || {};
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleBlock = () => {
        // Implement actual block logic here
        Alert.alert(
            'Contact Blocked',
            `${contactName} has been blocked. They won't be able to call you or send you messages.`,
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
                <Text style={styles.headerText}>Block {contactName}?</Text>
                <Text style={styles.subHeaderText}>
                    Blocked contacts will no longer be able to call you or send you messages.
                </Text>
            </View>

            <Divider style={styles.divider} />

            <List.Section>
                <List.Subheader>What happens when you block someone</List.Subheader>
                
                <List.Item
                    title="Messages and calls"
                    description="They won't be able to call or send you messages"
                    left={props => <List.Icon {...props} icon="message-off" />}
                />

                <List.Item
                    title="Groups"
                    description="You'll both continue to be in groups you're both in"
                    left={props => <List.Icon {...props} icon="account-group" />}
                />

                <List.Item
                    title="Status updates"
                    description="They won't be able to see your status updates"
                    left={props => <List.Icon {...props} icon="information-off" />}
                />

                <List.Item
                    title="Last seen & online"
                    description="They won't be able to see when you're online or when you were last seen"
                    left={props => <List.Icon {...props} icon="clock-off" />}
                />

                <List.Item
                    title="Profile picture"
                    description="They won't be able to see updates to your profile picture"
                    left={props => <List.Icon {...props} icon="account-off" />}
                />
            </List.Section>

            <Divider style={styles.divider} />

            <List.Section>
                <List.Subheader>Additional actions</List.Subheader>
                
                <List.Item
                    title="Report and block"
                    description="Report this contact to WhatsApp and block them"
                    titleStyle={{ color: '#d32f2f' }}
                    left={props => <List.Icon {...props} icon="alert-circle" color="#d32f2f" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => {
                        navigation.navigate('ReportContact', {
                            conversationId,
                            contactName,
                            contactId,
                        });
                    }}
                />

                <List.Item
                    title="Delete chat"
                    description="Delete all messages in this chat"
                    titleStyle={{ color: '#d32f2f' }}
                    left={props => <List.Icon {...props} icon="delete" color="#d32f2f" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => {
                        navigation.navigate('ClearChat', { conversationId });
                    }}
                />
            </List.Section>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() => setShowConfirmDialog(true)}
                    style={styles.blockButton}
                    buttonColor="#d32f2f"
                >
                    Block Contact
                </Button>
                <Button
                    mode="text"
                    onPress={() => navigation.goBack()}
                    style={styles.cancelButton}
                >
                    Cancel
                </Button>
            </View>

            <Portal>
                <Dialog visible={showConfirmDialog} onDismiss={() => setShowConfirmDialog(false)}>
                    <Dialog.Title>Block {contactName}?</Dialog.Title>
                    <Dialog.Content>
                        <Text>
                            {contactName} won't be able to call you or send you messages. This contact
                            won't be notified.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowConfirmDialog(false)}>Cancel</Button>
                        <Button
                            onPress={() => {
                                setShowConfirmDialog(false);
                                handleBlock();
                            }}
                            textColor="#d32f2f"
                        >
                            Block
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
        fontSize: 20,
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
        backgroundColor: '#E0E0E0',
        height: 8,
        marginVertical: 8,
    },
    footer: {
        padding: 16,
        paddingBottom: 40,
    },
    blockButton: {
        marginBottom: 12,
    },
    cancelButton: {
        marginTop: 8,
    },
});
