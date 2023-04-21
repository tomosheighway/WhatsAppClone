import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';
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
      members: [],
      messages: [],
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
    } = this.state;
    const messageList = messages.slice().reverse();
    return (
      <View>
        {errorMessage ? <Text>{errorMessage}</Text> : null}
        <Text style={styles.title}>Chats</Text>
        <TextInput placeholder="Test" />
        <Text>
          Chat Name:
          {' '}
          {chatName}
        </Text>
        <Text>
          --------------------------Members----------------------------
        </Text>
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
        <Text>
          --------------------------Messages-------------------------------
        </Text>
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
              {/* useful atm as lots users have same first / last name  */}
              (
              {message.author.email}
              )
            </Text>
          </View>
        ))}
      </View>
    );
  }
}

export default ViewChats;
