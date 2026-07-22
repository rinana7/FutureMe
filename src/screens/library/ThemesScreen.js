import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

export default function ThemesScreen({
  onBack,
  accentColor = '#D9822B',
  setAccentColor,
}) {
  const [themes, setThemes] = useState([
    { name: 'Ocean', color: '#1ABC9C' },
    { name: 'Lavender', color: '#8E44AD' },
    { name: 'Sunset', color: '#FF7A00' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeColor, setNewThemeColor] = useState('#007AFF');

  // Preview state dynamically tracks selected or edited color
  const [previewColor, setPreviewColor] = useState(accentColor);

  const handleAddTheme = () => {
    if (!newThemeName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for your theme.');
      return;
    }

    // Basic Hex color validation
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (!hexRegex.test(newThemeColor.trim())) {
      Alert.alert('Invalid Color', 'Please enter a valid Hex color code (e.g., #FF5733).');
      return;
    }

    const createdTheme = {
      name: newThemeName.trim(),
      color: newThemeColor.trim(),
    };

    setThemes([...themes, createdTheme]);
    setPreviewColor(createdTheme.color);
    if (setAccentColor) setAccentColor(createdTheme.color);

    // Reset Modal
    setNewThemeName('');
    setNewThemeColor('#007AFF');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={[styles.backText, { color: accentColor }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Themes</Text>
        <TouchableOpacity
          style={[styles.addHeaderBtn, { backgroundColor: accentColor }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addHeaderBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Make Future Letter feel like yours</Text>

        {/* YOUR THEMES LIST */}
        <Text style={styles.sectionHeader}>YOUR THEMES</Text>
        {themes.map((theme) => {
          const isActive = previewColor === theme.color;
          return (
            <View key={theme.name} style={styles.themeCard}>
              <View style={styles.themeLeft}>
                <View style={[styles.colorDot, { backgroundColor: theme.color }]} />
                <Text style={styles.themeName}>{theme.name}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.applyBtn,
                  { backgroundColor: isActive ? theme.color : '#F0ECE1' },
                ]}
                onPress={() => {
                  setPreviewColor(theme.color);
                  if (setAccentColor) setAccentColor(theme.color);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.applyBtnText,
                    { color: isActive ? '#FFFFFF' : '#2B2B2B' },
                  ]}
                >
                  {isActive ? 'Applied' : 'Apply'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* LIVE PREVIEW SECTION */}
        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>LIVE PREVIEW</Text>
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={[styles.previewBadge, { backgroundColor: previewColor }]}>
              <Text style={styles.previewBadgeText}>PREVIEW</Text>
            </View>
            <Text style={styles.previewStatus}>🔒 Locked</Text>
          </View>
          <Text style={styles.previewTitle}>A letter to my future self</Text>
          <Text style={styles.previewSub}>Delivers in 1 year · Goals</Text>

          <View style={styles.previewFooter}>
            <TouchableOpacity
              style={[styles.previewActionBtn, { backgroundColor: previewColor }]}
              activeOpacity={0.8}
            >
              <Text style={styles.previewActionText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* CREATE NEW THEME MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create Custom Theme</Text>
            <Text style={styles.modalSub}>
              Copy a Hex/RGB code from Google Picker and paste it below.
            </Text>

            <Text style={styles.inputLabel}>Theme Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Neon Pulse"
              value={newThemeName}
              onChangeText={setNewThemeName}
              placeholderTextColor="#AAAAAA"
            />

            <Text style={styles.inputLabel}>Hex Color Code</Text>
            <View style={styles.colorInputRow}>
              <View style={[styles.colorPreviewDot, { backgroundColor: newThemeColor }]} />
              <TextInput
                style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
                placeholder="#007AFF"
                value={newThemeColor}
                onChangeText={(val) => {
                  setNewThemeColor(val);
                  setPreviewColor(val);
                }}
                autoCapitalize="characters"
                placeholderTextColor="#AAAAAA"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: accentColor }]}
                onPress={handleAddTheme}
              >
                <Text style={styles.saveBtnText}>Save Theme</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  backBtn: { paddingVertical: 8 },
  backText: { fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 22, fontFamily: 'Georgia', fontWeight: 'bold', color: '#2B2B2B' },
  addHeaderBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  addHeaderBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  subtitle: { fontSize: 14, color: '#777777', textAlign: 'center', marginBottom: 20 },
  sectionHeader: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8, color: '#777777', marginBottom: 8 },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE5DF',
    marginBottom: 10,
  },
  themeLeft: { flexDirection: 'row', alignItems: 'center' },
  colorDot: { width: 32, height: 32, borderRadius: 16, marginRight: 12 },
  themeName: { fontSize: 16, fontWeight: '600', color: '#2B2B2B' },
  applyBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  applyBtnText: { fontSize: 13, fontWeight: '700' },
  previewCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE5DF',
  },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  previewBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  previewBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  previewStatus: { fontSize: 12, color: '#777777' },
  previewTitle: { fontSize: 18, fontFamily: 'Georgia', fontWeight: 'bold', color: '#2B2B2B' },
  previewSub: { fontSize: 13, color: '#777777', marginTop: 4 },
  previewFooter: { marginTop: 16 },
  previewActionBtn: { paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  previewActionText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', paddingHorizontal: 20 },
  modalContainer: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24 },
  modalTitle: { fontSize: 20, fontFamily: 'Georgia', fontWeight: 'bold', color: '#2B2B2B' },
  modalSub: { fontSize: 12, color: '#777777', marginTop: 4, marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#2B2B2B', marginBottom: 6 },
  textInput: { borderWidth: 1, borderColor: '#EAE5DF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14, fontSize: 14, color: '#2B2B2B' },
  colorInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  colorPreviewDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#EAE5DF' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  cancelBtnText: { color: '#777777', fontWeight: '600', fontSize: 14 },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});