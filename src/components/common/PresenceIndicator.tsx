import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface PresenceIndicatorProps {
    online: boolean;
    size?: number;
    showOffline?: boolean;
}

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
    online,
    size = 12,
    showOffline = false,
}) => {
    const { colors } = useTheme();

    if (!online && !showOffline) {
        return null;
    }

    return (
        <View
            style={[
                styles.indicator,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: online ? colors.online : colors.offline,
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    indicator: {
        borderWidth: 2,
        borderColor: 'white',
    },
});
