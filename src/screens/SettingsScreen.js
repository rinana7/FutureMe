import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';

export default function SettingsScreen({
  letters = [],
  setLetters,
  themeMode,
  setThemeMode,
  accentColor,
  setAccentColor,
  onBack,
}) {
  const [activeModal, setActiveModal] = useState(null); // 'themes' | 'categories' | 'favorites' | 'achievements' | 'deleted'

  const accentColors = [
    '#007AFF', '#2AC7E2', '#8E44AD', '#EC407A',
    '#E74C3C', '#F39C12', '#F1C40F', '#27AE60',
    '#00A896', '#D9822B', '#2C3E50',
  ];

  const categories = [
    { name: 'Goals', count: 3 },
    { name: 'Memories', count: 1 },
    { name: 'School', count: 2 },
    { name: 'Personal', count: 3 },
    { name: 'Family', count: 1 },
    { name: 'Friends', count: 1 },
    { name: 'Hobbies', count: 1 },
    { name: 'Travel', count: 1 },
  ];

  const achievements = [
    { title: 'First Letter', desc: 'Write your first future letter.', unlocked: true, icon: '✏️' },
    { title: 'Long-Term Planner', desc: 'Schedule a letter more than one year in advance.', unlocked: true, icon: '⏳' },
    { title: 'Designer', desc: "Customize your app's appearance.", unlocked: true, icon: '🎨' },
    { title: 'Future Messenger', desc: 'Schedule 10 letters.', unlocked: false, icon: '🔒' },
    { title: 'Reflection Master', desc: 'Open 25 letters.', unlocked: false, icon: '🔒' },
    { title: 'Collector', desc: 'Favorite 25 letters.', unlocked: false, icon: '🔒' },
    { title: 'Organizer', desc: 'Create 10 categories.', unlocked: false, icon: '🔒' },
  ];

  const isDark = themeMode === 'Dark';
  const bgColor = isDark ? '#121212' : '#FAF8F5';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#2B2B2B';
  const subTextColor = isDark ? '#AAAAAA' : '#777777';
  const borderColor = isDark ? '#2A2A2A' : '#EAE5DF';

  const renderModalContent = () => {
    switch (activeModal) {
      case 'themes':
        return (
          <View style={styles.modalInner}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Themes</Text>
            <Text style={[styles.modalSub, { color: subTextColor }]}>
              Make Future Letter feel like yours
            </Text>

            <Text style={styles.sectionHeader}>APPEARANCE</Text>
            <View style={styles.appearanceRow}>
              {['Light', 'Dark'].map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.appearanceCard,
                    { backgroundColor: cardBg, borderColor },
                    themeMode === mode && { borderColor: accentColor, borderWidth: 1.5 },
                  ]}
                  onPress={() => setThemeMode(mode)}
                >
                  <Text style={styles.appearanceIcon}>{mode === 'Light' ? '☀️' : '🌙'}</Text>
                  <Text style={[styles.appearanceText, { color: textColor }]}>{mode}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionHeader}>ACCENT COLOR</Text>
            <View style={[styles.cardBox, { backgroundColor: cardBg, borderColor }]}>
              <View style={styles.colorGrid}>
                {accentColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      accentColor === color && { borderWidth: 3, borderColor: color },
                    ]}
                    onPress={() => setAccentColor(color)}
                  />
                ))}
              </View>
            </View>
          </View>
        );

      case 'categories':
        return (
          <View style={styles.modalInner}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Categories</Text>
            <Text style={[styles.modalSub, { color: subTextColor }]}>Organize your letters</Text>
            {categories.map((cat, idx) => (
              <View key={idx} style={[styles.listItem, { backgroundColor: cardBg, borderColor }]}>
                <Text style={{ fontSize: 18, marginRight: 12 }}>🗂️</Text>
                <View>
                  <Text style={[styles.itemTitle, { color: textColor }]}>{cat.name}</Text>
                  <Text style={[styles.itemSub, { color: subTextColor }]}>
                    {cat.count} {cat.count === 1 ? 'letter' : 'letters'} · default
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );

      case 'favorites':
        const favoriteLetters = letters.filter((l) => l.isFavorite);
        return (
          <View style={styles.modalInner}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Favorites</Text>
            <Text style={[styles.modalSub, { color: subTextColor }]}>Your starred letters</Text>
            {favoriteLetters.length === 0 ? (
              <View style={[styles.emptyBox, { borderColor }]}>
                <Text style={{ color: subTextColor }}>No favorite letters yet.</Text>
              </View>
            ) : (
              favoriteLetters.map((l) => (
                <View key={l.id} style={[styles.listItem, { backgroundColor: cardBg, borderColor }]}>
                  <Text style={{ fontSize: 18, marginRight: 12 }}>⭐</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemTitle, { color: textColor }]}>{l.title}</Text>
                    <Text style={[styles.itemSub, { color: subTextColor }]}>{l.content}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        );

      case 'achievements':
        return (
          <View style={styles.modalInner}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Achievements</Text>
            <Text style={[styles.modalSub, { color: subTextColor }]}>Milestones on your journey</Text>
            <View style={[styles.cardBox, { backgroundColor: cardBg, borderColor, marginBottom: 16 }]}>
              <Text style={{ color: subTextColor, fontSize: 12 }}>Badges earned</Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: accentColor }}>3 / 12 (25%)</Text>
            </View>
            <View style={styles.grid2Col}>
              {achievements.map((item, idx) => (
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
        );

      case 'deleted':
        return (
          <View style={styles.modalInner}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Recently Deleted</Text>
            <Text style={[styles.modalSub, { color: subTextColor }]}>
              Kept for 30 days, then erased
            </Text>
            <View style={[styles.emptyBox, { borderColor }]}>
              <Text style={{ color: subTextColor }}>Nothing has been deleted recently.</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButtonTouch}>
          <Text style={[styles.backArrow, { color: textColor }]}>‹ Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
        <Text style={styles.headerSubtitle}>Make it yours</Text>

        {/* APPEARANCE */}
        <Text style={styles.sectionHeader}>APPEARANCE</Text>
        <View style={styles.appearanceRow}>
          {['Light', 'Dark'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.appearanceCard,
                { backgroundColor: cardBg, borderColor },
                themeMode === mode && { borderColor: accentColor, borderWidth: 1.5 },
              ]}
              onPress={() => setThemeMode(mode)}
            >
              <Text style={styles.appearanceIcon}>{mode === 'Light' ? '☀️' : '🌙'}</Text>
              <Text style={[styles.appearanceText, { color: textColor }]}>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ACCENT COLOR */}
        <Text style={styles.sectionHeader}>ACCENT COLOR</Text>
        <View style={[styles.cardBox, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.colorGrid}>
            {accentColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  accentColor === color && { borderWidth: 3, borderColor: color },
                ]}
                onPress={() => setAccentColor(color)}
              />
            ))}
          </View>
        </View>

        {/* LIBRARY LIST (RESTORED) */}
        <Text style={styles.sectionHeader}>LIBRARY</Text>
        <View style={[styles.cardBox, { backgroundColor: cardBg, borderColor, paddingVertical: 4 }]}>
          <TouchableOpacity style={styles.libraryRow} onPress={() => setActiveModal('themes')}>
            <Text style={[styles.libraryLabel, { color: textColor }]}>🎨 Custom Themes</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          <TouchableOpacity style={styles.libraryRow} onPress={() => setActiveModal('categories')}>
            <Text style={[styles.libraryLabel, { color: textColor }]}>🗂️ Categories</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          <TouchableOpacity style={styles.libraryRow} onPress={() => setActiveModal('favorites')}>
            <Text style={[styles.libraryLabel, { color: textColor }]}>⭐ Favorites</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          <TouchableOpacity
            style={styles.libraryRow}
            onPress={() => setActiveModal('achievements')}
          >
            <Text style={[styles.libraryLabel, { color: textColor }]}>🏆 Achievements</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          <TouchableOpacity style={styles.libraryRow} onPress={() => setActiveModal('deleted')}>
            <Text style={[styles.libraryLabel, { color: textColor }]}>🗑️ Recently Deleted</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* NOTIFICATIONS */}
        <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
        <View style={[styles.cardBox, { backgroundColor: cardBg, borderColor }]}>
          <Text style={{ fontSize: 13, color: subTextColor, lineHeight: 18 }}>
            🔔 Milestone alerts at 1 month, 1 week, and 1 day before each delivery are enabled.
          </Text>
        </View>

        <Text style={styles.footerQuote}>Write today. Discover tomorrow.</Text>
      </ScrollView>

      {/* Sub-Screen Modal View */}
      <Modal visible={activeModal !== null} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: bgColor }]}>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => setActiveModal(null)}
              style={styles.backButtonTouch}
            >
              <Text style={[styles.backArrow, { color: textColor }]}>‹ Back</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {renderModalContent()}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modalContainer: { flex: 1 },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButtonTouch: { paddingVertical: 6 },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 18,
  },
  appearanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appearanceCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  appearanceIcon: { fontSize: 20, marginBottom: 4 },
  appearanceText: { fontSize: 13, fontWeight: '600' },
  cardBox: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  libraryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  libraryLabel: { fontSize: 15, fontWeight: '600' },
  chevron: { fontSize: 18, color: '#C7C7CC' },
  divider: { height: 1, width: '100%' },
  footerQuote: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#8E8E93',
    marginTop: 30,
    fontSize: 13,
  },
  modalInner: { paddingTop: 10 },
  modalTitle: { fontSize: 26, fontFamily: 'Georgia', fontWeight: 'bold' },
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
});