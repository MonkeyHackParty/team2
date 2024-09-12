import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface PostData {
  thumbnail: string | null;
  title: string;
  description: string;
}

const CreatePost: React.FC = () => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setThumbnail(result.uri);
    }
  };

  const handleSubmit = () => {
    const postData: PostData = {
      thumbnail,
      title,
      description,
    };
    console.log('Post Data:', postData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter post title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter post description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Thumbnail:</Text>
      {thumbnail ? (
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      ) : (
        <Button title="Pick a thumbnail" onPress={pickImage} />
      )}

      <Button title="Submit Post" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default CreatePost;
