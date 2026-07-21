import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
  loadLettersFromStorage,
  saveLettersToStorage,
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
    isFavorite: true,
    isArchived: false,
    unlockDate: '2031-07-20T00:00:00.000Z',
    content: 'Hey future self, hope you are crushing your coding goals!',
  },
  {
    id: '2',
    title: 'My Goals for this Summer',
    type: 'reminder',
    category: 'Personal',
    isFavorite: false,
    isArchived: true,
    content: 'Hey self! Remember to keep working on your React Native projects.',
  },
];

function AppContent() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('home');
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Direct Modal for Grid Buttons (Favorites, Categories, Achievements)
  const [activeGridModal, setActiveGridModal] = useState(null); // 'favorites' | 'categories' | 'achievements'

  // Dynamic Settings
  const [themeMode, setThemeMode] = useState('Light');
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

  // Grid Navigation Handler
  const handleHomeGridNavigation = (target) => {
    if (target === 'archive') {
      setActiveTab('archive');
    } else {
      setActiveGridModal(target);
    }
  };

  const isDark = themeMode === 'Dark';
  const bgColor = isDark ? '#121212' : '#FAF8F5';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#2B2B2B';
  const subTextColor = isDark ? '#AAAAAA' : '#777777';
  const borderColor = isDark ? '#2A2A2A' : '#EAE5DF';

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
            onNavigateToTab={handleHomeGridNavigation}
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
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingCenter, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color={accentColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
      />
      
      <View style={styles.content}>{renderActiveScreen()}</View>

      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        accentColor={accentColor}
      />

      {/* Grid Quick Action Sub-Screen Modal */}
      <Modal
        visible={activeGridModal !== null}
        animationType="slide"
        onRequestClose={() => setActiveGridModal(null)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: bgColor }]}>
          <View style={styles.modalTopBar}>
            <TouchableOpacity
              onPress={() => setActiveGridModal(null)}
              activeOpacity={0.7}
              style={styles.backButtonTouch}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Text style={[styles.backArrow, { color: textColor }]}>‹ Back</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            {activeGridModal === 'favorites' && (
              <View>
                <Text style={[styles.modalTitle, { color: textColor }]}>Favorites</Text>
                <Text style={[styles.modalSub, { color: subTextColor }]}>Your starred letters</Text>
                {letters.filter((l) => l.isFavorite).length === 0 ? (
                  <View style={[styles.emptyBox, { borderColor }]}>
                    <Text style={{ color: subTextColor }}>No favorite letters yet.</Text>
                  </View>
                ) : (
                  letters
                    .filter((l) => l.isFavorite)
                    .map((l) => (
                      <TouchableOpacity
                        key={l.id}
                        style={[styles.listItem, { backgroundColor: cardBg, borderColor }]}
                        onPress={() => {
                          setActiveGridModal(null);
                          setSelectedLetter(l);
                        }}
                      >
                        <Text style={{ fontSize: 18, marginRight: 12 }}>⭐</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.itemTitle, { color: textColor }]}>{l.title}</Text>
                          <Text style={[styles.itemSub, { color: subTextColor }]} numberOfLines={1}>
                            {l.content}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                )}
              </View>
            )}

            {activeGridModal === 'categories' && (
              <View>
                <Text style={[styles.modalTitle, { color: textColor }]}>Categories</Text>
                <Text style={[styles.modalSub, { color: subTextColor }]}>Organize your letters</Text>
                {[
                  { name: 'Goals', count: 3 },
                  { name: 'Memories', count: 1 },
                  { name: 'School', count: 2 },
                  { name: 'Personal', count: 3 },
                ].map((cat, idx) => (
                  <View key={idx} style={[styles.listItem, { backgroundColor: cardBg, borderColor }]}>
                    <Text style={{ fontSize: 18, marginRight: 12 }}>🗂️</Text>
                    <View>
                      <Text style={[styles.itemTitle, { color: textColor }]}>{cat.name}</Text>
                      <Text style={[styles.itemSub, { color: subTextColor }]}>
                        {cat.count} letters
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {activeGridModal === 'achievements' && (
              <View>
                <Text style={[styles.modalTitle, { color: textColor }]}>Badges</Text>
                <Text style={[styles.modalSub, { color: subTextColor }]}>Milestones earned</Text>
                <View style={styles.grid2Col}>
                  {[
                    { title: 'First Letter', desc: 'Write your first future letter.', unlocked: true, icon: '✏️' },
                    { title: 'Long-Term Planner', desc: 'Schedule a letter 1 year ahead.', unlocked: true, icon: '⏳' },
                    { title: 'Designer', desc: "Customize your app's look.", unlocked: false, icon: '🎨' },
                    { title: 'Future Messenger', desc: 'Schedule 10 letters.', unlocked: false, icon: '🔒' },
                  ].map((item, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.gridCard,
                        { backgroundColor: cardBg, borderColor },
                        item.unlocked && { borderColor: accentColor },
                      ]}
                    >
                      <Text style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</Text>
                      <Text style={[styles.itemTitle, { color: textColor }]}>{item.title}</Text>
                      <Text style={[styles.itemSub, { color: subTextColor, marginTop: 4 }]}>
                        {item.desc}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Letter Details View Modal */}
      <Modal
        visible={selectedLetter !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedLetter(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: cardBg, borderColor }]}>
            <Text style={[styles.modalBadge, { color: accentColor }]}>
              {selectedLetter?.category || 'Personal'}
            </Text>
            <Text style={[styles.letterTitle, { color: textColor }]}>
              {selectedLetter?.title}
            </Text>
            <Text style={[styles.letterBody, { color: subTextColor }]}>
              {selectedLetter?.content}
            </Text>

            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: accentColor }]}
              onPress={() => setSelectedLetter(null)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
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
  container: { flex: 1 },
  content: { flex: 1 },
  loadingCenter: { justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1 },
  modalTopBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButtonTouch: {
    paddingVertical: 8,
    paddingRight: 20,
    alignSelf: 'flex-start',
  },
  backArrow: { fontSize: 20, fontWeight: 'bold' },
  modalScrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  modalTitle: { fontSize: 28, fontFamily: 'Georgia', fontWeight: 'bold' },
  modalSub: { fontSize: 14, marginBottom: 16 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  itemTitle: { fontSize: 15, fontWeight: 'bold' },
  itemSub: { fontSize: 12 },
  emptyBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
  },
  modalBadge: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  letterTitle: { fontSize: 22, fontFamily: 'Georgia', fontWeight: 'bold', marginBottom: 10 },
  letterBody: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  closeBtn: { paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  closeBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});