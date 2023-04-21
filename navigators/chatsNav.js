import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chats from '../components/chats';

const Stack = createNativeStackNavigator();

export default function ChatsNav() {
  return (
    <Stack.Navigator initialRouteName="Chats">
      <Stack.Screen name="Chats" component={Chats} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}