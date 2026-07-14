import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const nextLetter = {
    title: "Letter to my Graduation Self",
    years: "0",
    months: "1",
    days: "2",
    hours: "5"
  };

  const tiles = [
    { label: 'Favorites', icon: '⭐', count: 3 },
    { label: 'Categories', icon: '📁', count: 0 },
    { label: 'Badges', icon: '🏆', count: 1 },
    { label: 'Archive', icon: '📦', count: 5 },
  ];

  // Mock database of sealed letters
  const sealedLetters = [
    { id: 1, title: "My Goals for this Summer", unlockDate: "Aug 31, 2026", category: "Personal" },
    { id: 2, title: "Message to Me in 5 Years", unlockDate: "July 14, 2031", category: "Future" },
    { id: 3, title: "Advice for College Entry", unlockDate: "Sept 1, 2027", category: "School" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.titleText}>Future Letter</Text>
          <Text style={styles.taglineText}>✨ Write today. Discover tomorrow.</Text>
        </View>

        {/* HERO COUNTDOWN CARD */}
        <View style={styles.heroContainer}>
          <TouchableOpacity style={styles.heroCard} activeOpacity={0.9}>
            <View style={styles.heroHeader}>
              <Text style={styles.heroBadgeText}>⏳ NEXT TO ARRIVE</Text>
              <View style={styles.milestoneTag}>
                <Text style={styles.milestoneText}>Graduation</Text>
              </View>
            </View>
            
            <Text style={styles.heroTitle}>{nextLetter.title}</Text>
            
            <View style={styles.countdownRow}>
              {[
                { label: 'Years', val: nextLetter.years },
                { label: 'Months', val: nextLetter.months },
                { label: 'Days', val: nextLetter.days },
                { label: 'Hours', val: nextLetter.hours },
              ].map((item, index) => (
                <View key={index} style={styles.timeBox}>
                  <Text style={styles.timeVal}>{item.val}</Text>
                  <Text style={styles.timeLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>

        {/* QUICK NAVIGATION TILES GRID */}
        <View style={styles.gridContainer}>
          {tiles.map((tile, index) => (
            <TouchableOpacity key={index} style={styles.tileButton} activeOpacity={0.8}>
              <View style={styles.tileLeft}>
                <View style={styles.iconCircle}>
                  <Text style={styles.tileIcon}>{tile.icon}</Text>
                </View>
                <Text style={styles.tileLabel}>{tile.label}</Text>
              </View>
              {tile.count > 0 && (
                <Text style={styles.tileCount}>{tile.count}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* WRITE NEW LETTER CTA BUTTON */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.writeButton} activeOpacity={0.8}>
            <Text style={styles.writeButtonText}>✍️ Write a new letter</Text>
          </TouchableOpacity>
        </View>

        {/* SEALED LETTERS LIST SECTION */}
        <View style={styles.sealedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sealed letters</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all ➔</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.lettersList}>
            {sealedLetters.map((letter) => (
              <TouchableOpacity key={letter.id} style={styles.letterCard} activeOpacity={0.7}>
                <View style={styles.letterLeft}>
                  <Text style={styles.lockIcon}>🔒</Text>
                  <View>
                    <Text style={styles.letterTitle}>{letter.title}</Text>
                    <Text style={styles.letterSubtitle}>Unlocks on {letter.unlockDate}</Text>
                  </View>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{letter.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1