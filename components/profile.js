import React, { Component } from 'react';
import {
  View, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button } from 'react-native-elements';
import styles from '../styles/profileStyles';

class Profile extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  async componentDidMount() {
    const userInfo = await this.getUserInfo();
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.updateUserDetails();
    });
    if (userInfo) {
      console.log(userInfo);
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const userId = await AsyncStorage.getItem('userId');
      const photo = await this.getPhoto(userId, sessionToken);
      this.setState({ userInfo, photo });
    } else {
      this.setState({ errorMessage: 'Something went wrong' });
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // getting user details ------
  async getUserInfo() {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const userId = await AsyncStorage.getItem('userId');

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
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
          return data;
        }
        if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized error');
          navigation.navigate('Login');
          return null;
        }
        if (response.status === 404) {
          throw new Error('Not found ');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  async getPhoto() {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
        method: 'GET',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const blob = await response.blob();
        // let data = URL.createObjectURL(blob);
        // this.setState({
        //   photo: data,
        // })
        return window.URL.createObjectURL(blob);
      }
      if (response.status === 401) {
        const { navigation } = this.props;
        console.log('Unauthorized error');
        navigation.navigate('Login');
        return null;
      }
      if (response.status === 404) {
        throw new Error('Not found');
      }
      throw new Error('Something went wrong');
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('sessionToken');
    const { navigation } = this.props;
    if (value == null) {
      navigation.navigate('Login');
    }
  };

  // using to refresh the page data when returning from the profile page
  updateUserDetails = async () => {
    const userInfo = await this.getUserInfo();
    if (userInfo) {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const userId = await AsyncStorage.getItem('userId');
      const photo = await this.getPhoto(userId, sessionToken);
      this.setState({ userInfo, photo });
    } else {
      this.setState({ errorMessage: 'Something went wrong when updating ' });
    }
  };

  async logout() {
    console.log('logout');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('sessionToken'),
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem('sessionToken');
          await AsyncStorage.removeItem('userId');
          // this.props.navigation.navigate("Login")
          this.checkLoggedIn();
        } else if (response.status === 401) {
          console.log('Unauthroised error');
          await AsyncStorage.removeItem('sessionToken');
          await AsyncStorage.removeItem('userId');
          // this.props.navigation.navigate("Login")
          this.checkLoggedIn();
        } else {
          throw new Error('something went wrong');
        }
      })
      .catch((error) => {
        console.log('catch error: ', error);
      });
  }

  render() {
    const {
      userInfo, errorMessage, photo,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
        </View>
        {userInfo && (
          <View style={styles.detailsContainer}>
            <Text h4 style={styles.detailsTitle}>Your user details are shown below:</Text>
            <View style={styles.details}>
              <Text style={styles.detailsItem}>
                User ID:
                {' '}
                {userInfo.user_id}
              </Text>
              <Text style={styles.detailsItem}>
                First name:
                {' '}
                {userInfo.first_name}
              </Text>
              <Text style={styles.detailsItem}>
                Last name:
                {' '}
                {userInfo.last_name}
              </Text>
              <Text style={styles.detailsItem}>
                Email:
                {' '}
                {userInfo.email}
              </Text>
            </View>
          </View>
        )}
        <Button
          title="Update User details"
          containerStyle={{ marginVertical: 10 }}
          onPress={() => navigation.navigate('UpdateProfile', { data: userInfo, updateUserDetails: this.updateUserDetails })}
        />
        <Button
          title="Take a new profile photo"
          containerStyle={{ marginVertical: 10 }}
          onPress={() => navigation.navigate('CameraScreen', { updateUserDetails: this.updateUserDetails })}
        />
        <Button
          title="Logout"
          containerStyle={{ marginVertical: 10 }}
          onPress={() => {
            this.logout();
            this.checkLoggedIn();
          }}
        />
        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      </View>
    );
  }
}
export default Profile;
