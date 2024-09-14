import React from 'react';
import { DrawerLayoutAndroid, ScrollView, StyleSheet } from 'react-native';
import { BoardCard } from '..';
import { BoardCardProps } from '../types/board';

interface DATAProps {
  data: BoardCardProps[];
}

const Board = ({ data }: DATAProps) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data.map((item) => (
        <BoardCard
          boardID={item.boardID}
          title={item.title}
          description={item.description}
          tags={item.tags}
          base64={item.base64}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default Board;
