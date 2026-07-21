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

  // Stats calculation
  const totalLetters = letters.length;
  const unlockedCount = letters.filter((l) => l.isUnlocked || l.type !== 'future').length;
  const scheduledCount = totalLetters - unlockedCount;

  // Toggle favorite helper
  const handleToggleFavorite = (id, event) => {
    event.stopPropagation();
    setLetters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  // Filter letters based on search query & active filter tab
  const filteredLetters = letters.filter((item) => {
    const isUnlocked = item.isUnlocked || item.type !== 'future';
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'Unlocked') return matchesSearch && isUnlocked;
    if (activeFilter === 'Scheduled') return matchesSearch && !isUnlocked;
    return matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: subTextColor }]}>Welcome back</Text>
            <Text style={[styles.headerTitle, { color: textColor }]}>My Letters</Text>
          </View>
          {onNavigateToWrite && (
            <TouchableOpacity
              style={[styles.quickWriteBtn, { backgroundColor: accentColor }]}
              onPress={onNavigateToWrite}
              activeOpacity={0.8}
            >
              <Text style={styles.quickWriteBtnText}>+ Write</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Stats Bar */}
        <View style={[styles.statsCard, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: accentColor }]}>{totalLetters}</Text>
            <Text style={[styles.statLabel, { color: subTextColor }]}>Total</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: borderColor }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: textColor }]}>{unlockedCount}</Text>
            <Text style={[styles.statLabel, { color: subTextColor }]}>Unlocked</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: borderColor }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: subTextColor }]}>{scheduledCount}</Text>
            <Text style={[styles.statLabel, { color: subTextColor }]}>Scheduled</Text>
          </View>
        </View>

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

        {/* Filter Pills */}
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

        {/* Letters List */}
        {filteredLetters.length === 0 ? (
          <View style={[styles.emptyCard, { borderColor }]}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>📜</Text>
            <Text style={[styles.emptyTitle, { color: textColor }]}>No letters found</Text>
            <Text style={[styles.emptySub, { color: subTextColor }]}>
              {searchQuery ? 'Try another search term' : 'Tap "+ Write" above to create your first letter!'}
            </Text>
          </View>
        ) : (
          filteredLetters.map((item) => {
            const isUnlocked = item.isUnlocked || item.type !== 'future';

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.letterCard, { backgroundColor: cardBg, borderColor }]}
                activeOpacity={0.7}
                onPress={() => onSelectLetter && onSelectLetter(item)}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.badgeRow}>
                    <Text style={{ fontSize: 16, marginRight: 6 }}>{isUnlocked ? '📜' : '🔒'}</Text>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: isDark ? '#2A2A2A' : '#F2EFEA' },
                      ]}
                    >
                      <Text style={[styles.categoryText, { color: accentColor }]}>
                        {item.category || 'Personal'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={(e) => handleToggleFavorite(item.id, e)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={{ fontSize: 18 }}>{item.isFavorite ? '⭐' : '☆'}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.cardTitle, { color: textColor }]}>{item.title}</Text>
                <Text style={[styles.cardContent, { color: subTextColor }]} numberOfLines={2}>
                  {item.content}
                </Text>

                <View style={[styles.cardFooter, { borderTopColor: borderColor }]}>
                  <Text style={[styles.dateText, { color: subTextColor }]}>
                    {item.unlockDate
                      ? `Opens: ${new Date(item.unlockDate).toLocaleDateString()}`
                      : 'Remind Me'}
                  </Text>
                  <Text style={[styles.viewBtn, { color: accentColor }]}>
                    {isUnlocked ? 'Read Letter ›' : 'Locked ›'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
  },
  quickWriteBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickWriteBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginBottom: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '70%',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
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
  letterCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardContent: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  dateText: {
    fontSize: 11,
  },
  viewBtn: {
    fontSize: 12,
    fontWeight: 'bold',
  },
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