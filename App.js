import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import BottomNavBar from './src/components/BottomNavBar';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      // Additional screens (CountdownScreen, WriteScreen, etc.) connect here
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderActiveScreen()}</View>
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
  },
});