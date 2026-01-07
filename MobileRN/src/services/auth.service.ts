import { getRedirectUrl, supabase } from '@/config/supabase';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';
import { AuthResponse, User, UserRole } from '@/types/user';

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<ServiceResponse<AuthResponse>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          error: 'Login failed',
        };
      }

      //get user role from database
      const { data: userData } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', data.user.id)
        .single();

      if (!userData) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: {
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role as UserRole,
          },
          token: data.session.access_token,
          refreshToken: data.session.refresh_token,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An unknown error occurred',
      };
    }
  },

  async register(
    credentials: RegisterCredentials
  ): Promise<ServiceResponse<AuthResponse>> {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        return {
          success: false,
          error: 'password and confirm password do not match',
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: getRedirectUrl(),
          data: {
            name: credentials.name, // Store name in metadata for the trigger
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          error: 'Registration failed, Please try again',
        };
      }

      // Wait a moment for the database trigger to create the user profile
      // The trigger automatically creates the user profile with 'client' role
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Fetch the user profile created by the trigger
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', data.user.id)
        .single();

      if (userError || !userData) {
        return {
          success: false,
          error: userError?.message || 'Failed to create user profile',
        };
      }

      return {
        success: true,
        data: {
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role as UserRole,
          },
          token: data.session.access_token,
          refreshToken: data.session.refresh_token,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  },

  async logout(): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  },

  async getCurrentUser(): Promise<ServiceResponse<User>> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        return {
          success: false,
          error: userError?.message || 'Failed to fetch user profile',
        };
      }

      return {
        success: true,
        data: userData,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  },

  async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<ServiceResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: true,
        data: data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  },
};
