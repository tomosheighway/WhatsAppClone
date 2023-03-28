import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainAppNav from './mainAppNav';
import Login from './components/login';
import Signup from './components/signup';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MainAppNav" component={MainAppNav} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
