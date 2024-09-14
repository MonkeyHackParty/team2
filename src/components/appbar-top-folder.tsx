import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AccountIcon } from '../features/account';

interface AppbarTopFolderProps {
  title: string;
  index: number;
  setIndex: (index: number) => void;
}

export function AppbarTopFolder({ title, index, setIndex }: AppbarTopFolderProps) {
  const handlePress = (tabIndex: number) => {
    setIndex(tabIndex);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.emptySpace} /> 
        <Text style={styles.title}>{title}</Text>
        <Pressable style={styles.iconContainer}>
          <AccountIcon />
        </Pressable>
        <View style={styles.borderBottom} />
      </View>

      <View style={styles.footer}>
        <View style={styles.tabList}>
          {texts.map((text, tabIndex) => (
            <Pressable
              key={text.key}
              style={[
                styles.footerIconContainer,
                index === tabIndex && styles.activeTab
              ]}
              onPress={() => handlePress(tabIndex)}
            >
              <Text style={[styles.tabText, index === tabIndex && styles.activeTabText]}>
                {text.value}
              </Text>
              {index === tabIndex && (
                <View style={styles.activeIndicator} />
              )}
            </Pressable>
          ))}
        </View>
        <View style={styles.borderBottom} />
      </View>
    </View>
  );
}

const texts = [
  { key: 'home', value: 'MyBoards' },
  { key: 'search', value: 'BookMark' },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  footer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1F2937',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1F2937',
  },
  activeIndicator: {
    width: '100%',
    height: 2,
    backgroundColor: '#1F2937',
    position: 'absolute',
    bottom: -2,
  },
});

export default AppbarTopFolder;
