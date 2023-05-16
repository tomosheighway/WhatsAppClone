import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 20,
  },
  background: {
    flex: 1,
    backgroundColor: 'lightblue',
    padding: 10,
  },
  photoContainer: {
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 20,
  },
  photo: {
    width: 200,
    height: 200,
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsTitle: {
    marginBottom: 10,
  },
  details: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  detailsItem: {
    marginVertical: 5,
    fontSize: 16,
  },
  errorMessage: {
    backgroundColor: 'lightblue',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
