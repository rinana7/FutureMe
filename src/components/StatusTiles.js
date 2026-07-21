import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function StatusTiles({ favoriteCount, draftCount, archivedCount }) {
  const tiles = [
    { id: 'Favorites', label: 'Favorites', icon: '⭐', count: favoriteCount },
    { id: 'Drafts', label: 'Reminders', icon: '📝', count: draftCount },
    { id: 'Archived', label: 'Archive', icon: '📦', count: archivedCount },
  ];

  return (
    <View style={styles.container}>
      {tiles.map((tile) => (
        <TouchableOpacity key={tile.id} style={styles.tile}>
          <Text style={styles.icon}>{tile.icon}</Text>
          <Text style={styles.label}>{tile.label}</Text>
          <Text style={styles.count}>{tile.count}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  icon: { fontSize: 14 },
  label: { fontSize: 13, color: '#fff', fontWeight: '600', marginLeft: 6 },
  count: { fontSize: 13, color: '#ff9f43', fontWeight: 'bold', marginLeft: 6 },
});