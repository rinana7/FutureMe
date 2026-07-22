import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function CategoriesScreen({ onBack, accentColor = '#D9822B' }) {
  const categoriesList = [
    { name: 'Goals', count: '3 letters', tag: 'default' },
    { name: 'Memories', count: '1 letter', tag: 'default' },
    { name: 'School', count: '2 letters', tag: 'default' },
    { name: 'Personal', count: '3 letters', tag: 'default' },
    { name: 'Family', count: '1 letter', tag: 'default' },
    { name: 'Friends', count: '1 letter', tag: 'default' },
    { name: 'Hobbies', count: '1 letter', tag: 'default' },
    { name: 'Travel', count: '1 letter', tag: 'default' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={[styles.backText, { color: accentColor }]}>‹ Back</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Categories</Text>
          <Text style={styles.headerSubtitle}>Organize your letters</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {categoriesList.map((cat) => (
          <View key={cat.name} style={styles.categoryCard}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🏷️</Text>
            </View>
            <View>
              <Text style={styles.catName}>{cat.name}</Text>
              <Text style={styles.catSub}>{cat.count} · {cat.tag}</Text>
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
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2C3E50', alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#EAE5DF', marginBottom: 10 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0ECE1', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  iconText: { fontSize: 16 },
  catName: { fontSize: 16, fontWeight: 'bold', color: '#2B2B2B' },
  catSub: { fontSize: 13, color: '#777777', marginTop: 2 },
});