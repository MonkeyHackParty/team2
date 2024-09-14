import React, { useState, useEffect } from "react";
import { TouchableOpacity, Image, StyleSheet, Alert, View } from "react-native";
import { BoardUpdater } from "../../board-creator";

interface SettingButtonProps {
  boardID: string;
}

const SettingButton = ({ boardID }: SettingButtonProps): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };
  
  const handlePress = async () => {
    setIsModalVisible(true);
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Image
          style={styles.bookmarkIcon}
          source={require("../images/setting.png")}
        />
      </TouchableOpacity>
      <BoardUpdater visible={isModalVisible} onClose={closeModal} boardID={boardID}  />
    </View>
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

export default SettingButton;
