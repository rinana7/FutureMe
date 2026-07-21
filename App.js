import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
  loadLettersFromStorage,
  saveLettersToStorage,
  clearLettersFromStorage,
} from './src/utils/storage';

import HomeScreen from './src/screens/HomeScreen';
import WriteScreen from './src/screens/WriteScreen';
import ArchiveScreen from './src/screens/ArchiveScreen';
import SettingsScreen from './src/screens/SettingsScreen';

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
];

function AppContent() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('home');
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Global Theme States
  const [themeMode, setThemeMode] = useState('Light'); // 'Light' | 'Dark'
  const [accentColor, setAccentColor] = useState('#D9822B');

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

  const isDark = themeMode === 'Dark';

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            letters={letters}
            setLetters={setLetters}
            onSelectLetter={(letter) => setSelectedLetter(letter)}
            isDark={isDark}
            accentColor={accentColor}
            onNavigateToWrite={() => setActiveTab('write')}
          />
        );
      case 'write':
        return (
          <WriteScreen
            onSave={handleAddLetter}
            isDark={isDark}
            accentColor={accentColor}
          />
        );
      case 'archive':
        return (
          <ArchiveScreen
            letters={letters.filter((l) => l.isArchived)}
            isDark={isDark}
            accentColor={accentColor}
            onSelectLetter={(letter) => setSelectedLetter(letter)}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            letters={letters}
            setLetters={setLetters}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            onBack={() => setActiveTab('home')}
          />
        );
      default:
        return (
          <HomeScreen
            letters={letters}
            setLetters={setLetters}
            onSelectLetter={(letter) => setSelectedLetter(letter)}
            isDark={isDark}
            accentColor={accentColor}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingCenter,
          { backgroundColor: isDark ? '#121212' : '#FAF8F5' },
        ]}
      >
        <ActivityIndicator size="large" color={accentColor} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#121212' : '#FAF8F5',
          paddingTop: insets.top, // Keeps content clear of notch/camera cutouts
        },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#121212' : '#FAF8F5'}
      />
      <View style={styles.content}>{renderActiveScreen()}</View>

      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        accentColor={accentColor}
      />

      {/* Modal Detail Popup */}
      <Modal
        visible={selectedLetter !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedLetter(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
            ]}
          >
            <Text style={[styles.modalBadge, { color: accentColor }]}>
              {selectedLetter?.category || 'Personal'}
            </Text>
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? '#FFFFFF' : '#2B2B2B' },
              ]}
            >
              {selectedLetter?.title}
            </Text>
            <Text
              style={[
                styles.modalBody,
                { color: isDark ? '#CCCCCC' : '#555555' },
              ]}
            >
              {selectedLetter?.content}
            </Text>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: accentColor }]}
              onPress={() => setSelectedLetter(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EAE5DF',
  },
  modalBadge: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  closeButton: {
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