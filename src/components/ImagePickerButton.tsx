import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ImagePickerButtonProps {
  addImages: (images: { uri: string; name: string }[]) => void;
}

const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({ addImages }) => {
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => ({
        uri: asset.uri,
        name: "default_name_" + new Date().getTime() + ".jpg",
      }));
      addImages(uris);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = {
        uri: result.assets[0].uri,
        name: "photo_" + new Date().getTime() + ".jpg",
      };
      addImages([newImage]);
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={pickImages}>
        {/* テキストは <Text> で囲む必要があります */}
        <Text style={styles.buttonText}>Pick images</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        {/* テキストは <Text> で囲む必要があります */}
        <Text style={styles.buttonText}>Take photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row", // ボタンを横並びに配置
    justifyContent: "center", // ボタンを中央に配置
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#555555", // ボタンの色を暗い灰色に設定
    paddingVertical: 12,
    borderRadius: 8,
    width: 120, // ボタンの横幅を小さく設定
    marginHorizontal: 10, // ボタンの間にスペースを追加
  },
  buttonText: {
    color: "white", // テキストの色を白に設定
    fontWeight: "bold",
    fontSize: 14, // テキストサイズを小さく調整
    textAlign: "center", // テキストを中央に配置
  },
});

export default ImagePickerButton;
