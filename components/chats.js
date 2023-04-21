import React, { Component } from 'react';
import {
  View, TextInput, Text, FlatList, TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/chatStyles';

class Chats extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  async componentDidMount() {
    const chats = await this.getChats();
    if (chats) {
      this.setState({ chats });
    }
  }

  async getChats() {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    // const userId = await AsyncStorage.getItem('userId');

    return fetch('http://localhost:3333/api/1.0.0/chat', {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          return data;
        }
        if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized error');
          navigation.navigate('Login');
          return null;
        }
        if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          this.setState({ errorMessage: 'Something went wrong' });
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  // test render just to return output
  render() {
    const { chats, errorMessage } = this.state;
    const { navigation } = this.props;
    return (
      <View>
        <Text>Chats:</Text>
        {errorMessage ? <Text>{errorMessage}</Text> : null}
        <FlatList
          data={chats}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('ViewChat', { data: item.chat_id })}>
              <Text>
                ID:
                {' '}
                {item.chat_id}
                {'   '}
                Name:
                {' '}
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.chat_id.toString()}
        />
      </View>
    );
  }
}

export default Chats;
