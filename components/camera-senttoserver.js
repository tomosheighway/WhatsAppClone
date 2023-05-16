/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
import {
  Camera, CameraType,
} from 'expo-camera';
import React, { useState, useEffect } from 'react';

import {
  Text, TouchableOpacity, View, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
    backgroundColor: 'steelblue',
  },
  button: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ddd',
  },
});

export default function CameraSendToServer({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = useState(null); // Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    const getPer = async () => {
      console.log('here');
      const per = await Camera.requestCameraPermissionsAsync();
      requestPermission(per);
    };
    getPer();
    // const per = Camera.useCameraPermissions();
    // requestPermission(per);
  }, []);

  async function sendToServer(data) {
    // network request here
    console.log('HERE', data.uri);
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const userId = await AsyncStorage.getItem('userId');

    const res = await fetch(data.uri);
    const blob = await res.blob();

    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${userId}/photo`,
        {
          method: 'POST',
          headers: {
            'X-Authorization': sessionToken,
            'Content-Type': 'image/png',
          },
          body: blob,
        },
      );

      console.log('picture added', response);
      navigation.navigate('Profile');
    } catch (err) {
      console.log(err);
    }
  }

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log('Camera: ', type);
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data) };
      const data = await camera.takePictureAsync(options);
    }
  }
  console.log(permission);
  if (!permission || !permission.granted) {
    return (<Text>No access to camera</Text>);
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
