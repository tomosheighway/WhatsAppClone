import React, { Component } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
} from 'react-native';
import * as EmailValidator from 'email-validator'; // Importing the email-validator library
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Input } from 'react-native-elements';
import styles from '../styles/accountStyles';

// import Icon from 'react-native-vector-icons/MaterialIcons';   // icon pack

class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('sessionToken');
    if (value != null) {
      navigation.navigate('MainAppNav');
    }
  };

  handleEmailInput = (email) => {
    this.setState({ email });
  };

  handlePasswordInput = (pass) => {
    this.setState({ password: pass });
  };

  isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/; // (including: one uppercase, one number and one special
    return passwordRegex.test(password);
  };

  handleLogin = () => {
    const { email, password } = this.state;
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
    fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        // this.setState({errorMessage: "Sign Up successful!"});
        }
        if (response.status === 400) {
          throw new Error('Invalid user details');
        } else {
          throw new Error('Something went wrong');
        }
      })

      .then(async (responseJson) => {
        console.log(responseJson);
        try {
          const { navigation } = this.props;
          await AsyncStorage.setItem('sessionToken', responseJson.token);
          await AsyncStorage.setItem('userId', responseJson.id);
          navigation.navigate('MainAppNav');
        } catch {
          throw new Error('Something wrong');
        }
      })
      .catch((ERR) => {
        this.setState({ errorMessage: ERR.message });
      });
    // this.setState({errorMessage: "Login successful!"});
  };

  render() {
    const { email, password, errorMessage } = this.state;
    const { navigation } = this.props;

    return (

      <View style={styles.container}>

        <Text style={styles.title}>Please enter your login details below</Text>
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

        <Button
          title="Login"
          buttonStyle={styles.buttonContainer}
          onPress={this.handleLogin}
        />

        <Button
          title="Create a account"
          buttonStyle={styles.buttonContainer}
          onPress={() => navigation.navigate('Signup')}
        />

        {errorMessage ? <Text>{errorMessage}</Text> : null}
      </View>
    );
  }
}

export default Login;
