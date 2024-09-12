import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

interface TagInputProps {
  onTagsChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ onTagsChange }) => {
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const addTag = () => {
    if (tag && !tags.includes(tag)) {
      const updatedTags = [...tags, tag];
      setTags(updatedTags);
      onTagsChange(updatedTags);
      setTag('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={tag}
        onChangeText={setTag}
        placeholder="Enter tag"
      />
      <Button title="Add Tag" onPress={addTag} />
      <FlatList
        data={tags}
        renderItem={({ item }) => <Text style={styles.tag}>{item}</Text>}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginBottom: 10,
  },
  tag: {
    padding: 5,
    backgroundColor: '#e0e0e0',
    marginVertical: 2,
  },
});

export default TagInput;
