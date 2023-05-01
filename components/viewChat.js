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
      userId: '',
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

  handleUpdateMessage = async (chatId, messageId, updatedMessage) => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      if (!updatedMessage || updatedMessage.trim() === '') {
        this.setState({ errorMessage: 'Message cannot be blank' });
        return;
      }
      const body = {
        message: updatedMessage,
      };
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'PATCH',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        this.setState({ errorMessage: 'Message has been updated' });
        this.setState({ updatedMessage: '' });
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
    const userId = await AsyncStorage.getItem('userId');
    this.setState({ userId });
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
      userId,
    } = this.state;
    const messageList = messages.slice().reverse();
    const { navigation } = this.props;
    return (
      <View>
        {errorMessage ? <Text>{errorMessage}</Text> : null}
        {/* make this a popup thing  */}

        <View style={styles.chatNameContainer}>
          <Text style={styles.title}>{chatName}</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter new chat name"
            value={updatedChatName}
            onChangeText={(text) => this.setState({ updatedChatName: text })}
          />
          <TouchableOpacity style={styles.button} onPress={this.handleUpdateChatName}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.membersHeadContainer}>
          <View style={styles.membersContainer}>
            <Text style={styles.sectionTitle}>Members</Text>
            <ScrollView style={styles.scroll}>
              {members.map((member) => (
                <Text key={member.user_id} style={styles.member}>
                  {member.first_name}
                  {' '}
                  {member.last_name}
                </Text>
              ))}
            </ScrollView>
          </View>

          <View style={styles.membersButtonsContainer}>
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
          </View>
        </View> */}
        <Text style={styles.sectionTitle}>Members</Text>
        <ScrollView style={styles.scroll}>
          {members.map((member) => (
            <Text key={member.user_id} style={styles.member}>
              {member.first_name}
              {' '}
              {member.last_name}
            </Text>
          ))}
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.leftButtonContainer}
            onPress={() => navigation.navigate('AddToChat', { data: chatId, viewChat: this.viewChat.bind(this) })}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rightButtonContainer}
            onPress={() => navigation.navigate('RemoveFromChat', { chatId, members, viewChat: this.viewChat.bind(this) })}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Messages</Text>

        <View style={{ flex: 1, maxHeight: 500 }}>
          <ScrollView
            style={{ flex: 1, marginBottom: 60 }}
            contentContainerStyle={styles.messageContainer}
            showsVerticalScrollIndicator
          >
            {messageList.map((message) => {
              const isSentByUser = userId === String(message.author.user_id);
              const bubbleColor = isSentByUser ? '#09eb5c' : '#67c5f5';
              const textAlign = isSentByUser ? 'left' : 'right';

              return (
                <View key={message.message_id}>
                  <View style={{
                    backgroundColor: bubbleColor,
                    borderRadius: 20,
                    padding: 10,
                    marginLeft: isSentByUser ? 50 : 10,
                    marginBottom: 10,
                    marginRight: isSentByUser ? 10 : 50,
                    alignSelf: textAlign,
                    maxWidth: '80%',
                  }}
                  >
                    <Text style={{ fontSize: 16 }}>
                      {message.author.first_name}
                      ,
                      {' '}
                      {message.author.last_name}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {message.message}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#808080', textAlign: 'right' }}>
                      {new Date(message.timestamp).toLocaleString()}
                    </Text>
                    {isSentByUser
                  && (
                    <TouchableOpacity onPress={() => this.handleDeleteMessage(message.message_id)} style={{ position: 'absolute', top: 5, right: 10 }}>
                      <Text style={{ color: 'red', fontSize: 20, fontWeight: 'bold' }}>X</Text>
                    </TouchableOpacity>
                  )}
                  </View>
                </View>
              );
            })}

          </ScrollView>
          <View style={{
            position: 'absolute', bottom: 2, left: 0, right: 0, padding: 10, backgroundColor: '#f0f0f0', flexDirection: 'row',
          }}
          >
            <TextInput
              placeholder="Enter message"
              value={newMessage}
              onChangeText={(text) => this.setState({ newMessage: text })}
              style={{
                borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, flex: 1, marginRight: 10,
              }}
            />
            <TouchableOpacity
              onPress={this.handleNewMessage}
              style={{
                backgroundColor: '#67c5f5', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default ViewChats;
