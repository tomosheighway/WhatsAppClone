import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../components/profile';
import UpdateProfile from '../components/updateProfile';
import CameraScreen from '../components/camera-senttoserver';

const Stack = createNativeStackNavigator();

export default function ProfileNav() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateProfile" options={{ title: 'Update Your Details' }} component={UpdateProfile} />
      <Stack.Screen name="CameraScreen" options={{ title: 'Camera' }} component={CameraScreen} />
    </Stack.Navigator>
  );
}
