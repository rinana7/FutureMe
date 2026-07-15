import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define our Stationery Themes
const THEMES = {
  classic: { name: "Classic Slate", bg: "#1e1e1e", border: "#2d2d2d", text: "#e0e0e0", accent: "#bb86fc", fontStyle: "normal" },
  parchment: { name: "Vintage Parchment", bg: "#2c251e", border: "#c3a380", text: "#f4ebd0", accent: "#c3a380", fontStyle: "italic" },
  neon: { name: "Cyberpunk Neon", bg: "#0c0214", border: "#ff007f", text: "#00f0ff", accent: "#ff007f", fontStyle: "normal" },
  moss: { name: "Forest Moss", bg: "#141c16", border: "#81b29a", text: "#f4f1de", accent: "#81b29a", fontStyle: "normal" }
};

export default function App() {
  // Navigation & Form Input States
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [unlockInput, setUnlockInput] = useState(new Date().toISOString().split('T')[0]); 
  const [categoryInput, setCategoryInput] = useState('Personal');
  const [themeInput, setThemeInput] = useState('classic');

  // UI States
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePreset, setActivePreset] = useState('Custom');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRawDate, setSelectedRawDate] = useState(new Date());

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Favorites', 'Future', 'School', 'Instant', etc.

  // Letters Database State
  const [sealedLetters, setSealedLetters] = useState([
    { id: 1, title: "My Goals for this Summer", unlockDate: "2026-08-31", category: "Personal", theme: "moss", content: "Hey future self! Did you end up going on that road trip?", favorite: true, archived: false },
    { id: 2, title: "Message to Me in 5 Years", unlockDate: "2031-07-14", category: "Future", theme: "parchment", content: "Hello from 2026! You are officially 5 years older now.", favorite: true, archived: false },
    { id: 3, title: "Advice for College Entry", unlockDate: "2027-09-01", category: "School", theme: "classic", content: "College is starting! Take a deep breath.", favorite: false, archived: false },
    { id: 4, title: "Note to self (Unlocked!)", unlockDate: "2026-01-01", category: "Instant", theme: "neon", content: "This is a letter from the past that you can read right now.", favorite: true, archived: true }
  ]);

  const [countdown, setCountdown] = useState({ title: "No upcoming letters", years: "0", months: "0", days: "0", hours: "0", minutes: "0", seconds: "0" });

  // Dynamic Tile Counts based on letter states
  const favoriteCount = sealedLetters.filter(l => l.favorite && !l.archived).length;
  const archivedCount = sealedLetters.filter(l => l.archived).length;
  const uniqueCategories = Array.from(new Set(sealedLetters.map(l => l.category))).length;

  const tiles = [
    { id: 'Favorites', label: 'Favorites', icon: '⭐', count: favoriteCount },
    { id: 'Categories', label: 'Categories', icon: '📁', count: uniqueCategories },
    { id: 'Archived', label: 'Archive', icon: '📦', count: archivedCount }
  ];

  // Safe manual parse helper
  const parseDateSafely = (dateStr) => {
    const parts = dateStr.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 0, 0, 0, 0);
  };

  const isLetterUnlocked = (unlockDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const unlockDate = parseDateSafely(unlockDateStr);
    return today >= unlockDate;
  };

  const formatDisplayString = (dateStr) => {
    const d = parseDateSafely(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // --- LIVE TIMER ENGINE EFFECT ---
  useEffect(() => {
    const updateTimer = () => {
      const lockedLetters = sealedLetters.filter(l => !isLetterUnlocked(l.unlockDate) && !l.archived);
      if (lockedLetters.length === 0) {
        setCountdown({ title: "All letters unlocked! 🎉", years: "0", months: "0", days: "0", hours: "0", minutes: "0", seconds: "0" });
        return;
      }

      const sorted = [...lockedLetters].sort((a, b) => parseDateSafely(a.unlockDate) - parseDateSafely(b.unlockDate));
      const targetLetter = sorted[0];
      if (!targetLetter || !targetLetter.unlockDate) return;

      const now = new Date();
      const target = parseDateSafely(targetLetter.unlockDate);
      let diffMs = target - now;

      if (diffMs <= 0) {
        setCountdown({ title: targetLetter.title, years: "0", months: "0", days: "0", hours: "0", minutes: "0", seconds: "0" });
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);

      const calculatedYears = Math.floor(totalDays / 365);
      const calculatedMonths = Math.floor((totalDays % 365) / 30.43);
      const remainingDays = Math.floor((totalDays % 365) % 30.43);
      const remainingHours = totalHours % 24;
      const remainingMinutes = totalMinutes % 60;
      const remainingSeconds = totalSeconds % 60;

      setCountdown({
        title: targetLetter.title,
        years: String(calculatedYears),
        months: String(calculatedMonths),
        days: String(remainingDays),
        hours: String(remainingHours),
        minutes: String(remainingMinutes),
        seconds: String(remainingSeconds)
      });
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [sealedLetters]);

  // Filtering Logic
  const getFilteredLetters = () => {
    return sealedLetters.filter(letter => {
      // 1. Check Search Query
      const matchesSearch = 
        letter.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        letter.content.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Check Active Tile Filters
      if (activeFilter === 'Favorites') {
        return matchesSearch && letter.favorite && !letter.archived;
      }
      if (activeFilter === 'Archived') {
        return matchesSearch && letter.archived;
      }
      if (activeFilter === 'Categories') {
        // Just show all non-archived sorted by category if they clicked categories
        return matchesSearch && !letter.archived;
      }
      
      // Default: Hide archived from the main dashboard "All" view
      return matchesSearch && !letter.archived;
    });
  };

  const handleTilePress = (tileId) => {
    if (activeFilter === tileId) {
      setActiveFilter('All'); // Toggle off back to main list
    } else {
      setActiveFilter(tileId);
    }
  };

  const toggleFavorite = (id) => {
    setSealedLetters(sealedLetters.map(l => 
      l.id === id ? { ...l, favorite: !l.favorite } : l
    ));
    if (selectedLetter && selectedLetter.id === id) {
      setSelectedLetter(prev => ({ ...prev, favorite: !prev.favorite }));
    }
  };

  const toggleArchive = (id) => {
    setSealedLetters(sealedLetters.map(l => 
      l.id === id ? { ...l, archived: !l.archived } : l
    ));
    setCurrentScreen('home');
  };

  const formatDisplayDate = (dateObj) => {
    const offset = dateObj.getTimezoneOffset();
    const correctedDate = new Date(dateObj.getTime() - (offset * 60 * 1000));
    return correctedDate.toISOString().split('T')[0];
  };

  const setDateFromPreset = (daysToAdd, label) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    setSelectedRawDate(targetDate);
    setUnlockInput(formatDisplayDate(targetDate));
    setActivePreset(label);
    setShowDropdown(false);
  };

  const onCalendarChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowCalendar(false);
    if (selectedDate) {
      setSelectedRawDate(selectedDate);
      setUnlockInput(formatDisplayDate(selectedDate));
      setActivePreset('Custom Date');
    }
  };

  const handleSaveLetter = () => {
    if (!titleInput.trim()) return alert("Please give your letter a title!");

    const newLetter = {
      id: Date.now(), 
      title: titleInput,
      unlockDate: unlockInput,
      category: categoryInput,
      theme: themeInput,
      content: contentInput || "No content written.",
      favorite: false,
      archived: false
    };

    setSealedLetters([newLetter, ...sealedLetters]); 
    setTitleInput('');
    setContentInput('');
    setThemeInput('classic');
    setActivePreset('Custom');
    setCurrentScreen('home');
  };

  const handleSelectLetter = (letter) => {
    setSelectedLetter(letter);
    setCurrentScreen('detail');
  };

  const handleDeleteLetter = (letter) => {
    Alert.alert(
      "Discard Letter",
      "Are you absolutely sure you want to permanently delete this letter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedLetters = sealedLetters.filter(l => l.id !== letter.id);
            setSealedLetters(updatedLetters);
            setCurrentScreen('home');
            setSelectedLetter(null);
          }
        }
      ]
    );
  };

  // --- SCREEN 1: HOME DASHBOARD ---
  if (currentScreen === 'home') {
    const filteredLetters = getFilteredLetters();

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.titleText}>Future Letter</Text>
            <Text style={styles.taglineText}>✨ Write today. Discover tomorrow.</Text>
          </View>

          {/* TIMER HERO CARD */}
          <View style={styles.heroContainer}>
            <TouchableOpacity style={styles.heroCard} activeOpacity={0.9}>
              <View style={styles.heroHeader}>
                <Text style={styles.heroBadgeText}>⏳ NEXT TO ARRIVE</Text>
                <View style={styles.milestoneTag}>
                  <Text style={styles.milestoneText}>Future</Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>{countdown.title}</Text>
              <View style={styles.countdownRow}>
                {[
                  { label: 'Yrs', val: countdown.years },
                  { label: 'Mos', val: countdown.months },
                  { label: 'Days', val: countdown.days },
                  { label: 'Hrs', val: countdown.hours },
                  { label: 'Min', val: countdown.minutes },
                  { label: 'Sec', val: countdown.seconds },
                ].map((item, index) => (
                  <View key={index} style={styles.timeBox}>
                    <Text style={styles.timeVal}>{item.val}</Text>
                    <Text style={styles.timeLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          </View>

          {/* INTERACTIVE DASHBOARD TILES */}
          <View style={styles.gridContainer}>
            {tiles.map((tile) => {
              const isSelected = activeFilter === tile.id;
              return (
                <TouchableOpacity 
                  key={tile.id} 
                  style={[styles.tileButton, isSelected && styles.tileButtonActive]} 
                  activeOpacity={0.8}
                  onPress={() => handleTilePress(tile.id)}
                >
                  <View style={styles.tileLeft}>
                    <View style={[styles.iconCircle, isSelected && styles.iconCircleActive]}>
                      <Text style={styles.tileIcon}>{tile.icon}</Text>
                    </View>
                    <Text style={[styles.tileLabel, isSelected && styles.tileLabelActive]}>{tile.label}</Text>
                  </View>
                  <Text style={[styles.tileCount, isSelected && styles.tileCountActive]}>{tile.count}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SEARCH BAR & FILTER INDICATORS */}
          <View style={styles.searchContainer}>
            <TextInput 
              style={styles.searchBar} 
              placeholder="🔍 Search letters by title or content..." 
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {activeFilter !== 'All' && (
              <View style={styles.activeFilterRow}>
                <Text style={styles.filterLabel}>Filtering by: <Text style={styles.filterHighlight}>{activeFilter}</Text></Text>
                <TouchableOpacity onPress={() => setActiveFilter('All')}>
                  <Text style={styles.clearFilterText}>Clear Filter ✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.writeButton} activeOpacity={0.8} onPress={() => setCurrentScreen('create')}>
              <Text style={styles.writeButtonText}>✍️ Write a new letter</Text>
            </TouchableOpacity>
          </View>

          {/* LETTERS LIST */}
          <View style={styles.sealedSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeFilter === 'All' ? 'Sealed letters' : `${activeFilter} letters`} ({filteredLetters.length})
              </Text>
            </View>
            
            <View style={styles.lettersList}>
              {filteredLetters.length > 0 ? (
                filteredLetters.map((letter) => {
                  const unlocked = isLetterUnlocked(letter.unlockDate);
                  return (
                    <TouchableOpacity key={letter.id} style={styles.letterCard} activeOpacity={0.7} onPress={() => handleSelectLetter(letter)}>
                      <View style={styles.letterLeft}>
                        <Text style={styles.lockIcon}>{unlocked ? '🔓' : '🔒'}</Text>
                        <View style={{ flexShrink: 1 }}>
                          <View style={styles.titleRow}>
                            <Text style={styles.letterTitle} numberOfLines={1}>{letter.title}</Text>
                            {letter.favorite && <Text style={styles.starMini}>⭐</Text>}
                          </View>
                          <Text style={styles.letterSubtitle}>
                            {unlocked ? "Unlocked! Ready to read" : `Unlocks on ${formatDisplayString(letter.unlockDate)}`}
                          </Text>
                        </View>
                      </View>
                      <View style={unlocked ? styles.unlockedBadge : styles.categoryBadge}>
                        <Text style={unlocked ? styles.unlockedBadgeText : styles.categoryText}>{letter.category}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No letters found matching your criteria. 📥</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- SCREEN 2: CREATE LETTER SCREEN ---
  if (currentScreen === 'create') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.createHeader}>
            <TouchableOpacity onPress={() => setCurrentScreen('home')}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
            <Text style={styles.createTitle}>New Letter</Text>
            <View style={{ width: 80 }} /> 
          </View>

          <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>To my future self...</Text>
            <TextInput style={styles.textInputTitle} placeholder="Give your letter a title" placeholderTextColor="#555" value={titleInput} onChangeText={setTitleInput} />

            <Text style={styles.label}>When should this unlock?</Text>
            <TouchableOpacity style={styles.dropdownSelector} activeOpacity={0.8} onPress={() => setShowDropdown(!showDropdown)}>
              <Text style={styles.dropdownSelectorText}>📅 Option: <Text style={styles.dropdownHighlight}>{activePreset}</Text> ({formatDisplayString(unlockInput)})</Text>
              <Text style={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => setDateFromPreset(1, 'Tomorrow')}><Text style={styles.dropdownItemText}>🌅 Tomorrow</Text></TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => setDateFromPreset(3, '3 Days')}><Text style={styles.dropdownItemText}>⏳ In 3 Days</Text></TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => setDateFromPreset(7, '1 Week')}><Text style={styles.dropdownItemText}>📅 In 1 Week</Text></TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => { setShowDropdown(false); setShowCalendar(true); }}><Text style={styles.dropdownItemText}>📆 Open Calendar Visual Picker...</Text></TouchableOpacity>
              </View>
            )}

            {showCalendar && (
              <View style={styles.calendarWrapper}>
                {Platform.OS === 'ios' && (
                  <View style={styles.iosCalendarHeader}>
                    <Text style={styles.iosCalendarTitle}>Select Unlock Date</Text>
                    <TouchableOpacity onPress={() => setShowCalendar(false)}><Text style={styles.iosDoneText}>Done</Text></TouchableOpacity>
                  </View>
                )}
                <DateTimePicker value={selectedRawDate} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'calendar'} minimumDate={new Date()} onChange={onCalendarChange} themeVariant="dark" />
              </View>
            )}

            <Text style={styles.label}>Stationery Theme</Text>
            <View style={styles.themeSelectorContainer}>
              {Object.keys(THEMES).map((key) => {
                const theme = THEMES[key];
                const isSelected = themeInput === key;
                return (
                  <TouchableOpacity key={key} style={[styles.themeCard, { backgroundColor: theme.bg, borderColor: isSelected ? '#ffffff' : theme.border }]} onPress={() => setThemeInput(key)}>
                    <Text style={[styles.themeCardText, { color: theme.text, fontStyle: theme.fontStyle }]}>{theme.name}</Text>
                    {isSelected && <Text style={styles.themeChecked}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>EXACT UNLOCK DATE</Text>
                <TextInput style={styles.metaInput} value={formatDisplayString(unlockInput)} editable={false} />
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>CATEGORY</Text>
                <TextInput style={styles.metaInput} value={categoryInput} onChangeText={setCategoryInput} placeholder="e.g. Goals" placeholderTextColor="#555" />
              </View>
            </View>

            <Text style={styles.label}>The letter content</Text>
            <TextInput style={styles.textInputBody} placeholder="Write down your thoughts..." placeholderTextColor="#555" multiline textAlignVertical="top" value={contentInput} onChangeText={setContentInput} />
          </ScrollView>

          <View style={styles.floatingBottomRow}>
            <TouchableOpacity style={styles.floatingSealButton} activeOpacity={0.8} onPress={handleSaveLetter}>
              <Text style={styles.floatingSealButtonText}>Seal Letter 🔒</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // --- SCREEN 3: DETAIL SCREEN ---
  if (currentScreen === 'detail' && selectedLetter) {
    const unlocked = isLetterUnlocked(selectedLetter.unlockDate);
    const activeTheme = THEMES[selectedLetter.theme] || THEMES.classic;

    return (
      <SafeAreaView style={[styles.container, unlocked && { backgroundColor: activeTheme.bg }]}>
        <View style={[styles.createHeader, unlocked && { borderColor: activeTheme.border }]}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')}><Text style={[styles.backButtonText, unlocked && { color: activeTheme.accent }]}>⬅ Back</Text></TouchableOpacity>
          <Text style={styles.createTitle}>Letter Vault</Text>
          <TouchableOpacity onPress={() => handleDeleteLetter(selectedLetter)}><Text style={styles.trashText}>🗑️ Discard</Text></TouchableOpacity>
        </View>

        {unlocked ? (
          <ScrollView contentContainerStyle={styles.detailContainer}>
            <View style={styles.unlockedHeader}>
              <View style={[styles.unlockedCategoryBadge, { backgroundColor: activeTheme.accent + '25' }]}><Text style={[styles.unlockedCategoryText, { color: activeTheme.accent }]}>{selectedLetter.category}</Text></View>
              <Text style={styles.unlockedDateText}>Unsealed on {formatDisplayString(selectedLetter.unlockDate)}</Text>
            </View>
            
            <View style={styles.headerActionRow}>
              <Text style={styles.detailLetterTitle}>{selectedLetter.title}</Text>
              <View style={styles.iconButtons}>
                <TouchableOpacity onPress={() => toggleFavorite(selectedLetter.id)} style={styles.actionIconButton}>
                  <Text style={styles.actionIcon}>{selectedLetter.favorite ? '⭐' : '☆'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleArchive(selectedLetter.id)} style={styles.actionIconButton}>
                  <Text style={styles.actionIcon}>{selectedLetter.archived ? '📤' : '📦'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={[styles.letterPaper, { backgroundColor: activeTheme.bg, borderColor: activeTheme.border }]}>
              <Text style={[styles.letterPaperText, { color: activeTheme.text, fontStyle: activeTheme.fontStyle }]}>{selectedLetter.content}</Text>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.lockedContainer}>
            <View style={styles.padlockCircle}><Text style={styles.padlockEmoji}>🔒</Text></View>
            <Text style={styles.lockedWarningTitle}>This Letter is Sealed</Text>
            <Text style={styles.lockedWarningSubtitle}>You wrote this with a promise not to open it before the unlock date. No peeking!</Text>
            <View style={styles.lockDetailsCard}>
              <Text style={styles.lockDetailsLabel}>DESTINATION DATE</Text>
              <Text style={styles.lockDetailsValue}>{formatDisplayString(selectedLetter.unlockDate)}</Text>
              <View style={styles.lockedSeparator} />
              
              <View style={styles.inlineActionRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lockDetailsLabel}>CATEGORY</Text>
                  <Text style={styles.lockDetailsValue}>{selectedLetter.category}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleFavorite(selectedLetter.id)} style={styles.favoriteButtonMini}>
                  <Text style={styles.miniFavStar}>{selectedLetter.favorite ? '⭐ Favorited' : '☆ Favorite'}</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.lockedSeparator} />
              <Text style={styles.lockDetailsLabel}>STATIONERY THEME</Text>
              <Text style={styles.lockDetailsValue}>🎨 {activeTheme.name}</Text>
            </View>
            <Text style={styles.lockedTagline}>⏳ Access will be granted automatically on release day.</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContainer: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 64 : 48, paddingBottom: 12 },
  welcomeText: { fontSize: 14, color: '#888888' },
  titleText: { fontSize: 32, fontWeight: '700', color: '#ffffff', marginTop: 2 },
  taglineText: { fontSize: 14, fontStyle: 'italic', color: '#bb86fc', marginTop: 6 },
  
  // Hero
  heroContainer: { paddingHorizontal: 20, marginTop: 16 },
  heroCard: { backgroundColor: '#1e1e1e', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(187, 134, 252, 0.2)' },
  heroHeader: { flexDirection: 'row', alignItems: 'center' },
  heroBadgeText: { color: '#bb86fc', fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  milestoneTag: { backgroundColor: '#bb86fc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 'auto' },
  milestoneText: { color: '#121212', fontSize: 11, fontWeight: '700' },
  heroTitle: { color: '#ffffff', fontSize: 20, fontWeight: '600', marginTop: 12 },
  countdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  timeBox: { flex: 1, backgroundColor: '#2d2d2d', borderRadius: 12, paddingVertical: 8, marginHorizontal: 2, alignItems: 'center' },
  timeVal: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  timeLabel: { color: '#888888', fontSize: 9, textTransform: 'uppercase', marginTop: 2 },
  
  // Interactive Tiles
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 16 },
  tileButton: { width: '31%', backgroundColor: '#1e1e1e', borderRadius: 16, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderWidth: 1, borderColor: '#2d2d2d' },
  tileButtonActive: { borderColor: '#bb86fc', backgroundColor: 'rgba(187, 134, 252, 0.1)' },
  tileLeft: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  iconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  iconCircleActive: { backgroundColor: '#bb86fc' },
  tileIcon: { fontSize: 12 },
  tileLabel: { color: '#ffffff', fontSize: 11, fontWeight: '500' },
  tileLabelActive: { color: '#bb86fc', fontWeight: '700' },
  tileCount: { color: '#888888', fontSize: 12, fontWeight: '600' },
  tileCountActive: { color: '#bb86fc' },

  // Search Bar
  searchContainer: { paddingHorizontal: 20, marginVertical: 8 },
  searchBar: { backgroundColor: '#1e1e1e', color: '#ffffff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#2d2d2d', fontSize: 14 },
  activeFilterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingHorizontal: 4 },
  filterLabel: { color: '#888888', fontSize: 12 },
  filterHighlight: { color: '#bb86fc', fontWeight: '700' },
  clearFilterText: { color: '#ff5c5c', fontSize: 12, fontWeight: '600' },
  
  // Write Button
  buttonContainer: { paddingHorizontal: 20, marginTop: 8 },
  writeButton: { backgroundColor: '#bb86fc', paddingVertical: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  writeButtonText: { color: '#121212', fontSize: 16, fontWeight: '600' },
  
  // Sealed Section List
  sealedSection: { paddingHorizontal: 20, marginTop: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#888888', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  lettersList: { gap: 12 },
  letterCard: { backgroundColor: '#1e1e1e', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#2d2d2d' },
  letterLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  starMini: { fontSize: 12, marginLeft: 6 },
  lockIcon: { fontSize: 18, marginRight: 12 },
  letterTitle: { color: '#ffffff', fontSize: 16, fontWeight: '600', maxWidth: '85%' },
  letterSubtitle: { color: '#888888', fontSize: 12, marginTop: 2 },
  categoryBadge: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  categoryText: { color: '#888888', fontSize: 11 },
  unlockedBadge: { backgroundColor: 'rgba(0, 230, 118, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  unlockedBadgeText: { color: '#00e676', fontSize: 11, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { color: '#555555', fontSize: 14, textAlign: 'center' },

  // Forms & Modals
  createHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 64 : 48, paddingBottom: 20, borderBottomWidth: 1, borderColor: '#2d2d2d' },
  cancelText: { color: '#ff5c5c', fontSize: 16, fontWeight: '500', width: 80 },
  backButtonText: { color: '#bb86fc', fontSize: 16, fontWeight: '500', width: 80 },
  trashText: { color: '#ff5c5c', fontSize: 15, fontWeight: '600', textAlign: 'right', width: 80 },
  createTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  formContainer: { padding: 20, paddingBottom: 140 },
  label: { color: '#888888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  textInputTitle: { color: '#ffffff', fontSize: 20, fontWeight: '600', backgroundColor: '#1e1e1e', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#2d2d2d' },
  dropdownSelector: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#2d2d2d', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdownSelectorText: { color: '#ffffff', fontSize: 14 },
  dropdownHighlight: { color: '#bb86fc', fontWeight: '700' },
  dropdownArrow: { color: '#888888', fontSize: 12 },
  dropdownMenu: { backgroundColor: '#1e1e1e', borderRadius: 12, marginTop: 4, borderWidth: 1, borderColor: '#3a3a3a', overflow: 'hidden' },
  dropdownItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#2d2d2d' },
  dropdownItemText: { color: '#ffffff', fontSize: 14 },
  calendarWrapper: { backgroundColor: '#1e1e1e', borderRadius: 16, padding: 12, marginTop: 8, borderWidth: 1, borderColor: '#bb86fc' },
  iosCalendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#2d2d2d' },
  iosCalendarTitle: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  iosDoneText: { color: '#bb86fc', fontSize: 14, fontWeight: '700' },
  themeSelectorContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginTop: 4 },
  themeCard: { width: '48%', padding: 14, borderRadius: 12, borderWidth: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  themeCardText: { fontSize: 13, fontWeight: '600' },
  themeChecked: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  metaCol: { width: '48%' },
  metaLabel: { color: '#888888', fontSize: 10, letterSpacing: 1, marginBottom: 6, marginTop: 8 },
  metaInput: { color: '#aaaaaa', backgroundColor: '#1a1a1a', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#2d2d2d', fontSize: 14 },
  textInputBody: { color: '#ffffff', fontSize: 16, backgroundColor: '#1e1e1e', borderRadius: 12, padding: 14, height: 180, borderWidth: 1, borderColor: '#2d2d2d', lineHeight: 24 },
  floatingBottomRow: { position: 'absolute', bottom: 24, left: 20, right: 20, flexDirection: 'row', justifyContent: 'flex-end' },
  floatingSealButton: { backgroundColor: '#bb86fc', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 24, shadowColor: '#bb86fc', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  floatingSealButtonText: { color: '#121212', fontSize: 15, fontWeight: '700' },
  
  // Details screen
  detailContainer: { padding: 20 },
  unlockedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  unlockedCategoryBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  unlockedCategoryText: { fontSize: 13, fontWeight: '600' },
  unlockedDateText: { color: '#888888', fontSize: 13 },
  headerActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12 },
  detailLetterTitle: { color: '#ffffff', fontSize: 26, fontWeight: '700', flex: 1 },
  iconButtons: { flexDirection: 'row', gap: 10 },
  actionIconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1e1e1e', borderWidth: 1, borderColor: '#2d2d2d', alignItems: 'center', justifyContent: 'center' },
  actionIcon: { fontSize: 20, color: '#ffffff' },
  letterPaper: { borderWidth: 1, borderRadius: 16, padding: 20, minHeight: 250 },
  letterPaperText: { fontSize: 16, lineHeight: 26 },
  
  // Locked State
  lockedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, paddingBottom: 60 },
  padlockCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(187, 134, 252, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1.5, borderColor: '#bb86fc' },
  padlockEmoji: { fontSize: 48 },
  lockedWarningTitle: { color: '#ffffff', fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  lockedWarningSubtitle: { color: '#888888', fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 32 },
  lockDetailsCard: { backgroundColor: '#1e1e1e', borderWidth: 1, borderColor: '#2d2d2d', borderRadius: 16, width: '100%', padding: 20, marginBottom: 32 },
  lockDetailsLabel: { color: '#888888', fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 6 },
  lockDetailsValue: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  lockedSeparator: { height: 1, backgroundColor: '#2d2d2d', marginVertical: 14 },
  lockedTagline: { color: '#bb86fc', fontSize: 13, fontWeight: '500' },
  inlineActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  favoriteButtonMini: { backgroundColor: 'rgba(187, 134, 252, 0.15)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(187, 134, 252, 0.3)' },
  miniFavStar: { color: '#bb86fc', fontSize: 12, fontWeight: '600' }
});