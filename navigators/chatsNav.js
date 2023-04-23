import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chats from '../components/chats';
import ViewChat from '../components/viewChat';
import AddToChat from '../components/addToChat';
import RemoveFromChat from '../components/removeFromChat';

const Stack = createNativeStackNavigator();

export default function ChatsNav() {
  return (
    <Stack.Navigator initialRouteName="Chats">
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="ViewChat" component={ViewChat} />
      <Stack.Screen name="AddToChat" component={AddToChat} />
      <Stack.Screen name="RemoveFromChat" component={RemoveFromChat} />
    </Stack.Navigator>
  );
}
