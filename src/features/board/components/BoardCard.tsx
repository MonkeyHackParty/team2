import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BoardCardProps } from '../types/board';
import BookmarkButton from './BookmarkButton';

function BoardCard({
  boardID,
  title,
  description,
  base64,
  tags,
}: BoardCardProps) {
  return (
    <View style={styles.root} testID={boardID}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Image source={{ uri: base64 }} style={styles.image} />
        <View style={styles.tags}>
          {tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      </View>
      <BookmarkButton boardID={boardID} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    padding: wp(5),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    shadowColor: '#9e9e9e', 
    shadowOpacity: 0.25,
    shadowRadius: wp(1.5),
    shadowOffset: { width: 0, height: hp(1) },
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#0f172a',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: hp(3),
    marginBottom: hp(0.5),
  },
  description: {
    color: '#64748b',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: hp(3),
    marginBottom: hp(1),
  },
  image: {
    aspectRatio: 16 / 9,
    height: hp(20),
    marginBottom: hp(1),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 14,
    color: '#333',
  },
  bookmark: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  }
});

export default BoardCard;
