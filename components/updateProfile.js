import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import emailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdateProfile extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      originalData: null,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      errorMessage: '',
    };
  }

  componentDidMount() {
    const {
      route: { params: { data } },
    } = this.props;
    this.setState({
      originalData: data,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,

    });
  }

  handlePasswordInput = (pass) => {
    this.setState({ password: pass });
  };

  // eslint-disable-next-line class-methods-use-this
  isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/; // (including: one uppercase, one number and one special
    return passwordRegex.test(password);
  };

  handleNewPassword = async () => {
    const { password } = this.state;
    if (!this.isStrongPassword(password)) {
      this.setState({ errorMessage: "Please enter a strong password. \n(8 or more characters including at least one uppercase letter, one number, and one special character: !@#$%^&*()_+-=[]{};:'\"\\|,.<>/?)" });
      return;
    }

    this.setState({ errorMessage: 'Valid new password enterted and updated' });

    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const userId = await AsyncStorage.getItem('userId');
    const requestBody = { password };
    const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    if (response.status === 200) {
      console.log('Password updated successfully');
    } else if (response.status === 401) {
      console.log('Unauthorized error');
      const { navigation } = this.props;
      navigation.navigate('Login');
    } else if (response.status === 403) {
      console.log('Forbidded');
    } else if (response.status === 404) {
      console.log('User not found error');
    } else if (response.status === 500) {
      console.log('Server Error');
    } else {
      console.log('Something went wrong');
    }
  };

  updateProfile = async () => {
    const {
      originalData, firstName, lastName, email,
    } = this.state;
    if (firstName === originalData.first_name
        && lastName === originalData.last_name
        && email === originalData.email) {
      console.log('No changes made as details are the same');
      return;
    }

    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const userId = await AsyncStorage.getItem('userId');
    const requestBody = {};

    if (firstName !== originalData.first_name) {
      requestBody.first_name = firstName;
    }

    if (lastName !== originalData.last_name) {
      requestBody.last_name = lastName;
    }

    if (email !== originalData.email) {
      if (!emailValidator.validate(email)) {
        this.setState({ errorMessage: 'Invalid email enterted' });
        return;
      }
      requestBody.email = email;
    }

    const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 200) {
      console.log('User data updated successfully');
    } else if (response.status === 401) {
      console.log('Unauthorized error');
      const { navigation } = this.props;
      navigation.navigate('Login');
    } else if (response.status === 403) {
      console.log('Forbidden error');
    } else if (response.status === 404) {
      console.log('User not found error');
    } else if (response.status === 500) {
      console.log('Server error');
    } else {
      console.log('Something went wrong');
    }
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      errorMessage,
    } = this.state;
    return (
      <View>
        {errorMessage ? <Text>{errorMessage}</Text> : null}

        <Text> First Name: </Text>
        <TextInput
          value={firstName}
          onChangeText={(val) => this.setState({ firstName: val })}
        />

        <Text> Last Name: </Text>
        <TextInput
          value={lastName}
          onChangeText={(val) => this.setState({ lastName: val })}
        />

        <Text> Email:</Text>
        <TextInput
          value={email}
          onChangeText={(val) => this.setState({ email: val })}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.updateProfile}
        >
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>

        <Text>Password: </Text>
        <TextInput
          placeholder=" New Password..."
          onChangeText={this.handlePasswordInput}
          value={password}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.handleNewPassword}
        >
          <Text style={styles.buttonText}>Update password</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ebebeb',
  },
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    backgroundColor: '#222',
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
});

export default UpdateProfile;
