// /screens/BoardCreator.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import TagInput from '../components/TagInput';
import ThumbnailUploader from '../components/ThumbnailUploader';
import CreateButton from '../components/CreateButton';
import * as ImagePicker from 'expo-image-picker';

const BoardCreator = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleThumbnailUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
    }
  };

  const handleCreateBoard = () => {
    // ボード作成ロジック
    console.log({ title, description, tags, thumbnail });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <InputField
        label="タイトル"
        value={title}
        onChangeText={setTitle}
        placeholder="New Board"
      />
      <InputField
        label="説明"
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        multiline
        numberOfLines={4}
      />
      <TagInput tags={tags} setTags={setTags} />
      <ThumbnailUploader thumbnail={thumbnail} onUpload={handleThumbnailUpload} />
      <CreateButton onPress={handleCreateBoard} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default BoardCreator;
