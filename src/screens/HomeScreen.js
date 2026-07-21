import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import StatusTiles from '../components/StatusTiles';

export default function HomeScreen({ letters = [], setLetters, onSelectLetter }) {
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All categories', 'Personal', 'Future', 'School'];

  const filteredLetters = letters.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All categories' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const favoriteCount = letters.filter((l) => l.isFavorite).length;
  const draftCount = letters.filter((l) => l.type === 'reminder').length;
  const archivedCount = letters.filter((l) => l.isArchived).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back</Text>
        <Text style={styles.title}>Future Letter</Text>
        <Text style={styles.subtitle}>✨ Write today. Discover tomorrow.</Text>
      </View>

      {/* Hero Countdown Tile */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroTag}>⏳ NEXT LOCKED LETTER</Text>
          <View style={styles.futureBadge}>
            <Text style={styles.futureBadgeText}>Future</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Message to Me in 5 Years</Text>

        <View style={styles.timerRow}>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>4</Text>
            <Text style={styles.timeLabel}>Yrs</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>11</Text>
            <Text style={styles.timeLabel}>Mos</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>24</Text>
            <Text style={styles.timeLabel}>Days</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>8</Text>
            <Text style={styles.timeLabel}>Hrs</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>33</Text>
            <Text style={styles.timeLabel}>Min</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>8</Text>
            <Text style={styles.timeLabel}>Sec</Text>
          </View>
        </View>
      </View>

      {/* Status Summary Tiles */}
      <StatusTiles
        favoriteCount={favoriteCount}
        draftCount={draftCount}
        archivedCount={archivedCount}
      />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search reminders or letters..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Pills */}
      <Text style={styles.sectionLabel}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                {cat === 'All categories' ? '📁 All categories' : cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

{/* Feed List */}
      <Text style={styles.sectionTitle}>Your Feed ({filteredLetters.length})</Text>

      {filteredLetters.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => onSelectLetter && onSelectLetter(item)}
        >
          <View style={styles.cardLeft}>
            <Text style={styles.cardIcon}>
              {item.type === 'future' ? '🔒' : '📝'}
            </Text>
            <View style={styles.cardTextContainer}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.isFavorite && <Text style={styles.starIcon}>⭐</Text>}
              </View>
              <Text style={styles.cardSubtitle}>
                {item.type === 'future' ? 'Time Capsule • Tap to inspect' : 'Reminder • Tap to view'}
              </Text>
            </View>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category || 'Personal'}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#888888',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#ff9f43',
    marginTop: 4,
  },
  heroCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#bb86fc',
  },
  futureBadge: {
    backgroundColor: '#382247',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  futureBadgeText: {
    fontSize: 12,
    color: '#bb86fc',
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 12,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  timeNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  timeLabel: {
    fontSize: 10,
    color: '#888888',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryPill: {
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  categoryPillActive: {
    backgroundColor: '#ff9f43',
    borderColor: '#ff9f43',
  },
  categoryText: {
    fontSize: 13,
    color: '#888888',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#bb86fc',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 6,
  },
  starIcon: {
    fontSize: 12,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#382247',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#bb86fc',
    fontWeight: '600',
  },
});