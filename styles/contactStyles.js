import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
  errorMessage: {
    backgroundColor: 'lightblue',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  header2: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
  },
  icon: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    flex: 2,
  },
  addButton: {
    backgroundColor: 'green',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  close: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
    borderColor: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    maxHeight: 500,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
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
