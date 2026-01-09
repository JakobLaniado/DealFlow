import { ZoomProviderWrapper } from '@/components/ZoomProviderWrapper';
import useAuth from '@/contexts/AuthContext';
import { CreateMeetingScreen } from '@/screens/main/CreateMeetingScreen';
import { HomeScreen } from '@/screens/main/HomeScreen';
import { JoinMeetingScreen } from '@/screens/main/JoinMeeting';
import { MyMeetingsScreen } from '@/screens/main/MyMeetingsScreen';
import { ProfileScreen } from '@/screens/main/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const { user } = useAuth();
  const isSeller = user?.role === 'seller';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      {isSeller && (
        <Stack.Screen name="CreateMeeting" component={CreateMeetingScreen} />
      )}
      <Stack.Screen name="MyMeetings" component={MyMeetingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="JoinMeeting" component={JoinMeetingScreen} />
    </Stack.Navigator>
  );
};

const MeetingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CreateMeetingMain" component={CreateMeetingScreen} />
    <Stack.Screen name="JoinMeeting" component={JoinMeetingScreen} />
  </Stack.Navigator>
);

export const MainNavigator = () => {
  const { user } = useAuth();
  const isSeller = user?.role === 'seller';

  return (
    <ZoomProviderWrapper>
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
        {isSeller && (
          <Tab.Screen
            name="Meetings"
            component={MeetingsStack}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? 'videocam' : 'videocam-outline'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        )}
        <Tab.Screen
          name="profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </ZoomProviderWrapper>
  );
};
