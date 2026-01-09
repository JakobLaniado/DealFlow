import { useAuth } from '@/contexts/AuthContext';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator();

const linking: LinkingOptions<any> = {
  prefixes: ['DealFlow://'],
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

  React.useEffect(() => {
    Linking.getInitialURL().then(url => {
      console.log('INITIAL URL:', url);
    });

    const sub = Linking.addEventListener('url', ({ url }) => {
      console.log('RUNTIME URL:', url);
    });

    return () => sub.remove();
  }, []);

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
