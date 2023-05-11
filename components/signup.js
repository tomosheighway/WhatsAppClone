import React, { Component } from 'react';
import {
  Text, View,
} from 'react-native';
import * as EmailValidator from 'email-validator'; // Importing the email-validator library
import { Input, Button } from 'react-native-elements';
import styles from '../styles/accountStyles';

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
    const {
      email, password, firstName, lastName, errorMessage,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please enter your details to signup</Text>

        <Input
          placeholder="Email..."
          leftIcon={{ type: 'material', name: 'email' }}
          onChangeText={this.handleEmailInput}
          value={email}
          containerStyle={styles.textInputContainer}
          inputStyle={styles.textInput}
        />
        <Input
          placeholder="Password..."
          leftIcon={{ type: 'material', name: 'lock' }}
          onChangeText={this.handlePasswordInput}
          value={password}
          secureTextEntry
          containerStyle={styles.textInputContainer}
          inputStyle={styles.textInput}
        />
        <Input
          placeholder="First Name..."
          leftIcon={{ type: 'material', name: 'person' }}
          onChangeText={this.handleFirstNameInput}
          value={firstName}
          containerStyle={styles.textInputContainer}
          inputStyle={styles.textInput}
        />
        <Input
          placeholder="Last Name..."
          leftIcon={{ type: 'material', name: 'person' }}
          onChangeText={this.handleLastNameInput}
          value={lastName}
          containerStyle={styles.textInputContainer}
          inputStyle={styles.textInput}
        />

        <Button
          title="Signup"
          buttonStyle={styles.buttonContainer}
          onPress={this.handleSignup}
        />
        <Button
          title="Already have a account?"
          buttonStyle={styles.buttonContainer}
          onPress={() => navigation.navigate('Login')}
        />

        {errorMessage ? <Text>{errorMessage}</Text> : null}
      </View>
    );
  }
}

export default Signup;
