import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    TextInput,
} from 'react-native';
import { IconButton, Chip, FAB } from 'react-native-paper';

interface Label {
    id: string;
    name: string;
    color: string;
    chatCount: number;
}

export const ChatLabelsScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>('all');

    const [labels, setLabels] = useState<Label[]>([
        {
            id: '1',
            name: 'Work',
            color: '#2196F3',
            chatCount: 12,
        },
        {
            id: '2',
            name: 'Personal',
            color: '#FF9800',
            chatCount: 8,
        },
        {
            id: '3',
            name: 'Important',
            color: '#F44336',
            chatCount: 5,
        },
        {
            id: '4',
            name: 'Family',
            color: '#9C27B0',
            chatCount: 4,
        },
        {
            id: '5',
            name: 'Projects',
            color: '#4CAF50',
            chatCount: 7,
        },
        {
            id: '6',
            name: 'Shopping',
            color: '#FF5722',
            chatCount: 3,
        },
    ]);

    const colorOptions = [
        '#2196F3', // Blue
        '#FF9800', // Orange
        '#F44336', // Red
        '#9C27B0', // Purple
        '#4CAF50', // Green
        '#FF5722', // Deep Orange
        '#00BCD4', // Cyan
        '#FFC107', // Amber
        '#E91E63', // Pink
        '#009688', // Teal
    ];

    const handleCreateLabel = () => {
        Alert.prompt(
            'Create Label',
            'Enter label name',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Create',
                    onPress: (text?: string) => {
                        if (text && text.trim()) {
                            const newLabel: Label = {
                                id: Date.now().toString(),
                                name: text.trim(),
                                color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
                                chatCount: 0,
                            };
                            setLabels([...labels, newLabel]);
                            Alert.alert('Success', `Label "${text}" created`);
                        }
                    },
                },
            ]
        );
    };

    const handleEditLabel = (label: Label) => {
        Alert.prompt(
            'Edit Label',
            'Enter new label name',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Save',
                    onPress: (text?: string) => {
                        if (text && text.trim()) {
                            setLabels(
                                labels.map((l) =>
                                    l.id === label.id ? { ...l, name: text.trim() } : l
                                )
                            );
                            Alert.alert('Success', 'Label updated');
                        }
                    },
                },
            ],
            'plain-text',
            label.name
        );
    };

    const handleChangeColor = (label: Label) => {
        Alert.alert(
            'Change Color',
            'Choose a color for this label',
            [
                ...colorOptions.map((color) => ({
                    text: `● ${color}`,
                    onPress: () => {
                        setLabels(
                            labels.map((l) =>
                                l.id === label.id ? { ...l, color } : l
                            )
                        );
                    },
                })),
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleDeleteLabel = (label: Label) => {
        Alert.alert(
            'Delete Label',
            `Delete "${label.name}"? This will remove the label from ${label.chatCount} chat${
                label.chatCount !== 1 ? 's' : ''
            }.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setLabels(labels.filter((l) => l.id !== label.id));
                        Alert.alert('Success', 'Label deleted');
                    },
                },
            ]
        );
    };

    const handleViewChats = (label: Label) => {
        Alert.alert(
            label.name,
            `View all chats with label "${label.name}"`,
            [{ text: 'OK' }]
        );
    };

    const filteredLabels =
        selectedFilter === 'all'
            ? labels
            : labels.filter((l) => l.chatCount > 0);

    const renderLabel = ({ item }: { item: Label }) => {
        return (
            <TouchableOpacity
                style={styles.labelCard}
                onPress={() => handleViewChats(item)}
                onLongPress={() => {
                    Alert.alert(
                        item.name,
                        'Choose an action',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Edit Name', onPress: () => handleEditLabel(item) },
                            { text: 'Change Color', onPress: () => handleChangeColor(item) },
                            {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => handleDeleteLabel(item),
                            },
                        ]
                    );
                }}
            >
                <View style={styles.labelHeader}>
                    <View
                        style={[styles.colorIndicator, { backgroundColor: item.color }]}
                    />
                    <View style={styles.labelInfo}>
                        <Text style={styles.labelName}>{item.name}</Text>
                        <Text style={styles.chatCount}>
                            {item.chatCount} chat{item.chatCount !== 1 ? 's' : ''}
                        </Text>
                    </View>
                    <IconButton
                        icon="chevron-right"
                        size={24}
                        iconColor="#667781"
                    />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chat Labels</Text>
                <Text style={styles.headerSubtitle}>
                    Organize chats with custom labels
                </Text>
            </View>

            <View style={styles.filters}>
                <Chip
                    selected={selectedFilter === 'all'}
                    onPress={() => setSelectedFilter('all')}
                    style={styles.chip}
                >
                    All Labels ({labels.length})
                </Chip>
                <Chip
                    selected={selectedFilter === 'used'}
                    onPress={() => setSelectedFilter('used')}
                    style={styles.chip}
                >
                    In Use ({labels.filter((l) => l.chatCount > 0).length})
                </Chip>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    ℹ️ Create custom labels to organize your chats. Tap and hold to edit
                    or delete a label.
                </Text>
            </View>

            <FlatList
                data={filteredLabels}
                renderItem={renderLabel}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>🏷️</Text>
                        <Text style={styles.emptyStateText}>No labels found</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Create labels to organize your chats
                        </Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={handleCreateLabel}
                color="#fff"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        backgroundColor: '#F7F8FA',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#667781',
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    chip: {
        marginRight: 8,
    },
    infoBox: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#E7F5EC',
        borderRadius: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#667781',
        lineHeight: 18,
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    labelCard: {
        marginBottom: 12,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
    },
    labelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    colorIndicator: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    labelInfo: {
        flex: 1,
    },
    labelName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    chatCount: {
        fontSize: 14,
        color: '#667781',
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#667781',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#25D366',
    },
});
