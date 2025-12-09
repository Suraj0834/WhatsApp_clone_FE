import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { Avatar, IconButton, Button } from 'react-native-paper';

interface Participant {
    id: string;
    name: string;
    isMuted: boolean;
    isVideoOn: boolean;
}

export const GroupCallScreen = ({ route }: any) => {
    const groupName = route?.params?.groupName || 'Group Call';
    const callType = route?.params?.callType || 'voice'; // 'voice' | 'video'

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(callType === 'video');
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);
    const [callDuration, setCallDuration] = useState(0);

    const [participants, setParticipants] = useState<Participant[]>([
        { id: '1', name: 'Alice Johnson', isMuted: false, isVideoOn: true },
        { id: '2', name: 'Bob Smith', isMuted: false, isVideoOn: false },
        { id: '3', name: 'Charlie Brown', isMuted: true, isVideoOn: true },
        { id: '4', name: 'Diana Prince', isMuted: false, isVideoOn: false },
    ]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCallDuration((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        Alert.alert(
            'End Call',
            'Are you sure you want to end this call?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'End Call',
                    style: 'destructive',
                    onPress: () => {
                        // Navigate back
                        Alert.alert('Call Ended', 'Call ended successfully');
                    },
                },
            ]
        );
    };

    const handleAddParticipant = () => {
        Alert.alert('Add Participant', 'Select contacts to add to the call');
    };

    const renderParticipant = (participant: Participant) => {
        return (
            <View key={participant.id} style={styles.participantCard}>
                <View style={styles.participantVideoPlaceholder}>
                    {participant.isVideoOn ? (
                        <View style={styles.videoPlaceholder}>
                            <Text style={styles.videoPlaceholderText}>📹</Text>
                        </View>
                    ) : (
                        <Avatar.Text
                            size={64}
                            label={participant.name.substring(0, 2).toUpperCase()}
                            style={styles.participantAvatar}
                        />
                    )}
                </View>
                <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{participant.name}</Text>
                    <View style={styles.participantStatus}>
                        {participant.isMuted && (
                            <Text style={styles.statusIcon}>🔇</Text>
                        )}
                        {!participant.isVideoOn && callType === 'video' && (
                            <Text style={styles.statusIcon}>📷❌</Text>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.groupName}>{groupName}</Text>
                <Text style={styles.callInfo}>
                    {participants.length} participants • {formatDuration(callDuration)}
                </Text>
            </View>

            <ScrollView style={styles.participantsContainer}>
                <View style={styles.participantsGrid}>
                    {participants.map((participant) => renderParticipant(participant))}
                </View>
            </ScrollView>

            <View style={styles.controls}>
                <View style={styles.mainControls}>
                    <TouchableOpacity
                        style={[styles.controlButton, isMuted && styles.controlButtonActive]}
                        onPress={() => setIsMuted(!isMuted)}
                    >
                        <IconButton
                            icon={isMuted ? 'microphone-off' : 'microphone'}
                            size={32}
                            iconColor="#fff"
                        />
                        <Text style={styles.controlLabel}>
                            {isMuted ? 'Unmute' : 'Mute'}
                        </Text>
                    </TouchableOpacity>

                    {callType === 'video' && (
                        <TouchableOpacity
                            style={[styles.controlButton, !isVideoOn && styles.controlButtonActive]}
                            onPress={() => setIsVideoOn(!isVideoOn)}
                        >
                            <IconButton
                                icon={isVideoOn ? 'video' : 'video-off'}
                                size={32}
                                iconColor="#fff"
                            />
                            <Text style={styles.controlLabel}>
                                {isVideoOn ? 'Stop Video' : 'Start Video'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
                        onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                    >
                        <IconButton
                            icon={isSpeakerOn ? 'volume-high' : 'volume-off'}
                            size={32}
                            iconColor="#fff"
                        />
                        <Text style={styles.controlLabel}>Speaker</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={handleAddParticipant}
                    >
                        <IconButton
                            icon="account-plus"
                            size={32}
                            iconColor="#fff"
                        />
                        <Text style={styles.controlLabel}>Add</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
                    <IconButton icon="phone-hangup" size={32} iconColor="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1418',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center',
    },
    groupName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    callInfo: {
        fontSize: 14,
        color: '#8696A0',
    },
    participantsContainer: {
        flex: 1,
    },
    participantsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 8,
    },
    participantCard: {
        width: '48%',
        marginHorizontal: '1%',
        marginVertical: 8,
        backgroundColor: '#1F2C33',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    participantVideoPlaceholder: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    videoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoPlaceholderText: {
        fontSize: 48,
    },
    participantAvatar: {
        backgroundColor: '#25D366',
    },
    participantInfo: {
        alignItems: 'center',
    },
    participantName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    participantStatus: {
        flexDirection: 'row',
    },
    statusIcon: {
        fontSize: 12,
        marginHorizontal: 2,
    },
    controls: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 20,
    },
    mainControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    controlButton: {
        alignItems: 'center',
        backgroundColor: '#1F2C33',
        borderRadius: 50,
        padding: 8,
    },
    controlButtonActive: {
        backgroundColor: '#F44336',
    },
    controlLabel: {
        fontSize: 12,
        color: '#fff',
        marginTop: 4,
    },
    endCallButton: {
        backgroundColor: '#F44336',
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
});
