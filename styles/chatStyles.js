import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  background: {
    flex: 1,
    backgroundColor: 'lightblue',
    padding: 10,
  },
  messageContainer: {
    flex: 1,
    maxHeight: 560,
    padding: 10,
  },
  errorMessage: {
    backgroundColor: 'lightblue',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,

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
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  changeNameContainer: {
    justifyContent: 'flex-end',
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
  leftButtonContainer2: {
    backgroundColor: '#337ab7',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  membersButtonContainer: {
    backgroundColor: '#ad1010',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    backgroundColor: '#337ab7',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
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
  modalTitle: {
    fontWeight: 'bold',
  },
  draftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#66bb6a',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#42a5f5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ef5350',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#bdbdbd',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalMemberContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  draftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageText: {
    marginRight: 10,
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chatItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  chatId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // chatName: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
});
