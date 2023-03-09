import React, { Component } from 'react';

import { StyleSheet, View, Text,TextInput,TouchableOpacity } from 'react-native';

class Home extends Component {
    static navigationOptions = {
        header: null
      };
    // home page for main app navigation 
    // tab nav to seperate pages 


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