import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BottomNavBar({ activeTab, setActiveTab }) {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('home')}
      >
        <Text style={[styles.icon, activeTab === 'home' && styles.activeIcon]}>
          🏠
        </Text>
        <Text style={[styles.label, activeTab === 'home' && styles.activeLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('write')}
      >
        <Text style={[styles.icon, activeTab === 'write' && styles.activeIcon]}>
          ✏️
        </Text>
        <Text style={[styles.label, activeTab === 'write' && styles.activeLabel]}>
          Write
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('archive')}
      >
        <Text style={[styles.icon, activeTab === 'archive' && styles.activeIcon]}>
          📁
        </Text>
        <Text style={[styles.label, activeTab === 'archive' && styles.activeLabel]}>
          Archive
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('settings')}
      >
        <Text style={[styles.icon, activeTab === 'settings' && styles.activeIcon]}>
          ⚙️
        </Text>
        <Text style={[styles.label, activeTab === 'settings' && styles.activeLabel]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    opacity: 0.5,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  activeLabel: {
    color: '#ff9f43',
    fontWeight: 'bold',
  },
});