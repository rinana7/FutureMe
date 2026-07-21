import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { loadLettersFromStorage, saveLettersToStorage } from './src/utils/storage';

import HomeScreen from './src/screens/HomeScreen';
import WriteScreen from './src/screens/WriteScreen';
import ArchiveScreen from './src/screens/ArchiveScreen';

import BottomNavBar from './src/components/BottomNavBar';

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
    content: 'Hey self! Remember to keep working on your React Native projects.',
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
  const [selectedLetter, setSelectedLetter] = useState(null);

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

  useEffect(() => {
    if (!isLoading) {
      saveLettersToStorage(letters);
    }
  }, [letters, isLoading]);

  const handleAddLetter = (newLetter) => {
    setLetters((prev) => [newLetter, ...prev]);
    setActiveTab('home');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            letters={letters}
            setLetters={setLetters}
            onSelectLetter={(letter) => setSelectedLetter(letter)}
          />
        );
      case 'write':
        return <WriteScreen onSave={handleAddLetter} />;
      case 'archive':
        return <ArchiveScreen letters={letters.filter((l) => l.isArchived)} />;
      default:
        return (
          <HomeScreen
            letters={letters}
            setLetters={setLetters}
            onSelectLetter={(letter) => setSelectedLetter(letter)}
          />
        );
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
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.content}>{renderActiveScreen()}</View>

      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modal Detail Popup */}
      <Modal
        visible={selectedLetter !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedLetter(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalBadge}>
              {selectedLetter?.category || 'Personal'}
            </Text>
            <Text style={styles.modalTitle}>{selectedLetter?.title}</Text>
            <Text style={styles.modalBody}>{selectedLetter?.content}</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedLetter(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalBadge: {
    color: '#ff9f43',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 15,
    color: '#cccccc',
    lineHeight: 22,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#ff9f43',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});