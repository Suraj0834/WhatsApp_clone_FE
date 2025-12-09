import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Avatar, IconButton, Searchbar, Chip } from 'react-native-paper';

interface MediaItem {
    id: string;
    type: 'image' | 'video' | 'document' | 'link';
    uri?: string;
    thumbnail?: string;
    title?: string;
    url?: string;
    timestamp: Date;
}

export const MediaLinksScreen = () => {
    const [activeTab, setActiveTab] = useState<'media' | 'links' | 'docs'>('media');
    const [searchQuery, setSearchQuery] = useState('');

    const [mediaItems] = useState<MediaItem[]>([
        { id: '1', type: 'image', uri: 'https://picsum.photos/200/200', timestamp: new Date() },
        { id: '2', type: 'image', uri: 'https://picsum.photos/201/200', timestamp: new Date() },
        { id: '3', type: 'video', thumbnail: 'https://picsum.photos/202/200', timestamp: new Date() },
        { id: '4', type: 'image', uri: 'https://picsum.photos/203/200', timestamp: new Date() },
        { id: '5', type: 'image', uri: 'https://picsum.photos/204/200', timestamp: new Date() },
        { id: '6', type: 'video', thumbnail: 'https://picsum.photos/205/200', timestamp: new Date() },
    ]);

    const [documents] = useState<MediaItem[]>([
        { id: '1', type: 'document', title: 'Project_Proposal.pdf', timestamp: new Date() },
        { id: '2', type: 'document', title: 'Invoice_2024.xlsx', timestamp: new Date() },
        { id: '3', type: 'document', title: 'Meeting_Notes.docx', timestamp: new Date() },
    ]);

    const [links] = useState<MediaItem[]>([
        { id: '1', type: 'link', title: 'GitHub Repository', url: 'https://github.com/example', timestamp: new Date() },
        { id: '2', type: 'link', title: 'Documentation', url: 'https://docs.example.com', timestamp: new Date() },
        { id: '3', type: 'link', title: 'YouTube Video', url: 'https://youtube.com/watch', timestamp: new Date() },
    ]);

    const renderMediaItem = ({ item }: { item: MediaItem }) => (
        <TouchableOpacity style={styles.mediaItem}>
            <Image
                source={{ uri: item.uri || item.thumbnail }}
                style={styles.mediaThumbnail}
            />
            {item.type === 'video' && (
                <View style={styles.playButton}>
                    <IconButton icon="play" iconColor="#fff" size={24} />
                </View>
            )}
        </TouchableOpacity>
    );

    const renderDocumentItem = ({ item }: { item: MediaItem }) => {
        const getDocIcon = () => {
            if (item.title?.endsWith('.pdf')) return '📄';
            if (item.title?.endsWith('.xlsx') || item.title?.endsWith('.xls')) return '📊';
            if (item.title?.endsWith('.docx') || item.title?.endsWith('.doc')) return '📝';
            return '📎';
        };

        return (
            <TouchableOpacity style={styles.documentItem}>
                <View style={styles.docIcon}>
                    <Text style={styles.docIconText}>{getDocIcon()}</Text>
                </View>
                <View style={styles.docInfo}>
                    <Text style={styles.docTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.docDate}>
                        {item.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                </View>
                <IconButton icon="download" iconColor="#25D366" size={20} />
            </TouchableOpacity>
        );
    };

    const renderLinkItem = ({ item }: { item: MediaItem }) => (
        <TouchableOpacity style={styles.linkItem}>
            <View style={styles.linkIcon}>
                <IconButton icon="link" iconColor="#25D366" size={20} />
            </View>
            <View style={styles.linkInfo}>
                <Text style={styles.linkTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.linkUrl} numberOfLines={1}>
                    {item.url}
                </Text>
                <Text style={styles.linkDate}>
                    {item.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
            </View>
            <IconButton icon="open-in-new" iconColor="#25D366" size={20} />
        </TouchableOpacity>
    );

    const getActiveData = () => {
        switch (activeTab) {
            case 'media':
                return mediaItems;
            case 'docs':
                return documents;
            case 'links':
                return links;
            default:
                return [];
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

            <View style={styles.tabsContainer}>
                <Chip
                    selected={activeTab === 'media'}
                    onPress={() => setActiveTab('media')}
                    style={[styles.tab, activeTab === 'media' && styles.tabActive]}
                    textStyle={[styles.tabText, activeTab === 'media' && styles.tabTextActive]}
                >
                    Media ({mediaItems.length})
                </Chip>
                <Chip
                    selected={activeTab === 'docs'}
                    onPress={() => setActiveTab('docs')}
                    style={[styles.tab, activeTab === 'docs' && styles.tabActive]}
                    textStyle={[styles.tabText, activeTab === 'docs' && styles.tabTextActive]}
                >
                    Docs ({documents.length})
                </Chip>
                <Chip
                    selected={activeTab === 'links'}
                    onPress={() => setActiveTab('links')}
                    style={[styles.tab, activeTab === 'links' && styles.tabActive]}
                    textStyle={[styles.tabText, activeTab === 'links' && styles.tabTextActive]}
                >
                    Links ({links.length})
                </Chip>
            </View>

            {activeTab === 'media' ? (
                <FlatList
                    data={getActiveData()}
                    renderItem={renderMediaItem}
                    keyExtractor={item => item.id}
                    numColumns={3}
                    contentContainerStyle={styles.mediaGrid}
                />
            ) : activeTab === 'docs' ? (
                <FlatList
                    data={getActiveData()}
                    renderItem={renderDocumentItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <FlatList
                    data={getActiveData()}
                    renderItem={renderLinkItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    searchBar: {
        elevation: 0,
        backgroundColor: '#F7F8FA',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    tab: {
        marginRight: 8,
        backgroundColor: '#F7F8FA',
    },
    tabActive: {
        backgroundColor: '#25D366',
    },
    tabText: {
        color: '#667781',
        fontSize: 13,
    },
    tabTextActive: {
        color: '#fff',
    },
    mediaGrid: {
        padding: 2,
    },
    mediaItem: {
        flex: 1,
        margin: 2,
        aspectRatio: 1,
        position: 'relative',
    },
    mediaThumbnail: {
        width: '100%',
        height: '100%',
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -24 }, { translateY: -24 }],
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 24,
    },
    listContainer: {
        paddingVertical: 8,
    },
    documentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    docIcon: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#F7F8FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    docIconText: {
        fontSize: 24,
    },
    docInfo: {
        flex: 1,
    },
    docTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    docDate: {
        fontSize: 12,
        color: '#667781',
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    linkIcon: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#E7F5EC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    linkInfo: {
        flex: 1,
    },
    linkTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    linkUrl: {
        fontSize: 13,
        color: '#25D366',
        marginBottom: 4,
    },
    linkDate: {
        fontSize: 12,
        color: '#667781',
    },
});
