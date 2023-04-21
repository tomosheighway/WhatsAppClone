import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';

class AddContacts extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errorMessage: '',
    };
  }

  handleAddContact = async () => {
    const { email } = this.state;
    if (!EmailValidator.validate(email)) {
      this.setState({ errorMessage: 'Please enter a valid email address' });
      return;
    }
    console.log(`Email entered: ${email}`);
    const data = await this.getUsersId(email);
    console.log(`Data returned: ${JSON.stringify(data)}`);
    if (data && data.length > 0) {
      const userId = data[0].user_id;
      console.log(`User ID: ${userId}`);
      await this.addUserAsContact(userId);
    } else {
      this.setState({ errorMessage: 'That email address couldnt be linked with a user of this app' });
      console.log('User not found');
    }
  };

  async getUsersId(email) {
    const sessionToken = await AsyncStorage.getItem('sessionToken');

    return fetch(`http://localhost:3333/api/1.0.0/search?q=${email}&search_in=all`, {
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
        if (response.status === 404) {
          this.setState({ errorMessage: 'Not found :(' });
          throw new Error('Not found ');
        } else if (response.status === 500) {
          this.setState({ errorMessage: 'Server Error :(' });
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

  async addUserAsContact(userId) {
    const sessionToken = await AsyncStorage.getItem('sessionToken');

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: 'Post',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Contact Added successfully');
        } else if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized error');
          navigation.navigate('Login');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else if (response.status === 400) {
          this.setState({ errorMessage: 'You cant add yourself as a contact!' });
          throw new Error('You cant add yourself');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { errorMessage } = this.state;
    return (
      <View>
        <Text>Enter the email of a contact you wish to add</Text>
        <TextInput
          placeholder="Email...."
          onChangeText={(text) => this.setState({ email: text })}
        />

        <TouchableOpacity onPress={this.handleAddContact}>
          <Text>Add</Text>
        </TouchableOpacity>
        {errorMessage ? <Text>{errorMessage}</Text> : null}
      </View>
    );
  }
}

export default AddContacts;
