import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import TagInput from './TagInput';

const PhotoUpload: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setImageUri(asset.uri);
        // エフェクターの名前を自動的にタグに追加（ここでは仮に"Default Effect"を使用）
        setTags([...tags, 'Default Effect']);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Photo" onPress={handleImageUpload} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TagInput onTagsChange={setTags} />
      <View style={styles.tagContainer}>
        {tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>{tag}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  tagContainer: {
    marginTop: 10,
  },
  tag: {
    padding: 5,
    backgroundColor: '#e0e0e0',
    marginVertical: 2,
  },
});

export default PhotoUpload;
