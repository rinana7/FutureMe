import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';

export default function SettingsScreen({ letters = [], setLetters }) {
  const [appearance, setAppearance] = useState('Light'); // 'Light' | 'Dark' | 'System'
  const [selectedAccent, setSelectedAccent] = useState('#D9822B'); // Default warm orange
  const [activeModal, setActiveModal] = useState(null); // 'categories' | 'favorites' | 'achievements' | 'deleted'

  const accentColors = [
    '#007AFF', '#2AC7E2', '#8E44AD', '#EC407A',
    '#E74C3C', '#F39C12', '#F1C40F', '#27AE60',
    '#00A896', '#D9822B', '#2C3E50',
  ];

  const categories = [
    { name: 'Goals', count: 3, isDefault: true },
    { name: 'Memories', count: 1, isDefault: true },
    { name: 'School', count: 2, isDefault: true },
    { name: 'Personal', count: 3, isDefault: true },
    { name: 'Family', count: 1, isDefault: true },
    { name: 'Friends', count: 1, isDefault: true },
    { name: 'Hobbies', count: 1, isDefault: true },
    { name: 'Travel', count: 1, isDefault: true },
  ];

  const achievements = [
    { id: '1', title: 'First Letter', desc: 'Write your first future letter.', unlocked: true, icon: '✏️' },
    { id: '2', title: 'Future Messenger', desc: 'Schedule 10 letters.', unlocked: false, icon: '🔒' },
    { id: '3', title: 'Long-Term Planner', desc: 'Schedule a letter more than one year in advance.', unlocked: true, icon: '⏳' },
    { id: '4', title: 'Reflection Master', desc: 'Open 25 letters.', unlocked: false, icon: '🔒' },
    { id: '5', title: 'Collector', desc: 'Favorite 25 letters.', unlocked: false, icon: '🔒' },
    { id: '6', title: 'Organizer', desc: 'Create 10 categories.', unlocked: false, icon: '🔒' },
    { id: '7', title: 'Goal Setter', desc: 'Write 20 letters in the Goals category.', unlocked: false, icon: '🔒' },
    { id: '8', title: 'Time Capsule Expert', desc: 'Open a letter after 5 years or more.', unlocked: false, icon: '🔒' },
    { id: '9', title: 'Designer', desc: "Customize your app's appearance.", unlocked: true, icon: '🎨' },
    { id: '10', title: 'Theme Creator', desc: 'Create and save a custom theme.', unlocked: false, icon: '🔒' },
    { id: '11', title: 'Patient Writer', desc: 'Keep a letter locked for one full year.', unlocked: false, icon: '🔒' },
    { id: '12', title: 'Future Legend', desc: 'Schedule a letter more than 10 years out.', unlocked: false, icon: '🔒' },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const favoritedLetters = letters.filter((l) => l.isFavorite);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Make it yours</Text>

        {/* APPEARANCE */}
        <Text style={styles.sectionHeader}>APPEARANCE</Text>
        <View style={styles.appearanceRow}>
          {['Light', 'Dark', 'System'].map((mode) => {
            const isActive = appearance === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.appearanceCard, isActive && styles.appearanceCardActive]}
                onPress={() => setAppearance(mode)}
              >
                <Text style={styles.appearanceIcon}>
                  {mode === 'Light' ? '☀️' : mode === 'Dark' ? '🌙' : '🌓'}
                </Text>
                <Text style={[styles.appearanceText, isActive && styles.appearanceTextActive]}>
                  {mode}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ACCENT COLOR */}
        <Text style={styles.sectionHeader}>ACCENT COLOR</Text>
        <View style={styles.cardBox}>
          <View style={styles.colorGrid}>
            {accentColors.map((color) => {
              const isSelected = selectedAccent === color;
              return (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    isSelected && styles.colorCircleSelected,
                  ]}
                  onPress={() => setSelectedAccent(color)}
                />
              );
            })}
          </View>
        </View>

        {/* LIBRARY */}
        <Text style={styles.sectionHeader}>LIBRARY</Text>
        <View style={styles.cardBox}>
          <TouchableOpacity style={styles.libraryRow} onPress={() => setActiveModal('themes')}>
            <View style={styles.libraryLeft}>
              <Text style={styles.libraryIcon}>🎨</Text>
              <Text style={styles.libraryLabel}>Custom Themes</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.libraryRow} onPress={() => setActiveModal('categories')}>
            <View style={styles.libraryLeft}>
              <Text style={styles.libraryIcon}>🗂️</Text>
              <Text style={styles.libraryLabel}>Categories</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.libraryRow} onPress={() => setActiveModal('favorites')}>
            <View style={styles.libraryLeft}>
              <Text style={styles.libraryIcon}>⭐</Text>
              <Text style={styles.libraryLabel}>Favorites</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.libraryRow} onPress={() => setActiveModal('achievements')}>
            <View style={styles.libraryLeft}>
              <Text style={styles.libraryIcon}>🏆</Text>
              <Text style={styles.libraryLabel}>Achievements</Text>
            </View>
            <View style={styles.libraryRight}>
              <Text style={styles.badgeCount}>{unlockedCount} earned</Text>
              <Text style={styles.chevron}> ›</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.libraryRow} onPress={() => setActiveModal('deleted')}>
            <View style={styles.libraryLeft}>
              <Text style={styles.libraryIcon}>🗑️</Text>
              <Text style={styles.libraryLabel}>Recently Deleted</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* NOTIFICATIONS */}
        <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
        <View style={styles.cardBox}>
          <View style={styles.notificationNotice}>
            <Text style={styles.bellIcon}>🔔</Text>
            <Text style={styles.notificationText}>
              Milestone alerts at 1 month, 1 week, and 1 day before each delivery are enabled.
            </Text>
          </View>
        </View>

        {/* Footer Slogan */}
        <Text style={styles.slogan}>Write today. Discover tomorrow.</Text>
      </ScrollView>

      {/* ----------------- SUB-SCREEN MODALS ----------------- */}

      {/* Categories Modal */}
      <Modal visible={activeModal === 'categories'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)}>
              <Text style={styles.backButton}>‹</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.modalHeaderTitle}>Categories</Text>
              <Text style={styles.modalHeaderSub}>Organize your letters</Text>
            </View>
            <TouchableOpacity style={styles.plusButton}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            {categories.map((cat) => (
              <View key={cat.name} style={styles.modalCardRow}>
                <View style={styles.categoryCircle}>
                  <Text>🗂️</Text>
                </View>
                <View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryMeta}>
                    {cat.count} {cat.count === 1 ? 'letter' : 'letters'} • {cat.isDefault ? 'default' : 'custom'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Favorites Modal */}
      <Modal visible={activeModal === 'favorites'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)}>
              <Text style={styles.backButton}>‹</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.modalHeaderTitle}>Favorites</Text>
              <Text style={styles.modalHeaderSub}>Your starred letters</Text>
            </View>
            <View style={{ width: 30 }} />
          </View>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            {favoritedLetters.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No starred letters yet.</Text>
              </View>
            ) : (
              favoritedLetters.map((item) => (
                <View key={item.id} style={styles.favoriteCard}>
                  <View style={styles.favTopRow}>
                    <Text style={styles.favLockIcon}>🔒</Text>
                    <Text style={styles.favStar}>⭐</Text>
                  </View>
                  <Text style={styles.favTitle}>{item.title}</Text>
                  <Text style={styles.favSub}>{item.content}</Text>
                  <View style={styles.favPill}>
                    <Text style={styles.favPillText}>{item.category || 'Personal'}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Achievements Modal */}
      <Modal visible={activeModal === 'achievements'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)}>
              <Text style={styles.backButton}>‹</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.modalHeaderTitle}>Achievements</Text>
              <Text style={styles.modalHeaderSub}>Milestones on your journey</Text>
            </View>
            <View style={{ width: 30 }} />
          </View>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            {/* Badges Progress */}
            <View style={styles.progressCard}>
              <View style={styles.progressTop}>
                <Text style={styles.progressLabel}>Badges earned</Text>
                <Text style={styles.progressPercent}>
                  {Math.round((unlockedCount / achievements.length) * 100)}%
                </Text>
              </View>
              <Text style={styles.progressNumber}>{unlockedCount}/{achievements.length}</Text>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${(unlockedCount / achievements.length) * 100}%` },
                  ]}
                />
              </View>
            </View>

            {/* Achievement Grid */}
            <View style={styles.achievementGrid}>
              {achievements.map((ach) => (
                <View
                  key={ach.id}
                  style={[
                    styles.achievementCard,
                    !ach.unlocked && styles.achievementLocked,
                  ]}
                >
                  <View style={styles.achIconBg}>
                    <Text style={styles.achIcon}>{ach.icon}</Text>
                  </View>
                  <Text style={styles.achTitle}>{ach.title}</Text>
                  <Text style={styles.achDesc}>{ach.desc}</Text>
                  {ach.unlocked && (
                    <View style={styles.unlockedBadge}>
                      <Text style={styles.unlockedBadgeText}>UNLOCKED</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Recently Deleted Modal */}
      <Modal visible={activeModal === 'deleted'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)}>
              <Text style={styles.backButton}>‹</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.modalHeaderTitle}>Recently Deleted</Text>
              <Text style={styles.modalHeaderSub}>Kept for 30 days, then erased</Text>
            </View>
            <View style={{ width: 30 }} />
          </View>
          <View style={styles.deletedContent}>
            <View style={styles.dashedBox}>
              <Text style={styles.dashedText}>Nothing has been deleted recently.</Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5', // Cream / Parchment background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2B2B2B',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 24,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 16,
  },
  // Appearance Selector
  appearanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appearanceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#EAE5DF',
  },
  appearanceCardActive: {
    borderColor: '#D9822B',
    borderWidth: 1.5,
    backgroundColor: '#FFFBF7',
  },
  appearanceIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  appearanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  appearanceTextActive: {
    color: '#2B2B2B',
  },
  // Card Box Container
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE5DF',
  },
  // Color Grid
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  colorCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#D9822B',
  },
  // Library Row
  libraryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  libraryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  libraryIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  libraryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B2B2B',
  },
  libraryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeCount: {
    fontSize: 13,
    color: '#8E8E93',
  },
  chevron: {
    fontSize: 18,
    color: '#C7C7CC',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2EFEA',
    marginVertical: 4,
  },
  // Notifications
  notificationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  slogan: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Georgia',
    color: '#8E8E93',
    marginTop: 40,
    fontSize: 14,
  },

  /* Modals Base */
  modalContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EAE5DF',
  },
  backButton: {
    fontSize: 32,
    color: '#2B2B2B',
    lineHeight: 32,
  },
  modalHeaderTitle: {
    fontSize: 22,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2B2B2B',
  },
  modalHeaderSub: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  plusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C3E50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScroll: {
    padding: 20,
  },

  // Categories Modal Items
  modalCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAE5DF',
  },
  categoryCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2EFEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B2B2B',
  },
  categoryMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },

  // Achievements Modal Items
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAE5DF',
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 13,
    color: '#777',
  },
  progressPercent: {
    fontSize: 20,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#D9822B',
  },
  progressNumber: {
    fontSize: 28,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2B2B2B',
    marginVertical: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F2EFEA',
    borderRadius: 4,
    marginTop: 8,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#D9822B',
    borderRadius: 4,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAE5DF',
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2EFEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  achIcon: {
    fontSize: 18,
  },
  achTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2B2B2B',
    marginBottom: 4,
  },
  achDesc: {
    fontSize: 11,
    color: '#777',
    lineHeight: 15,
  },
  unlockedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFBF7',
    borderColor: '#D9822B',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 10,
  },
  unlockedBadgeText: {
    color: '#D9822B',
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Favorites Modal Items
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAE5DF',
  },
  favTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  favLockIcon: {
    fontSize: 16,
  },
  favStar: {
    fontSize: 16,
  },
  favTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
    color: '#2B2B2B',
    marginTop: 6,
  },
  favSub: {
    fontSize: 13,
    color: '#666',
    marginVertical: 6,
  },
  favPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2EFEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  favPillText: {
    fontSize: 11,
    color: '#555',
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },

  // Recently Deleted
  deletedContent: {
    padding: 20,
  },
  dashedBox: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  dashedText: {
    color: '#777',
    fontSize: 14,
  },
});