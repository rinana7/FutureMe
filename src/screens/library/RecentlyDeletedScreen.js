import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function RecentlyDeletedScreen({ onBack, accentColor = '#D9822B' }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={[styles.backText, { color: accentColor }]}>‹ Back</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Recently Deleted</Text>
          <Text style={styles.headerSubtitle}>Kept for 30 days, then erased</Text>
        </View>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Nothing has been deleted recently.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  backBtn: { paddingVertical: 8 },
  backText: { fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 22, fontFamily: 'Georgia', fontWeight: 'bold', color: '#2B2B2B' },
  headerSubtitle: { fontSize: 12, color: '#777777', marginTop: 2 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  emptyBox: { borderWidth: 1, borderColor: '#EAE5DF', borderStyle: 'dashed', borderRadius: 24, padding: 30, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#777777', fontSize: 14 },
});