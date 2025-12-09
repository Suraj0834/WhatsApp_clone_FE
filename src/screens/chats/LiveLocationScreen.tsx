import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';

interface Location {
    latitude: number;
    longitude: number;
    address?: string;
}

export const LiveLocationScreen = () => {
    const [isSharing, setIsSharing] = useState(false);
    const [duration, setDuration] = useState(15); // minutes
    
    const [currentLocation] = useState<Location>({
        latitude: 37.78825,
        longitude: -122.4324,
        address: 'San Francisco, CA',
    });

    const handleStartSharing = () => {
        Alert.alert(
            'Share live location',
            `Share your live location for ${duration} minutes?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Share',
                    onPress: () => {
                        setIsSharing(true);
                        Alert.alert('Success', 'Live location sharing started');
                    },
                },
            ]
        );
    };

    const handleStopSharing = () => {
        Alert.alert(
            'Stop sharing',
            'Stop sharing your live location?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Stop',
                    style: 'destructive',
                    onPress: () => {
                        setIsSharing(false);
                        Alert.alert('Stopped', 'Live location sharing stopped');
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation
                showsMyLocationButton
            >
                <Marker
                    coordinate={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                    }}
                    title="Your Location"
                    description={currentLocation.address}
                >
                    <View style={styles.markerContainer}>
                        <Avatar.Text
                            size={40}
                            label="You"
                            style={styles.markerAvatar}
                        />
                    </View>
                </Marker>
            </MapView>

            {isSharing && (
                <View style={styles.sharingBanner}>
                    <View style={styles.sharingInfo}>
                        <Text style={styles.sharingTitle}>Sharing live location</Text>
                        <Text style={styles.sharingTime}>
                            {duration} minutes remaining
                        </Text>
                    </View>
                    <TouchableOpacity onPress={handleStopSharing}>
                        <Text style={styles.stopButton}>Stop</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.footer}>
                {!isSharing ? (
                    <>
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationIcon}>📍</Text>
                            <View style={styles.locationText}>
                                <Text style={styles.locationTitle}>Current Location</Text>
                                <Text style={styles.locationAddress}>
                                    {currentLocation.address}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.durationSelector}>
                            <Text style={styles.durationLabel}>Share for:</Text>
                            <View style={styles.durationButtons}>
                                {[15, 60, 480].map(mins => (
                                    <TouchableOpacity
                                        key={mins}
                                        style={[
                                            styles.durationButton,
                                            duration === mins && styles.durationButtonActive,
                                        ]}
                                        onPress={() => setDuration(mins)}
                                    >
                                        <Text
                                            style={[
                                                styles.durationButtonText,
                                                duration === mins && styles.durationButtonTextActive,
                                            ]}
                                        >
                                            {mins < 60 ? `${mins} min` : `${mins / 60} hr${mins / 60 > 1 ? 's' : ''}`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleStartSharing}
                            style={styles.shareButton}
                            icon="map-marker-radius"
                            labelStyle={styles.shareButtonText}
                        >
                            SHARE LIVE LOCATION
                        </Button>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                Your live location will be shared in this chat. Others can see where
                                you are in real-time.
                            </Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.sharingDetails}>
                        <Text style={styles.sharingDetailsTitle}>
                            Live location is being shared
                        </Text>
                        <Text style={styles.sharingDetailsText}>
                            Everyone in this chat can see your real-time location
                        </Text>
                        <Button
                            mode="outlined"
                            onPress={handleStopSharing}
                            style={styles.stopFullButton}
                            labelStyle={styles.stopFullButtonText}
                        >
                            STOP SHARING
                        </Button>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        flex: 1,
    },
    markerContainer: {
        alignItems: 'center',
    },
    markerAvatar: {
        backgroundColor: '#25D366',
    },
    sharingBanner: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        flexDirection: 'row',
        backgroundColor: '#25D366',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    sharingInfo: {
        flex: 1,
    },
    sharingTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    sharingTime: {
        fontSize: 12,
        color: '#fff',
    },
    stopButton: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        paddingHorizontal: 12,
    },
    footer: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    locationIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    locationText: {
        flex: 1,
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    locationAddress: {
        fontSize: 13,
        color: '#667781',
    },
    durationSelector: {
        marginBottom: 16,
    },
    durationLabel: {
        fontSize: 14,
        color: '#667781',
        marginBottom: 8,
    },
    durationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    durationButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 4,
        backgroundColor: '#F7F8FA',
        borderRadius: 8,
        alignItems: 'center',
    },
    durationButtonActive: {
        backgroundColor: '#25D366',
    },
    durationButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#667781',
    },
    durationButtonTextActive: {
        color: '#fff',
    },
    shareButton: {
        backgroundColor: '#25D366',
        marginBottom: 12,
    },
    shareButtonText: {
        fontSize: 15,
        fontWeight: '700',
    },
    infoBox: {
        padding: 12,
        backgroundColor: '#FFF9E6',
        borderRadius: 8,
    },
    infoText: {
        fontSize: 12,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 16,
    },
    sharingDetails: {
        alignItems: 'center',
    },
    sharingDetailsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    sharingDetailsText: {
        fontSize: 14,
        color: '#667781',
        textAlign: 'center',
        marginBottom: 24,
    },
    stopFullButton: {
        borderColor: '#F44336',
        width: '100%',
    },
    stopFullButtonText: {
        color: '#F44336',
        fontSize: 15,
        fontWeight: '700',
    },
});
