import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function FavoritesScreen({ onBack, accentColor = '#D9822B' }) {
  const favoriteLetters = [
    {
      id: '1',
      title: 'A year from today',
      date: 'Delivers Aug 23, 2026',
      categories: ['Goals', 'Personal'],
      timeLeft: '1mo 3d left',
      status: 'locked',
    },
    {
      id: '2',
      title: 'On the eve of graduation',
      date: 'Delivers Jul 21, 2026',
      categories: ['School', 'Goals'],
      timeLeft: '0d 17h left',
      status: 'locked',
    },
    {
      id: '3',
      title: 'Happy birthday, old friend',
      date: 'Opened Jul 16, 2026',
      categories: ['Personal'],
      timeLeft: 'Delivered',
      status: 'opened',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={[styles.backText, { color: accentColor }]}>‹ Back</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Favorites</Text>
          <Text style={styles.headerSubtitle}>Your starred letters</Text>
        </View>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {favoriteLetters.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <Text style={styles.lockIcon}>{item.status === 'locked' ? '🔒' : '✉️'}</Text>
                <View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDate}>{item.date}</Text>
                </View>
              </View>
              <Text style={styles.star}>⭐</Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.pillRow}>
                {item.categories.map((cat) => (
                  <View key={cat} style={styles.pill}>
                    <Text style={styles.pillText}>{cat}</Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.timeLeft, { color: accentColor }]}>{item.timeLeft}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#EAE5DF', marginBottom: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  lockIcon: { fontSize: 18, marginRight: 10 },
  cardTitle: { fontSize: 16, fontFamily: 'Georgia', fontWeight: 'bold', color: '#2B2B2B' },
  cardDate: { fontSize: 12, color: '#777777', marginTop: 2 },
  star: { fontSize: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  pillRow: { flexDirection: 'row', gap: 6 },
  pill: { backgroundColor: '#F0ECE1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillText: { fontSize: 11, fontWeight: '600', color: '#2B2B2B' },
  timeLeft: { fontSize: 12, fontWeight: 'bold' },
});