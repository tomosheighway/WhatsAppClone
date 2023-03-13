import React, { Component } from 'react';
import { StyleSheet, View, Text,TextInput,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component {
    static navigationOptions = {
        header: null
      };
    // home page for main app navigation 
    // tab nav to seperate pages 
    // need add logout button on one the pages as currecntly to logout you have to deleate values from async. 
    
      componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        })
      }
      componentWillUnmount(){
        this.unsubscribe();
      }
      checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('session_token');
        if (value == null) {
            this.props.navigation.navigate('Login')
        }
      }

    //test render just to return output
    render() {
        return (
          <View>
            <TextInput placeholder='Test' />
            
          </View>
        );
    }



}

export default Home