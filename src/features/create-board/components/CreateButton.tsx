import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CreateButtonProps {
  onPress: () => void;
}

const CreateButton: React.FC<CreateButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Make Board</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CreateButton;
