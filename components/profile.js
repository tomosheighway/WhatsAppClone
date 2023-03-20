import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Profile extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {      
      user_id: ''
    };
  }

  async componentDidMount() {
    const user_id = await AsyncStorage.getItem('user_id');
    this.setState({  user_id });
  }


  render() {
    return (
      <View>
        <Text>User ID: {this.state.user_id}</Text>
        <TextInput placeholder='Test' />       
      </View>
    );
  }
}



export default Profile;