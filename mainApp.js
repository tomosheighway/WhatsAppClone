// main app navigation (Tab)

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import Login from './components/login';
// import Signup from './components/signup';
 import Home from './components/home'
 // chat page 
 // contacts 
 // profile 
 



const Tab = createBottomTabNavigator();

export default function App() {
    return (
      <NavigationContainer>
        <Tab.Navigator initialRouteName='Home'>
          <Tab.Screen name="Home" component={Home} />
              {/* <Tab.Screen name="About" component={About} />
              <Tab.Screen name="Contact" component={Contact} /> */}
        </Tab.Navigator>
      </NavigationContainer>
    );
  }