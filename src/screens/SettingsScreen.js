import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';

export default function SettingsScreen({
  letters = [],
  setLetters,
  themeMode = 'Light',
  setThemeMode,
  accentColor = '#D9822B',
  setAccentColor,
  onBack,
}) {
  const isDark = themeMode === 'Dark';

  // Dynamic Theme Colors
  const bgColor = isDark ? '#121212' : '#FAF8F5';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#2B2B2B';
  const subTextColor = isDark ? '#AAAAAA' : '#777777';
  const borderColor = isDark ? '#2A2A2A' : '#EAE5DF';

  const accentColors = ['#D9822B', '#E56B6F', '#4A90E2', '#2EC4B6', '#9B51E0'];

  const handleClearAllData = () => {
    Alert.alert(
      'Delete All Letters',
      'Are you sure you want to permanently delete all your letters and reminders? This action cannot be undone.',
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

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.6}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={[styles.backText, { color: accentColor }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* APP THEME SECTION */}
        <Text style={[styles.sectionHeader, { color: subTextColor }]}>
          APPEARANCE
        </Text>

        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.row}>
            <View>
              <Text style={[styles.rowTitle, { color: textColor }]}>
                Dark Mode
              </Text>
              <Text style={[styles.rowSub, { color: subTextColor }]}>
                Switch between light and dark visual themes
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(val) =>
                setThemeMode ? setThemeMode(val ? 'Dark' : 'Light') : null
              }
              trackColor={{ false: '#767577', true: accentColor }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          {/* ACCENT COLOR SELECTOR */}
          <View style={styles.column}>
            <Text style={[styles.rowTitle, { color: textColor, marginBottom: 10 }]}>
              Accent Color
            </Text>
            <View style={styles.colorRow}>
              {accentColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    accentColor === color && styles.colorCircleActive,
                  ]}
                  onPress={() => (setAccentColor ? setAccentColor(color) : null)}
                  activeOpacity={0.8}
                />
              ))}
            </View>
          </View>
        </View>

        {/* DATA & STORAGE SECTION */}
        <Text style={[styles.sectionHeader, { color: subTextColor }]}>
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
        <Text style={[styles.sectionHeader, { color: subTextColor }]}>ABOUT</Text>

        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
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
    paddingTop: 24,
    paddingBottom: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  column: {
    paddingVertical: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 12,
    marginTop: 2,
  },
  rowBadge: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});