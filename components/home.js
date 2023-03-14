import React, { Component } from 'react';
import { StyleSheet, View, Text,TextInput,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component {
    static navigationOptions = {
        header: null
      };
    // home page for main app navigation 
    // tab nav to seperate pages 
    // need add logout button on one the pages as currecntly to logout you have to deleate values from async. 

      componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        })
      }
      componentWillUnmount(){
        this.unsubscribe();
      }
      checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('session_token');
        if (value == null) {
            this.props.navigation.navigate('Login')
        }
      }

      async logout(){
        console.log("logout")
        return fetch("http://localhost:3333/api/1.0.0/logout",{
            method: "POST",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("session_token")
            }
        })
        .then(async (response) => {
            if(response.status ===200){
                await AsyncStorage.removeItem("session_token")
                await AsyncStorage.removeItem("user_id")
                //this.props.navigation.navigate('Login')
                //this.checkLoggedIn
            } else if (response.status === 401){
                console.log("Unauthroised")
                await AsyncStorage.removeItem("session_token")
                await AsyncStorage.removeItem("user_id")
                //this.props.navigation.navigate('Login')
                //this.checkLoggedIn
            } else {
                throw "something went wrong "
            }
        })
        .catch((error) =>{
            console.log("catch error ", error)
        })
      }




    //test render just to return output
    render() {
        return (
          <View>
            <TextInput placeholder='Test' />
            
            <TouchableOpacity
		        style={styles.buttonContainer}
                onPress={this.logout}>
			    <Text style={styles.buttonText}>Logout</Text>
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
export default Home