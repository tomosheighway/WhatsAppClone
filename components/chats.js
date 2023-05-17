import React, { Component } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ListItem, Input,
} from 'react-native-elements';
import styles from '../styles/chatStyles';

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
    await this.getChats();
    this.intervalId = setInterval(this.getChats.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
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
            this.setState({ chats, newChatName: '' });
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
        return null;
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorMessage: error.message });
      });
  };

  render() {
    const { chats, errorMessage } = this.state;
    const { navigation } = this.props;
    const reversedChats = [...chats].reverse();
    return (
      <View style={styles.background}>
        <View style={styles.container}>

          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          <Input
            placeholder="Enter a new chat name"
            value={this.newChatName}
            onChangeText={(text) => this.setState({ newChatName: text })}
          />
          <TouchableOpacity style={styles.createButton} onPress={this.createNewChat}>
            <Text style={styles.createButtonText}>Create New Chat</Text>
          </TouchableOpacity>
          <FlatList
            data={reversedChats}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chatItem}
                onPress={() => navigation.navigate('ViewChat', {
                  data: item.chat_id,
                  getChats: this.getChats.bind(this),
                })}
              >
                <ListItem.Content>
                  <ListItem.Title>
                    Chat Name:
                    {' '}
                    {item.name}
                  </ListItem.Title>
                </ListItem.Content>
                {item.last_message && item.last_message.message ? (
                  <ListItem.Subtitle>
                    Last Message:
                    {' '}
                    {item.last_message.message}
                  </ListItem.Subtitle>
                ) : null}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.chat_id.toString()}
          />
        </View>
      </View>
    );
  }
}

export default Chats;
