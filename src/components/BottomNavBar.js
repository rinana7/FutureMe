import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BottomNavBar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'countdown', label: 'Countdown', icon: '⏳' },
    { id: 'write', label: 'Write', icon: '➕', isCenter: true },
    { id: 'archive', label: 'Archive', icon: '📥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        if (tab.isCenter) {
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.centerButton}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={styles.centerIcon}>+</Text>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.icon, isActive && styles.activeText]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeText]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#2d2d2d',
  },
  tab: { alignItems: 'center', flex: 1 },
  icon: { fontSize: 18, color: '#888' },
  label: { fontSize: 11, color: '#888', marginTop: 2 },
  activeText: { color: '#ff9f43', fontWeight: 'bold' },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff9f43',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  centerIcon: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
});