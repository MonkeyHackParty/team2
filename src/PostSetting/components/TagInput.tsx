// /components/TagInput.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagContainer}>
        <TextInput
          style={styles.tagInput}
          placeholder="Add New Tag"
          value={newTag}
          onChangeText={setNewTag}
        />
        <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
          <Text style={styles.addTagText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tagsList}>
        {tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default TagInput;
