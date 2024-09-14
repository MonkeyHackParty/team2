import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CreateButtonProps {
  onPress: () => void;
  text: string;
}

const CreateButton: React.FC<CreateButtonProps> = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CreateButton;
