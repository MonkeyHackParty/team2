import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import Home from './src/pages/Home';
import Search from './src/pages/Search';
import Folder from './src/pages/Folder';
import AppFooter from './src/components/app-footer';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <Home />;
      case 1:
        return <Search />;
      case 2:
        return <Folder />;
      default:
        return <Home />;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <AppFooter onTabPress={setActiveTab} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
