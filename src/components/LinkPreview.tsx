import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { LinkPreview as LinkPreviewType } from '../types/models';

interface LinkPreviewProps {
    preview: LinkPreviewType;
    isOutgoing?: boolean;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ preview, isOutgoing = false }) => {
    const handlePress = () => {
        if (preview.url) {
            Linking.openURL(preview.url);
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isOutgoing ? styles.outgoingContainer : styles.incomingContainer,
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            {preview.image && (
                <Image
                    source={{ uri: preview.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
            <View style={styles.content}>
                {preview.title && (
                    <Text
                        style={[
                            styles.title,
                            isOutgoing ? styles.outgoingText : styles.incomingText,
                        ]}
                        numberOfLines={2}
                    >
                        {preview.title}
                    </Text>
                )}
                {preview.description && (
                    <Text
                        style={[
                            styles.description,
                            isOutgoing ? styles.outgoingText : styles.incomingText,
                        ]}
                        numberOfLines={3}
                    >
                        {preview.description}
                    </Text>
                )}
                {preview.url && (
                    <Text
                        style={[
                            styles.url,
                            isOutgoing ? styles.outgoingUrlText : styles.incomingUrlText,
                        ]}
                        numberOfLines={1}
                    >
                        {new URL(preview.url).hostname}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 4,
        borderWidth: 1,
        maxWidth: '100%',
    },
    outgoingContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    incomingContainer: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E5EA',
    },
    image: {
        width: '100%',
        height: 150,
        backgroundColor: '#F0F0F0',
    },
    content: {
        padding: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        marginBottom: 4,
        lineHeight: 16,
    },
    url: {
        fontSize: 11,
        marginTop: 2,
    },
    outgoingText: {
        color: '#FFFFFF',
    },
    incomingText: {
        color: '#000000',
    },
    outgoingUrlText: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    incomingUrlText: {
        color: '#8E8E93',
    },
});
