import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, ActivityIndicator } from 'react-native';

// Utilities & Data
import { loadLettersFromStorage, saveLettersToStorage } from './src/utils/storage';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import WriteScreen from './src/screens/WriteScreen';
import ArchiveScreen from './src/screens/ArchiveScreen';

// Components
import BottomNavBar from './src/components/BottomNavBar';

// Fallback initial sample data
const INITIAL_SAMPLE_LETTERS = [
  {
    id: '1',
    title: 'Message to Me in 5 Years',
    type: 'future',
    category: 'Future',
    isFavorite: false,
    unlockDate: '2031-07-20T00:00:00.000Z',
    content: 'Hey future self, hope you are crushing your coding goals!',
  },
  {
    id: '2',
    title: 'My Goals for this Summer',
    type: 'reminder',
    category: 'Personal',
    isFavorite: true,
    content: 'Hey self! Remember to keep working on your coding projects.',
  },
  {
    id: '3',
    title: 'Reminder: Call your grandparents!',
    type: 'reminder',
    category: 'Personal',
    isFavorite: false,
    content: 'Check in with them this weekend.',
  },
  {
    id: '4',
    title: 'Next Semester Checklist',
    type: 'reminder',
    category: 'School',
    isFavorite: false,
    content: 'Get textbooks, prep binder, review class schedule.',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Load saved letters from AsyncStorage on app startup
  useEffect(() => {
    async function initStorage() {
      const savedLetters = await loadLettersFromStorage();
      if (savedLetters && savedLetters.length > 0) {
        setLetters(savedLetters);
      } else {
        setLetters(INITIAL_SAMPLE_LETTERS);
      }
      setIsLoading(false);
    }
    initStorage();
  }, []);

  // 2. Persist letters to device storage whenever the letters state updates
  useEffect(() => {
    if (!isLoading) {
      saveLettersToStorage(letters);
    }
  }, [letters, isLoading]);

  // Handler to add a new letter or reminder
  const handleAddLetter = (newLetter) => {
    setLetters((prev) => [newLetter, ...prev]);
    setActiveTab('home');
  };

  // Switch between tabs
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen letters={letters} setLetters={setLetters} />;
      case 'write':
        return <WriteScreen onSave={handleAddLetter} />;
      case 'archive':
        return <ArchiveScreen letters={letters.filter((l) => l.isArchived)} />;
      default:
        return <HomeScreen letters={letters} setLetters={setLetters} />;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingCenter]}>
        <ActivityIndicator size="large" color="#ff9f43" />
      </SafeAreaView>
    );
  }

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
  loadingCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});