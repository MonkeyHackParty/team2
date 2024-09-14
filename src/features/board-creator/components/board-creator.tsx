import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Modal, Text, TouchableOpacity, Switch } from 'react-native';
import { InputField, CreateButton, TagInput, ThumbnailUploader } from '../';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import firebase from 'firebase/compat/app';
import { collection, updateDoc, doc, serverTimestamp, FieldValue, setDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import * as ImageManipulator from 'expo-image-manipulator';

interface BoardCreatorProps {
  visible: boolean;
  onClose: () => void;
}

const BoardCreator = ({ visible, onClose }: BoardCreatorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleThumbnailUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;

      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          uri,
          [],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } 
        );
        const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setThumbnail(`data:image/jpeg;base64,${base64}`);
      } catch (error) {
        console.error('Error encoding image to base64: ', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleCreateBoard = async () => {
    try {
      if (!user) {
        setError('ログイン情報が無効です');
        return;
      }
      if (!title || !thumbnail) {
        setError('タイトルとサムネイルは必須です');
        return;
      }
      setError("");
      const boardID = Crypto.randomUUID();
      const base64 = thumbnail;
      const currentDate = new Date();
      const boardData = {
        boardID,
        title,
        description,
        tags,
        base64,
        uploadDate: firebase.firestore.Timestamp.fromDate(currentDate),
      };
      const userDocRef = doc(firebase.firestore(), `users/${user.uid}`);
      await updateDoc(userDocRef, {
        myboard: firebase.firestore.FieldValue.arrayUnion(boardData),
      });
      
      if (isPublic) {
        const publicBoardRef = doc(firebase.firestore(), `publicboard/${boardID}`);
        await setDoc(publicBoardRef, boardData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating board: ', error);
      setError('ボードの作成中にエラーが発生しました');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <View style={styles.modalBackground}>
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              <InputField
                label="タイトル"
                value={title}
                onChangeText={setTitle}
                placeholder="New Board"
                topAlignment={false}
              />
              <InputField
                label="メモ"
                value={description}
                onChangeText={setDescription}
                placeholder="Memo"
                multiline
                numberOfLines={4}
                topAlignment={true}
              />
              <Text style={styles.label}>タグ</Text>
              <TagInput tags={tags} setTags={setTags} />
              <ThumbnailUploader thumbnail={thumbnail} onUpload={handleThumbnailUpload} />

              <View style={styles.switchContainer}>
                <Text style={styles.label}>公開する</Text>
                <Switch
                  value={isPublic}
                  onValueChange={setIsPublic}
                  thumbColor={isPublic ? '#f4f3f4' : '#f4f3f4'}
                  trackColor={{ false: '#767577', true: '#334155' }}
                />
              </View>
            </ScrollView>

            {error && <Text style={styles.errorText}>{error}</Text>}
            <CreateButton onPress={handleCreateBoard} text="作成"/>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  content: {
    paddingVertical: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#334155',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    fontSize: 14,
  },
});

export default BoardCreator;
