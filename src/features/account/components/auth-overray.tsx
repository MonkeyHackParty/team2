import React, { useState } from 'react';
import { Modal, View, TextInput, Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firebaseConfig } from '../../../lib/firebase';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

interface AuthOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const AuthOverlay = ({ isVisible, onClose }: AuthOverlayProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('メールアドレスとパスワードを入力してください。');
      return;
    }

    setLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      resetFields();
      onClose();
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          setErrorMessage('無効なメールアドレスです。');
          break;
        case 'auth/user-disabled':
          setErrorMessage('このアカウントは無効化されています。');
          break;
        case 'auth/user-not-found':
          setErrorMessage('メールアドレスまたはパスワードが間違っています。');
          break;
        case 'auth/wrong-password':
          setErrorMessage('メールアドレスまたはパスワードが間違っています。');
          break;
        default:
          setErrorMessage('ログインに失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      setErrorMessage('メールアドレスとパスワードを入力してください。');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        await firebase.firestore().collection('users').doc(user.uid).set({
          myboard: [],
          bookmark: []
        });

        resetFields();
        onClose();
      }
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage('このメールアドレスは既に使用されています。');
          break;
        case 'auth/invalid-email':
          setErrorMessage('無効なメールアドレスです。');
          break;
        case 'auth/weak-password':
          setErrorMessage('パスワードは6文字以上である必要があります。');
          break;
        default:
          setErrorMessage('新規登録に失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{isLogin ? 'ログイン' : '新規登録'}</Text>

          <TextInput
            style={styles.input}
            placeholder="メールアドレス"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="パスワード"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={isLogin ? handleLogin : handleSignUp}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>{isLogin ? 'ログイン' : '新規登録'}</Text>}
          </Pressable>

          <Pressable style={styles.toggle} onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleText}>
              {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={() => { resetFields(); onClose(); }}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>キャンセル</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  toggle: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#334155',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#334155',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#334155', 
  },
});

export default AuthOverlay;
