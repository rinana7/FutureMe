import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

// Import sub-screens from library folder
import ThemesScreen from './library/ThemesScreen';
import CategoriesScreen from './library/CategoriesScreen';
import FavoritesScreen from './library/FavoritesScreen';
import AchievementsScreen from './library/AchievementsScreen';
import RecentlyDeletedScreen from './library/RecentlyDeletedScreen';

export default function SettingsScreen({
  letters = [],
  setLetters,
  themeMode = 'Light', // 'Light' | 'Dark' | 'System'
  setThemeMode,
  accentColor = '#D9822B',
  setAccentColor,
  onBack,
}) {
  const [activeSubScreen, setActiveSubScreen] = useState(null);

  // Render Sub-Screens inside Settings if selected
  if (activeSubScreen === 'themes') {
    return (
      <ThemesScreen
        onBack={() => setActiveSubScreen(null)}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
      />
    );
  }
  if (activeSubScreen === 'categories') {
    return (
      <CategoriesScreen
        onBack={() => setActiveSubScreen(null)}
        accentColor={accentColor}
      />
    );
  }
  if (activeSubScreen === 'favorites') {
    return (
      <FavoritesScreen
        onBack={() => setActiveSubScreen(null)}
        accentColor={accentColor}
      />
    );
  }
  if (activeSubScreen === 'achievements') {
    return (
      <AchievementsScreen
        onBack={() => setActiveSubScreen(null)}
        accentColor={accentColor}
      />
    );
  }
  if (activeSubScreen === 'deleted') {
    return (
      <RecentlyDeletedScreen
        onBack={() => setActiveSubScreen(null)}
        accentColor={accentColor}
      />
    );
  }

  const isDark = themeMode === 'Dark';

  // Dynamic Theme Colors
  const bgColor = isDark ? '#121212' : '#FAF8F5';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#2B2B2B';
  const subTextColor = isDark ? '#AAAAAA' : '#777777';
  const borderColor = isDark ? '#2A2A2A' : '#EAE5DF';

  const accentColors = [
    '#007AFF',
    '#30B0C7',
    '#8E44AD',
    '#FF4F9A',
    '#E74C3C',
    '#FF7A00',
    '#F1C40F',
    '#2ECC71',
    '#1ABC9C',
    '#D9822B',
    '#2C3E50',
  ];

  const handleClearAllData = () => {
    Alert.alert(
      'Delete All Letters',
      'Are you sure you want to permanently delete all your letters? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            if (setLetters) {
              setLetters([]);
            }
            Alert.alert('Cleared', 'All letters have been removed.');
          },
        },
      ]
    );
  };

  const libraryItems = [
    { id: 'themes', label: 'Custom Themes', icon: '🎨' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
    { id: 'favorites', label: 'Favorites', icon: '⭐' },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: '🏆',
      badge: '2 earned',
    },
    { id: 'deleted', label: 'Recently Deleted', icon: '🗑️' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Top Header */}
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.6}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={[styles.backText, { color: accentColor }]}>‹ Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}
        <View>
          <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
          <Text style={[styles.headerSubtitle, { color: subTextColor }]}>
            Make it yours
          </Text>
        </View>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* APPEARANCE SECTION */}
        <Text style={[styles.sectionHeader, { color: subTextColor }]}>
          APPEARANCE
        </Text>
        <View style={styles.appearanceTabContainer}>
          {['Light', 'Dark', 'System'].map((mode) => {
            const isSelected = themeMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.appearanceTab,
                  {
                    backgroundColor: isSelected ? cardBg : 'transparent',
                    borderColor: isSelected ? accentColor : borderColor,
                    borderWidth: isSelected ? 1.5 : 1,
                  },
                ]}
                onPress={() => (setThemeMode ? setThemeMode(mode) : null)}
                activeOpacity={0.7}
              >
                <Text style={styles.appearanceIcon}>
                  {mode === 'Light' ? '☀️' : mode === 'Dark' ? '🌙' : '🌓'}
                </Text>
                <Text style={[styles.appearanceText, { color: textColor }]}>
                  {mode}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ACCENT COLOR SECTION */}
        <Text style={[styles.sectionHeader, { color: subTextColor, marginTop: 22 }]}>
          ACCENT COLOR
        </Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor, paddingVertical: 14 }]}>
          <View style={styles.colorGrid}>
            {accentColors.map((color) => {
              const isSelected = accentColor === color;
              return (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    isSelected && { borderColor: color, borderWidth: 3, transform: [{ scale: 1.1 }] },
                  ]}
                  onPress={() => (setAccentColor ? setAccentColor(color) : null)}
                  activeOpacity={0.8}
                >
                  {isSelected && (
                    <View style={styles.selectedCircleInner} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* LIBRARY SECTION */}
        <Text style={[styles.sectionHeader, { color: subTextColor, marginTop: 22 }]}>
          LIBRARY
        </Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor, paddingVertical: 4 }]}>
          {libraryItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.libraryRow}
                onPress={() => setActiveSubScreen(item.id)}
                activeOpacity={0.6}
              >
                <View style={styles.libraryLeft}>
                  <Text style={styles.libraryIcon}>{item.icon}</Text>
                  <Text style={[styles.rowTitle, { color: textColor }]}>
                    {item.label}
                  </Text>
                </View>
                <View style={styles.libraryRight}>
                  {item.badge && (
                    <Text style={[styles.badgeText, { color: subTextColor }]}>
                      {item.badge}
                    </Text>
                  )}
                  <Text style={[styles.chevron, { color: subTextColor }]}>›</Text>
                </View>
              </TouchableOpacity>
              {index < libraryItems.length - 1 && (
                <View style={[styles.divider, { backgroundColor: borderColor }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* NOTIFICATIONS SECTION */}
        <Text style={[styles.sectionHeader, { color: subTextColor, marginTop: 22 }]}>
          NOTIFICATIONS
        </Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor, paddingVertical: 14 }]}>
          <View style={styles.notificationRow}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>🔔</Text>
            <Text style={[styles.notificationText, { color: subTextColor }]}>
              Milestone alerts at 1 month, 1 week, and 1 day before each delivery are enabled.
            </Text>
          </View>
        </View>

        {/* DATA & STORAGE SECTION */}
        <Text style={[styles.sectionHeader, { color: subTextColor, marginTop: 22 }]}>
          DATA & STORAGE
        </Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.row}>
            <Text style={[styles.rowTitle, { color: textColor }]}>Total Letters</Text>
            <Text style={[styles.rowBadge, { color: accentColor }]}>
              {letters.length}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          <TouchableOpacity
            style={styles.row}
            onPress={handleClearAllData}
            activeOpacity={0.7}
          >
            <Text style={[styles.rowTitle, { color: '#FF5555' }]}>
              Delete All Data
            </Text>
            <Text style={{ color: '#FF5555', fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ABOUT SECTION */}
        <Text style={[styles.sectionHeader, { color: subTextColor, marginTop: 22 }]}>
          ABOUT
        </Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor, marginBottom: 20 }]}>
          <View style={styles.row}>
            <Text style={[styles.rowTitle, { color: textColor }]}>App Version</Text>
            <Text style={[styles.rowSub, { color: subTextColor }]}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 60,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  appearanceTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  appearanceTab: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appearanceIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  appearanceText: {
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 4,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  libraryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  libraryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  libraryIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  libraryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 13,
    marginRight: 6,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '300',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  notificationText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 13,
  },
  rowBadge: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});