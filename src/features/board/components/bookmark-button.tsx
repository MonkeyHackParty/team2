import React, { useState, useEffect } from "react";
import { TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

interface BookmarkButtonProps {
  boardID: string;
}

const BookmarkButton = ({ boardID }: BookmarkButtonProps): JSX.Element => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        try {
          const userDoc = await firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .get();

          const userBookmarks = userDoc.data()?.bookmark || [];
          setIsBookmarked(userBookmarks.includes(boardID));
        } catch (error) {
          console.error("Firestoreからのデータ取得エラー:", error);
        }
      }
    };

    checkBookmarkStatus();
  }, [boardID]);

  const handlePress = async () => {
    const user = firebase.auth().currentUser;
    if (!user) {
      Alert.alert("ログインが必要です");
      return;
    }

    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);

    try {
      const userDocRef = firebase.firestore().collection("users").doc(user.uid);

      if (newBookmarkState) {
        await userDocRef.update({
          bookmark: firebase.firestore.FieldValue.arrayUnion(boardID),
        });
      } else {
        await userDocRef.update({
          bookmark: firebase.firestore.FieldValue.arrayRemove(boardID),
        });
      }
    } catch (error) {
      console.error("Firestoreの更新エラー:", error);
      Alert.alert("エラーが発生しました");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Image
        style={styles.bookmarkIcon}
        source={
          isBookmarked
            ? require("../images/bookmark-active.png")
            : require("../images/bookmark.png")
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bookmarkButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
  },
  bookmarkIcon: {
    width: 24,
    height: 24,
  },
});

export default BookmarkButton;
