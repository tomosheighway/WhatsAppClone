import React, { Component } from 'react';
import {
  View, TextInput, Text, TouchableOpacity, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/chatStyles';

class ViewChats extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      chatId: null,
      errorMessage: '',
      chatName: '',
      updatedChatName: '',
      members: [],
      messages: [],
      newMessage: '',
    };
  }

  componentDidMount() {
    const {
      route: { params: { data } },
    } = this.props;
    this.setState({
      chatId: data,
    }, async () => {
      await this.viewChat();
    });
  }

  handleUpdateChatName = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId, updatedChatName } = this.state;
      const { getChats } = this.props.route.params;
      if (!updatedChatName || updatedChatName.trim() === '') {
        this.setState({ errorMessage: 'Chat name cannot be blank' });
        return;
      }
      const body = {
        name: updatedChatName,
      };
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
        method: 'PATCH',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        getChats();
        this.setState({ errorMessage: 'Chat name has been updated' });
        this.setState({
          chatName: updatedChatName,
          updatedChatName: '',
        });
      } else if (response.status === 401) {
        const { navigation } = this.props;
        console.log('Unauthorized error');
        navigation.navigate('Login');
      } else if (response.status === 500) {
        throw new Error('Server Error');
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleNewMessage = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId, newMessage } = this.state;
      console.log(newMessage);
      if (!newMessage || !newMessage.trim()) {
        this.setState({ errorMessage: 'Please enter a message' });
        return;
      }
      const body = {
        message: newMessage,
      };
      await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      console.log('Message Sent');
      await this.viewChat();
      this.setState({
        errorMessage: 'Message Sent',
        newMessage: '',
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  handleDeleteMessage = async (messageId) => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId } = this.state;
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        console.log('Message deleted');
        await this.viewChat();
      } else if (response.status === 401) {
        const { navigation } = this.props;
        console.log('Unauthorized error');
        navigation.navigate('Login');
      } else if (response.status === 403) {
        this.setState({ errorMessage: 'You can only delete your own messages!' });
        throw new Error('Forbidden');
      } else if (response.status === 500) {
        throw new Error('Server Error');
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  async viewChat() {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    // const userId = await AsyncStorage.getItem('userId');
    const { chatId } = this.state;
    return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
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
          this.setState({
            chatName: data.name,
            members: data.members,
            messages: data.messages,
          });
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

  render() {
    const {
      errorMessage,
      chatName,
      members,
      messages,
      newMessage,
      updatedChatName,
      chatId,
    } = this.state;
    const messageList = messages.slice().reverse();
    const { navigation } = this.props;
    return (
      <View>
        {errorMessage ? <Text>{errorMessage}</Text> : null}
        <Text style={styles.title}>Chat</Text>

        <TextInput
          placeholder={chatName}
          value={updatedChatName}
          onChangeText={(text) => this.setState({ updatedChatName: text })}
        />
        <TouchableOpacity onPress={this.handleUpdateChatName}>
          <Text>Update Chat Name</Text>
        </TouchableOpacity>

        <Text>{chatName}</Text>
        <Text>--------------------------Members----------------------------</Text>
        {members.map((member) => (
          <Text key={member.user_id}>
            {member.first_name}
            {' '}
            {member.last_name}
            {' '}
            (
            {member.email}
            )
          </Text>
        ))}

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('AddToChat', { data: chatId })}
        >
          <Text style={styles.buttonText}>Add a contact to the chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('RemoveFromChat', { chatId, members })}
        >
          <Text style={styles.buttonText}>Remove a user from the chat</Text>
        </TouchableOpacity>
        <Text>--------------------------Messages-------------------------------</Text>
        <ScrollView
          contentContainerStyle={styles.messageContainer}
          showsVerticalScrollIndicator
                // need to make it defult scroll to the end
        >
          {messageList.map((message) => (
            <View key={message.message_id}>
              <Text>
                Message ID:
                {' '}
                {message.message_id}
              </Text>
              <Text>{new Date(message.timestamp).toLocaleString()}</Text>
              <Text>
                Message:
                {' '}
                {message.message}
              </Text>
              <Text>
                Author:
                {' '}
                {message.author.first_name}
                {' '}
                {message.author.last_name}
                {' '}
                (
                {message.author.email}
                )
              </Text>
              <TouchableOpacity onPress={() => this.handleDeleteMessage(message.message_id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <TextInput
          placeholder="Enter Message"
          value={newMessage}
          onChangeText={(text) => this.setState({ newMessage: text })}
        />
        <TouchableOpacity onPress={this.handleNewMessage}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ViewChats;
