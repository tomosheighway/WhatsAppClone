import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  render() {
    const {
      chatId,
      errorMessage,
      contacts,
    } = this.state;
    return (
      <View>
        {errorMessage ? <Text>{errorMessage}</Text> : null}

        <Text>
          {' '}
          Chat ID
          {' '}
          { chatId }
          {' '}
        </Text>
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
          </View>
        ))}
      </View>
    );
  }
}

export default AddToChat;
