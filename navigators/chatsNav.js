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
      <Stack.Screen name="Chats" component={Chats} options={{ headerShown: false }} />
      <Stack.Screen
        name="ViewChat"
        component={ViewChat}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen
        name="AddToChat"
        component={AddToChat}
        options={{ title: 'Add a contact to the chat' }}
      />
      <Stack.Screen name="RemoveFromChat" component={RemoveFromChat} options={{ title: 'Remove a user from the chat' }} />
    </Stack.Navigator>
  );
}
