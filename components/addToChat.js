import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddToChat extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {

      chatId: null,
      errorMessage: '',
    };
  }

  componentDidMount() {
    const {
      route: { params: { data } },
    } = this.props;
    this.setState({
      chatId: data,

    });
  }

  render() {
    const {
      chatId,
      errorMessage,
    } = this.state;
    return (
      <View>
        {errorMessage ? <Text>{errorMessage}</Text> : null}

        <Text>
          {' '}
          Chat ID
          {' '}
          { chatId }
          {' '}
        </Text>

      </View>
    );
  }
}

export default AddToChat;
