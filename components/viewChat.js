import React, { Component } from 'react';
import {
  View, TextInput, Text, TouchableOpacity, FlatList,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import styles from '../styles/chatStyles';

class ViewChats extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.flatListRef = React.createRef();
    this.state = {
      chatId: null,
      errorMessage: '',
      chatName: '',
      updatedChatName: '',
      members: [],
      messages: [],
      draftMessages: [],
      newMessage: '',
      userId: '',
      editMessageId: null,
      isModalVisible: false,
      isMembersModalVisible: false,
      isDraftModalVisable: false,
    };
  }

  componentDidMount() {
    const {
      route: { params: { data } },
    } = this.props;
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.handleNewMessageAdded();
    });
    this.retrieveDraftMessages();
    this.setState({
      chatId: data,
    }, async () => {
      await this.viewChat();
      this.intervalId = setInterval(this.viewChat.bind(this), 5000);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.intervalId);
  }

  handleUpdateChatName = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId, updatedChatName } = this.state;
      // eslint-disable-next-line react/destructuring-assignment
      const { getChats } = this.props.route.params;
      if (!updatedChatName || updatedChatName.trim() === '') {
        this.setState({ errorMessage: 'Chat name cannot be blank' });
        return;
      }
      const body = {
        name: updatedChatName,
      };
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
        method: 'PATCH',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        getChats();
        this.setState({ errorMessage: 'Chat name has been updated' });
        this.setState({
          chatName: updatedChatName,
          updatedChatName: '',
        });
      } else if (response.status === 401) {
        const { navigation } = this.props;
        console.log('Unauthorized error');
        navigation.navigate('Login');
      } else if (response.status === 500) {
        throw new Error('Server Error');
      }
    } catch (error) {
      console.error(error);
    }
    this.setState({ isModalVisible: false });
  };

  handleUpdateMessage = async (chatId, messageId, updatedMessage) => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      if (!updatedMessage || updatedMessage.trim() === '') {
        this.setState({ errorMessage: 'Message cannot be blank' });
        return;
      }
      const body = {
        message: updatedMessage,
      };
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'PATCH',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        this.setState({ errorMessage: 'Message has been updated' });
        this.viewChat();
        this.setState({ updatedMessage: '' });
      } else if (response.status === 401) {
        const { navigation } = this.props;
        console.log('Unauthorized error');
        navigation.navigate('Login');
      } else if (response.status === 500) {
        throw new Error('Server Error');
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleNewMessage = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId, newMessage } = this.state;
      // console.log(newMessage);
      if (!newMessage || !newMessage.trim()) {
        this.setState({ errorMessage: 'Please enter a message' });
        return;
      }
      const body = {
        message: newMessage,
      };
      await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      console.log('Message Sent');
      await this.viewChat();
      this.handleNewMessageAdded();
      this.setState({
        errorMessage: 'Message Sent',
        newMessage: '',
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  handleDeleteMessage = async (messageId) => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId } = this.state;
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        this.setState({ errorMessage: 'Message Deleted' });
        await this.viewChat();
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

  handleNewMessageAdded = () => {
    this.flatListRef.current.scrollToEnd({ animated: true });
  };

  handleSaveDraft = async () => {
    const { newMessage, chatId } = this.state;
    if (newMessage.trim() === '') {
      this.setState({ errorMessage: 'Message cannot be blank' });
      return;
    }
    try {
      const savedMessages = await AsyncStorage.getItem('draftMessages');
      let draftMessages = {};
      if (savedMessages) {
        draftMessages = JSON.parse(savedMessages);
      }
      if (!draftMessages[chatId]) {
        draftMessages[chatId] = [];
      }
      const messageIndex = draftMessages[chatId].indexOf(newMessage);
      if (messageIndex !== -1) {
        draftMessages[chatId][messageIndex] = newMessage;
      } else {
        draftMessages[chatId].push(newMessage);
      }

      await AsyncStorage.setItem('draftMessages', JSON.stringify(draftMessages));
      this.setState({ errorMessage: 'Message saved to drafts', newMessage: '' });
      this.retrieveDraftMessages();
    } catch (error) {
      this.setState({ errorMessage: 'Something went wrong' });
    }
  };

  deleteDraftMessage = async (message) => {
    try {
      const { chatId } = this.state;
      const savedMessages = await AsyncStorage.getItem('draftMessages');
      let draftMessages = {};
      if (savedMessages) {
        draftMessages = JSON.parse(savedMessages);
      }
      if (draftMessages[chatId]) {
        const messageIndex = draftMessages[chatId].indexOf(message);
        if (messageIndex !== -1) {
          draftMessages[chatId].splice(messageIndex, 1); // Remove the draft message
          await AsyncStorage.setItem('draftMessages', JSON.stringify(draftMessages));
          this.setState({ draftMessages: draftMessages[chatId] });
        }
      }
    } catch (error) {
      console.error('Error deleting draft message:', error);
    }
  };

  editDraftMessage = (message) => {
    this.setState({
      isDraftModalVisable: false,
      errorMessage: 'Edit you message in the input box',
      newMessage: message,
    });
  };

  // extention task 2 unused code
  // eslint-disable-next-line react/no-unused-class-component-methods
  handleScheduleDraftMessage = async (message, scheduledTime) => {
    this.setState({ isDraftModalVisable: false, newMessage: message });
    const draftMessage = {
      message,
      scheduledTime,
    };
    try {
      const savedMessages = await AsyncStorage.getItem('draftMessages');
      let draftMessages = [];
      if (savedMessages) {
        draftMessages = JSON.parse(savedMessages);
      }
      draftMessages.push(draftMessage);
      await AsyncStorage.setItem('draftMessages', JSON.stringify(draftMessages));
      this.setState({ errorMessage: 'Message scheduled', newMessage: '' });
      this.retrieveDraftMessages();
    } catch (error) {
      this.setState({ errorMessage: 'Something went wrong' });
    }
  };

  retrieveDraftMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('draftMessages');
      if (savedMessages) {
        const draftMessages = JSON.parse(savedMessages);
        const { chatId } = this.state;
        if (draftMessages[chatId]) {
          this.setState({ draftMessages: draftMessages[chatId] });
        } else {
          this.setState({ draftMessages: [] });
        }
      } else {
        this.setState({ draftMessages: [] });
      }
    } catch (error) {
      console.error('Error retrieving draft messages:', error);
    }
  };

  handleSendDraftMessage = async (message) => {
    this.setState({ isDraftModalVisable: false, newMessage: message });
    await this.handleNewMessage();
    this.handleNewMessageAdded();
    this.deleteDraftMessage(message);
  };

  async viewChat() {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const userId = await AsyncStorage.getItem('userId');
    this.setState({ userId });
    const { chatId } = this.state;
    const { navigation } = this.props;
    return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          const data = await response.json();
          // console.log(data);
          this.setState({
            chatName: data.name,
            members: data.members,
            messages: data.messages,
          });
          return data;
        }
        if (response.status === 401) {
          console.log('Unauthorized error');
          navigation.navigate('Login');
          return null;
        }
        if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          navigation.navigate('Chats');
          this.setState({ errorMessage: 'Something went wrong' });
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  render() {
    const {
      errorMessage,
      chatName,
      members,
      messages,
      draftMessages,
      newMessage,
      updatedChatName,
      chatId,
      userId,
      editMessageId,
      updatedMessage,
      isModalVisible,
      isMembersModalVisible,
      isDraftModalVisable,
    } = this.state;
    const messageList = messages.slice().reverse();
    const { navigation } = this.props;
    return (
      <View style={styles.background}>
        <View style={styles.container}>
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <Modal visible={isModalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Chat Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter new chat name"
                  value={updatedChatName}
                  onChangeText={(text) => this.setState({ updatedChatName: text })}
                />
                <TouchableOpacity style={styles.saveButton} onPress={this.handleUpdateChatName}>
                  <Text style={styles.saveButtonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => this.setState({ isModalVisible: false })}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.chatNameContainer}>
            <Text style={styles.title}>{chatName}</Text>
            <View style={styles.changeNameContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.setState({ isModalVisible: true })}
              >
                <Text style={styles.buttonText}>Update Chat Name</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            visible={isMembersModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => this.setState({ isMembersModalVisible: false })}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalMemberContent}>
                <Text style={styles.modalTitle}>Members</Text>
                <FlatList
                  data={members}
                  renderItem={({ item }) => (
                    <Text key={item.user_id} style={styles.member}>
                      {item.first_name}
                      {' '}
                      {item.last_name}
                    </Text>
                  )}
                />
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => this.setState({ isMembersModalVisible: false })}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            visible={isDraftModalVisable}
            animationType="slide"
            transparent
            onRequestClose={() => this.setState({ isDraftModalVisable: false })}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalMemberContent}>
                <Text style={styles.modalTitle}>Draft Messages</Text>
                {draftMessages.map((message) => (
                  <View key={message.id} style={styles.draftContainer}>
                    <View style={styles.draftMsgContainer}>
                      <Text style={styles.messageText}>{message}</Text>
                    </View>
                    <View style={styles.draftButtonContainer}>

                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => this.handleSendDraftMessage(message)}
                      >
                        <Text style={styles.sendButtonText}>Send</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => this.editDraftMessage(message)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => this.deleteDraftMessage(message)}
                      >
                        <Text style={styles.sendButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => this.setState({ isDraftModalVisable: false })}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>

              </View>
            </View>
          </Modal>

          <Text style={styles.sectionTitle}>
            Members (
            {members.length}
            )
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.leftButtonContainer2}
              onPress={() => this.setState({ isMembersModalVisible: true })}
            >
              <Text style={styles.buttonText}>View Members</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.leftButtonContainer}
              onPress={() => navigation.navigate('AddToChat', { data: chatId, viewChat: this.viewChat.bind(this) })}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rightButtonContainer}
              onPress={() => navigation.navigate('RemoveFromChat', { chatId, members, viewChat: this.viewChat.bind(this) })}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.leftButtonContainer2}
              onPress={() => this.setState({ isDraftModalVisable: true })}
            >
              <Text style={styles.buttonText}>Drafts</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Messages</Text>

          <View style={{ flex: 1, maxHeight: 500, backgroundColor: '#dedede' }}>

            <FlatList
              ref={this.flatListRef}
              style={{ flex: 1, marginBottom: 60 }}
              contentContainerStyle={styles.messageContainer}
              data={messageList}
              keyExtractor={(message) => message.message_id}
              renderItem={({ item: message }) => {
                const isSentByUser = userId === String(message.author.user_id);
                const bubbleColor = isSentByUser ? '#09eb5c' : '#67c5f5';
                const textAlign = isSentByUser ? 'left' : 'right';

                return (
                  <View key={message.message_id}>
                    <View
                      style={{
                        backgroundColor: bubbleColor,
                        borderRadius: 20,
                        padding: 10,
                        marginLeft: isSentByUser ? 50 : 10,
                        marginBottom: 10,
                        marginRight: isSentByUser ? 10 : 50,
                        alignSelf: textAlign,
                        maxWidth: '80%',
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>
                        {message.author.first_name}
                        ,
                        {' '}
                        {message.author.last_name}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                        {message.message}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#4d4d4d', textAlign: 'right' }}>
                        {new Date(message.timestamp).toLocaleString()}
                      </Text>
                      {isSentByUser && (
                      <View style={{ flexDirection: 'row' }}>
                        {editMessageId === message.message_id ? (
                          <TouchableOpacity
                            onPress={() => this.handleUpdateMessage(message.message_id)}
                            style={{ position: 'absolute', top: 5, right: 50 }}
                          >
                            <Text style={{ color: 'blue', fontSize: 20, fontWeight: 'bold' }} />
                          </TouchableOpacity>
                        ) : (
                          <Icon
                            name="edit"
                            type="font-awesome"
                            onPress={() => this.setState({ editMessageId: message.message_id })}
                            containerStyle={{ position: 'absolute', top: -65, right: 30 }}
                            size={20}
                            color="blue"
                          />
                        )}

                        <Icon
                          name="close"
                          type="material-community"
                          onPress={() => this.handleDeleteMessage(message.message_id)}
                          containerStyle={{ position: 'absolute', top: -65, right: 5 }}
                          size={20}
                          color="red"
                        />
                      </View>
                      )}

                    </View>
                  </View>
                );
              }}
              onContentSizeChange={() => this.flatListRef.current.scrollToEnd({ animated: true })}
              onLayout={() => this.flatListRef.current.scrollToEnd({ animated: true })}
            />

            <View style={{
              position: 'absolute', bottom: 2, left: 0, right: 0, padding: 10, backgroundColor: '', flexDirection: 'row',
            }}
            >
              <TextInput
                placeholder="Enter message"
                value={newMessage}
                onChangeText={(text) => this.setState({ newMessage: text })}
                style={{
                  borderWidth: 1, borderColor: '#000', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 10, flex: 1, marginRight: 3,
                }}
              />
              <TouchableOpacity
                onPress={this.handleNewMessage}
                style={{
                  backgroundColor: '#67c5f5', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#67c5f5', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10,
                }}
                onPress={this.handleSaveDraft}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            visible={editMessageId !== null}
            animationType="slide"
            transparent
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update a message</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter new message"
                  value={updatedMessage}
                  onChangeText={(text) => this.setState({ updatedMessage: text })}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    this.handleUpdateMessage(chatId, editMessageId, updatedMessage);
                    this.setState({ editMessageId: null });
                  }}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => this.setState({ editMessageId: null })}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

export default ViewChats;
