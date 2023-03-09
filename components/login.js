import React, { Component } from 'react';

import { StyleSheet, View, Text,TextInput,TouchableOpacity } from 'react-native';
import * as EmailValidator from 'email-validator'; // Importing the email-validator library
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialIcons';   // icon pack 



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


    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: 'post',
      headers: {
        'Content-Type': "application/json"
      }, 
      body: JSON.stringify({
        "email": this.state.email, "password": this.state.password
      })
    })
    .then((response) => {
      if(response.status === 200){
        return response.json()
        //this.setState({errorMessage: "Sign Up successful!"});
      }
      else if (response.status === 400){
        throw 'Invalid user details';
      }
      else{         // give nicer errors 
        throw 'Something went wrong';
      }

    })
    .then(async (responseJson) =>{
        console.log(responseJson);
       // await AsyncStorage.setItem('@session_token', responseJson.token);
        //this.props.navigation.navigate('');//  HOME
    })
    .catch((ERR) => {
        console.log(ERR)
    });


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
        <TextInput placeholder='Email...' onChangeText={this.handleEmailInput} value={this.state.email}/>

        <TextInput placeholder='Password...' onChangeText={this.handlePasswordInput} value={this.state.password} secureTextEntry={true} />
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

  textInputContainer: {
    marginBottom: 20,
    width: '80%',
    borderBottomColor: '#222',
    borderBottomWidth: 1,
    alignItems: 'center',
    flexDirection: 'row'
    },
    textInput: {
    fontSize: 18,
    marginLeft: 5,
    flex: 1,
    padding: 10,
    color: '#222'
    },
    textInputIcon: {
    marginLeft: 5,
    marginRight: 5
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