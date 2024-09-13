import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

const BoardCreator = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleCreateBoard = () => {
    // ボードを作成するロジックをここに追加
    console.log({ title, description, tags, thumbnail });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>BOARD SETTING</Text>
      
      {/* タイトル入力 */}
      <Text style={styles.label}>タイトル</Text>
      <TextInput
        style={styles.input}
        placeholder="New Board"
        value={title}
        onChangeText={setTitle}
      />

      {/* 説明入力 */}
      <Text style={styles.label}>説明</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
      />

      {/* タグ追加 */}
      <Text style={styles.label}>タグ</Text>
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

      {/* サムネイル */}
      <Text style={styles.label}>サムネイル</Text>
      <TouchableOpacity style={styles.thumbnail}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.thumbnailImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text>Upload Thumbnail</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Make Board ボタン */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateBoard}>
        <Text style={styles.createButtonText}>Make Board</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
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
  createButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BoardCreator;
