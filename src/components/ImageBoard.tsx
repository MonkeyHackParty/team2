import React from "react";
import { View, StyleSheet } from "react-native";
import CustomDraggable from "./CustomDraggable";
import ImageItem from "./ImageItem";

interface ImageBoardProps {
  images: { uri: string; name: string }[];
  updateImageName: (index: number, newName: string) => void;
}

const ImageBoard: React.FC<ImageBoardProps> = ({ images, updateImageName }) => {
  return (
    <View style={styles.board}>
      {images.map((image, index) => (
        <CustomDraggable key={index} x={50} y={50}>
          <ImageItem
            uri={image.uri}
            name={image.name}
            onNameChange={(newName) => updateImageName(index, newName)}
          />
        </CustomDraggable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flex: 1,
    width: "100%",
    height: 500,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default ImageBoard;
