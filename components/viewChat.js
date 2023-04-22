import React, { Component } from 'react';
import {
  View, TextInput, Text, TouchableOpacity,
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
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const { chatId, updatedChatName } = this.state;
    console.log(updatedChatName);
    const body = {
      name: updatedChatName,
    };

    return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (response.status === 200) {
        //   const data = await response.json();
          //   console.log(data);
          this.setState({ errorMessage: 'Chat Name has been updated' });
          this.setState({
            chatName: updatedChatName,
            updatedChatName: '',
          });
        }
        if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized error');
          navigation.navigate('Login');
          return null;
        }
        if (response.status === 500) {
          throw new Error('Server Error');
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
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
      updatedChatName,
    } = this.state;
    const messageList = messages.slice().reverse();
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

        <Text>
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
