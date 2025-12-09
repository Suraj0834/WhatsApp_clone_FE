import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { Button, RadioButton, Divider } from 'react-native-paper';

interface PollOption {
    id: string;
    text: string;
}

export const CreatePollScreen = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<PollOption[]>([
        { id: '1', text: '' },
        { id: '2', text: '' },
    ]);
    const [allowMultipleAnswers, setAllowMultipleAnswers] = useState(false);

    const addOption = () => {
        if (options.length >= 12) {
            Alert.alert('Limit reached', 'You can add up to 12 options');
            return;
        }
        setOptions([...options, { id: Date.now().toString(), text: '' }]);
    };

    const removeOption = (id: string) => {
        if (options.length <= 2) {
            Alert.alert('Error', 'Poll must have at least 2 options');
            return;
        }
        setOptions(options.filter(option => option.id !== id));
    };

    const updateOption = (id: string, text: string) => {
        setOptions(options.map(option => 
            option.id === id ? { ...option, text } : option
        ));
    };

    const handleSend = () => {
        if (!question.trim()) {
            Alert.alert('Error', 'Please enter a question');
            return;
        }

        const filledOptions = options.filter(opt => opt.text.trim());
        if (filledOptions.length < 2) {
            Alert.alert('Error', 'Please provide at least 2 options');
            return;
        }

        Alert.alert('Success', 'Poll created and sent!');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.label}>Question</Text>
                    <TextInput
                        style={styles.questionInput}
                        placeholder="Ask a question"
                        value={question}
                        onChangeText={setQuestion}
                        maxLength={255}
                        multiline
                    />
                    <Text style={styles.charCount}>{question.length}/255</Text>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.label}>Options</Text>
                    {options.map((option, index) => (
                        <View key={option.id} style={styles.optionContainer}>
                            <Text style={styles.optionNumber}>{index + 1}</Text>
                            <TextInput
                                style={styles.optionInput}
                                placeholder={`Option ${index + 1}`}
                                value={option.text}
                                onChangeText={(text) => updateOption(option.id, text)}
                                maxLength={100}
                            />
                            {options.length > 2 && (
                                <TouchableOpacity
                                    onPress={() => removeOption(option.id)}
                                    style={styles.removeButton}
                                >
                                    <Text style={styles.removeButtonText}>✕</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                    
                    {options.length < 12 && (
                        <TouchableOpacity style={styles.addOptionButton} onPress={addOption}>
                            <Text style={styles.addOptionText}>+ Add option</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Divider style={styles.divider} />

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setAllowMultipleAnswers(!allowMultipleAnswers)}
                    >
                        <View style={styles.settingLeft}>
                            <Text style={styles.settingTitle}>Allow multiple answers</Text>
                            <Text style={styles.settingSubtitle}>
                                Let people select more than one option
                            </Text>
                        </View>
                        <View style={styles.checkbox}>
                            {allowMultipleAnswers && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        • Polls are anonymous{'\n'}
                        • People can change their vote{'\n'}
                        • You can see who voted for each option
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleSend}
                    style={styles.sendButton}
                    icon="send"
                    labelStyle={styles.sendButtonText}
                >
                    SEND POLL
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#667781',
        marginBottom: 12,
    },
    questionInput: {
        backgroundColor: '#F7F8FA',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#000',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        color: '#667781',
        textAlign: 'right',
        marginTop: 4,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    optionNumber: {
        width: 24,
        fontSize: 14,
        fontWeight: '600',
        color: '#667781',
    },
    optionInput: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        color: '#000',
    },
    removeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    removeButtonText: {
        fontSize: 20,
        color: '#F44336',
    },
    addOptionButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    addOptionText: {
        fontSize: 15,
        color: '#25D366',
        fontWeight: '600',
    },
    divider: {
        height: 8,
        backgroundColor: '#F7F8FA',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLeft: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#667781',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25D366',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    infoBox: {
        margin: 16,
        padding: 16,
        backgroundColor: '#E7F5EC',
        borderRadius: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 20,
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    },
    sendButton: {
        backgroundColor: '#25D366',
    },
    sendButtonText: {
        fontSize: 15,
        fontWeight: '700',
    },
});
