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
    paddingHorizontal: 15,
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
  modalTitle: {
    fontWeight: 'bold',
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
    marginRight: 50,
  },
  sendButton: {
    textAlign: 'right',
  },
});
