import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';
import {
  View, Text, TouchableOpacity, FlatList, Modal,
} from 'react-native';
import {
  Icon, Input, ListItem,
} from 'react-native-elements';
import styles from '../styles/contactStyles';

class Contacts extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      blockedContacts: [],
      email: '',
      errorMessage: '',
      users: null,
      modalVisible: false,
    };
  }

  async componentDidMount() {
    const contacts = await this.getContacts();
    const blockedContacts = await this.getBlockedContacts();
    this.getUsers().then((users) => {
      this.setState({ users });
    });
    if (contacts) {
      this.setState({ contacts });
    }
    if (blockedContacts) {
      this.setState({ blockedContacts });
    }
    console.log(contacts);
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

  async getUsers() {
    const sessionToken = await AsyncStorage.getItem('sessionToken');

    return fetch('http://localhost:3333/api/1.0.0/search', {
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

  async getContacts() {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
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
          this.setState({ errorMessage: 'Contact blocked successfully' });
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
          this.setState({ errorMessage: 'You cant block yourself' });
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
          this.setState({ errorMessage: 'Contact unblocked successfully' });
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
          this.setState({ errorMessage: 'Unable to unblocked contact' });
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
          this.setState({ errorMessage: 'Contact deleted successfully' });
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
          this.setState({ errorMessage: 'Unable to delete contact' });
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async addUserAsContact(userId) {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    this.setState({ modalVisible: false });
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
          this.setState({ errorMessage: 'Contact Added successfully' });
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
    const {
      contacts, blockedContacts, errorMessage,
      users, modalVisible,
    } = this.state;
    return (
      <View style={styles.background}>
        <View style={styles.container}>
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          <Text style={styles.header}>Enter the email of a contact you wish to add</Text>
          <View style={styles.inputContainer}>

            <Input
              containerStyle={styles.input}
              placeholder="Email...."
              onChangeText={(text) => this.setState({ email: text })}
            />
            <TouchableOpacity style={styles.addButton} onPress={this.handleAddContact}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
            <Text style={styles.header2}>Or click to explore existing users</Text>
          </TouchableOpacity>

          <Modal visible={modalVisible} animationType="slide">
            <View style={styles.background}>
              <View style={styles.container}>

                <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
                  <Text style={styles.close}>Close</Text>
                </TouchableOpacity>
                <Text style={styles.header}>List of all users</Text>
                <FlatList
                  data={users}
                  keyExtractor={(item) => item.user_id}
                  renderItem={({ item }) => (
                    <ListItem bottomDivider>
                      <ListItem.Content>
                        <ListItem.Title>
                          {item.given_name}
                          {' '}
                          {item.family_name}
                        </ListItem.Title>
                      </ListItem.Content>
                      <TouchableOpacity onPress={() => this.addUserAsContact(item.user_id)}>
                        <Text>Add as Contact</Text>
                      </TouchableOpacity>

                    </ListItem>
                  )}
                />
              </View>
            </View>
          </Modal>

          <Text style={styles.header}>Your contacts</Text>
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => (
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>
                    {'Name: '}
                    {item.first_name}
                    {' '}
                    {item.last_name}
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    {'Email: '}
                    {item.email}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <Icon
                  name="lock"
                  type="material-community"
                  color="#ff0000"
                  onPress={() => this.blockContact(item.user_id)}
                />
                <Icon
                  name="close"
                  type="material-community"
                  color="#ff0000"
                  onPress={() => this.deleteContact(item.user_id)}
                />
              </ListItem>
            )}
          />

          <Text style={styles.header}>Blocked contacts</Text>
          <FlatList
            data={blockedContacts}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => (
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>
                    {'UserID: '}
                    {item.user_id}
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    {'Name: '}
                    {item.first_name}
                    {' '}
                    {item.last_name}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    {'Email: '}
                    {item.email}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <Icon
                  name="lock-open"
                  type="material-community"
                  color="#00FF00"
                  onPress={() => this.unblockContact(item.user_id)}
                />
                <Icon
                  name="close"
                  type="material-community"
                  color="#ff0000"
                  onPress={() => this.deleteContact(item.user_id)}
                />
              </ListItem>
            )}
          />
        </View>
      </View>
    );
  }
}

export default Contacts;
