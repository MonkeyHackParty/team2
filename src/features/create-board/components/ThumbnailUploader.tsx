import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface ThumbnailUploaderProps {
  thumbnail: string | null;
  onUpload: () => void;
}

const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({ thumbnail, onUpload }) => {
  return (
    <TouchableOpacity style={styles.thumbnail} onPress={onUpload}>
      {thumbnail ? (
        <Image source={{ uri: thumbnail }} style={styles.thumbnailImage} />
      ) : (
        <View style={styles.placeholder}>
          <Text>Upload Thumbnail</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThumbnailUploader;
