import React, { Component } from 'react';

import { StyleSheet, View, Text,TextInput, Button,TouchableOpacity } from 'react-native';
import * as EmailValidator from 'email-validator'; // Importing the email-validator library

class Login extends Component {
    static navigationOptions = {
        header: null
      };


  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: ""        // error state 4 outputting error message on login
    }
  }

  handleEmailInput = (email) => {
    this.setState({email: email})
  }

  handlePasswordInput = (pass) => {
    this.setState({password: pass})
  }

  handleLogin = () => {
    // Validation login logic 
    if (!this.state.email || !this.state.password) {
      this.setState({errorMessage: "Please fill in all of the fields"});
      return;
    }
    if (!EmailValidator.validate(this.state.email)) {
      this.setState({errorMessage: "Please enter a valid email address"});
      return;
    }
    if (!this.isStrongPassword(this.state.password)) {
      this.setState({errorMessage: "Please enter a strong password. \n(8 or more characters including at least one uppercase letter, one number, and one special character: !@#$%^&*()_+-=[]{};:'\"\\|,.<>/?)"});
      return;
    }

    //output msg 
    this.setState({errorMessage: "Login successful!"});     //success message for testing. 
  }

  // Password strength check 
  isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/; //(including: one uppercase, one number and one special
    return passwordRegex.test(password);
  }
  
// <Button title="New user?" onPress={this.props.navigate("Signup")}  /> 
  render() {
    
    return (

      <View>
        <TextInput placeholder='email...' onChangeText={this.handleEmailInput} value={this.state.email} />
        <TextInput placeholder='password...' onChangeText={this.handlePasswordInput} value={this.state.password} secureTextEntry={true} />
        {/* <Button title="Login" onPress={this.handleLogin} /> */}
     
        <TouchableOpacity
		      style={styles.buttonContainer}
            onPress={this.handleLogin}>
			  <Text style={styles.buttonText}>Login</Text>
		    </TouchableOpacity>

        <TouchableOpacity
		      style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('Signup')}>
			  <Text style={styles.buttonText}>Go to signup</Text>
		    </TouchableOpacity>

        {this.state.errorMessage ? <Text>{this.state.errorMessage}</Text> : null}
{/*      
        <View>
            <Button title="New user?" onPress={this.props.navigation.navigate("Signup")}  /> 
        </View> */}
      </View>

      


      
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ebebeb'
  },
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold'
  },
  buttonContainer: {
    backgroundColor: '#222',
    borderRadius: 5,
    padding: 10,
    margin: 20
  },
  buttonText: {
    fontSize: 20,
    color: '#fff'
  }
});


export default Login;