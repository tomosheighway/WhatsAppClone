import React, { Component } from 'react';
import {
  View, TextInput, Text,
} from 'react-native';

import styles from '../styles/chatStyles';

class Chats extends Component {
  static navigationOptions = {
    header: null,
  };

  // test render just to return output
  render() {
    return (
      <View>
        <Text style={styles.title}>Chats</Text>
        <TextInput placeholder="Test" />

      </View>
    );
  }
}

export default Chats;
