import React, { Component } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // getting user details ------
  async componentDidMount() {
    const userInfo = await this.getUserInfo();
    if (userInfo) {
      console.log(userInfo);
      this.setState({ userInfo });
    } else {
      this.setState({ errorMessage: 'Something went wrong' });
    }
  }

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

  // not working when trying to return
  // async getUserProfilePhoto() {
  //   const sessionToken = await AsyncStorage.getItem('sessionToken');
  //   const userId = await AsyncStorage.getItem('userId');

  //   return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
  //     method: 'GET',
  //     headers: {
  //       'X-Authorization': sessionToken,
  //       Accept: 'image/png',
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then(async (response) => {
  //       if (response.status === 200) {
  //         const blob = await response.blob();
  //         const photoUrl = URL.createObjectURL(blob);
  //         return photoUrl;
  //       }
  //       if (response.status === 401) {
  //         const { navigation } = this.props;
  //         console.log('Unauthorized error');
  //         navigation.navigate('Login');
  //         return null;
  //       }
  //       if (response.status === 404) {
  //         throw new Error('Not found ');
  //       } else if (response.status === 500) {
  //         throw new Error('Server Error');
  //       } else {
  //         throw new Error('Something went wrong');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       return null;
  //     });
  // }

  getProfileImage = async () => {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const userId = await AsyncStorage.getItem('userId');
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'image/png',
        'Content-Type': 'image/png',
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          // isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const {
      userInfo, errorMessage, photo,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View>
        {userInfo && (
          <>
            <Text>Your user details are shown below:</Text>
            <Text>
              User ID:
              {' '}
              {userInfo.user_id}
            </Text>
            <Text>
              First name:
              {' '}
              {userInfo.first_name}
            </Text>
            <Text>
              Last name:
              {' '}
              {userInfo.last_name}
            </Text>
            <Text>
              Email:
              {' '}
              {userInfo.email}
            </Text>

            {/* NOT WORKING  */}
            {photo && (
            <Image
              source={{
                uri: photo,
              }}
            />
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('UpdateProfile', { data: userInfo })}
        >
          <Text style={styles.buttonText}>Update User details</Text>
        </TouchableOpacity>

        {errorMessage ? <Text>{errorMessage}</Text> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ebebeb',
  },
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    backgroundColor: '#222',
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
});

export default Profile;
