import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

export default function LetterDetailModal({
  letter,
  onClose,
  onToggleFavorite,
  onDeleteLetter,
  onEditLetter,
  isDark,
  accentColor = '#D9822B',
}) {
  if (!letter) return null;

  const isLocked = new Date(letter.unlockDate) > new Date();

  const getTimeRemaining = (targetIso) => {
    const diff = new Date(targetIso) - new Date();
    if (diff <= 0) return '0d 0h left';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${days}d ${hours}h left`;
  };

  const formattedDeliveryDate = new Date(letter.unlockDate).toLocaleDateString(
    'en-US',
    { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  );

  const handleDelete = () => {
    Alert.alert(
      'Delete Letter',
      'Are you sure you want to delete this letter?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onDeleteLetter) onDeleteLetter(letter.id);
            onClose();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    onClose();
    if (onEditLetter) onEditLetter(letter);
  };

  const bgColor = isDark ? '#121212' : '#FAF8F5';
  const textColor = isDark ? '#FFFFFF' : '#2B2B2B';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subTextColor = isDark ? '#AAAAAA' : '#777777';

  return (
    <Modal visible={!!letter} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        {/* Navigation Header */}
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity onPress={onClose} style={styles.iconBtn} activeOpacity={0.6}>
            <Text style={[styles.backArrow, { color: textColor }]}>‹</Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.headerRight}>
            {/* Star / Favorite Button */}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onToggleFavorite && onToggleFavorite(letter.id)}
              activeOpacity={0.6}
            >
              <Text style={{ fontSize: 22 }}>{letter.isFavorite ? '⭐' : '☆'}</Text>
            </TouchableOpacity>

            {/* Edit Button */}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={handleEdit}
              activeOpacity={0.6}
            >
              <Text style={{ fontSize: 18 }}>✏️</Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={handleDelete}
              activeOpacity={0.6}
            >
              <Text style={{ fontSize: 18 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {isLocked ? (
            /* LOCKED VIEW */
            <View style={styles.lockedContainer}>
              <View style={styles.lockBadgeIcon}>
                <Text style={{ fontSize: 36 }}>🔒</Text>
              </View>

              <Text style={[styles.lockedTitle, { color: textColor }]}>
                Sealed for your future self
              </Text>
              <Text style={[styles.lockedSubtitle, { color: subTextColor }]}>
                This letter stays locked until it arrives. The words inside are waiting patiently for you.
              </Text>

              <View style={styles.timerPill}>
                <Text style={{ fontSize: 14 }}>⏰</Text>
                <Text style={styles.timerText}>{getTimeRemaining(letter.unlockDate)}</Text>
              </View>

              <Text style={[styles.deliversText, { color: subTextColor }]}>
                Delivers {formattedDeliveryDate}
              </Text>

              <TouchableOpacity
                style={styles.openEarlyBtn}
                onPress={() =>
                  Alert.alert('Open Early', 'This feature is currently locked until delivery date!')
                }
              >
                <Text style={styles.openEarlyText}>Open early</Text>
              </TouchableOpacity>

              <View style={styles.tagWrap}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>{letter.category || 'School'}</Text>
                </View>
              </View>

              <Text style={[styles.writtenText, { color: subTextColor }]}>
                Written {new Date(letter.createdAt || Date.now()).toLocaleDateString()}
              </Text>
            </View>
          ) : (
            /* UNLOCKED VIEW */
            <View style={styles.unlockedContainer}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: accentColor, marginBottom: 8 }}>
                📬 DELIVERED
              </Text>
              <Text style={[styles.letterTitle, { color: textColor }]}>{letter.title}</Text>

              <View style={[styles.letterCard, { backgroundColor: cardBg }]}>
                <Text style={[styles.letterBody, { color: textColor }]}>{letter.content}</Text>
              </View>

              <View style={styles.tagPill}>
                <Text style={styles.tagText}>{letter.category || 'Personal'}</Text>
              </View>

              <Text style={[styles.writtenText, { color: subTextColor }]}>
                Written {new Date(letter.createdAt || Date.now()).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerRight: { flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 8 },
  backArrow: { fontSize: 32, fontWeight: '300' },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: 'center' },
  lockedContainer: { alignItems: 'center' },
  lockBadgeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F7EEDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  lockedTitle: { fontSize: 24, fontFamily: 'Georgia', fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  lockedSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5D8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 8,
  },
  timerText: { fontSize: 14, fontWeight: 'bold', color: '#B36B00' },
  deliversText: { fontSize: 13, marginBottom: 20 },
  openEarlyBtn: {
    borderWidth: 1,
    borderColor: '#D3C3B1',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 30,
  },
  openEarlyText: { fontSize: 14, color: '#555555', fontWeight: '500' },
  tagWrap: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tagPill: { backgroundColor: '#EAE5DF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, alignSelf: 'flex-start' },
  tagText: { fontSize: 12, color: '#444444' },
  writtenText: { fontSize: 12, marginTop: 10 },
  unlockedContainer: { flex: 1, paddingTop: 20 },
  letterTitle: { fontSize: 28, fontFamily: 'Georgia', fontWeight: 'bold', marginBottom: 20 },
  letterCard: { padding: 20, borderRadius: 18, marginBottom: 20 },
  letterBody: { fontSize: 16, lineHeight: 26 },
});