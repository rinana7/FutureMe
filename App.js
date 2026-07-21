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

// Tells the app how to handle notifications when open in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Define Stationery Themes
const THEMES = {
  classic: { name: "Classic Slate", bg: "#1e1e1e", border: "#2d2d2d", text: "#e0e0e0", accent: "#bb86fc", fontStyle: "normal" },
  parchment: { name: "Vintage Parchment", bg: "#2c251e", border: "#c3a380", text: "#f4ebd0", accent: "#c3a380", fontStyle: "italic" },
  neon: { name: "Cyberpunk Neon", bg: "#0c0214", border: "#ff007f", text: "#00f0ff", accent: "#ff007f", fontStyle: "normal" },
  moss: { name: "Forest Moss", bg: "#141c16", border: "#81b29a", text: "#f4f1de", accent: "#81b29a", fontStyle: "normal" }
};

export default function App() {
  // Navigation States
  // activeTab: 'home' | 'countdown' | 'write' | 'archive' | 'settings'
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isViewingDetail, setIsViewingDetail] = useState(false);
  
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
  const [isEditingDraft, setIsEditingDraft] = useState(false);
 
  // Open Early Warning Modal State
  const [showOpenEarlyModal, setShowOpenEarlyModal] = useState(false);
  const [isEarlyUnlocked, setIsEarlyUnlocked] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); 
  const [selectedCategory, setSelectedCategory] = useState('All'); 

  // Letters Database State
  const [sealedLetters, setSealedLetters] = useState([
    { id: 1, title: "My Goals for this Summer", unlockDate: "2026-08-31", category: "Personal", theme: "moss", content: "Hey self! Remember to keep working on your coding projects.", favorite: true, archived: false, isDraft: true, lastModified: "Jul 14, 2026" },
    { id: 2, title: "Message to Me in 5 Years", unlockDate: "2031-07-14", category: "Future", theme: "parchment", content: "Hello from 2026! You are officially 5 years older now.", favorite: true, archived: false, isDraft: false, lastModified: "Jul 14, 2026" },
    { id: 3, title: "Reminder: Call your grandparents!", unlockDate: "2026-07-20", category: "Personal", theme: "classic", content: "Just a quick reminder to check in with them.", favorite: false, archived: false, isDraft: true, lastModified: "Jul 14, 2026" },
    { id: 4, title: "Next Semester Checklist", unlockDate: "2026-09-01", category: "School", theme: "neon", content: "Get textbooks and organize the weekly schedule.", favorite: false, archived: false, isDraft: true, lastModified: "Jul 14, 2026" }
  ]);

  const [countdown, setCountdown] = useState({ title: "No upcoming letters", years: "0", months: "0", days: "0", hours: "0", minutes: "0", seconds: "0" });

  // Dynamically extract unique categories
  const availableCategories = ['All', ...new Set(sealedLetters.map(l => l.category))];

  // Dynamic Tile Counts
  const favoriteCount = sealedLetters.filter(l => l.favorite && !l.archived).length;
  const draftCount = sealedLetters.filter(l => l.isDraft).length;
  const archivedCount = sealedLetters.filter(l => l.archived).length;

const tiles = [
    { id: 'Favorites', label: 'Favorites ', icon: '⭐', count: favoriteCount },
    { id: 'Drafts', label: 'Reminders ', icon: '📝', count: draftCount },
    { id: 'Archived', label: 'Archive ', icon: '📦', count: archivedCount }
  ];
  // Date Helpers
  const parseDateSafely = (dateStr) => {
    if (!dateStr) return new Date();
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

  // Live Timer Engine
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
    setIsViewingDetail(false);
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

  const resetForm = () => {
    setTitleInput('');
    setContentInput('');
    setThemeInput('classic');
    setCategoryInput('Personal');
    setUnlockInput(new Date().toISOString().split('T')[0]);
    setSelectedRawDate(new Date());
    setActivePreset('Custom');
    setIsEditingDraft(false);
  };

  const handleSelectLetter = (letter) => {
    setIsEarlyUnlocked(false);
    setSelectedLetter(letter);
    setIsViewingDetail(true);
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
            setSealedLetters(sealedLetters.filter(l => l.id !== letter.id));
            setIsViewingDetail(false);
            setSelectedLetter(null);
          }
        }
      ]
    );
  };

  const handleSaveLetter = async (sealImmediately) => {
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

    if (sealImmediately) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Letter Unlocked! 🔒",
          body: `Your letter "${newLetter.title}" is ready to be opened.`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        },
      });
      alert("Letter locked! You will receive a notification when it unlocks.");
    }

    setSealedLetters([newLetter, ...sealedLetters]); 
    resetForm();
    setActiveTab('home');
  };

  const handleUpdateLetter = async (sealImmediately) => {
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

    if (sealImmediately) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Letter Unlocked! 🔒",
          body: `Your letter "${titleInput}" is ready to be opened.`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        },
      });
      alert("Letter locked!");
    }

    resetForm();
    setIsViewingDetail(false);
    setSelectedLetter(null);
    setActiveTab('home');
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
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Letter Unlocked! 🔒",
                body: `Your letter "${letter.title}" is ready to be opened.`,
                sound: true,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 5,
              },
            });

            setSealedLetters(sealedLetters.map(l => 
              l.id === letter.id ? { ...l, isDraft: false, lastModified: getFormattedToday() } : l
            ));
            setIsViewingDetail(false);
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
    setIsEditingDraft(true);
    setIsViewingDetail(false);
    setActiveTab('write');
  };

  // -------------------------------------------------------------
  // SCREEN RENDER FUNCTIONS
  // -------------------------------------------------------------
  const renderHomeScreen = () => {
    const filteredLetters = getFilteredLetters();

    return (
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

        {/* DASHBOARD TILES */}
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

        {/* CATEGORY PILLS */}
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

        {/* FEED LIST */}
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
    );
  };

  const renderCountdownScreen = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Countdown Vault</Text>
        <Text style={styles.taglineText}>Track all your active time capsules in real time.</Text>
      </View>
      <View style={styles.heroContainer}>
        <View style={styles.heroCard}>
          <Text style={styles.heroBadgeText}>⏳ NEXT UNLOCK</Text>
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
        </View>
      </View>
    </ScrollView>
  );

  const renderWriteScreen = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={styles.createHeader}>
        <TouchableOpacity onPress={() => { resetForm(); setActiveTab('home'); }}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
        <Text style={styles.createTitle}>{isEditingDraft ? 'Edit Reminder' : 'Write Reminder'}</Text>
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

      <View style={styles.doubleButtonRow}>
        <TouchableOpacity style={styles.draftButton} activeOpacity={0.8} onPress={() => isEditingDraft ? handleUpdateLetter(false) : handleSaveLetter(false)}>
          <Text style={styles.draftButtonText}>💾 Save Reminder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingSealButton} activeOpacity={0.8} onPress={() => isEditingDraft ? handleUpdateLetter(true) : handleSaveLetter(true)}>
          <Text style={styles.floatingSealButtonText}>Seal & Lock 🔒</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  const renderArchiveScreen = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Archive</Text>
        <Text style={styles.taglineText}>Opened memories & stored letters</Text>
      </View>
      {sealedLetters.filter(l => l.archived).map(letter => (
        <TouchableOpacity key={letter.id} style={styles.letterCard} onPress={() => handleSelectLetter(letter)}>
          <View style={styles.letterContentWrapper}>
            <Text style={styles.letterTitle}>{letter.title}</Text>
            <Text style={styles.letterSubtitle}>Archived letter</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSettingsScreen = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Settings</Text>
        <Text style={styles.taglineText}>App preferences & themes</Text>
      </View>
    </ScrollView>
  );

  // -------------------------------------------------------------
  // DETAIL VIEW OVERLAY
  // -------------------------------------------------------------
  if (isViewingDetail && selectedLetter) {
    const unlocked = isLetterUnlocked(selectedLetter.unlockDate);
    const activeTheme = THEMES[selectedLetter.theme] || THEMES.classic;

    return (
      <SafeAreaView style={[styles.container, (unlocked || selectedLetter.isDraft) && { backgroundColor: activeTheme.bg }]}>
        <View style={[styles.createHeader, (unlocked || selectedLetter.isDraft) && { borderColor: activeTheme.border }]}>
          <TouchableOpacity onPress={() => setIsViewingDetail(false)}><Text style={[styles.backButtonText, (unlocked || selectedLetter.isDraft) && { color: activeTheme.accent }]}>⬅ Back</Text></TouchableOpacity>
          <Text style={styles.createTitle}>Letter Vault</Text>
          <TouchableOpacity onPress={() => handleDeleteLetter(selectedLetter)}><Text style={styles.trashText}>🗑️ Discard</Text></TouchableOpacity>
        </View>

        {selectedLetter.isDraft ? (
          <ScrollView contentContainerStyle={styles.detailContainer}>
            <View style={styles.unlockedHeader}>
              <View style={[styles.unlockedCategoryBadge, { backgroundColor: activeTheme.accent + '25' }]}><Text style={[styles.unlockedCategoryText, { color: activeTheme.accent }]}>{selectedLetter.category} (Reminder)</Text></View>
              <Text style={styles.unlockedDateText}>Draft last saved: {selectedLetter.lastModified}</Text>
            </View>
            
            <View style={styles.headerActionRow}>
              <Text style={styles.detailLetterTitle}>{selectedLetter.title}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(selectedLetter.id)} style={styles.actionIconButton}>
                <Text style={styles.actionIcon}>{selectedLetter.favorite ? '⭐' : '☆'}</Text>
              </TouchableOpacity>
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
        ) : isEarlyUnlocked ? (
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

            <TouchableOpacity style={styles.openEarlyBtn} activeOpacity={0.8} onPress={() => setShowOpenEarlyModal(true)}>
              <Text style={styles.openEarlyBtnText}>⚠️ Break Seal & Open Early</Text>
            </TouchableOpacity>

            {showOpenEarlyModal && (
              <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                  <Text style={styles.modalEmoji}>🚨</Text>
                  <Text style={styles.modalTitle}>Break Seal Early?</Text>
                  <Text style={styles.modalBody}>
                    Opening this time capsule early ruins the surprise! The countdown is still active for a reason. Are you sure you want to bypass your past self's lock?
                  </Text>
                  <View style={styles.modalActionRow}>
                    <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowOpenEarlyModal(false)}>
                      <Text style={styles.modalCancelText}>Keep Sealed 🔒</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalConfirmBtn} onPress={() => { setShowOpenEarlyModal(false); setIsEarlyUnlocked(true); }}>
                      <Text style={styles.modalConfirmText}>Open Anyway</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------
  // MAIN COMPONENT RETURN BLOCK
  // -------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHomeScreen()}
        {activeTab === 'countdown' && renderCountdownScreen()}
        {activeTab === 'write' && renderWriteScreen()}
        {activeTab === 'archive' && renderArchiveScreen()}
        {activeTab === 'settings' && renderSettingsScreen()}
      </View>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomBarContainer}>
        <TouchableOpacity style={styles.navTab} onPress={() => { setIsViewingDetail(false); setActiveTab('home'); }}>
          <Text style={[styles.navIcon, activeTab === 'home' && styles.navIconActive]}>🏠</Text>
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => { setIsViewingDetail(false); setActiveTab('countdown'); }}>
          <Text style={[styles.navIcon, activeTab === 'countdown' && styles.navIconActive]}>⌛</Text>
          <Text style={[styles.navLabel, activeTab === 'countdown' && styles.navLabelActive]}>Countdown</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.floatingWriteBtn} activeOpacity={0.85} onPress={() => { resetForm(); setIsViewingDetail(false); setActiveTab('write'); }}>
          <Text style={styles.floatingWriteIcon}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => { setIsViewingDetail(false); setActiveTab('archive'); }}>
          <Text style={[styles.navIcon, activeTab === 'archive' && styles.navIconActive]}>📥</Text>
          <Text style={[styles.navLabel, activeTab === 'archive' && styles.navLabelActive]}>Archive</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => { setIsViewingDetail(false); setActiveTab('settings'); }}>
          <Text style={[styles.navIcon, activeTab === 'settings' && styles.navIconActive]}>⚙️</Text>
          <Text style={[styles.navLabel, activeTab === 'settings' && styles.navLabelActive]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 24},
  scrollContainer: { padding: 20 },
  header: { marginBottom: 20 },
  welcomeText: { color: '#888', fontSize: 14, fontWeight: '500' },
  titleText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  taglineText: { color: '#aaa', fontSize: 14, marginTop: 4 },
  heroContainer: { marginBottom: 20 },
  heroCard: { backgroundColor: '#1e1e1e', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#333' },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  heroBadgeText: { color: '#bb86fc', fontSize: 11, fontWeight: 'bold' },
  milestoneTag: { backgroundColor: '#bb86fc25', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  milestoneText: { color: '#bb86fc', fontSize: 10, fontWeight: 'bold' },
  heroTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  countdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeBox: { alignItems: 'center', backgroundColor: '#2a2a2a', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, minWidth: 45 },
  timeVal: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  timeLabel: { color: '#888', fontSize: 9, marginTop: 2 },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  tileButton: { flex: 1, backgroundColor: '#1e1e1e', padding: 12, borderRadius: 12, marginHorizontal: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#2d2d2d' },
  tileButtonActive: { borderColor: '#bb86fc', backgroundColor: '#251b2e' },
  tileLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  iconCircleActive: { backgroundColor: '#bb86fc' },
  tileIcon: { fontSize: 12 },
  tileLabel: { color: '#aaa', fontSize: 11, fontWeight: '500' },
  tileLabelActive: { color: '#fff', fontWeight: 'bold' },
  tileCount: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  tileCountActive: { color: '#bb86fc' },
  searchContainer: { marginBottom: 15 },
  searchBar: { backgroundColor: '#1e1e1e', color: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2d2d2d', fontSize: 14 },
  categoryPillsWrapper: { marginBottom: 15 },
  categoryPillsTitle: { color: '#888', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  pillsScrollContent: { paddingRight: 10 },
  pillButton: { backgroundColor: '#1e1e1e', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#2d2d2d' },
  pillButtonActive: { backgroundColor: '#e08a1e', borderColor: '#e08a1e' },
  pillButtonText: { color: '#aaa', fontSize: 12, fontWeight: '500' },
  pillButtonTextActive: { color: '#fff', fontWeight: 'bold' },
  sealedSection: { marginTop: 10 },
  sectionHeader: { marginBottom: 10 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  lettersList: { gap: 10 },
  letterCard: { backgroundColor: '#1e1e1e', borderRadius: 12, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: '#2d2d2d', minHeight: 65 },
  indicatorLeftDraft: { width: 5, backgroundColor: '#bb86fc' },
  indicatorLeftUnlocked: { width: 5, backgroundColor: '#4caf50' },
  indicatorLeftLocked: { width: 5, backgroundColor: '#757575' },
  letterContentWrapper: { flex: 1, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  letterLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  lockIcon: { fontSize: 18, marginRight: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  letterTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  starMini: { fontSize: 12 },
  letterSubtitle: { color: '#888', fontSize: 11, marginTop: 2 },
  categoryBadge: { backgroundColor: '#2a2a2a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryText: { color: '#aaa', fontSize: 10, fontWeight: '500' },
  draftBadge: { backgroundColor: '#bb86fc25', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  draftBadgeText: { color: '#bb86fc', fontSize: 10, fontWeight: 'bold' },
  unlockedBadge: { backgroundColor: '#4caf5025', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  unlockedBadgeText: { color: '#4caf50', fontSize: 10, fontWeight: 'bold' },
  emptyContainer: { padding: 30, alignItems: 'center' },
  emptyText: { color: '#666', fontSize: 14 },
  createHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d2d2d' },
  cancelText: { color: '#ff5252', fontSize: 14, fontWeight: '600' },
  backButtonText: { color: '#bb86fc', fontSize: 14, fontWeight: '600' },
  trashText: { color: '#ff5252', fontSize: 14 },
  createTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  formContainer: { padding: 20 },
  label: { color: '#888', fontSize: 12, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  textInputTitle: { backgroundColor: '#1e1e1e', color: '#fff', padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: '#2d2d2d' },
  dropdownSelector: { backgroundColor: '#1e1e1e', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2d2d2d', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdownSelectorText: { color: '#aaa', fontSize: 13 },
  dropdownHighlight: { color: '#bb86fc', fontWeight: 'bold' },
  dropdownArrow: { color: '#888', fontSize: 10 },
  dropdownMenu: { backgroundColor: '#2a2a2a', borderRadius: 10, marginTop: 4, borderWidth: 1, borderColor: '#333' },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  dropdownItemText: { color: '#fff', fontSize: 13 },
  calendarWrapper: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 10, marginTop: 8, borderWidth: 1, borderColor: '#333' },
  iosCalendarHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8 },
  iosCalendarTitle: { color: '#fff', fontWeight: 'bold' },
  iosDoneText: { color: '#bb86fc', fontWeight: 'bold' },
  themeSelectorContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  themeCard: { width: '48%', padding: 12, borderRadius: 10, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  themeCardText: { fontSize: 12, fontWeight: 'bold' },
  themeChecked: { color: '#fff', fontWeight: 'bold' },
  metaRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  metaCol: { flex: 1 },
  metaLabel: { color: '#666', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  metaInput: { backgroundColor: '#1e1e1e', color: '#fff', padding: 10, borderRadius: 8, fontSize: 12, borderWidth: 1, borderColor: '#2d2d2d' },
  textInputBody: { backgroundColor: '#1e1e1e', color: '#fff', padding: 12, borderRadius: 10, fontSize: 14, minHeight: 120, borderWidth: 1, borderColor: '#2d2d2d' },
  doubleButtonRow: { flexDirection: 'row', padding: 16, gap: 10, backgroundColor: '#121212', borderTopWidth: 1, borderTopColor: '#2d2d2d' },
  draftButton: { flex: 1, backgroundColor: '#2a2a2a', padding: 14, borderRadius: 10, alignItems: 'center' },
  draftButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  floatingSealButton: { flex: 1, backgroundColor: '#bb86fc', padding: 14, borderRadius: 10, alignItems: 'center' },
  floatingSealButtonText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  detailContainer: { padding: 20 },
  unlockedHeader: { marginBottom: 12 },
  unlockedCategoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 4 },
  unlockedCategoryText: { fontSize: 11, fontWeight: 'bold' },
  unlockedDateText: { color: '#888', fontSize: 11 },
  headerActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailLetterTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', flex: 1 },
  iconButtons: { flexDirection: 'row', gap: 10 },
  actionIconButton: { padding: 6, backgroundColor: '#2a2a2a', borderRadius: 8 },
  actionIcon: { fontSize: 16 },
  letterPaper: { padding: 16, borderRadius: 12, borderWidth: 1, minHeight: 180 },
  letterPaperText: { fontSize: 15, lineHeight: 22 },
  draftDetailActionRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  editDraftBtn: { flex: 1, backgroundColor: '#2a2a2a', padding: 14, borderRadius: 10, alignItems: 'center' },
  editDraftBtnText: { color: '#fff', fontWeight: 'bold' },
  sealDraftBtn: { flex: 1, backgroundColor: '#bb86fc', padding: 14, borderRadius: 10, alignItems: 'center' },
  sealDraftBtnText: { color: '#000', fontWeight: 'bold' },
  lockedContainer: { flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center' },
  padlockCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  padlockEmoji: { fontSize: 32 },
  lockedWarningTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  lockedWarningSubtitle: { color: '#aaa', fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 24 },
  lockDetailsCard: { backgroundColor: '#1e1e1e', width: '100%', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#2d2d2d' },
  lockDetailsLabel: { color: '#666', fontSize: 10, fontWeight: 'bold' },
  lockDetailsValue: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  lockedSeparator: { height: 1, backgroundColor: '#2d2d2d', marginVertical: 12 },
  inlineActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  favoriteButtonMini: { backgroundColor: '#2a2a2a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  miniFavStar: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  openEarlyBtn: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: '#ff5252', backgroundColor: '#ff525215' },
  openEarlyBtnText: { color: '#ff5252', fontSize: 14, fontWeight: '600' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, zIndex: 1000 },
  modalCard: { backgroundColor: '#1e1e1e', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#333', width: '100%' },
  modalEmoji: { fontSize: 40, marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  modalBody: { fontSize: 14, color: '#aaa', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  modalActionRow: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#2d2d2d', alignItems: 'center' },
  modalCancelText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  modalConfirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#ff5252', alignItems: 'center' },
  modalConfirmText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  bottomBarContainer: { flexDirection: 'row', height: 65, backgroundColor: '#fffdf7', borderTopWidth: 1, borderTopColor: '#f0eae1', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 10, paddingBottom: 5 },
  navTab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 20, opacity: 0.5 },
  navIconActive: { opacity: 1 },
  navLabel: { fontSize: 11, color: '#8e8a83', marginTop: 2, fontWeight: '500' },
  navLabelActive: { color: '#e08a1e', fontWeight: '700' },
  floatingWriteBtn: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#e08a1e', alignItems: 'center', justifyContent: 'center', marginTop: -26, elevation: 6, shadowColor: '#e08a1e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 6 },
  floatingWriteIcon: { fontSize: 30, color: '#ffffff', fontWeight: '300', marginTop: -2 },
});