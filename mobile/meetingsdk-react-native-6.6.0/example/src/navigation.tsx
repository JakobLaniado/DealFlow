import React from 'react';
import { JoinScreen } from './screens/join-screen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainNavigation() {
  return (
    <Stack.Navigator initialRouteName="Join">
      <Stack.Screen name="Join" component={JoinScreen} options={{title: ''}} />
    </Stack.Navigator>
  );
}

export function Navigation() {
  return (
    <Drawer.Navigator initialRouteName="Main">
      <Drawer.Screen
          name="Main"
          component={MainNavigation}
          options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}
