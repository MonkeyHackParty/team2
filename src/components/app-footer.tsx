import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface AppFooterProps {
  onTabPress: (index: number) => void;
}

export function AppFooter({ onTabPress }: AppFooterProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePress = (index: number) => {
    setActiveIndex(index);
    onTabPress(index);
  };

  return (
    <View style={styles.root}>
      <View style={styles.borderTop} />
      <View style={styles.tabList}>
        {icons.map((icon, index) => (
          <TouchableOpacity
            key={icon.key}
            style={styles.footerIconContainer}
            onPress={() => handlePress(index)}
          >
            <Image
              source={icon.source}
              style={styles.icon}
            />
            {activeIndex === index && (
              <View style={styles.activeIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.borderBottom} />
    </View>
  );
}

const icons = [
  { key: 'home', source: require('../images/home.png') },
  { key: 'search', source: require('../images/search.png') },
  { key: 'folder', source: require('../images/folder.png') },
];

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
  },
  borderTop: {
    height: 1,
    width: '100%',
    backgroundColor: '#d1d5db',
  },
  borderBottom: {
    height: 1,
    width: '100%',
    backgroundColor: '#333333',
  },
  tabList: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerIconContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  activeIndicator: {
    width: 60,
    height: 2,
    backgroundColor: '#333333',
    position: 'absolute',
    bottom: -2,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default AppFooter;
