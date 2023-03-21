import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './components/login';
import Signup from './components/signup';
import MainAppNav from '/mainAppNav'
//import Home from './components/home';
//import Contacts from './components/contacts';
//import Profile from './components/profile';
//import Chats from './components/chats';

const Stack = createNativeStackNavigator();
//const Tab = createBottomTabNavigator();

// function HomeTabs() {
//   return (
//     <Tab.Navigator initialRouteName='Home'>
//       {/* do i need a home as abit redundant?  */}
//       <Tab.Screen name="Home" component={Home} />  
//       <Tab.Screen name="Chats" component={Chats} />
//       <Tab.Screen name="Contacts" component={Contacts} />
//       <Tab.Screen name="Profile" component={Profile} />
//     </Tab.Navigator>
//   );
// }

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} />
		    <Stack.Screen name="Signup" component={Signup} />
        {/* <Stack.Screen name="Home" component={HomeTabs}  options={{headerShown: false}}/>         */}
        <Stack.Screen name="MainAppNav" component={MainAppNav} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}