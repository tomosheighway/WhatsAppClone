import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './components/home';
import Contacts from './components/contacts';
import Profile from './components/profile';
import Chats from './components/chats';

const Tab = createBottomTabNavigator();

class MainAppNav extends Component { 

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            console.log("testing")    // not getting triggered at this point 
        })
      }
      componentWillUnmount(){
        this.unsubscribe();
      }
      checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('session_token');
        if (value == null) {
            console.log("Detected user missing login details")
            this.props.navigation.navigate('Login')
        }
      }

    render() {
        return (
            <Tab.Navigator initialRouteName='Home'>
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Chats" component={Chats} />
                <Tab.Screen name="Contacts" component={Contacts} />
                <Tab.Screen name="Profile" component={Profile} />
            </Tab.Navigator>
        );
    }
}

export default MainAppNav;
