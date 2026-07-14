import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [unlockInput, setUnlockInput] = useState('Dec 31, 2026'); 
  const [categoryInput, setCategoryInput] = useState('Personal');

  const [sealedLetters, setSealedLetters] = useState([
    { id: 1, title: "My Goals for this Summer", unlockDate: "Aug 31, 2026", category: "Personal" },
    { id: 2, title: "Message to Me in 5 Years", unlockDate: "July 14, 2031", category: "Future" },
    { id: 3, title: "Advice for College Entry", unlockDate: "Sept 1, 2027", category: "School" },
  ]);

  const nextLetter = {
    title: sealedLetters[0]?.title || "No upcoming letters",
    years: "0",
    months: "1",
    days: "2",
    hours: "5"
  };

  const tiles = [
    { label: 'Favorites', icon: '⭐', count: 3 },
    { label: 'Categories', icon: '📁', count: 0 },
    { label: 'Badges', icon: '🏆', count: 1 },
    { label: 'Archive', icon: '📦', count: 5 },
  ];

  const handleSaveLetter = () => {
    if (!titleInput.trim()) return alert("Please give your letter a title!");

    const newLetter = {
      id: Date.now(), 
      title: titleInput,
      unlockDate: unlockInput,
      category: categoryInput,
    };

    setSealedLetters([newLetter, ...sealedLetters]); 
    
    setTitleInput('');
    setContentInput('');
    setCurrentScreen('home');
  };

  // --- SCREEN 1: HOME DASHBOARD ---
  if (currentScreen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          {/* HEADER SECTION */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.titleText}>Future Letter</Text>
            <Text style={styles.taglineText}>✨ Write today. Discover tomorrow.</Text>
          </View>

          {/* HERO COUNTDOWN CARD */}
          <View style={styles.heroContainer}>
            <TouchableOpacity style={styles.heroCard} activeOpacity={0.9}>
              <View style={styles.heroHeader}>
                <Text style={styles.heroBadgeText}>⏳ NEXT TO ARRIVE</Text>
                <View style={styles.milestoneTag}>
                  <Text style={styles.milestoneText}>Future</Text>
                </View>
              </View>
              
              <Text style={styles.heroTitle}>{nextLetter.title}</Text>
              
              <View style={styles.countdownRow}>
                {[
                  { label: 'Years', val: nextLetter.years },
                  { label: 'Months', val: nextLetter.months },
                  { label: 'Days', val: nextLetter.days },
                  { label: 'Hours', val: nextLetter.hours },
                ].map((item, index) => (
                  <View key={index} style={styles.timeBox}>
                    <Text style={styles.timeVal}>{item.val}</Text>
                    <Text style={styles.timeLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          </View>

          {/* QUICK NAVIGATION TILES GRID */}
          <View style={styles.gridContainer}>
            {tiles.map((tile, index) => (
              <TouchableOpacity key={index} style={styles.tileButton} activeOpacity={0.8}>
                <View style={styles.tileLeft}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.tileIcon}>{tile.icon}</Text>
                  </View>
                  <Text style={styles.tileLabel}>{tile.label}</Text>
                </View>
                {tile.count > 0 && (
                  <Text style={styles.tileCount}>{tile.count}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* WRITE NEW LETTER CTA BUTTON */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.writeButton} 
              activeOpacity={0.8}
              onPress={() => setCurrentScreen('create')}
            >
              <Text style={styles.writeButtonText}>✍️ Write a new letter</Text>
            </TouchableOpacity>
          </View>

          {/* SEALED LETTERS LIST */}
          <View style={styles.sealedSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sealed letters</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all ➔</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.lettersList}>
              {sealedLetters.map((letter) => (
                <TouchableOpacity key={letter.id} style={styles.letterCard} activeOpacity={0.7}>
                  <View style={styles.letterLeft}>
                    <Text style={styles.lockIcon}>🔒</Text>
                    <View>
                      <Text style={styles.letterTitle}>{letter.title}</Text>
                      <Text style={styles.letterSubtitle}>Unlocks on {letter.unlockDate}</Text>
                    </View>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{letter.category}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- SCREEN 2: CREATE LETTER SCREEN ---
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        {/* SAFE HEADER (Pushed down slightly to clear camera notches) */}
        <View style={styles.createHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.createTitle}>New Letter</Text>
          <View style={{ width: 50 }} /> {/* Purely for balancing the title in the center */}
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          {/* TITLE INPUT */}
          <Text style={styles.label}>To my future self...</Text>
          <TextInput
            style={styles.textInputTitle}
            placeholder="Give your letter a title"
            placeholderTextColor="#555"
            value={titleInput}
            onChangeText={setTitleInput}
          />

          {/* METADATA (CATEGORY & DATE) */}
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>UNLOCK DATE</Text>
              <TextInput
                style={styles.metaInput}
                value={unlockInput}
                onChangeText={setUnlockInput}
                placeholder="e.g. Dec 31, 2026"
                placeholderTextColor="#555"
              />
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>CATEGORY</Text>
              <TextInput
                style={styles.metaInput}
                value={categoryInput}
                onChangeText={setCategoryInput}
                placeholder="e.g. Goals"
                placeholderTextColor="#555"
              />
            </View>
          </View>

          {/* LETTER BODY INPUT */}
          <Text style={styles.label}>The letter content</Text>
          <TextInput
            style={styles.textInputBody}
            placeholder="Write down your thoughts, fears, dreams, or predictions..."
            placeholderTextColor="#555"
            multiline
            textAlignVertical="top"
            value={contentInput}
            onChangeText={setContentInput}
          />
        </ScrollView>

        {/* FLOATING ACTION BOTTOM ROW FOR EASY THUMB REACH */}
        <View style={styles.floatingBottomRow}>
          <TouchableOpacity 
            style={styles.floatingSealButton} 
            activeOpacity={0.8}
            onPress={handleSaveLetter}
          >
            <Text style={styles.floatingSealButtonText}>Seal Letter 🔒</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#888888',
  },
  titleText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 2,
  },
  taglineText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#bb86fc',
    marginTop: 6,
  },
  heroContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  heroCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.2)',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroBadgeText: {
    color: '#bb86fc',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  milestoneTag: {
    backgroundColor: '#bb86fc',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  milestoneText: {
    color: '#121212',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  timeBox: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  timeVal: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  timeLabel: {
    color: '#888888',
    fontSize: 10,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  tileButton: {
    width: '48%',
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2d2d2d',
  },
  tileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  tileIcon: {
    fontSize: 14,
  },
  tileLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  tileCount: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  writeButton: {
    backgroundColor: '#bb86fc',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '600',
  },
  sealedSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  seeAllText: {
    color: '#bb86fc',
    fontSize: 12,
    fontWeight: '500',
  },
  lettersList: {
    gap: 12,
  },
  letterCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#2d2d2d',
  },
  letterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  letterTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  letterSubtitle: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: '#888888',
    fontSize: 11,
  },
  
  // --- CREATE SCREEN STYLES (UPDATED FOR CAMERA SAFETY) ---
  createHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8, // Safety padding for camera punches/notches
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#2d2d2d',
  },
  cancelText: {
    color: '#ff5c5c',
    fontSize: 16,
    fontWeight: '500',
    width: 60,
  },
  createTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  formContainer: {
    padding: 20,
    paddingBottom: 100, // Space so keyboard/bottom row doesn't block text inputs
  },
  label: {
    color: '#888888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  textInputTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2d2d2d',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metaCol: {
    width: '48%',
  },
  metaLabel: {
    color: '#888888',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 8,
  },
  metaInput: {
    color: '#ffffff',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2d2d2d',
    fontSize: 14,
  },
  textInputBody: {
    color: '#ffffff',
    fontSize: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 14,
    height: 180,
    borderWidth: 1,
    borderColor: '#2d2d2d',
    lineHeight: 24,
  },
  // FLOATING BOTTOM ROW STYLE
  floatingBottomRow: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligns our button to the bottom right!
  },
  floatingSealButton: {
    backgroundColor: '#bb86fc',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24, // Pill shape
    shadowColor: '#bb86fc',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6, // Shadow on Android
  },
  floatingSealButtonText: {
    color: '#121212',
    fontSize: 15,
    fontWeight: '700',
  },
});