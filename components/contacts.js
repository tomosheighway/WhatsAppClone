import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';
import {
  View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet,
} from 'react-native';
import { Icon, Button, Input } from 'react-native-elements';

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
    const { contacts, blockedContacts, errorMessage } = this.state;
    return (
      <View style={styles.container}>
        {errorMessage ? <Text>{errorMessage}</Text> : null}
        <Text>Enter the email of a contact you wish to add</Text>
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

        <Text style={styles.header}>Your contacts</Text>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.user_id}
          renderItem={({ item }) => (
            <View key={item.user_id} style={styles.item}>
              <Text style={styles.itemText}>
                {'\n'}
                {'UserID: '}
                {item.user_id}
                {'\n'}
                {'Name: '}
                {item.first_name}
                {' '}
                {item.last_name}
                {'\n'}
                {'Email: '}
                {item.email}
                {'\n'}
              </Text>
              <TouchableOpacity
                onPress={() => this.blockContact(item.user_id)}
                style={styles.icon}
              >
                <Icon name="lock" type="material-community" color="#ff0000" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.deleteContact(item.user_id)}
                style={styles.icon}
              >
                <Icon name="close" type="material-community" color="#ff0000" />
              </TouchableOpacity>
            </View>
          )}
        />

        <Text style={styles.header}>Blocked contacts</Text>
        <FlatList
          data={blockedContacts}
          keyExtractor={(item) => item.user_id}
          renderItem={({ item }) => (
            <View key={item.user_id} style={styles.item}>
              <Text style={styles.itemText}>
                {'\n'}
                {'UserID: '}
                {item.user_id}
                {'\n'}
                {'Name: '}
                {item.first_name}
                {' '}
                {item.last_name}
                {'\n'}
                {'Email: '}
                {item.email}
                {'\n'}
              </Text>
              <TouchableOpacity
                onPress={() => this.unblockContact(item.user_id)}
                style={styles.icon}
              >
                <Icon name="lock-open" type="material-community" color="#008000" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.deleteContact(item.user_id)}
                style={styles.icon}
              >
                <Icon name="close" type="material-community" color="#ff0000" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  }
}

export default Contacts;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
  },
  icon: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    flex: 2,
  },
  addButton: {
    backgroundColor: 'green',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
