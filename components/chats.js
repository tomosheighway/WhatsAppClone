import React, { Component } from 'react';
import {
  View, TextInput,
} from 'react-native';

class Chats extends Component {
  static navigationOptions = {
    header: null,
  };

  // test render just to return output
  render() {
    return (
      <View>
        <TextInput placeholder="Test" />

      </View>
    );
  }
}

export default Chats;
