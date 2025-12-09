import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadStoredAuth } from '../store/slices/authSlice';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { SplashScreen } from '../screens/SplashScreen';

import { socketService } from '../services/socketService';
import { offlineService } from '../services/offlineService';
import { SOCKET_URL } from '../utils/constants';

import NetInfo from '@react-native-community/netinfo';
import { syncPendingMessages } from '../store/slices/chatSlice';

export const AppNavigator = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, tokens } = useSelector((state: RootState) => state.auth);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showSplash, setShowSplash] = React.useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                await offlineService.init();
                await dispatch(loadStoredAuth());

                // Keep splash screen for at least 2 seconds
                setTimeout(() => {
                    setShowSplash(false);
                    setIsLoading(false);
                }, 2000);
            } catch (error) {
                console.error('Initialization error:', error);
                // Clear potentially corrupted data
                try {
                    const { clearAppData } = await import('../utils/clearAppData');
                    await clearAppData();
                    console.log('Cleared corrupted app data');
                } catch (clearError) {
                    console.error('Error clearing data:', clearError);
                }

                // Still proceed to show the app
                setTimeout(() => {
                    setShowSplash(false);
                    setIsLoading(false);
                }, 2000);
            }
        };
        init();

        const unsubscribe = NetInfo.addEventListener(state => {
            // isConnected can be null or boolean, ensure it's explicitly true
            if (state.isConnected === true) {
                dispatch(syncPendingMessages());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated && tokens?.accessToken) {
            socketService.connect(SOCKET_URL, tokens.accessToken);
        } else {
            socketService.disconnect();
        }
    }, [isAuthenticated, tokens]);

    // Listen for incoming calls globally
    const navigationRef = React.useRef<any>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const handleIncomingCall = (data: {
            callId: string;
            callerId: string;
            callerName: string;
            callerAvatar?: string;
            callType: 'audio' | 'video';
            offer: any;
            conversationId: string;
        }) => {
            console.log('Incoming call:', data);

            // Navigate to incoming call screen
            if (navigationRef.current) {
                navigationRef.current.navigate('IncomingCall', {
                    callId: data.callId,
                    callerId: data.callerId,
                    callerName: data.callerName || 'Unknown',
                    callerAvatar: data.callerAvatar,
                    callType: data.callType,
                    offer: data.offer,
                });
            }
        };

        socketService.on('call:incoming', handleIncomingCall);

        return () => {
            socketService.off('call:incoming');
        };
    }, [isAuthenticated]);

    // Show splash screen
    if (showSplash || isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer ref={navigationRef}>
            {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};
