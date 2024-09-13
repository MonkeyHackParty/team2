import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import LogoutModal from './logout-modal';
import AuthOverlay from './auth-overray'; 

const AccountIcon = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notLoggedInVisible, setNotLoggedInVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserInfo(user);
      } else {
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePress = () => {
    if (userInfo) {
      setModalVisible(true);
    } else {
      setNotLoggedInVisible(true);
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      setUserInfo(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        {userInfo ? (
          <>
            <Image
              source={require('../images/logout.png')}
              style={styles.icon}
            />
          </>
        ) : (
          <>
            <Image
              source={require('../images/login.png')}
              style={styles.icon}
            />
          </>
        )}
      </TouchableOpacity>
      <LogoutModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLogout={handleLogout}
      />
      <AuthOverlay
        isVisible={notLoggedInVisible}
        onClose={() => setNotLoggedInVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AccountIcon;
