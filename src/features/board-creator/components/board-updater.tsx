import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Modal, Text, TouchableOpacity, Switch, ActivityIndicator, SafeAreaView } from 'react-native';
import { InputField, CreateButton, TagInput, ThumbnailUploader } from '../';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/compat/app';
import { collection, updateDoc, doc, getDoc, serverTimestamp, setDoc, deleteDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

interface BoardUpdaterProps {
  visible: boolean;
  onClose: () => void;
  boardID: string;
  onUpdateSuccess?: () => void; 
}

const BoardUpdater = ({ visible, onClose, boardID, onUpdateSuccess }: BoardUpdaterProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          setError('ログイン情報が無効です');
          return;
        }
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        const myboard = userDoc.data()?.myboard || [];
        const boardData = myboard.find((item: any) => item.boardID === boardID);

        if (boardData) {
          setTitle(boardData?.title || '');
          setDescription(boardData?.description || '');
          setTags(boardData?.tags || []);
          setThumbnail(boardData?.base64 || null);
          setIsPublic(!!boardData?.isPublic);
        } else {
          setError('ボードが見つかりません');
        }
      } catch (error) {
        console.error('Error fetching board data: ', error);
        setError('ボードのデータ取得中にエラーが発生しました');
      }
    };

    if (user && boardID) {
      fetchBoardData();
    }
  }, [user, boardID]);

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

  const handleUpdateBoard = async () => {
    try {
      setIsLoading(true); 

      if (!user) {
        setError('ログイン情報が無効です');
        setIsLoading(false);
        return;
      }
      if (!title || !thumbnail) {
        setError('タイトルとサムネイルは必須です');
        setIsLoading(false);
        return;
      }
      setError("");
      const base64 = thumbnail;
      const currentDate = new Date();
      const boardData = {
        title,
        description,
        tags,
        base64,
        uploadDate: firebase.firestore.Timestamp.fromDate(currentDate),
        isPublic,
      };

      const userDocRef = doc(firebase.firestore(), `users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const myboard = userData?.myboard || [];

      const updatedMyboard = myboard.map((board: any) =>
        board.boardID === boardID ? { ...board, ...boardData } : board
      );

      await updateDoc(userDocRef, { myboard: updatedMyboard });

      if (isPublic) {
        const publicBoardRef = doc(firebase.firestore(), `publicboard/${boardID}`);
        await setDoc(publicBoardRef, boardData);
      } else {
        const publicBoardRef = doc(firebase.firestore(), `publicboard/${boardID}`);
        await deleteDoc(publicBoardRef);
      }

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error updating board: ', error);
      setError('ボードの更新中にエラーが発生しました');
    } finally {
      setIsLoading(false); 
    }
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <InputField
              label="タイトル"
              value={title}
              onChangeText={setTitle}
              placeholder="Board Title"
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
            <TagInput tags={tags} setTags={setTags}/> 
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
          {isLoading && <ActivityIndicator size="large" color="#334155" style={styles.loader} />}
          <CreateButton onPress={handleUpdateBoard} text="更新" /> 
          <TouchableOpacity style={styles.closeButton} onPress={onClose} disabled={isLoading}>
            <Text style={styles.closeButtonText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default BoardUpdater;
