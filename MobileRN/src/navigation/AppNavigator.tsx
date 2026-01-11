import { useAuth } from '@/contexts/AuthContext';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator();

const linking: LinkingOptions<any> = {
  prefixes: ['dealflow://'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: {
            screens: {
              JoinMeeting: {
                path: 'join',
                parse: {
                  meetingId: (meetingId: string) => meetingId,
                  password: (password: string) => password,
                },
              },
            },
          },
        },
      },
    },
  },
};

export const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
