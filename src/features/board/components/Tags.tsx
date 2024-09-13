import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface TagsProps {
  tags: string[];
}

const Tags = ({ tags }: TagsProps): JSX.Element => {
  return (
    <View style={styles.tags}>
      <View style={styles.frame72}>
        <Image style={styles.tagIcon} source={require('../images/tag.png')} />
        {tags.map((tag, index) => (
          <View key={index} style={styles.tagWrapper}>
            <Text style={styles.textWrapper}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    flexWrap: 'wrap',
    
  },
  tagIcon: {
    height: 24, 
    width: 24,
    marginRight: 4,
  },
  frame72: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    width: '100%', 
  },
  tagWrapper: {
    backgroundColor: '#334155',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 5,
  },
  textWrapper: {
    color: '#ffffff',
  },
});

export default Tags;
