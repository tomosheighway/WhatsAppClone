import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  messageContainer: {
    flex: 1,
    maxHeight: 560,
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 5,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
  },
  scroll: {
    maxHeight: 60,
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
  },
  button: {
    padding: 10,
    backgroundColor: '#337ab7',
    color: '#fff',
    textAlign: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  chatNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 10,
  },
  member: {
    marginBottom: 10,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  leftButtonContainer: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  rightButtonContainer: {
    backgroundColor: '#ad1010',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  // buttonContainer: {
  //   padding: 10,
  //   backgroundColor: '#337ab7',
  //   borderRadius: 5,
  //   marginBottom: 10,
  // },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },

  membersHeadContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  membersContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  membersButtonContainer: {
    backgroundColor: '#007AFF',
    paddingTop: 20,
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  background: {
    flex: 1,
    backgroundColor: 'lightblue',
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#EFEFF4',
    borderRadius: 5,
    padding: 10,
  },
  cancelButtonText: {
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
