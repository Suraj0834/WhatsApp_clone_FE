import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Avatar, ProgressBar, Divider, IconButton } from 'react-native-paper';

interface PollOption {
    id: string;
    text: string;
    votes: number;
    voters: string[];
}

interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    totalVotes: number;
    allowMultipleAnswers: boolean;
    createdBy: string;
    createdAt: Date;
    myVotes: string[];
}

export const ViewPollScreen = () => {
    const [poll, setPoll] = useState<Poll>({
        id: '1',
        question: 'What time works best for the meeting?',
        options: [
            { id: '1', text: '10:00 AM', votes: 5, voters: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'] },
            { id: '2', text: '2:00 PM', votes: 8, voters: ['Frank', 'George', 'Hannah', 'Ian', 'Julia', 'Kevin', 'Linda', 'Mike'] },
            { id: '3', text: '4:00 PM', votes: 3, voters: ['Nancy', 'Oscar', 'Paul'] },
        ],
        totalVotes: 16,
        allowMultipleAnswers: false,
        createdBy: 'John Doe',
        createdAt: new Date(),
        myVotes: ['2'],
    });

    const [showVoters, setShowVoters] = useState<string | null>(null);

    const handleVote = (optionId: string) => {
        if (!poll.allowMultipleAnswers) {
            // Single choice: replace existing vote
            setPoll(prev => {
                const updatedOptions = prev.options.map(opt => {
                    if (opt.id === optionId) {
                        return {
                            ...opt,
                            votes: opt.votes + 1,
                            voters: [...opt.voters, 'You'],
                        };
                    } else if (prev.myVotes.includes(opt.id)) {
                        return {
                            ...opt,
                            votes: opt.votes - 1,
                            voters: opt.voters.filter(v => v !== 'You'),
                        };
                    }
                    return opt;
                });

                return {
                    ...prev,
                    options: updatedOptions,
                    myVotes: [optionId],
                };
            });
        } else {
            // Multiple choice: toggle vote
            setPoll(prev => {
                const isVoted = prev.myVotes.includes(optionId);
                const updatedOptions = prev.options.map(opt => {
                    if (opt.id === optionId) {
                        return {
                            ...opt,
                            votes: isVoted ? opt.votes - 1 : opt.votes + 1,
                            voters: isVoted
                                ? opt.voters.filter(v => v !== 'You')
                                : [...opt.voters, 'You'],
                        };
                    }
                    return opt;
                });

                return {
                    ...prev,
                    options: updatedOptions,
                    myVotes: isVoted
                        ? prev.myVotes.filter(id => id !== optionId)
                        : [...prev.myVotes, optionId],
                };
            });
        }
    };

    const renderOption = (option: PollOption) => {
        const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
        const isVoted = poll.myVotes.includes(option.id);
        const isWinning = option.votes === Math.max(...poll.options.map(o => o.votes)) && option.votes > 0;

        return (
            <TouchableOpacity
                key={option.id}
                style={[
                    styles.optionItem,
                    isVoted && styles.optionItemVoted,
                ]}
                onPress={() => handleVote(option.id)}
            >
                <View style={styles.optionHeader}>
                    <View style={styles.optionLeft}>
                        <View style={[
                            styles.optionCheckbox,
                            isVoted && styles.optionCheckboxVoted,
                        ]}>
                            {isVoted && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.optionText}>{option.text}</Text>
                        {isWinning && <Text style={styles.winningBadge}>🏆</Text>}
                    </View>
                    <Text style={styles.voteCount}>{option.votes}</Text>
                </View>
                
                <ProgressBar
                    progress={percentage / 100}
                    color={isVoted ? '#25D366' : '#E8E8E8'}
                    style={styles.progressBar}
                />
                
                <View style={styles.optionFooter}>
                    <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
                    <TouchableOpacity onPress={() => setShowVoters(showVoters === option.id ? null : option.id)}>
                        <Text style={styles.viewVoters}>
                            View voters ({option.voters.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {showVoters === option.id && (
                    <View style={styles.votersList}>
                        {option.voters.map((voter, index) => (
                            <Text key={index} style={styles.voterName}>• {voter}</Text>
                        ))}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.pollIcon}>📊</Text>
                    <Text style={styles.question}>{poll.question}</Text>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.optionsContainer}>
                    {poll.options.map(renderOption)}
                </View>

                <Divider style={styles.divider} />

                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Total votes</Text>
                        <Text style={styles.infoValue}>{poll.totalVotes}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Created by</Text>
                        <Text style={styles.infoValue}>{poll.createdBy}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Created at</Text>
                        <Text style={styles.infoValue}>
                            {poll.createdAt.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                    {poll.allowMultipleAnswers && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Type</Text>
                            <Text style={styles.infoValue}>Multiple choice</Text>
                        </View>
                    )}
                </View>

                <View style={styles.noteBox}>
                    <Text style={styles.noteText}>
                        ℹ️ Polls are anonymous. You can change your vote anytime.
                    </Text>
                </View>
            </ScrollView>
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
    header: {
        padding: 20,
        alignItems: 'center',
    },
    pollIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    question: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
    },
    divider: {
        height: 8,
        backgroundColor: '#F7F8FA',
    },
    optionsContainer: {
        padding: 16,
    },
    optionItem: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
    },
    optionItemVoted: {
        backgroundColor: '#E7F5EC',
        borderWidth: 2,
        borderColor: '#25D366',
    },
    optionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionCheckbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#667781',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionCheckboxVoted: {
        backgroundColor: '#25D366',
        borderColor: '#25D366',
    },
    checkmark: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        flex: 1,
    },
    winningBadge: {
        fontSize: 18,
        marginLeft: 8,
    },
    voteCount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#25D366',
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        marginVertical: 8,
    },
    optionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    percentage: {
        fontSize: 13,
        fontWeight: '600',
        color: '#667781',
    },
    viewVoters: {
        fontSize: 13,
        color: '#25D366',
        fontWeight: '600',
    },
    votersList: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    },
    voterName: {
        fontSize: 14,
        color: '#667781',
        marginBottom: 4,
    },
    infoSection: {
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#667781',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    noteBox: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFF9E6',
        borderRadius: 8,
    },
    noteText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
});
