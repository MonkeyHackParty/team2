import React, { useState, useEffect } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker"; // 画像選択とカメラ機能をインポート
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [image, setImage] = useState<string | null>(null); // 画像の状態を管理

  // カメラとライブラリのアクセス許可をリクエスト
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        alert(
          "Sorry, we need camera and library permissions to make this work!"
        );
      }
    })();
  }, []);

  // 画像ライブラリから画像を選択する関数
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // カメラを起動して写真を撮る関数
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Take a photo" onPress={takePhoto} />

      {/* 画像が選択された場合に表示 */}
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
