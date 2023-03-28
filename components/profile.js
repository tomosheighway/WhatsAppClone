import React, { Component } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Profile extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      errorMessage: '',
    };
  }

  // getting user details ------
  async componentDidMount() {
    const userInfo = await this.getUserInfo();
    if (userInfo) {
      console.log(userInfo);
      this.setState({ userInfo });
    } else {
      this.setState({ errorMessage: 'Something went wrong' });
    }
  }

  async getUserInfo() {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const userId = await AsyncStorage.getItem('userId');

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
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
          throw new Error('Not found ');
        } else if (response.status === 500) {
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

  // incomplete
  async getGrofilePhoto() {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const userId = await AsyncStorage.getItem('userId');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json', // need take image
        'Content-Type': 'application/json',
      },
    });
  }

  // password reset stuff -----------
  handlePasswordInput = (pass) => {
    this.setState({ password: pass });
  };

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

    this.setState({ errorMessage: 'Valid new password' });

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

  render() {
    const { userInfo, password, errorMessage } = this.state;
    return (
      <View>
        {userInfo && (
          <>
            <Text>Your user details are shown below:</Text>
            <Text>
              User ID:
              {' '}
              {userInfo.user_id}
            </Text>
            <Text>
              First name:
              {' '}
              {userInfo.first_name}
            </Text>
            <Text>
              Last name:
              {' '}
              {userInfo.last_name}
            </Text>
            <Text>
              Email:
              {' '}
              {userInfo.email}
            </Text>
          </>
        )}

        <Text>To change your password enter a new one below: </Text>
        <TextInput placeholder=" New Password..." onChangeText={this.handlePasswordInput} value={password} secureTextEntry />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.handleNewPassword}
        >
          <Text style={styles.buttonText}>Update password</Text>
        </TouchableOpacity>

        {errorMessage ? <Text>{errorMessage}</Text> : null}
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

export default Profile;
