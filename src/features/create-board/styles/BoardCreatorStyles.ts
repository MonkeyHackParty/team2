import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
  },
  thumbnail: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  addTagButton: {
    backgroundColor: '#000',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  addTagText: {
    color: '#fff',
    fontSize: 18,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
  },
});

export default styles;
