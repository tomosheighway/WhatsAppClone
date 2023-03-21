import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './components/home';
import Contacts from './components/contacts';
import Profile from './components/profile';
import Chats from './components/chats';

const Tab = createBottomTabNavigator();

function MainAppNav() {
    return (
      <Tab.Navigator initialRouteName='Home'>
        {/* do i need a home as abit redundant?  */}
        <Tab.Screen name="Home" component={Home} />  
        <Tab.Screen name="Chats" component={Chats} />
        <Tab.Screen name="Contacts" component={Contacts} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
  }

export default MainAppNav