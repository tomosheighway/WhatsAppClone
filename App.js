import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './components/login';
import Signup from './components/signup';
import MainAppNav from '/mainAppNav'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} />
		    <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MainAppNav" component={MainAppNav} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}