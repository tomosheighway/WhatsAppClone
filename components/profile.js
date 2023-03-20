import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Profile extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {      
      password: "",
      errorMessage: ""    
    };
  }


  
  // getting user details ------ 
  async componentDidMount() {
    const userInfo = await this.getUserInfo();
    if (userInfo) {
      console.log(userInfo);
      this.setState({ userInfo });
    } else {
      this.setState({errorMessage: "Something went wrong"});  
    }
  }
  

  async getUserInfo() {
    const session_token = await AsyncStorage.getItem('session_token');
    const user_id = await AsyncStorage.getItem('user_id');
  
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
      method: 'GET',
      headers: {
        'X-Authorization': session_token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          const data = await response.json();
          return data;
        }
        else if (response.status === 401) {
          console.log('Unauthorized error');
          //await AsyncStorage.removeItem('session_token');
          //await AsyncStorage.removeItem('user_id');
          //this.props.navigation.navigate("Login")
          //this.checkLoggedIn(); not currently in profile page 
          return null;
        }
        else if (response.status === 404) {
          throw ('Not found ');
        }else if (response.status === 500) {
          throw ('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }
  // password reset stuff -----------
  handlePasswordInput = (pass) => {
    this.setState({password: pass})
  }

  isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/; //(including: one uppercase, one number and one special
    return passwordRegex.test(password);
  }

  handleNewPassword = async () => {
    // is it possible to pull old password to check if its the same / a previously used one? 
    if (!this.isStrongPassword(this.state.password)) {
      this.setState({errorMessage: "Please enter a strong password. \n(8 or more characters including at least one uppercase letter, one number, and one special character: !@#$%^&*()_+-=[]{};:'\"\\|,.<>/?)"});
      return;
    } 
    else {
      this.setState({errorMessage: "Valid new password"});
    }

    const session_token = await AsyncStorage.getItem('session_token');
    const user_id = await AsyncStorage.getItem('user_id');
    const requestBody = { password: this.state.password };
    const response = await fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
      method: 'PATCH',
      headers: {
        'X-Authorization': session_token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    if (response.status === 200) {
      console.log("Password updated successfully");
    } else if (response.status === 401) {
      console.log('Unauthorized error');
      // kick them out ? 
    } else if (response.status === 403) {
      console.log('Forbidded');  
    } else if (response.status === 404) {
      console.log('User not found error');
    }else if (response.status === 500) {
      console.log('Server Error');
    } else {
      console.log('Something went wrong');
    }
  }


  render() {
    const { userInfo } = this.state;
    return (
      <View>
        {userInfo && (
          <>
            <Text>Your user details are shown below:</Text>
            <Text>User ID: {userInfo.user_id}</Text>
            <Text>First name: {userInfo.first_name}</Text>
            <Text>Last name: {userInfo.last_name}</Text>
            <Text>Email: {userInfo.email}</Text>
          </>
        )}
        
        <Text>To change your password enter a new one below: </Text>
        <TextInput placeholder=' New Password...' onChangeText={this.handlePasswordInput} value={this.state.password} secureTextEntry={true} />
        <TouchableOpacity
		      style={styles.buttonContainer}
            onPress={this.handleNewPassword}>
			  <Text style={styles.buttonText}>Update password</Text>
		    </TouchableOpacity>

        {this.state.errorMessage ? <Text>{this.state.errorMessage}</Text> : null} 
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



export default Profile;