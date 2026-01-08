import { ZoomProviderWrapper } from '@/components/ZoomProviderWrapper';
import { CreateMeetingScreen } from '@/screens/main/ CreateMeetingScreen';
import { HomeScreen } from '@/screens/main/HomeScreen';
import { JoinMeetingScreen } from '@/screens/main/JoinMeeting';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="CreateMeeting" component={CreateMeetingScreen} />
    <Stack.Screen name="JoinMeeting">
      {() => (
        <ZoomProviderWrapper>
          <JoinMeetingScreen />
        </ZoomProviderWrapper>
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
