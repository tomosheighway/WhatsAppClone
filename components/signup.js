import React, { Component } from 'react';
import {
  Text, TextInput, View, TouchableOpacity, StyleSheet,
} from 'react-native';
import * as EmailValidator from 'email-validator'; // Importing the email-validator library

class Signup extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      errorMessage: '', // error state 4 outputting error message on login
    };
  }

  handleFirstNameInput = (firstName) => {
    this.setState({ firstName });
  };

  handleLastNameInput = (lastName) => {
    this.setState({ lastName });
  };

  handleEmailInput = (email) => {
    this.setState({ email });
  };

  handlePasswordInput = (pass) => {
    this.setState({ password: pass });
  };

  handleSignup = () => {
    const {
      email, password, firstName, lastName,
    } = this.state;
    const { navigation } = this.props;
    // Validation sign up logic ## could add validation to prevent numbers in the name inputs
    if (!email || !password) {
      this.setState({ errorMessage: 'Please fill in all of the fields' });
      return;
    }
    if (!EmailValidator.validate(email)) {
      this.setState({ errorMessage: 'Please enter a valid email address' });
      return;
    }
    if (!this.isStrongPassword(password)) {
      this.setState({ errorMessage: "Please enter a strong password. \n(8 or more characters including at least one uppercase letter, one number, and one special character: !@#$%^&*()_+-=[]{};:'\"\\|,.<>/?)" });
      return;
    }

    // output msg
    // this.setState({errorMessage: "Sign Up successful!"});     //success message for testing.

    // is it 2.0.0 or not. currently getiing a 404 version.
    fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('user created ID: ', response.json());
          navigation.navigate('Login');
        // this.setState({errorMessage: "Sign Up successful!"});
        }
        if (response.status === 400) {
          this.setState({ errorMessage: 'Email already exisits' });
          console.log('email already exisits');
          // navigation.navigate('Signup');
          throw new Error('Email already exisits');
        } else {
          console.log('email already exisits');
          throw new Error('Something went wrong');
        }
      })
      .catch((ERR) => {
        console.log(ERR);
        this.setState({ errorMessage: ERR.message });
      });
  };

  // Password strength check
  isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/; // (including: one uppercase, one number and one special
    return passwordRegex.test(password);
  };

  render() {
    // const { navigation } = this.props;
    const {
      email, password, firstName, lastName, errorMessage,
    } = this.state;
    return (
      <View>
        <TextInput placeholder="Email..." onChangeText={this.handleEmailInput} value={email} />
        <TextInput placeholder="Password..." onChangeText={this.handlePasswordInput} value={password} secureTextEntry />
        <TextInput placeholder="First Name..." onChangeText={this.handleFirstNameInput} value={firstName} />
        <TextInput placeholder="Last Name..." onChangeText={this.handleLastNameInput} value={lastName} />

        <TouchableOpacity // just deals with valiadtion wont return user to login page yet
          style={styles.buttonContainer}
          onPress={this.handleSignup}
        >
          <Text style={styles.buttonText}>Continue</Text>
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

export default Signup;
