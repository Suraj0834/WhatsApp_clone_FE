import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { authApi, RegisterData, LoginData } from '../../api/endpoints/auth';
import { AuthState, User, AuthTokens } from '../../types/models';

const initialState: AuthState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

export const register = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await authApi.register(data);
            await SecureStore.setItemAsync('accessToken', response.accessToken);
            await SecureStore.setItemAsync('refreshToken', response.refreshToken);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Registration failed');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (data: LoginData, { rejectWithValue }) => {
        try {
            const response = await authApi.login(data);
            await SecureStore.setItemAsync('accessToken', response.accessToken);
            await SecureStore.setItemAsync('refreshToken', response.refreshToken);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        await authApi.logout();
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
    }
});

export const loadStoredAuth = createAsyncThunk('auth/loadStored', async () => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    const userJson = await SecureStore.getItemAsync('user');

    if (accessToken && refreshToken && userJson) {
        return {
            tokens: { accessToken, refreshToken },
            user: JSON.parse(userJson),
        };
    }

    return null;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            SecureStore.setItemAsync('user', JSON.stringify(action.payload));
        },
        clearError: state => {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(register.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.tokens = {
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                };
                SecureStore.setItemAsync('user', JSON.stringify(action.payload.user));
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(login.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.tokens = {
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                };
                SecureStore.setItemAsync('user', JSON.stringify(action.payload.user));
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(logout.fulfilled, state => {
                state.user = null;
                state.tokens = null;
                state.isAuthenticated = false;
                SecureStore.deleteItemAsync('user');
            })
            .addCase(loadStoredAuth.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload.user;
                    state.tokens = action.payload.tokens;
                    state.isAuthenticated = true;
                }
            });
    },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
