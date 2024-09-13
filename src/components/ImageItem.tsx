import React from "react";
import { View, Image, TextInput, StyleSheet } from "react-native";

interface ImageItemProps {
  uri: string;
  name: string;
  onNameChange: (newName: string) => void;
}

const ImageItem: React.FC<ImageItemProps> = ({ uri, name, onNameChange }) => {
  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri }} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Enter image name"
        value={name}
        onChangeText={onNameChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    margin: 15,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    width: 150,
    borderRadius: 5,
  },
});

export default ImageItem;
