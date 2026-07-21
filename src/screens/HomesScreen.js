import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import StatusTiles from '../components/StatusTiles';

export default function HomeScreen({ letters }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Welcome back</Text>
      <Text style={styles.title}>Future Letter</Text>
      <Text style={styles.subtitle}>✨ Write today. Discover tomorrow.</Text>

      <StatusTiles favoriteCount={2} draftCount={3} archivedCount={0} />

      <Text style={styles.sectionHeader}>Your Feed</Text>
      {/* Letter items list rendering */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  greeting: { fontSize: 14, color: '#888' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#ff9f43', marginBottom: 12 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 16 },
});