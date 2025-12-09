import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightColors = {
    primary: '#075E54',
    primaryDark: '#054d44',
    secondary: '#25D366',
    accent: '#34B7F1',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceVariant: '#E5E5EA',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#E0E0E0',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
    
    // Message colors
    messageSent: '#DCF8C6',
    messageReceived: '#FFFFFF',
    messageTimestamp: '#999999',
    
    // Status colors
    online: '#4CAF50',
    offline: '#9E9E9E',
    typing: '#25D366',
    
    // Call colors
    callAccept: '#4CAF50',
    callDecline: '#F44336',
    callEnd: '#F44336',
};

export const darkColors = {
    primary: '#00A884',
    primaryDark: '#008F72',
    secondary: '#25D366',
    accent: '#34B7F1',
    background: '#0B141A',
    surface: '#1C2A33',
    surfaceVariant: '#2A3942',
    text: '#E9EDEF',
    textSecondary: '#8696A0',
    textTertiary: '#667781',
    border: '#2A3942',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
    
    // Message colors
    messageSent: '#005C4B',
    messageReceived: '#1C2A33',
    messageTimestamp: '#8696A0',
    
    // Status colors
    online: '#4CAF50',
    offline: '#667781',
    typing: '#25D366',
    
    // Call colors
    callAccept: '#4CAF50',
    callDecline: '#F44336',
    callEnd: '#F44336',
};

export type ColorScheme = 'light' | 'dark' | 'auto';
export type ThemeColors = typeof lightColors;

interface ThemeContextType {
    theme: ColorScheme;
    setTheme: (theme: ColorScheme) => void;
    colors: ThemeColors;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@whatsapp_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<ColorScheme>('auto');
    
    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme) {
                setThemeState(savedTheme as ColorScheme);
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    };

    const setTheme = async (newTheme: ColorScheme) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const isDark = theme === 'auto' 
        ? systemColorScheme === 'dark' 
        : theme === 'dark';

    const colors = isDark ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colors, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
