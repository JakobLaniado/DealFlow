import { useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/config/supabase';
import { authService } from '@/services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
};

export default function AuthCallback() {
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase automatically processes tokens from URL hash when detectSessionInUrl is enabled
        // Wait a moment for Supabase to process the URL
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session && !sessionError) {
          // Session was created successfully, get user data
          const response = await authService.getCurrentUser();
          
          if (response.success && response.data) {
            // Store user data and token
            await AsyncStorage.multiSet([
              [STORAGE_KEYS.USER, JSON.stringify(response.data)],
              [STORAGE_KEYS.TOKEN, session.access_token],
              [STORAGE_KEYS.REFRESH_TOKEN, session.refresh_token],
            ]);
            router.replace('./(tabs)/home');
          } else {
            console.error('Failed to get user data:', response.error);
            router.replace('./(auth)/login');
          }
        } else {
          console.error('No session found or session error:', sessionError);
          router.replace('./(auth)/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('./(auth)/login');
      }
    };

    handleAuthCallback();
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Confirming your email...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

