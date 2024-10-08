import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AccountIcon } from '../features/account';

export interface HeaderProps {
  title: string;
  canLogout: boolean;
}

export function AppbarTop({ title, canLogout }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {canLogout ? 
          <>
            <View style={styles.emptySpace} /><Text style={styles.title}>{title}</Text>
            <Pressable style={styles.iconContainer}>
              <AccountIcon />
            </Pressable>
          </> 
          :
          <Text style={styles.title}>{title}</Text>
        }
      </View>
      <View style={styles.borderBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: '100%',
  },
  title: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  emptySpace: {
    width: 24,
  },
  borderBottom: {
    height: 1,
    backgroundColor: '#CCCCCC',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

export default AppbarTop;
