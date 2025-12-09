import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '../../theme/ThemeContext';

interface LastSeenProps {
    lastSeen: Date | string;
    online: boolean;
}

export const LastSeen: React.FC<LastSeenProps> = ({ lastSeen, online }) => {
    const { colors } = useTheme();

    if (online) {
        return <Text style={[styles.text, { color: colors.online }]}>online</Text>;
    }

    const lastSeenDate = typeof lastSeen === 'string' ? new Date(lastSeen) : lastSeen;
    const lastSeenText = formatDistanceToNow(lastSeenDate, { addSuffix: true });

    return (
        <Text style={[styles.text, { color: colors.textSecondary }]}>
            last seen {lastSeenText}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 13,
    },
});
