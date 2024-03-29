import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem } from 'react-native-elements';
import styles from '../styles/chatStyles';

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

  handleRemoveUserFromChat = async (userId) => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId, members } = this.state;
      // eslint-disable-next-line react/destructuring-assignment
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
    const { errorMessage, members } = this.state;
    return (
      <View style={styles.background}>
        <View style={styles.container}>
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          <FlatList
            data={members}
            keyExtractor={(member) => member.user_id.toString()}
            renderItem={({ item: member }) => (
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>
                    {member.first_name}
                    {' '}
                    {member.last_name}
                  </ListItem.Title>
                  <ListItem.Subtitle>{member.email}</ListItem.Subtitle>
                </ListItem.Content>
                <TouchableOpacity onPress={() => this.handleRemoveUserFromChat(member.user_id)}>
                  <Text>Remove user</Text>
                </TouchableOpacity>
              </ListItem>
            )}
          />
        </View>
      </View>
    );
  }
}

export default RemoveFromChat;
