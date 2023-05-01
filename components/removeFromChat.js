import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class RemoveFromChat extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      members: [],
      chatId: null,
      errorMessage: '',
    };
  }

  async componentDidMount() {
    const {
      route: { params: { chatId, members } },
    } = this.props;
    this.setState({
      chatId,
      members,
    });
  }

  // #TODO
  // they are able to remove their own user from the chat - should they be able to?
  // this causes issue as once they are removed they are then unable to remove others
  // add in a redirect to avoid this

  handleRemoveUserFromChat = async (userId) => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId, members } = this.state;
      const { viewChat } = this.props.route.params;
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        console.log('User removed from chat ');
        this.setState({
          errorMessage: 'User removed from chat',
          members: members.filter((member) => member.user_id !== userId),
        });
        viewChat();
        // await this.viewChat();
      } else if (response.status === 400) {
        console.log('Bad Request');
        this.setState({ errorMessage: 'User already a member of the chat' });
      } else if (response.status === 401) {
        const { navigation } = this.props;
        console.log('Unauthorized error');
        navigation.navigate('Login');
      } else if (response.status === 403) {
        this.setState({ errorMessage: 'You can only delete your own messages!' });
        throw new Error('Forbidden');
      } else if (response.status === 500) {
        throw new Error('Server Error');
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  render() {
    const {
      chatId,
      errorMessage,
      members,
    } = this.state;
    return (
      <View>
        {errorMessage ? <Text>{errorMessage}</Text> : null}

        <Text>
          {' '}
          Chat ID
          {' '}
          { chatId }
          {' '}
        </Text>
        {members.map((member) => (
          <View key={member.user_id}>
            <Text>
              {member.first_name}
              {' '}
              {member.last_name}
              {' '}
              (
              {member.email}
              )
            </Text>
            <TouchableOpacity onPress={() => this.handleRemoveUserFromChat(member.user_id)}>
              <Text>Delete user</Text>
            </TouchableOpacity>
          </View>
        ))}

      </View>
    );
  }
}

export default RemoveFromChat;
