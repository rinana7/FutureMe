import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';

export default function SettingsScreen({ onResetData }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('Classic Dark');

  const themes = ['Classic Dark', 'Cyberpunk', 'Parchment'];

  const handleReset = () => {
    Alert.alert(
      'Reset All Data?',
      'This will delete all saved time capsules and reminders permanently. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => onResetData && onResetData(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Settings</Text>

      {/* Preferences Section */}
      <Text style={styles.sectionHeader}>Preferences</Text>
      
      <View style={styles.row}>
        <View style={styles.rowTextContainer}>
          <Text style={styles.rowLabel}>Dark Mode</Text>
          <Text style={styles.rowSublabel}>Use sleek dark aesthetic</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: '#333', true: '#ff9f43' }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={styles.row}>
        <View style={styles.rowTextContainer}>
          <Text style={styles.rowLabel}>Push Notifications</Text>
          <Text style={styles.rowSublabel}>Get notified when letters unlock</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#333', true: '#ff9f43' }}
          thumbColor="#ffffff"
        />
      </View>

      {/* Theme Accent Section */}
      <Text style={styles.sectionHeader}>App Theme Accent</Text>
      <View style={styles.themeGrid}>
        {themes.map((themeName) => {
          const isActive = selectedTheme === themeName;
          return (
            <TouchableOpacity
              key={themeName}
              style={[styles.themeCard, isActive && styles.themeCardActive]}
              onPress={() => setSelectedTheme(themeName)}
            >
              <Text style={[styles.themeText, isActive && styles.themeTextActive]}>
                {themeName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Storage Management Section */}
      <Text style={styles.sectionHeader}>Data Management</Text>

      <TouchableOpacity style={styles.dangerButton} onPress={handleReset}>
        <Text style={styles.dangerButtonText}>🗑️ Reset Storage & Delete Data</Text>
      </TouchableOpacity>

      {/* About Info */}
      <View style={styles.aboutContainer}>
        <Text style={styles.aboutTitle}>FutureMe v1.0.0</Text>
        <Text style={styles.aboutSub}>Write today. Discover tomorrow.</Text>
      </View>
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
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#888888',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 10,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  rowTextContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  rowSublabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  themeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  themeCard: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  themeCardActive: {
    backgroundColor: '#382247',
    borderColor: '#bb86fc',
  },
  themeText: {
    color: '#888888',
    fontSize: 12,
  },
  themeTextActive: {
    color: '#bb86fc',
    fontWeight: 'bold',
  },
  dangerButton: {
    backgroundColor: '#2a1a1a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ff5555',
  },
  dangerButtonText: {
    color: '#ff5555',
    fontWeight: 'bold',
    fontSize: 14,
  },
  aboutContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  aboutTitle: {
    color: '#666666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  aboutSub: {
    color: '#444444',
    fontSize: 12,
    marginTop: 2,
  },
});