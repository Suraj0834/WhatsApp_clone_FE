import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    Share,
    Alert,
} from 'react-native';
import { IconButton, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface Document {
    id: string;
    name: string;
    type: string;
    size: string;
    timestamp: Date;
    sender: string;
}

export const DocumentViewerScreen = () => {
    const navigation = useNavigation<any>();
    
    const [document] = useState<Document>({
        id: '1',
        name: 'Project_Proposal.pdf',
        type: 'pdf',
        size: '2.4 MB',
        timestamp: new Date(),
        sender: 'John Doe',
    });

    const getFileIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'ppt':
            case 'pptx':
                return '📽️';
            case 'txt':
                return '📃';
            case 'zip':
            case 'rar':
                return '🗜️';
            default:
                return '📎';
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Sharing document: ${document.name}`,
            });
        } catch (error) {
            Alert.alert('Error', 'Could not share document');
        }
    };

    const handleDownload = () => {
        Alert.alert('Download', 'Document will be saved to device');
    };

    const handleOpenWith = () => {
        Alert.alert('Open with', 'Choose an app to open this document');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    iconColor="#fff"
                    size={24}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {document.name}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {document.sender} • {document.size}
                    </Text>
                </View>
                <IconButton
                    icon="dots-vertical"
                    iconColor="#fff"
                    size={24}
                    onPress={() => {}}
                />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.documentCard}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.fileIcon}>{getFileIcon(document.type)}</Text>
                    </View>
                    <Text style={styles.fileName}>{document.name}</Text>
                    <Text style={styles.fileInfo}>
                        {document.type.toUpperCase()} • {document.size}
                    </Text>
                    <Text style={styles.fileDate}>
                        {document.timestamp.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>

                <View style={styles.previewContainer}>
                    <Text style={styles.previewTitle}>Document Preview</Text>
                    <View style={styles.previewPlaceholder}>
                        <Text style={styles.previewIcon}>📄</Text>
                        <Text style={styles.previewText}>
                            Preview not available
                        </Text>
                        <Text style={styles.previewSubtext}>
                            Tap "Open with" to view this document in a compatible app
                        </Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Document Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>File Name</Text>
                        <Text style={styles.infoValue}>{document.name}</Text>
                    </View>
                    <Divider />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>File Type</Text>
                        <Text style={styles.infoValue}>{document.type.toUpperCase()}</Text>
                    </View>
                    <Divider />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>File Size</Text>
                        <Text style={styles.infoValue}>{document.size}</Text>
                    </View>
                    <Divider />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Sent by</Text>
                        <Text style={styles.infoValue}>{document.sender}</Text>
                    </View>
                    <Divider />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>
                            {document.timestamp.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton} onPress={handleOpenWith}>
                    <IconButton icon="open-in-new" iconColor="#25D366" size={24} />
                    <Text style={styles.footerButtonText}>Open with</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={handleShare}>
                    <IconButton icon="share-variant" iconColor="#25D366" size={24} />
                    <Text style={styles.footerButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={handleDownload}>
                    <IconButton icon="download" iconColor="#25D366" size={24} />
                    <Text style={styles.footerButtonText}>Download</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 8,
        paddingBottom: 12,
        backgroundColor: '#075E54',
    },
    headerInfo: {
        flex: 1,
        marginHorizontal: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#B3E5DB',
    },
    content: {
        flex: 1,
    },
    documentCard: {
        margin: 16,
        padding: 24,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    fileIcon: {
        fontSize: 48,
    },
    fileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
        marginBottom: 8,
    },
    fileInfo: {
        fontSize: 14,
        color: '#667781',
        marginBottom: 4,
    },
    fileDate: {
        fontSize: 12,
        color: '#667781',
    },
    previewContainer: {
        margin: 16,
    },
    previewTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    previewPlaceholder: {
        height: 300,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    previewIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    previewText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    previewSubtext: {
        fontSize: 13,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 18,
    },
    infoSection: {
        margin: 16,
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#667781',
    },
    infoValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    },
    footerButton: {
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 12,
        color: '#25D366',
        marginTop: -4,
    },
});
