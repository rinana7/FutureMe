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

export default function App() {
  // Navigation State: 'home', 'create', or 'detail'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Form Input States
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [unlockInput, setUnlockInput] = useState('Dec 31, 2026'); 
  const [categoryInput, setCategoryInput] = useState('Personal');

  // Preset Picker UI States
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePreset, setActivePreset] = useState('Custom');

  // Native Calendar Controller State
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRawDate, setSelectedRawDate] = useState(new Date());

  // Dynamic Letters Database State
  const [sealedLetters, setSealedLetters] = useState([
    { 
      id: 1, 
      title: "My Goals for this Summer", 
      unlockDate: "Aug 31, 2026", 
      category: "Personal",
      content: "Hey future self! Did you end up going on that road trip? Did you finish learning React Native? I hope you had an amazing summer and didn't spend the whole time playing video games. Write down what actually happened!"
    },
    { 
      id: 2, 
      title: "Message to Me in 5 Years", 
      unlockDate: "Jul 14, 2031", 
      category: "Future",
      content: "Hello from 2026! You are officially 5 years older now. Are you working at your dream job? Are you still drinking way too much iced coffee? I hope you are happy, healthy, and still curious."
    },
    { 
      id: 3, 
      title: "Advice for College Entry", 
      unlockDate: "Sep 1, 2027", 
      category: "School",
      content: "College is starting! Take a deep breath. You belong here. Work hard, make good friends, and remember to call your family."
    },
    {
      id: 4,
      title: "Note to self (Unlocked!)",
      unlockDate: "Jan 1, 2026", 
      category: "Instant",
      content: "This is a letter from the past that you can read right now because its unlock date has already passed. Pretty cool, right?!"
    }
  ]);

  // State to hold the live ticking countdown values
  const [countdown, setCountdown] = useState({
    title: "No upcoming letters",
    years: "0",
    months: "0",
    days: "0",
    hours: "0",
    minutes: "0",
    seconds: "0"
  });

  const tiles = [
    { label: 'Favorites', icon: '⭐', count: 3 },
    { label: 'Categories', icon: '📁', count: 0 },
    { label: 'Badges', icon: '🏆', count: 1 },
    { label: 'Archive', icon: '📦', count: 5 },
  ];

  // Helper to check if a letter is unlocked
  const isLetterUnlocked = (unlockDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const unlockDate = new Date(unlockDateStr);
    return today >= unlockDate;
  };

  // --- LIVE TIMER ENGINE EFFECT ---
  useEffect(() => {
    const updateTimer = () => {
      // 1. Filter out already unlocked letters, find only locked future ones
      const lockedLetters = sealedLetters.filter(l => !isLetterUnlocked(l.unlockDate));
      
      if (lockedLetters.length === 0) {
        setCountdown(prev => ({ ...prev, title: "All letters unlocked! 🎉" }));
        return;
      }

      // 2. Sort them to find the letter unlocking the soonest
      const sorted = [...lockedLetters].sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate));
      const targetLetter = sorted[0];

      // 3. Math calculation for time delta remaining
      const now = new Date();
      const target = new Date(targetLetter.unlockDate);
      let diffMs = target - now;

      if (diffMs <= 0) {
        setCountdown(prev => ({ ...prev, title: targetLetter.title, years: "0", months: "0", days: "0", hours: "0", minutes: "0", seconds: "0" }));
        return;
      }

      // Break down total milliseconds cleanly into time units
      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);

      // Rough year/month calculation approximations for standard UI breakdown
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

    // Run calculation once instantly on startup
    updateTimer();

    // Re-calculate the milliseconds diff precisely every single second
    const intervalId = setInterval(updateTimer, 1000);

    // Clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, [sealedLetters]);

  // Date utilities
  const formatDisplayDate = (dateObj) => {
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
      content: contentInput || "No content written in this letter.",
    };

    setSealedLetters([newLetter, ...sealedLetters]); 
    
    setTitleInput('');
    setContentInput('');
    setActivePreset('Custom');
    setCurrentScreen('home');
  };

  const handleSelectLetter = (letter) => {
    setSelectedLetter(letter);
    setCurrentScreen('detail');
  };

  const handleDeleteLetter = (letterId) => {
    Alert.alert(
      "Discard Letter",
      "Are you absolutely sure you want to permanently delete this letter? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedLetters = sealedLetters.filter(letter => letter.id !== letterId);
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
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.titleText}>Future Letter</Text>
            <Text style={styles.taglineText}>✨ Write today. Discover tomorrow.</Text>
          </View>

          {/* DYNAMIC REAL-TIME HERO COUNTDOWN CARD */}
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.writeButton} 
              activeOpacity={0.8}
              onPress={() => setCurrentScreen('create')}
            >
              <Text style={styles.writeButtonText}>✍️ Write a new letter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sealedSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sealed letters</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all ➔</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.lettersList}>
              {sealedLetters.map((letter) => {
                const unlocked = isLetterUnlocked(letter.unlockDate);
                return (
                  <TouchableOpacity 
                    key={letter.id} 
                    style={styles.letterCard} 
                    activeOpacity={0.7}
                    onPress={() => handleSelectLetter(letter)}
                  >
                    <View style={styles.letterLeft}>
                      <Text style={styles.lockIcon}>{unlocked ? '🔓' : '🔒'}</Text>
                      <View>
                        <Text style={styles.letterTitle}>{letter.title}</Text>
                        <Text style={styles.letterSubtitle}>
                          {unlocked ? "Unlocked! Ready to read" : `Unlocks on ${letter.unlockDate}`}
                        </Text>
                      </View>
                    </View>
                    <View style={unlocked ? styles.unlockedBadge : styles.categoryBadge}>
                      <Text style={unlocked ? styles.unlockedBadgeText : styles.categoryText}>
                        {letter.category}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          <View style={styles.createHeader}>
            <TouchableOpacity onPress={() => setCurrentScreen('home')}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.createTitle}>New Letter</Text>
            <View style={{ width: 80 }} /> 
          </View>

          <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>To my future self...</Text>
            <TextInput
              style={styles.textInputTitle}
              placeholder="Give your letter a title"
              placeholderTextColor="#555"
              value={titleInput}
              onChangeText={setTitleInput}
            />

            <Text style={styles.label}>When should this unlock?</Text>
            
            <TouchableOpacity 
              style={styles.dropdownSelector} 
              activeOpacity={0.8}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={styles.dropdownSelectorText}>
                📅 Option: <Text style={styles.dropdownHighlight}>{activePreset}</Text> ({unlockInput})
              </Text>
              <Text style={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => setDateFromPreset(1, 'Tomorrow')}>
                  <Text style={styles.dropdownItemText}>🌅 Tomorrow</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => setDateFromPreset(3, '3 Days')}>
                  <Text style={styles.dropdownItemText}>⏳ In 3 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => setDateFromPreset(7, '1 Week')}>
                  <Text style={styles.dropdownItemText}>📅 In 1 Week</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownItem} 
                  onPress={() => {
                    setShowDropdown(false);
                    setShowCalendar(true);
                  }}
                >
                  <Text style={styles.dropdownItemText}>📆 Open Calendar Visual Picker...</Text>
                </TouchableOpacity>
              </View>
            )}

            {showCalendar && (
              <View style={styles.calendarWrapper}>
                {Platform.OS === 'ios' && (
                  <View style={styles.iosCalendarHeader}>
                    <Text style={styles.iosCalendarTitle}>Select Unlock Date</Text>
                    <TouchableOpacity onPress={() => setShowCalendar(false)}>
                      <Text style={styles.iosDoneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <DateTimePicker
                  value={selectedRawDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                  minimumDate={new Date()} 
                  onChange={onCalendarChange}
                  themeVariant="dark"
                />
              </View>
            )}

            <View style={styles.metaRow}>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>EXACT UNLOCK DATE</Text>
                <TextInput
                  style={styles.metaInput}
                  value={unlockInput}
                  editable={false} 
                  placeholder="Select via dropdown above"
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

  // --- SCREEN 3: DETAIL SCREEN (LOCKED or UNLOCKED) ---
  if (currentScreen === 'detail' && selectedLetter) {
    const unlocked = isLetterUnlocked(selectedLetter.unlockDate);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.createHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')}>
            <Text style={styles.backButtonText}>⬅ Back</Text>
          </TouchableOpacity>
          <Text style={styles.createTitle}>Letter Vault</Text>
          <TouchableOpacity onPress={() => handleDeleteLetter(selectedLetter.id)}>
            <Text style={styles.trashText}>🗑️ Discard</Text>
          </TouchableOpacity>
        </View>

        {unlocked ? (
          /* UNLOCKED VIEW: READ THE LETTER */
          <ScrollView contentContainerStyle={styles.detailContainer}>
            <View style={styles.unlockedHeader}>
              <View style={styles.unlockedCategoryBadge}>
                <Text style={styles.unlockedCategoryText}>{selectedLetter.category}</Text>
              </View>
              <Text style={styles.unlockedDateText}>Unsealed on {selectedLetter.unlockDate}</Text>
            </View>

            <Text style={styles.detailLetterTitle}>{selectedLetter.title}</Text>
            
            <View style={styles.letterPaper}>
              <Text style={styles.letterPaperText}>{selectedLetter.content}</Text>
            </View>
          </ScrollView>
        ) : (
          /* LOCKED VIEW */
          <View style={styles.lockedContainer}>
            <View style={styles.padlockCircle}>
              <Text style={styles.padlockEmoji}>🔒</Text>
            </View>
            
            <Text style={styles.lockedWarningTitle}>This Letter is Sealed</Text>
            <Text style={styles.lockedWarningSubtitle}>
              You wrote this with a promise not to open it before the unlock date. No peeking!
            </Text>

            <View style={styles.lockDetailsCard}>
              <Text style={styles.lockDetailsLabel}>DESTINATION DATE</Text>
              <Text style={styles.lockDetailsValue}>{selectedLetter.unlockDate}</Text>
              
              <View style={styles.lockedSeparator} />
              
              <Text style={styles.lockDetailsLabel}>CATEGORY</Text>
              <Text style={styles.lockDetailsValue}>{selectedLetter.category}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 64 : 48, 
    paddingBottom: 12,
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
    marginHorizontal: 2, // Margins tweaked slightly to accommodate the extra grid boxes neatly
    alignItems: 'center',
  },
  timeVal: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  timeLabel: {
    color: '#888888',
    fontSize: 9,
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
  unlockedBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unlockedBadgeText: {
    color: '#00e676',
    fontSize: 11,
    fontWeight: '600',
  },
  
  // --- CREATE/DETAIL HEADER ---
  createHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 64 : 48,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#2d2d2d',
  },
  cancelText: {
    color: '#ff5c5c',
    fontSize: 16,
    fontWeight: '500',
    width: 80,
  },
  backButtonText: {
    color: '#bb86fc',
    fontSize: 16,
    fontWeight: '500',
    width: 80,
  },
  trashText: {
    color: '#ff5c5c',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
    width: 80,
  },
  createTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  formContainer: {
    padding: 20,
    paddingBottom: 140, 
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
  dropdownSelector: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2d2d2d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownSelectorText: {
    color: '#ffffff',
    fontSize: 14,
  },
  dropdownHighlight: {
    color: '#bb86fc',
    fontWeight: '700',
  },
  dropdownArrow: {
    color: '#888888',
    fontSize: 12,
  },
  dropdownMenu: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d2d',
  },
  dropdownItemText: {
    color: '#ffffff',
    fontSize: 14,
  },
  calendarWrapper: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#bb86fc',
  },
  iosCalendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d2d',
  },
  iosCalendarTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  iosDoneText: {
    color: '#bb86fc',
    fontSize: 14,
    fontWeight: '700',
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
    color: '#aaaaaa',
    backgroundColor: '#1a1a1a',
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
  floatingBottomRow: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  floatingSealButton: {
    backgroundColor: '#bb86fc',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#bb86fc',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingSealButtonText: {
    color: '#121212',
    fontSize: 15,
    fontWeight: '700',
  },

  // --- DETAIL VIEW STYLES ---
  detailContainer: {
    padding: 20,
  },
  unlockedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  unlockedCategoryBadge: {
    backgroundColor: 'rgba(187, 134, 252, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unlockedCategoryText: {
    color: '#bb86fc',
    fontSize: 13,
    fontWeight: '600',
  },
  unlockedDateText: {
    color: '#888888',
    fontSize: 13,
  },
  detailLetterTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },
  letterPaper: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#2d2d2d',
    borderRadius: 16,
    padding: 20,
    minHeight: 250,
  },
  letterPaperText: {
    color: '#e0e0e0',
    fontSize: 16,
    lineHeight: 26,
  },

  // --- LOCKED VAULT VIEW STYLES ---
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  padlockCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#bb86fc',
  },
  padlockEmoji: {
    fontSize: 48,
  },
  lockedWarningTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  lockedWarningSubtitle: {
    color: '#888888',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 32,
  },
  lockDetailsCard: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#2d2d2d',
    borderRadius: 16,
    width: '100%',
    padding: 20,
    marginBottom: 32,
  },
  lockDetailsLabel: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 6,
  },
  lockDetailsValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  lockedSeparator: {
    height: 1,
    backgroundColor: '#2d2d2d',
    marginVertical: 14,
  },
  lockedTagline: {
    color: '#bb86fc',
    fontSize: 13,
    fontWeight: '500',
  },
});