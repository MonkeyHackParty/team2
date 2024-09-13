import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import ImagePickerButton from "./src/components/ImagePickerButton";
import ImageBoard from "./src/components/ImageBoard";

export default function App() {
  const [images, setImages] = useState<{ uri: string; name: string }[]>([]);

  const addImages = (newImages: { uri: string; name: string }[]) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const updateImageName = (index: number, newName: string) => {
    const updatedImages = [...images];
    updatedImages[index].name = newName;
    setImages(updatedImages);
  };

  return (
    <View style={styles.container}>
      {/* テキストにマージンを追加 */}
      <Text style={styles.headerText}>
        Pick or take a photo and give it a name!
      </Text>
      <ImagePickerButton addImages={addImages} />
      <ImageBoard images={images} updateImageName={updateImageName} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 18, // 文字サイズ（必要に応じて調整）
    marginTop: 40, // テキストの上のマージンを追加
    marginBottom: 20, // 下のスペースを調整
    textAlign: "center", // テキストを中央揃え
  },
});
