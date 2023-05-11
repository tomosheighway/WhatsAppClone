import React, { Component } from 'react';
import {
  View, Text,
} from 'react-native';
import emailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Input } from 'react-native-elements';

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
    const { params: { updateUserDetails } } = this.props.route;
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
      updateUserDetails();
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

        <Input
          label="First Name"
          value={firstName}
          onChangeText={(val) => this.setState({ firstName: val })}
        />

        <Input
          label="Last Name"
          value={lastName}
          onChangeText={(val) => this.setState({ lastName: val })}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={(val) => this.setState({ email: val })}
        />

        <Button
          title="Update Profile"
          onPress={this.updateProfile}
        />

        <Input
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChangeText={this.handlePasswordInput}
          secureTextEntry
        />

        <Button
          title="Update Password"
          onPress={this.handleNewPassword}
        />
      </View>
    );
  }
}

export default UpdateProfile;
