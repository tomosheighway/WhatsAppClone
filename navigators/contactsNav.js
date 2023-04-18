import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Contacts from '../components/contacts';

const Stack = createNativeStackNavigator();

export default function ContactsNav() {
  return (
    <Stack.Navigator initialRouteName="Contacts">
      <Stack.Screen name="Contacts" component={Contacts} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
