import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { ListItem } from 'react-native-elements';

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
        this.setState({ errorMessage: 'User added' });
        Toast.show({
          type: 'success',
          text1: 'User added to the chat',
          visibilityTime: 6000,
          style: {
            backgroundColor: 'black',
            borderRadius: 10,
            zIndex: 9999, // Add this line
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
    const { chatId, errorMessage, contacts } = this.state;
    return (
      <View>

        <Toast ref={(ref) => Toast.setRef(ref)} />

        {errorMessage ? (
          <View style={{ backgroundColor: 'red', padding: 10 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {errorMessage}
            </Text>
          </View>
        ) : (
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
              Select a user to add to the chat
            </Text>
          </View>
        )}
        <FlatList
          data={contacts}
          keyExtractor={(contact) => contact.user_id.toString()}
          renderItem={({ item: contact }) => (
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title>
                  {contact.first_name}
                  {' '}
                  {contact.last_name}
                </ListItem.Title>
                <ListItem.Subtitle>{contact.email}</ListItem.Subtitle>
              </ListItem.Content>
              <TouchableOpacity onPress={() => this.handleAddUserToChat(contact.user_id)}>
                <Text>Add to Chat</Text>
              </TouchableOpacity>
            </ListItem>
          )}
        />
      </View>
    );
  }
}

export default AddToChat;
