import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

class AddToChat extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      chatId: null,
      errorMessage: '',
    };
  }

  async componentDidMount() {
    const {
      route: { params: { data } },
    } = this.props;
    this.setState({
      chatId: data,
    });
    const contacts = await this.getContacts();
    if (contacts) {
      this.setState({ contacts });
    }
    console.log(contacts);
  }

  async getContacts() {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    // const userId = await AsyncStorage.getItem('userId');

    return fetch('http://localhost:3333/api/1.0.0/contacts', {
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
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  handleAddUserToChat = async (userId) => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId } = this.state;
      const { viewChat } = this.props.route.params;
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
        method: 'POST',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        console.log('User added to the chat ');
        Toast.show({
          type: 'success',
          text1: 'User added to the chat',
          visibilityTime: 6000,
          style: {
            backgroundColor: 'black',
            borderRadius: 10,
          },
          text1Style: {
            color: 'white',
          },
        });
        viewChat();
        // await this.viewChat();
      } else if (response.status === 400) {
        console.log('Bad Request');
        this.setState({ errorMessage: 'User already a member of the chat' });
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

  render() {
    const {
      chatId,
      errorMessage,
      contacts,
    } = this.state;
    return (

      <View>
        {errorMessage ? <Text>{errorMessage}</Text> : null}
        <Toast ref={(ref) => Toast.setRef(ref)} />
        <Text>
          {' '}
          Chat ID
          {' '}
          { chatId }
          {' '}
        </Text>

        <Text> This is a list of your contacts. Select a user to add to the chat</Text>
        {contacts.map((contact) => (
          <View key={contact.user_id}>
            <Text>
              {'\n'}
              {'UserID: '}
              {contact.user_id}
              {'\n'}
              {'Name: '}
              {contact.first_name}
              {' '}
              {contact.last_name}
              {'\n'}
              {'Email: '}
              {contact.email}
              {'\n'}
            </Text>
            <TouchableOpacity onPress={() => this.handleAddUserToChat(contact.user_id)}>
              <Text>Add to Chat</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }
}

export default AddToChat;
