import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 8,
    margin: 5,
    backgroundColor: 'black',
    borderRadius: 5,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'steelblue',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
