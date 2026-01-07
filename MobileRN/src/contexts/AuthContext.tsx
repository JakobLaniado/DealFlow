import { supabase } from '@/config/supabase';
import { authService, ServiceResponse } from '@/services/auth.service';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';
import { User } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<ServiceResponse<void>>;
  register: (
    credentials: RegisterCredentials,
  ) => Promise<ServiceResponse<void>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // First, try to get the current session from Supabase
      // Supabase automatically persists sessions, so this should work
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (session && !sessionError) {
        // We have a valid Supabase session, get user data
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
          // Update stored tokens to keep them in sync
          await AsyncStorage.multiSet([
            [STORAGE_KEYS.USER, JSON.stringify(response.data)],
            [STORAGE_KEYS.TOKEN, session.access_token],
            [STORAGE_KEYS.REFRESH_TOKEN, session.refresh_token],
          ]);
        } else {
          await clearStorage();
        }
      } else {
        // No active session, try to restore from stored refresh token
        const storedRefreshToken = await AsyncStorage.getItem(
          STORAGE_KEYS.REFRESH_TOKEN,
        );
        const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);

        if (storedRefreshToken && storedUser) {
          // Try to refresh the session using the stored refresh token
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession({
              refresh_token: storedRefreshToken,
            });

          if (refreshData.session && !refreshError) {
            // Session refreshed successfully
            const response = await authService.getCurrentUser();
            if (response.success && response.data) {
              setUser(response.data);
              // Update stored tokens
              await AsyncStorage.multiSet([
                [STORAGE_KEYS.USER, JSON.stringify(response.data)],
                [STORAGE_KEYS.TOKEN, refreshData.session.access_token],
                [STORAGE_KEYS.REFRESH_TOKEN, refreshData.session.refresh_token],
              ]);
            } else {
              await clearStorage();
            }
          } else {
            // Refresh failed, clear storage
            await clearStorage();
          }
        }
      }
    } catch (error: any) {
      console.error('Error initializing auth:', error);
      await clearStorage();
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
    setUser(null);
  };

  const login = async (
    credentials: LoginCredentials,
  ): Promise<ServiceResponse<void>> => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.USER, JSON.stringify(response.data.user)],
          [STORAGE_KEYS.TOKEN, response.data.token],
          [STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken],
        ]);
        setUser(response.data.user);
      }

      return {
        success: response.success,
        error: response.error ? response.error : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  };

  const register = async (
    credentials: RegisterCredentials,
  ): Promise<ServiceResponse<void>> => {
    try {
      const response = await authService.register(credentials);

      if (response.success && response.data) {
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.USER, JSON.stringify(response.data.user)],
          [STORAGE_KEYS.TOKEN, response.data.token],
          [STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken],
        ]);
        setUser(response.data.user);
      }
      return {
        success: response.success,
        error: response.error ? response.error : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    await clearStorage();
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
