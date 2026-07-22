import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';

export default function HomeScreen({
  letters = [],
  setLetters,
  onSelectLetter,
  isDark = false,
  accentColor = '#D9822B',
  onNavigateToWrite,
  onNavigateToTab,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Unlocked' | 'Scheduled'

  // Dynamic Theme Styling
  const bgColor = isDark ? '#121212' : '#FAF8F5';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#2B2B2B';
  const subTextColor = isDark ? '#AAAAAA' : '#777777';
  const borderColor = isDark ? '#2A2A2A' : '#EAE5DF';
  const inputBg = isDark ? '#262626' : '#F2EFEA';

  // Quick Action Grid Counts
  const favoritesCount = letters.filter((l) => l.isFavorite).length;
  const archiveCount = letters.filter((l) => l.isArchived).length;

  // Find next upcoming letter for the hero countdown
  const scheduledLetters = letters.filter(
    (l) => !l.isUnlocked && new Date(l.unlockDate) > new Date()
  );
  const nextLetter = scheduledLetters.length > 0 ? scheduledLetters[0] : null;

  // Toggle Favorite
  const handleToggleFavorite = (id, event) => {
    if (event && event.stopPropagation) event.stopPropagation();
    setLetters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  // Helper: Format Date String
  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper: Get Time Remaining String (e.g. "5d left", "1mo 3d left")
  const getRemainingTimeText = (unlockDateStr) => {
    const diffMs = new Date(unlockDateStr) - new Date();
    if (diffMs <= 0) return 'Arrived';

    const daysTotal = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(daysTotal / 30);
    const days = daysTotal % 30;

    if (months > 0) {
      return `${months}mo ${days}d left`;
    }
    return `${daysTotal}d left`;
  };

  // Filter letters based on search and active filter tab
  const filteredLetters = letters.filter((item) => {
    const isUnlocked = item.isUnlocked || new Date(item.unlockDate) <= new Date();
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'Unlocked') return matchesSearch && isUnlocked;
    if (activeFilter === 'Scheduled') return matchesSearch && !isUnlocked;
    return matchesSearch;
  });

  // Split into Sealed and Delivered lists for categorized display
  const sealedList = filteredLetters.filter(
    (l) => !l.isUnlocked && new Date(l.unlockDate) > new Date()
  );
  const deliveredList = filteredLetters.filter(
    (l) => l.isUnlocked || new Date(l.unlockDate) <= new Date()
  );

  // Render individual Letter Card based on your design mockup
  const renderLetterCard = (letter) => {
    const isSealed = !letter.isUnlocked && new Date(letter.unlockDate) > new Date();

    return (
      <TouchableOpacity
        key={letter.id}
        style={[styles.letterCard, { backgroundColor: cardBg, borderColor }]}
        activeOpacity={0.8}
        onPress={() => onSelectLetter && onSelectLetter(letter)}
      >
        {/* Card Header */}
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <View
              style={[
                styles.iconCircle,
                isSealed
                  ? { backgroundColor: isDark ? '#33281E' : '#F9EEDC' }
                  : { backgroundColor: isDark ? '#2A2A2A' : '#F0EDED' },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{isSealed ? '🔒' : '✉️'}</Text>
            </View>

            <View style={styles.titleContainer}>
              <Text style={[styles.cardTitle, { color: textColor }]} numberOfLines={1}>
                {letter.title}
              </Text>
              <Text style={[styles.cardSubDate, { color: subTextColor }]}>
                {isSealed
                  ? `Delivers ${formatDate(letter.unlockDate)}`
                  : `Opened ${formatDate(letter.openedAt || letter.unlockDate)}`}
              </Text>
            </View>
          </View>

          {/* Star Favorite Toggle */}
          <TouchableOpacity
            onPress={(e) => handleToggleFavorite(letter.id, e)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={{ fontSize: 20, color: accentColor }}>
              {letter.isFavorite ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card Text Preview */}
        {isSealed ? (
          <Text
            style={[
              styles.blurredContent,
              { color: isDark ? '#555555' : '#BBBBBB' },
            ]}
            numberOfLines={2}
          >
            This letter stays sealed until its delivery date. A message from your past self awaits.
          </Text>
        ) : (
          <Text style={[styles.clearContent, { color: subTextColor }]} numberOfLines={2}>
            {letter.content}
          </Text>
        )}

        {/* Card Footer Meta Row */}
        <View style={styles.cardFooterRow}>
          <View style={styles.tagWrap}>
            {Array.isArray(letter.categories) && letter.categories.length > 0 ? (
              letter.categories.map((cat, idx) => (
                <View
                  key={idx}
                  style={[styles.tagPill, { backgroundColor: isDark ? '#2A2A2A' : '#F0ECE6' }]}
                >
                  <Text style={[styles.tagText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                    {cat}
                  </Text>
                </View>
              ))
            ) : (
              <View
                style={[styles.tagPill, { backgroundColor: isDark ? '#2A2A2A' : '#F0ECE6' }]}
              >
                <Text style={[styles.tagText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                  {letter.category || 'Personal'}
                </Text>
              </View>
            )}
          </View>

          {isSealed ? (
            <Text style={[styles.timerLabel, { color: accentColor }]}>
              {getRemainingTimeText(letter.unlockDate)}
            </Text>
          ) : (
            <Text style={[styles.statusLabel, { color: subTextColor }]}>
              {letter.openedEarly ? 'Opened early' : 'Delivered'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Greeting */}
        <Text style={[styles.greeting, { color: subTextColor }]}>Welcome back</Text>
        <Text style={[styles.headerTitle, { color: textColor }]}>Future Letter</Text>
        <Text style={[styles.subQuote, { color: accentColor }]}>✨ Write today. Discover tomorrow.</Text>

        {/* Hero Card: Next To Arrive */}
        {nextLetter && (
          <View style={[styles.heroCard, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.heroHeader}>
              <Text style={[styles.heroTag, { color: accentColor }]}>⏳ NEXT TO ARRIVE</Text>
              <View style={[styles.arrivesPill, { backgroundColor: accentColor }]}>
                <Text style={styles.arrivesText}>Arrives soon</Text>
              </View>
            </View>
            <Text style={[styles.heroTitle, { color: textColor }]}>{nextLetter.title}</Text>

            {/* Countdown Grid */}
            <View style={styles.countdownRow}>
              <View style={[styles.timeBox, { backgroundColor: inputBg }]}>
                <Text style={[styles.timeNum, { color: textColor }]}>0</Text>
                <Text style={[styles.timeLabel, { color: subTextColor }]}>YEARS</Text>
              </View>
              <View style={[styles.timeBox, { backgroundColor: inputBg }]}>
                <Text style={[styles.timeNum, { color: textColor }]}>0</Text>
                <Text style={[styles.timeLabel, { color: subTextColor }]}>MONTHS</Text>
              </View>
              <View style={[styles.timeBox, { backgroundColor: inputBg }]}>
                <Text style={[styles.timeNum, { color: textColor }]}>0</Text>
                <Text style={[styles.timeLabel, { color: subTextColor }]}>DAYS</Text>
              </View>
              <View style={[styles.timeBox, { backgroundColor: inputBg }]}>
                <Text style={[styles.timeNum, { color: textColor }]}>17</Text>
                <Text style={[styles.timeLabel, { color: subTextColor }]}>HOURS</Text>
              </View>
            </View>
          </View>
        )}

        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: inputBg }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search letters..."
            placeholderTextColor={subTextColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ color: subTextColor, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills (All / Unlocked / Scheduled) */}
        <View style={styles.filterContainer}>
          {['All', 'Unlocked', 'Scheduled'].map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterPill,
                  { backgroundColor: cardBg, borderColor },
                  isActive && { backgroundColor: accentColor, borderColor: accentColor },
                ]}
                onPress={() => setActiveFilter(tab)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: textColor },
                    isActive && { color: '#FFFFFF', fontWeight: 'bold' },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Action Grid */}
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: cardBg, borderColor }]}
            activeOpacity={0.7}
            onPress={() => onNavigateToTab && onNavigateToTab('favorites')}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: isDark ? '#2A2A2A' : '#FFF6EC' }]}>
              <Text style={{ fontSize: 18 }}>⭐</Text>
            </View>
            <Text style={[styles.gridLabel, { color: textColor }]}>Favorites</Text>
            <Text style={[styles.gridCount, { color: subTextColor }]}>{favoritesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: cardBg, borderColor }]}
            activeOpacity={0.7}
            onPress={() => onNavigateToTab && onNavigateToTab('categories')}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: isDark ? '#2A2A2A' : '#FFF6EC' }]}>
              <Text style={{ fontSize: 18 }}>🗂️</Text>
            </View>
            <Text style={[styles.gridLabel, { color: textColor }]}>Categories</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: cardBg, borderColor }]}
            activeOpacity={0.7}
            onPress={() => onNavigateToTab && onNavigateToTab('achievements')}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: isDark ? '#2A2A2A' : '#FFF6EC' }]}>
              <Text style={{ fontSize: 18 }}>🏆</Text>
            </View>
            <Text style={[styles.gridLabel, { color: textColor }]}>Badges</Text>
            <Text style={[styles.gridCount, { color: subTextColor }]}>2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: cardBg, borderColor }]}
            activeOpacity={0.7}
            onPress={() => onNavigateToTab && onNavigateToTab('archive')}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: isDark ? '#2A2A2A' : '#FFF6EC' }]}>
              <Text style={{ fontSize: 18 }}>📦</Text>
            </View>
            <Text style={[styles.gridLabel, { color: textColor }]}>Archive</Text>
            <Text style={[styles.gridCount, { color: subTextColor }]}>{archiveCount}</Text>
          </TouchableOpacity>
        </View>

        {/* Big Action Button: Write a new letter */}
        <TouchableOpacity
          style={[styles.writeMainBtn, { backgroundColor: accentColor }]}
          activeOpacity={0.85}
          onPress={onNavigateToWrite}
        >
          <Text style={styles.writeMainBtnText}>✏️ Write a new letter</Text>
        </TouchableOpacity>

        {/* LETTERS FEED */}
        {filteredLetters.length === 0 ? (
          <View style={[styles.emptyCard, { borderColor }]}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>📜</Text>
            <Text style={[styles.emptyTitle, { color: textColor }]}>No letters found</Text>
            <Text style={[styles.emptySub, { color: subTextColor }]}>
              {searchQuery ? 'Try another search term' : 'Tap "Write a new letter" above to start!'}
            </Text>
          </View>
        ) : (
          <View>
            {/* SEALED LETTERS SECTION */}
            {sealedList.length > 0 && (
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[styles.sectionTitle, { color: subTextColor }]}>SEALED LETTERS</Text>
                  <Text style={[styles.sectionSubCount, { color: accentColor }]}>
                    {sealedList.length}
                  </Text>
                </View>
                {sealedList.map((letter) => renderLetterCard(letter))}
              </View>
            )}

            {/* RECENTLY DELIVERED SECTION */}
            {deliveredList.length > 0 && (
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[styles.sectionTitle, { color: subTextColor }]}>
                    RECENTLY DELIVERED
                  </Text>
                  <Text style={[styles.sectionSubCount, { color: subTextColor }]}>
                    {deliveredList.length}
                  </Text>
                </View>
                {deliveredList.map((letter) => renderLetterCard(letter))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 60,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
  },
  subQuote: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroTag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  arrivesPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  arrivesText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 3,
  },
  timeNum: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
  },
  timeLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  gridCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  gridLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  gridCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  writeMainBtn: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  writeMainBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  /* Letter Section Block */
  sectionBlock: {
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sectionSubCount: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* Custom Mockup Letter Cards */
  letterCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
  },
  cardSubDate: {
    fontSize: 12,
    marginTop: 2,
  },
  blurredContent: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  clearContent: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagWrap: {
    flexDirection: 'row',
    gap: 6,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusLabel: {
    fontSize: 12,
  },

  /* Empty State Card */
  emptyCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
  },
});