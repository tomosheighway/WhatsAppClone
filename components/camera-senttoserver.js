/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
import {
  Camera, CameraType,
} from 'expo-camera';
import React, { useState, useEffect } from 'react';

import {
  Text, TouchableOpacity, View, StyleSheet, Modal, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/cameraStyles';

export default function CameraSendToServer({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = useState(null); // Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [photoData, setPhotoData] = useState(null);

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

  async function sendPhotoToServer(data) {
    setPhotoData(data);
    setShowModal(true);
  }

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

  function handleConfirmation(confirm) {
    setShowModal(false);
    if (confirm) {
      sendToServer(photoData);
    }
  }
  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log('Camera: ', type);
  }

  async function takePhoto() {
    if (camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => sendPhotoToServer(data),
      };
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
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <Image source={{ uri: photoData && photoData.uri }} style={styles.modalImage} />

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => handleConfirmation(true)}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleConfirmation(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Camera>
    </View>
  );
}
