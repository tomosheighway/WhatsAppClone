import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View, Text, Button, TouchableOpacity,
} from 'react-native';

class Contacts extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      blockedContacts: [],
    };
  }

  async componentDidMount() {
    const contacts = await this.getContacts();
    const blockedContacts = await this.getBlockedContacts();
    if (contacts) {
      this.setState({ contacts });
    }
    if (blockedContacts) {
      this.setState({ blockedContacts });
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

  async getBlockedContacts() {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    // const userId = await AsyncStorage.getItem('userId');

    return fetch('http://localhost:3333/api/1.0.0/blocked', {
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

  async blockContact(userId) {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Contact blocked successfully');
          const contacts = await this.getContacts();
          const blockedContacts = await this.getBlockedContacts();
          if (contacts && blockedContacts) {
            this.setState({ contacts, blockedContacts });
          }
        } else if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized error');
          navigation.navigate('Login');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else if (response.status === 400) {
          throw new Error('You cant block yourself');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async unblockContact(userId) {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Contact unblocked successfully');
          const contacts = await this.getContacts();
          const blockedContacts = await this.getBlockedContacts();
          if (contacts && blockedContacts) {
            this.setState({ contacts, blockedContacts });
          }
        } else if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized error');
          navigation.navigate('Login');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async deleteContact(userId) {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Contact deleted successfully');
          const contacts = await this.getContacts();
          const blockedContacts = await this.getBlockedContacts();
          if (contacts && blockedContacts) {
            this.setState({ contacts, blockedContacts });
          }
        } else if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized error');
          navigation.navigate('Login');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { contacts, blockedContacts } = this.state;
    const { navigation } = this.props;
    return (
      <View>

        <TouchableOpacity
          onPress={() => navigation.navigate('AddContact')}
        >
          <Text>Add a new contact</Text>
        </TouchableOpacity>
        <Text> List of Users contacts</Text>
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
            <Button
              title="Block Contact"
              onPress={() => this.blockContact(contact.user_id)}
            />
            <Button
              title="Delete Contact"
              onPress={() => this.deleteContact(contact.user_id)}
            />
          </View>
        ))}

        <Text>
          {'\n'}
          List of Blocked contacts
        </Text>
        {blockedContacts.map((blockedContact) => (
          <View key={blockedContact.user_id}>
            <Text>
              {'\n'}
              {'UserID: '}
              {blockedContact.user_id}
              {'\n'}
              {'Name: '}
              {blockedContact.first_name}
              {' '}
              {blockedContact.last_name}
              {'\n'}
              {'Email: '}
              {blockedContact.email}
            </Text>
            <Button
              title="Un Block Contact"
              onPress={() => this.unblockContact(blockedContact.user_id)}
            />
            <Button
              title="Delete Contact"
              onPress={() => this.deleteContact(blockedContact.user_id)}
            />
          </View>
        ))}
      </View>
    );
  }
}

export default Contacts;
