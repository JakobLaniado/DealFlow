import { authService, ServiceResponse } from '@/services/auth.service';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';
import { User } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<ServiceResponse<void>>;
  register: (
    credentials: RegisterCredentials
  ) => Promise<ServiceResponse<void>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);

        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          await clearStorage();
          router.replace('./(auth)/login');
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
    await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN]);
    setUser(null);
  };

  const login = async (
    credentials: LoginCredentials
  ): Promise<ServiceResponse<void>> => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.USER, JSON.stringify(response.data.user)],
          [STORAGE_KEYS.TOKEN, response.data.token],
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
    credentials: RegisterCredentials
  ): Promise<ServiceResponse<void>> => {
    try {
      const response = await authService.register(credentials);

      if (response.success && response.data) {
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.USER, JSON.stringify(response.data.user)],
          [STORAGE_KEYS.TOKEN, response.data.token],
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
