import { supabase } from '@/config/supabase';
import { authService, ServiceResponse } from '@/services/auth.service';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';
import { User } from '@/types/user';
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    // Safety timeout - always set loading to false after 10 seconds
    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - forcing loading to false');
        setLoading(false);
      }
    }, 10000);

    const init = async () => {
      try {
        // Initialize auth state
        await initializeAuth();

        // Listen to auth state changes
        if (supabase?.auth && mounted) {
          const {
            data: { subscription: authSubscription },
          } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              if (session) {
                await loadUser();
              }
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
            }
          });
          subscription = authSubscription;
        }
      } catch (error) {
        console.error('Error setting up auth:', error);
        if (mounted) {
          setLoading(false);
        }
      } finally {
        clearTimeout(safetyTimeout);
      }
    };

    init();

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const initializeAuth = async () => {
    try {
      if (!supabase || !supabase.auth) {
        console.error('Supabase client is not initialized');
        setUser(null);
        return;
      }

      // Get current session (Supabase handles persistence automatically)
      // Add timeout to prevent hanging
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Session check timeout')), 5000),
      );

      const {
        data: { session },
        error: sessionError,
      } = (await Promise.race([sessionPromise, timeoutPromise])) as any;

      if (session && !sessionError) {
        await loadUser();
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error('Error initializing auth:', error);
      setUser(null);
    } finally {
      // Always set loading to false, even if there's an error
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error('Error loading user:', error);
      setUser(null);
    }
  };

  const login = async (
    credentials: LoginCredentials,
  ): Promise<ServiceResponse<void>> => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        // User will be loaded automatically via onAuthStateChange
        await loadUser();
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
        // User will be loaded automatically via onAuthStateChange
        await loadUser();
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
    setUser(null);
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
