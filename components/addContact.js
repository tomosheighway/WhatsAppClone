import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
} from 'react-native';

import * as EmailValidator from 'email-validator';

class AddContacts extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errorMessage: '',
    };
  }

  handleAddContact = () => {
    const { email } = this.state;
    if (!EmailValidator.validate(email)) {
      this.setState({ errorMessage: 'Please enter a valid email address' });
      return;
    }
    console.log(`Email entered: ${email}`);
  };

  render() {
    const { errorMessage } = this.state;
    return (
      <View>
        <Text>Enter the email of a contact you wish to add</Text>
        <TextInput
          placeholder="Email...."
          onChangeText={(text) => this.setState({ email: text })}
        />

        <TouchableOpacity onPress={this.handleAddContact}>
          <Text>Add</Text>
        </TouchableOpacity>
        {errorMessage ? <Text>{errorMessage}</Text> : null}
      </View>
    );
  }
}

export default AddContacts;
