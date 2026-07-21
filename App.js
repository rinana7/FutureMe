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
import * as Notifications from 'expo-notifications';

// Tells the app how to handle notifications when the app is open in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


// Define our Stationery Themes
const THEMES = {
  classic: { name: "Classic Slate", bg: "#1e1e1e", border: "#2d2d2d", text: "#e0e0e0", accent: "#bb86fc", fontStyle: "normal" },
  parchment: { name: "Vintage Parchment", bg: "#2c251e", border: "#c3a380", text: "#f4ebd0", accent: "#c3a380", fontStyle: "italic" },
  neon: { name: "Cyberpunk Neon", bg: "#0c0214", border: "#ff007f", text: "#00f0ff", accent: "#ff007f", fontStyle: "normal" },
  moss: { name: "Forest Moss", bg: "#141c16", border: "#81b29a", text: "#f4f1de", accent: "#81b29a", fontStyle: "normal" }
};

export default function App() {
  // Navigation States: 'home' | 'create' | 'detail' | 'edit'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedLetter, setSelectedLetter] = useState(null);
  
  useEffect(() => {
  async function requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission for notifications was denied!');
    }
  }
  requestPermissions();
}, []);

  // Form Input States
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
 
  // Open Early Warning Modal State
  const [showOpenEarlyModal, setShowOpenEarlyModal] = useState(false);
  const [isEarlyUnlocked, setIsEarlyUnlocked] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Favorites' | 'Archived' | 'Drafts'
  const [selectedCategory, setSelectedCategory] = useState('All'); // For the category pill filter

  // Letters Database State
  const [sealedLetters, setSealedLetters] = useState([
    { id: 1, title: "My Goals for this Summer", unlockDate: "2026-08-31", category: "Personal", theme: "moss", content: "Hey self! Remember to keep working on your coding projects.", favorite: true, archived: false, isDraft: true, lastModified: "Jul 14, 2026" },
    { id: 2, title: "Message to Me in 5 Years", unlockDate: "2031-07-14", category: "Future", theme: "parchment", content: "Hello from 2026! You are officially 5 years older now.", favorite: true, archived: false, isDraft: false, lastModified: "Jul 14, 2026" },
    { id: 3, title: "Reminder: Call your grandparents!", unlockDate: "2026-07-20", category: "Personal", theme: "classic", content: "Just a quick reminder to check in with them.", favorite: false, archived: false, isDraft: true, lastModified: "Jul 14, 2026" },
    { id: 4, title: "Next Semester Checklist", unlockDate: "2026-09-01", category: "School", theme: "neon", content: "Get textbooks and organize the weekly schedule.", favorite: false, archived: false, isDraft: true, lastModified: "Jul 14, 2026" }
  ]);

  const [countdown, setCountdown] = useState({ title: "No upcoming letters", years: "0", months: "0", days: "0", hours: "0", minutes: "0", seconds: "0" });

  // Dynamically extract all unique categories present in our database
  const availableCategories = ['All', ...new Set(sealedLetters.map(l => l.category))];

  // Dynamic Tile Counts
  const favoriteCount = sealedLetters.filter(l => l.favorite && !l.archived).length;
  const draftCount = sealedLetters.filter(l => l.isDraft).length;
  const archivedCount = sealedLetters.filter(l => l.archived).length;

  const tiles = [
    { id: 'Favorites', label: 'Favorites', icon: '⭐', count: favoriteCount },
    { id: 'Drafts', label: 'Reminders', icon: '📝', count: draftCount },
    { id: 'Archived', label: 'Archive', icon: '📦', count: archivedCount }
  ];

  // Date Parsing Helpers
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

  const getFormattedToday = () => {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // --- LIVE TIMER ENGINE EFFECT ---
  useEffect(() => {
    const updateTimer = () => {
      const lockedLetters = sealedLetters.filter(l => !isLetterUnlocked(l.unlockDate) && !l.archived && !l.isDraft);
      if (lockedLetters.length === 0) {
        setCountdown({ title: "No locked letters 🔑", years: "0", months: "0", days: "0", hours: "0", minutes: "0", seconds: "0" });
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
      const matchesSearch = 
        letter.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        letter.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'All' || letter.category.toLowerCase() === selectedCategory.toLowerCase();

      let matchesTileFilter = true;
      if (activeFilter === 'Favorites') {
        matchesTileFilter = letter.favorite && !letter.archived;
      } else if (activeFilter === 'Drafts') {
        matchesTileFilter = letter.isDraft && !letter.archived;
      } else if (activeFilter === 'Archived') {
        matchesTileFilter = letter.archived;
      } else {
        matchesTileFilter = !letter.archived;
      }

      return matchesSearch && matchesCategory && matchesTileFilter;
    });
  };

  const handleTilePress = (tileId) => {
    setActiveFilter(activeFilter === tileId ? 'All' : tileId);
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

  // Save new letter
  const handleSaveLetter = (sealImmediately) => {
    if (!titleInput.trim()) return alert("Please give your letter a title!");

    const newLetter = {
      id: Date.now(), 
      title: titleInput,
      unlockDate: unlockInput,
      category: categoryInput.trim() || "General",
      theme: themeInput,
      content: contentInput || "No content written.",
      favorite: false,
      archived: false,
      isDraft: !sealImmediately,
      lastModified: getFormattedToday()
    };

    const handleSealDraft = async (letterTitle) => {
  // 1. Existing logic to update state/lock the letter...

  // 2. Schedule a notification (testing 5 seconds from now)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Letter Unlocked! 🔒",
      body: `Your letter "${letterTitle || 'Future Self'}" is ready to be opened.`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5, // Triggers 5 seconds after pressing lock for quick testing!
    },
  });

  alert("Draft locked! You will receive a notification in 5 seconds.");
};

    setSealedLetters([newLetter, ...sealedLetters]); 
    resetForm();
    setCurrentScreen('home');
  };

  // Save edits
  const handleUpdateLetter = (sealImmediately) => {
    if (!titleInput.trim()) return alert("Please give your letter a title!");

    setSealedLetters(sealedLetters.map(l => {
      if (l.id === selectedLetter.id) {
        return {
          ...l,
          title: titleInput,
          content: contentInput,
          unlockDate: unlockInput,
          category: categoryInput.trim() || "General",
          theme: themeInput,
          isDraft: !sealImmediately,
          lastModified: getFormattedToday()
        };
      }
      return l;
    }));

    resetForm();
    setCurrentScreen('home');
    setSelectedLetter(null);
  };

  const handleSealDraftFromDetail = (letter) => {
    Alert.alert(
      "Lock & Seal Letter 🔒",
      "Sealing this letter means you will NOT be able to open or read it again until the selected unlock date. Do you want to proceed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Lock It",
          onPress: async () => {
            // schedule notifications when sealing a draft
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Letter Unlocked! 🔒",
                body: `Your letter "${letter.title}" is ready to be opened.`,
                sound: true,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 5, // 5 second delay for testing!
              },
            });

            setSealedLetters(sealedLetters.map(l => 
              l.id === letter.id ? { ...l, isDraft: false, lastModified: getFormattedToday() } : l
            ));
            setCurrentScreen('home');
            setSelectedLetter(null);
          }
        }
      ]
    );
  };

  const startEditDraft = (letter) => {
    setSelectedLetter(letter);
    setTitleInput(letter.title);
    setContentInput(letter.content);
    setUnlockInput(letter.unlockDate);
    setCategoryInput(letter.category);
    setThemeInput(letter.theme);
    setSelectedRawDate(parseDateSafely(letter.unlockDate));
    setActivePreset('Custom Date');
    setCurrentScreen('edit');
  };

  const resetForm = () => {
    setTitleInput('');
    setContentInput('');
    setThemeInput('classic');
    setCategoryInput('Personal');
    setUnlockInput(new Date().toISOString().split('T')[0]);
    setSelectedRawDate(new Date());
    setActivePreset('Custom');
  };

  const handleSelectLetter = (letter) => {
    setIsEarlyUnlocked(false);
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
                <Text style={styles.heroBadgeText}>⏳ NEXT LOCKED LETTER</Text>
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

          {/* SEARCH BAR */}
          <View style={styles.searchContainer}>
            <TextInput 
              style={styles.searchBar} 
              placeholder="🔍 Search reminders or letters..." 
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* NEW: HORIZONTAL CATEGORY SELECTOR PILLS */}
          <View style={styles.categoryPillsWrapper}>
            <Text style={styles.categoryPillsTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScrollContent}>
              {availableCategories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.pillButton, isSelected && styles.pillButtonActive]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.pillButtonText, isSelected && styles.pillButtonTextActive]}>
                      {cat === 'All' ? '📂 All categories' : cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.writeButton} activeOpacity={0.8} onPress={() => { resetForm(); setCurrentScreen('create'); }}>
              <Text style={styles.writeButtonText}>✍️ Write a reminder/letter</Text>
            </TouchableOpacity>
          </View>

          {/* LETTERS LIST */}
          <View style={styles.sealedSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory !== 'All' ? `📁 Category: ${selectedCategory}` : 'Your Feed'} ({filteredLetters.length})
              </Text>
            </View>
            
            <View style={styles.lettersList}>
              {filteredLetters.length > 0 ? (
                filteredLetters.map((letter) => {
                  const unlocked = isLetterUnlocked(letter.unlockDate);
                  return (
                    <TouchableOpacity key={letter.id} style={styles.letterCard} activeOpacity={0.7} onPress={() => handleSelectLetter(letter)}>
                      <View style={letter.isDraft ? styles.indicatorLeftDraft : unlocked ? styles.indicatorLeftUnlocked : styles.indicatorLeftLocked} />
                      <View style={styles.letterContentWrapper}>
                        <View style={styles.letterLeft}>
                          <Text style={styles.lockIcon}>{letter.isDraft ? '📝' : unlocked ? '🔓' : '🔒'}</Text>
                          <View style={{ flexShrink: 1 }}>
                            <View style={styles.titleRow}>
                              <Text style={styles.letterTitle} numberOfLines={1}>{letter.title}</Text>
                              {letter.favorite && <Text style={styles.starMini}>⭐</Text>}
                            </View>
                            <Text style={styles.letterSubtitle}>
                              {letter.isDraft ? `Reminder • Tap to view/edit` : unlocked ? "Unlocked! Ready to read" : `Unlocks on ${formatDisplayString(letter.unlockDate)}`}
                            </Text>
                          </View>
                        </View>
                        <View style={letter.isDraft ? styles.draftBadge : unlocked ? styles.unlockedBadge : styles.categoryBadge}>
                          <Text style={letter.isDraft ? styles.draftBadgeText : unlocked ? styles.unlockedBadgeText : styles.categoryText}>{letter.category}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No items found. 📥</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- SCREEN 2 & 4: CREATE & EDIT SCREENS ---
  if (currentScreen === 'create' || currentScreen === 'edit') {
    const isEditing = currentScreen === 'edit';

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.createHeader}>
            <TouchableOpacity onPress={() => { resetForm(); setCurrentScreen('home'); }}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
            <Text style={styles.createTitle}>{isEditing ? 'Edit Content' : 'Write Reminder'}</Text>
            <View style={{ width: 80 }} /> 
          </View>

          <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>To my future self...</Text>
            <TextInput style={styles.textInputTitle} placeholder="Give your reminder a title" placeholderTextColor="#555" value={titleInput} onChangeText={setTitleInput} />

            <Text style={styles.label}>Unlock Date (If you choose to lock it)</Text>
            <TouchableOpacity style={styles.dropdownSelector} activeOpacity={0.8} onPress={() => setShowDropdown(!showDropdown)}>
              <Text style={styles.dropdownSelectorText}>📅 Target: <Text style={styles.dropdownHighlight}>{activePreset}</Text> ({formatDisplayString(unlockInput)})</Text>
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
                <Text style={styles.metaLabel}>REMINDER UNLOCK DATE</Text>
                <TextInput style={styles.metaInput} value={formatDisplayString(unlockInput)} editable={false} />
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>CATEGORY</Text>
                <TextInput style={styles.metaInput} value={categoryInput} onChangeText={setCategoryInput} placeholder="e.g. Goals" placeholderTextColor="#555" />
              </View>
            </View>

            <Text style={styles.label}>The reminder content</Text>
            <TextInput style={styles.textInputBody} placeholder="Write down your thoughts..." placeholderTextColor="#555" multiline textAlignVertical="top" value={contentInput} onChangeText={setContentInput} />
          </ScrollView>

          {/* DUAL FLOATING ACTIONS */}
          <View style={styles.doubleButtonRow}>
            <TouchableOpacity style={styles.draftButton} activeOpacity={0.8} onPress={() => isEditing ? handleUpdateLetter(false) : handleSaveLetter(false)}>
              <Text style={styles.draftButtonText}>💾 Save Reminder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingSealButton} activeOpacity={0.8} onPress={() => isEditing ? handleUpdateLetter(true) : handleSaveLetter(true)}>
              <Text style={styles.floatingSealButtonText}>Seal & Lock 🔒</Text>
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
      <SafeAreaView style={[styles.container, (unlocked || selectedLetter.isDraft) && { backgroundColor: activeTheme.bg }]}>
        <View style={[styles.createHeader, (unlocked || selectedLetter.isDraft) && { borderColor: activeTheme.border }]}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')}><Text style={[styles.backButtonText, (unlocked || selectedLetter.isDraft) && { color: activeTheme.accent }]}>⬅ Back</Text></TouchableOpacity>
          <Text style={styles.createTitle}>Letter Vault</Text>
          <TouchableOpacity onPress={() => handleDeleteLetter(selectedLetter)}><Text style={styles.trashText}>🗑️ Discard</Text></TouchableOpacity>
        </View>

        {/* DRAFT REMINDER VIEW: ALWAYS READABLE & EDITABLE */}
        {selectedLetter.isDraft ? (
          <ScrollView contentContainerStyle={styles.detailContainer}>
            <View style={styles.unlockedHeader}>
              <View style={[styles.unlockedCategoryBadge, { backgroundColor: activeTheme.accent + '25' }]}><Text style={[styles.unlockedCategoryText, { color: activeTheme.accent }]}>{selectedLetter.category} (Reminder)</Text></View>
              <Text style={styles.unlockedDateText}>Draft last saved: {selectedLetter.lastModified}</Text>
            </View>
            
            <View style={styles.headerActionRow}>
              <Text style={styles.detailLetterTitle}>{selectedLetter.title}</Text>
              <View style={styles.iconButtons}>
                <TouchableOpacity onPress={() => toggleFavorite(selectedLetter.id)} style={styles.actionIconButton}>
                  <Text style={styles.actionIcon}>{selectedLetter.favorite ? '⭐' : '☆'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.letterPaper, { backgroundColor: activeTheme.bg, borderColor: activeTheme.border }]}>
              <Text style={[styles.letterPaperText, { color: activeTheme.text, fontStyle: activeTheme.fontStyle }]}>{selectedLetter.content}</Text>
            </View>

            <View style={styles.draftDetailActionRow}>
              <TouchableOpacity style={styles.editDraftBtn} onPress={() => startEditDraft(selectedLetter)}>
                <Text style={styles.editDraftBtnText}>✏️ Edit content</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sealDraftBtn} onPress={() => handleSealDraftFromDetail(selectedLetter)}>
                <Text style={styles.sealDraftBtnText}>Lock & Seal 🔒</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : unlocked ? (
          /* UNLOCKED PERMANENT STATE */
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
          /* FULLY LOCKED STATE */
        isEarlyUnlocked ? (
          <ScrollView contentContainerStyle={styles.detailContainer}>
            <View style={styles.unlockedHeader}>
              <View style={[styles.unlockedCategoryBadge, { backgroundColor: '#ff980025' }]}>
                <Text style={[styles.unlockedCategoryText, { color: '#ff9800' }]}>⚠️ Opened Early ({selectedLetter.category})</Text>
              </View>
              <Text style={styles.unlockedDateText}>Original Unlock: {formatDisplayString(selectedLetter.unlockDate)}</Text>
            </View>
            
            <View style={styles.headerActionRow}>
              <Text style={styles.detailLetterTitle}>{selectedLetter.title}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(selectedLetter.id)} style={styles.actionIconButton}>
                <Text style={styles.actionIcon}>{selectedLetter.favorite ? '⭐' : '☆'}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.letterPaper, { backgroundColor: activeTheme.bg, borderColor: activeTheme.border }]}>
              <Text style={[styles.letterPaperText, { color: activeTheme.text, fontStyle: activeTheme.fontStyle }]}>
                {selectedLetter.content}
              </Text>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.lockedContainer}>
            <View style={styles.padlockCircle}><Text style={styles.padlockEmoji}>🔒</Text></View>
            <Text style={styles.lockedWarningTitle}>This Letter is Sealed</Text>
            <Text style={styles.lockedWarningSubtitle}>
              You wrote this with a promise not to open it before the unlock date. No peeking!
            </Text>
            
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
            </View>

            {/* OPEN EARLY TRIGGER BUTTON */}
            <TouchableOpacity 
              style={styles.openEarlyBtn} 
              activeOpacity={0.8}
              onPress={() => setShowOpenEarlyModal(true)}
            >
              <Text style={styles.openEarlyBtnText}>⚠️ Break Seal & Open Early</Text>
            </TouchableOpacity>

            {/* OPEN EARLY WARNING MODAL */}
            {showOpenEarlyModal && (
              <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                  <Text style={styles.modalEmoji}>🚨</Text>
                  <Text style={styles.modalTitle}>Break Seal Early?</Text>
                  <Text style={styles.modalBody}>
                    Opening this time capsule early ruins the surprise! The message will still be locked when you go back. Are you sure you want to bypass your past self's lock?
                  </Text>
                  <View style={styles.modalActionRow}>
                    <TouchableOpacity 
                      style={styles.modalCancelBtn} 
                      onPress={() => setShowOpenEarlyModal(false)}
                    >
                      <Text style={styles.modalCancelText}>Keep Sealed 🔒</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.modalConfirmBtn} 
                      onPress={() => {
                        setShowOpenEarlyModal(false);
                        setIsEarlyUnlocked(true);
                      }}
                    >
                      <Text style={styles.modalConfirmText}>Open Anyway</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        )
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

  // Category Pills Styles
  categoryPillsWrapper: { paddingHorizontal: 20, marginVertical: 12 },
  categoryPillsTitle: { color: '#888888', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  pillsScrollContent: { gap: 8, paddingRight: 20 },
  pillButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1e1e1e', borderWidth: 1, borderColor: '#2d2d2d' },
  pillButtonActive: { backgroundColor: '#bb86fc', borderColor: '#bb86fc' },
  pillButtonText: { color: '#aaaaaa', fontSize: 13, fontWeight: '500' },
  pillButtonTextActive: { color: '#121212', fontWeight: '700' },
  
  // Write Button
  buttonContainer: { paddingHorizontal: 20, marginTop: 8 },
  writeButton: { backgroundColor: '#bb86fc', paddingVertical: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  writeButtonText: { color: '#121212', fontSize: 16, fontWeight: '600' },
  
  // Sealed Section List
  sealedSection: { paddingHorizontal: 20, marginTop: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#888888', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  lettersList: { gap: 12 },
  letterCard: { backgroundColor: '#1e1e1e', borderRadius: 16, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: '#2d2d2d' },
  indicatorLeftDraft: { width: 6, backgroundColor: '#bb86fc' },
  indicatorLeftUnlocked: { width: 6, backgroundColor: '#00e676' },
  indicatorLeftLocked: { width: 6, backgroundColor: '#3a3a3a' },
  letterContentWrapper: { flex: 1, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  draftBadge: { backgroundColor: 'rgba(187, 134, 252, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  draftBadgeText: { color: '#bb86fc', fontSize: 11, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { color: '#555555', fontSize: 14, textAlign: 'center' },

  // Forms
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
  
  // Double Floating Action Buttons
  doubleButtonRow: { position: 'absolute', bottom: 24, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  draftButton: { flex: 1, backgroundColor: '#2d2d2d', paddingVertical: 14, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  draftButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  floatingSealButton: { flex: 1, backgroundColor: '#bb86fc', paddingVertical: 14, borderRadius: 24, alignItems: 'center', shadowColor: '#bb86fc', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
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
  
  // Draft Details Action Row
  draftDetailActionRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  editDraftBtn: { flex: 1, backgroundColor: '#2d2d2d', paddingVertical: 14, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  editDraftBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  sealDraftBtn: { flex: 1, backgroundColor: '#bb86fc', paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  sealDraftBtnText: { color: '#121212', fontSize: 14, fontWeight: '700' },

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
  miniFavStar: { color: '#bb86fc', fontSize: 12, fontWeight: '600' },
  // Open Early Styles
  openEarlyBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff5252',
    backgroundColor: '#ff525215',
  },
  openEarlyBtnText: {
    color: '#ff5252',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    width: '100%',
  },
  modalEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2d2d2d',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ff5252',
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});