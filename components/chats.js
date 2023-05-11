import React, { Component } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,
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

  // async componentDidMount() {
  //   const chats = await this.getChats();
  //   if (chats) {
  //     this.setState({ chats });
  //   }
  // }
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
    const reversedChats = [...chats].reverse();
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chats:</Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Enter a new chat name"
          value={this.newChatName}
          onChangeText={(text) => this.setState({ newChatName: text })}
        />
        <TouchableOpacity style={styles.button} onPress={this.createNewChat}>
          <Text style={styles.buttonText}>Create New Chat</Text>
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
              <Text style={styles.chatId}>
                ID:
                {' '}
                {item.chat_id}
              </Text>
              <Text style={styles.chatName}>
                Name:
                {' '}
                {item.name}
              </Text>
              {item.last_message && item.last_message.message ? (
                <Text style={styles.chatLastMessage}>
                  Last Message:
                  {' '}
                  {item.last_message.message}
                </Text>
              ) : null}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.chat_id.toString()}
        />
      </View>
    );
  }
}

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chatItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  chatId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
