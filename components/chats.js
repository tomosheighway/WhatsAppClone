import React, { Component } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
// import styles from '../styles/chatStyles';

class Chats extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      newChatName: '',
      errorMessage: '',
      chats: [],
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
    const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      this.setState({ chats: data });
    } else if (response.status === 401) {
      const { navigation } = this.props;
      console.log('Unauthorized error');
      navigation.navigate('Login');
    } else if (response.status === 500) {
      throw new Error('Server Error');
    } else {
      this.setState({ errorMessage: 'Something went wrong' });
      throw new Error('Something went wrong');
    }
  }

  createNewChat = async () => {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const { newChatName } = this.state;
    console.log(newChatName);
    if (!newChatName || newChatName.trim() === '') {
      this.setState({ errorMessage: 'Chat name cannot be blank' });
      return;
    }
    const body = {
      name: newChatName,
    };

    fetch('http://localhost:3333/api/1.0.0/chat', {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (response.status === 201) {
          const data = await response.json();
          console.log(data);
          const chats = await this.getChats();
          if (chats) {
            this.setState({ chats });
          }
        } else if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized error');
          navigation.navigate('Login');
          return null;
        } else if (response.status === 400) {
          throw new Error('Invalid Request');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorMessage: error.message });
      });
  };

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
            <TouchableOpacity onPress={() => navigation.navigate('ViewChat', { data: item.chat_id, getChats: this.getChats.bind(this) })}>
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
        <TextInput
          placeholder="Enter Message"
          value={this.newChatName}
          onChangeText={(text) => this.setState({ newChatName: text })}
        />
        <TouchableOpacity onPress={this.createNewChat}>
          <Text>Create New Chat</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

export default Chats;
