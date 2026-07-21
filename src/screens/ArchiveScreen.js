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

export default function ArchiveScreen({
  letters = [],
  isDark = false,
  accentColor = '#D9822B',
  onSelectLetter,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All'); // 'All' | 'Delivered' | 'Written'

  // Dynamic Theme Colors
  const bgColor = isDark ? '#121212' : '#FAF8F5';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#2B2B2B';
  const subTextColor = isDark ? '#AAAAAA' : '#777777';
  const borderColor = isDark ? '#2A2A2A' : '#EAE5DF';
  const inputBg = isDark ? '#262626' : '#F2EFEA';

  // Filter archived letters
  const filteredLetters = letters.filter((letter) => {
    const matchesSearch =
      letter.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.content?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'Delivered') {
      return matchesSearch && letter.isDelivered;
    }
    if (selectedFilter === 'Written') {
      return matchesSearch && !letter.isDelivered;
    }
    return matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Header */}
        <Text style={[styles.headerTitle, { color: textColor }]}>Archive</Text>
        <Text style={[styles.headerSubtitle, { color: subTextColor }]}>
          Your saved memories and past letters
        </Text>

        {/* Search Input */}
        <View style={[styles.searchBox, { backgroundColor: inputBg }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search archive..."
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

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {['All', 'Delivered', 'Written'].map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  { backgroundColor: cardBg, borderColor },
                  isActive && { backgroundColor: accentColor, borderColor: accentColor },
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isDark ? '#FFFFFF' : '#555555' },
                    isActive && { color: '#FFFFFF', fontWeight: 'bold' },
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Archive List / Empty State */}
        {filteredLetters.length === 0 ? (
          <View style={[styles.emptyContainer, { borderColor }]}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={[styles.emptyTitle, { color: textColor }]}>No Archived Letters</Text>
            <Text style={[styles.emptySub, { color: subTextColor }]}>
              {searchQuery
                ? 'No results matched your search.'
                : 'Letters you archive will safely stay here.'}
            </Text>
          </View>
        ) : (
          filteredLetters.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.letterCard, { backgroundColor: cardBg, borderColor }]}
              activeOpacity={0.7}
              onPress={() => onSelectLetter && onSelectLetter(item)}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.categoryTag,
                    { backgroundColor: isDark ? '#2A2A2A' : '#F2EFEA' },
                  ]}
                >
                  <Text style={[styles.categoryText, { color: accentColor }]}>
                    {item.category || 'Personal'}
                  </Text>
                </View>
                <Text style={{ fontSize: 16 }}>{item.isFavorite ? '⭐' : '📁'}</Text>
              </View>

              <Text style={[styles.cardTitle, { color: textColor }]}>{item.title}</Text>
              <Text
                style={[styles.cardPreview, { color: subTextColor }]}
                numberOfLines={2}
              >
                {item.content}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={[styles.cardDate, { color: subTextColor }]}>
                  {item.unlockDate
                    ? `Unlocked ${new Date(item.unlockDate).toLocaleDateString()}`
                    : 'Saved to Archive'}
                </Text>
                <Text style={[styles.readMore, { color: accentColor }]}>View ›</Text>
              </View>
            </TouchableOpacity>
          ))
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
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 18,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
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
  filterRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  letterCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardPreview: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 11,
  },
  readMore: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 18,
    padding: 36,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
  },
});