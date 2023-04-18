import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import MainAppNav from './mainAppNav';
// import Login from './components/login';
// import Signup from './components/signup';
import Profile from './components/profile';

const Stack = createNativeStackNavigator();

export default function ProfileNav() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
