import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProfileNav from './profileNav';
import ChatsNav from './chatsNav';
import ContactsNav from './contactsNav';

const Tab = createBottomTabNavigator();

class MainAppNav extends Component {
  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('sessionToken');
    if (value == null) {
      navigation.navigate('Login');
    }
  };

  render() {
    return (
      <Tab.Navigator initialRouteName="Chats">
        {/* <Tab.Screen name="Home" component={Home} /> */}
        <Tab.Screen name="Chats" component={ChatsNav} />
        <Tab.Screen name="Contacts" component={ContactsNav} />
        <Tab.Screen name="Profile" component={ProfileNav} />
      </Tab.Navigator>
    );
  }
}

export default MainAppNav;
