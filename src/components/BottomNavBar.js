import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNavBar({
  activeTab,
  setActiveTab,
  isDark,
  accentColor,
}) {
  const insets = useSafeAreaInsets();

  // Dynamic colors based on light / dark mode
  const navBgColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const navBorderColor = isDark ? '#2A2A2A' : '#EAE5DF';
  const inactiveTextColor = isDark ? '#888888' : '#8E8E93';

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'write', label: 'Write', icon: '✏️' },
    { id: 'archive', label: 'Archive', icon: '📦' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: navBgColor,
          borderColor: navBorderColor,
          paddingBottom: insets.bottom + 15, // Higher elevation
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const activeColor = accentColor || '#D9822B';

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.icon,
                { opacity: isActive ? 1 : 0.6 },
              ]}
            >
              {tab.icon}
            </Text>
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? activeColor : inactiveTextColor,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
  },
});