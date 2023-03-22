import React, { Component } from 'react';

import {
  View, TextInput,
} from 'react-native';

class Contacts extends Component {
  static navigationOptions = {
    header: null,
  };

  // addContacts = () => {
  //   // pass user ID of person they want to friend request
  //   return fetch("http://localhost:3333/api/1.0.0/user/{user_id}/contacts", {
  //     method: 'post'
  //   })
  //   .then((response) => {
  //     if(response.status === 200){
  //       return response.json()
  //     }
  //     else if (response.status === 400){
  //       throw 'You cant add yourself';
  //     }
  //     else if (response.status === 401){
  //       throw 'Unauthorised';
  //     }
  //     else if (response.status === 404){
  //       throw 'Not found';
  //     }
  //     else if (response.status === 500){
  //       throw 'Not found';
  //     }
  //     else{
  //       throw 'Something went wrong';
  //     }
  //   })
  // }

  // test render just to return output
  render() {
    return (
      <View>
        <TextInput placeholder="Test" />

      </View>
    );
  }
}

export default Contacts;
