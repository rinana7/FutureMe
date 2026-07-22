import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function AchievementsScreen({ onBack, accentColor = '#D9822B' }) {
  const achievements = [
    { id: '1', title: 'First Letter', desc: 'Write your first future letter.', unlocked: true, icon: '✏️' },
    { id: '2', title: 'Future Messenger', desc: 'Schedule 10 letters.', unlocked: false, icon: '🔒' },
    { id: '3', title: 'Long-Term Planner', desc: 'Schedule a letter more than one year in advance.', unlocked: true, icon: '⌛' },
    { id: '4', title: 'Reflection Master', desc: 'Open 25 letters.', unlocked: false, icon: '🔒' },
    { id: '5', title: 'Collector', desc: 'Favorite 25 letters.', unlocked: false, icon: '🔒' },
    { id: '6', title: 'Organizer', desc: 'Create 10 categories.', unlocked: false, icon: '🔒' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={[styles.backText, { color: accentColor }]}>‹ Back</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Achievements</Text>
          <Text style={styles.headerSubtitle}>Milestones on your journey</Text>
        </View>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress Banner */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressLabel}>Badges earned</Text>
              <Text style={styles.progressCount}>3/12</Text>
            </View>
            <Text style={[styles.progressPercent, { color: accentColor }]}>25%</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: '25%', backgroundColor: accentColor }]} />
          </View>
        </View>

        {/* Badge Grid */}
        <View style={styles.grid}>
          {achievements.map((item) => (
            <View key={item.id} style={styles.badgeCard}>
              <View style={[styles.badgeIcon, { backgroundColor: item.unlocked ? accentColor : '#F0ECE1' }]}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <Text style={styles.badgeTitle}>{item.title}</Text>
              <Text style={styles.badgeDesc}>{item.desc}</Text>

              {item.unlocked && (
                <View style={styles.unlockedBadge}>
                  <Text style={[styles.unlockedText, { color: accentColor }]}>UNLOCKED</Text>
                </View>
              )}
            </View>
          ))}
        </View>
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
  progressCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#EAE5DF', marginBottom: 20 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 13, color: '#777777' },
  progressCount: { fontSize: 28, fontFamily: 'Georgia', fontWeight: 'bold', color: '#2B2B2B' },
  progressPercent: { fontSize: 22, fontWeight: 'bold' },
  barBg: { height: 8, backgroundColor: '#EAE5DF', borderRadius: 4, marginTop: 12, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  badgeCard: { width: '48%', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#EAE5DF', marginBottom: 12 },
  badgeIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  badgeTitle: { fontSize: 15, fontFamily: 'Georgia', fontWeight: 'bold', color: '#2B2B2B', marginBottom: 4 },
  badgeDesc: { fontSize: 12, color: '#777777', lineHeight: 16 },
  unlockedBadge: { backgroundColor: '#FFF5EB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginTop: 10 },
  unlockedText: { fontSize: 10, fontWeight: 'bold' },
});