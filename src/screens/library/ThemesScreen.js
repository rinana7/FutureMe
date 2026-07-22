import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

  // Color Picker HSV States
  const [hue, setHue] = useState(15); // 0 - 360
  const [sat, setSat] = useState(85); // 0 - 100
  const [val, setVal] = useState(90); // 0 - 100
  const [colorMode, setColorMode] = useState('Hex');
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  // Live preview state
  const [previewColor, setPreviewColor] = useState(accentColor);

  // Measure Refs for Smooth Dragging
  const boxRef = useRef(null);
  const hueRef = useRef(null);
  const boxLayout = useRef({ x: 0, y: 0, width: 280, height: 160 });
  const hueLayout = useRef({ x: 0, width: 280 });

  // HSV to RGB Conversion
  const hsvToRgb = (h, s, v) => {
    s /= 100;
    v /= 100;
    let c = v * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = v - c;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h <= 360) { r = c; g = 0; b = x; }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  };

  const getRgbString = () => {
    const { r, g, b } = hsvToRgb(hue, sat, val);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getHexString = () => {
    const { r, g, b } = hsvToRgb(hue, sat, val);
    const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const currentColorHex = getHexString();

  // 2D Picker Box Smooth Gesture Handler
  const updateBoxPos = (pageX, pageY) => {
    if (!boxRef.current) return;
    boxRef.current.measureInWindow((x, y, width, height) => {
      const relX = Math.max(0, Math.min(pageX - x, width));
      const relY = Math.max(0, Math.min(pageY - y, height));

      setSat(Math.round((relX / width) * 100));
      setVal(Math.round((1 - relY / height) * 100));
    });
  };

  const boxPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateBoxPos(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
      },
      onPanResponderMove: (evt) => {
        updateBoxPos(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
      },
    })
  ).current;

  // 1D Hue Slider Smooth Gesture Handler
  const updateHuePos = (pageX) => {
    if (!hueRef.current) return;
    hueRef.current.measureInWindow((x, y, width) => {
      const relX = Math.max(0, Math.min(pageX - x, width));
      setHue(Math.round((relX / width) * 360));
    });
  };

  const huePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateHuePos(evt.nativeEvent.pageX);
      },
      onPanResponderMove: (evt) => {
        updateHuePos(evt.nativeEvent.pageX);
      },
    })
  ).current;

  const handleRandomPalette = () => {
    setHue(Math.floor(Math.random() * 360));
    setSat(Math.floor(Math.random() * 40) + 60);
    setVal(Math.floor(Math.random() * 40) + 60);
  };

  const handleAddTheme = () => {
    if (!newThemeName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for your theme.');
      return;
    }

    const createdTheme = {
      name: newThemeName.trim(),
      color: currentColorHex,
    };

    setThemes([...themes, createdTheme]);
    setPreviewColor(createdTheme.color);
    if (setAccentColor) setAccentColor(createdTheme.color);

    setNewThemeName('');
    setModalVisible(false);
  };

  const rainbowColors = [
    '#FF0000',
    '#FFFF00',
    '#00FF00',
    '#00FFFF',
    '#0000FF',
    '#FF00FF',
    '#FF0000',
  ];

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

        {/* YOUR THEMES */}
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

        {/* LIVE PREVIEW */}
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

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Theme Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Sunset Amber"
              value={newThemeName}
              onChangeText={setNewThemeName}
              placeholderTextColor="#AAAAAA"
            />

            {/* COLOR PICKER CONTROLS */}
            <View style={styles.pickerWrapper}>
              {/* 2D SATURATION & VALUE CANVAS */}
              <View
                ref={boxRef}
                style={[
                  styles.gradientBox,
                  { backgroundColor: `hsl(${hue}, 100%, 50%)` },
                ]}
                {...boxPanResponder.panHandlers}
              >
                <LinearGradient
                  colors={['#FFFFFF', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                />
                <LinearGradient
                  colors={['transparent', '#000000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                />
                <View
                  style={[
                    styles.pickerHandle,
                    {
                      left: (sat / 100) * 280 - 12,
                      top: (1 - val / 100) * 160 - 12,
                    },
                  ]}
                  pointerEvents="none"
                />
              </View>

              {/* HUE RAINBOW SLIDER */}
              <View
                ref={hueRef}
                style={styles.hueBarWrapper}
                {...huePanResponder.panHandlers}
              >
                <LinearGradient
                  colors={rainbowColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.hueGradientBar}
                  pointerEvents="none"
                />
                <View
                  style={[
                    styles.hueHandle,
                    {
                      left: (hue / 360) * 280 - 10,
                      backgroundColor: `hsl(${hue}, 100%, 50%)`,
                    },
                  ]}
                  pointerEvents="none"
                />
              </View>

              {/* VALUE & FORMAT INPUT ROW */}
              <View style={styles.valueRowContainer}>
                <View style={styles.valueLeft}>
                  <View style={[styles.activeColorCircle, { backgroundColor: currentColorHex }]} />
                  <Text style={styles.colorCodeText}>
                    {colorMode === 'Hex' ? currentColorHex : getRgbString()}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() => setShowModeDropdown(!showModeDropdown)}
                >
                  <Text style={styles.dropdownText}>{colorMode}</Text>
                  <Text style={styles.dropdownChevron}>⌄</Text>
                </TouchableOpacity>

                {showModeDropdown && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => {
                        setColorMode('Hex');
                        setShowModeDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>Hex</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => {
                        setColorMode('RGB');
                        setShowModeDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>RGB</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* RANDOM PALETTE BUTTON */}
              <TouchableOpacity
                style={styles.randomBtn}
                onPress={handleRandomPalette}
                activeOpacity={0.8}
              >
                <Text style={styles.randomBtnText}>Random palette</Text>
              </TouchableOpacity>
            </View>

            {/* MODAL ACTIONS */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: currentColorHex }]}
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

  /* Modal Styles */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalContainer: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, width: 320 },
  modalTitle: { fontSize: 20, fontFamily: 'Georgia', fontWeight: 'bold', color: '#2B2B2B' },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#2B2B2B', marginBottom: 6 },
  textInput: { borderWidth: 1, borderColor: '#EAE5DF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16, fontSize: 14, color: '#2B2B2B' },

  /* Color Picker Controls */
  pickerWrapper: { alignItems: 'center' },
  gradientBox: { width: 280, height: 160, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  pickerHandle: { width: 24, height: 24, borderRadius: 12, borderWidth: 3, borderColor: '#FFFFFF', position: 'absolute' },

  hueBarWrapper: { width: 280, height: 24, marginTop: 16, justifyContent: 'center', position: 'relative' },
  hueGradientBar: { height: 12, borderRadius: 6, width: '100%' },
  hueHandle: { width: 20, height: 20, borderRadius: 10, borderWidth: 3, borderColor: '#FFFFFF', position: 'absolute', elevation: 3 },

  valueRowContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 280, marginTop: 16, borderWidth: 1, borderColor: '#EAE5DF', borderRadius: 14, padding: 8, position: 'relative' },
  valueLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activeColorCircle: { width: 24, height: 24, borderRadius: 12 },
  colorCodeText: { fontSize: 14, fontWeight: '600', color: '#2B2B2B' },

  dropdownBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: '#F5F5F5' },
  dropdownText: { fontSize: 13, fontWeight: '600', color: '#2B2B2B' },
  dropdownChevron: { fontSize: 12, color: '#777777' },

  dropdownMenu: { position: 'absolute', right: 8, top: 44, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#EAE5DF', zIndex: 10, elevation: 4 },
  dropdownOption: { paddingHorizontal: 16, paddingVertical: 8 },
  dropdownOptionText: { fontSize: 13, fontWeight: '600', color: '#2B2B2B' },

  randomBtn: { width: 280, paddingVertical: 10, borderWidth: 1, borderColor: '#EAE5DF', borderRadius: 12, alignItems: 'center', marginTop: 14 },
  randomBtnText: { fontSize: 14, fontWeight: '600', color: '#2B2B2B' },

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 20, width: '100%' },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  cancelBtnText: { color: '#777777', fontWeight: '600', fontSize: 14 },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});