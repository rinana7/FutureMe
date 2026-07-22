import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function WriteScreen({
  onSave,
  onClose,
  onNavigate,
  isDark,
  accentColor = '#D9822B',
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('School');
  const [selectedDuration, setSelectedDuration] = useState('Tomorrow'); // 'Tomorrow' | 'In 2 days' | 'In 3 days' | '1 week' | 'custom'
  const [customDate, setCustomDate] = useState(new Date('2026-07-21'));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = [
    'Goals',
    'Memories',
    'School',
    'Personal',
    'Family',
    'Friends',
    'Hobbies',
    'Travel',
    'Other',
  ];

  const durationOptions = [
    { id: 'Tomorrow', label: 'Tomorrow', days: 1 },
    { id: 'In 2 days', label: 'In 2 days', days: 2 },
    { id: 'In 3 days', label: 'In 3 days', days: 3 },
    { id: '1 week', label: '1 week', days: 7 },
  ];

  // Handler to close screen and switch to Home
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (onNavigate) {
      onNavigate('home');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setCustomDate(selectedDate);
      setSelectedDuration('custom');
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please give your letter a title.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please write some content before sealing.');
      return;
    }

    let targetDate = new Date();

    if (selectedDuration === 'custom' && customDate) {
      targetDate = customDate;
    } else {
      const option = durationOptions.find((opt) => opt.id === selectedDuration);
      const daysToAdd = option ? option.days : 1;
      targetDate.setDate(targetDate.getDate() + daysToAdd);
    }

    const newLetter = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      type: 'future',
      category: category,
      isFavorite: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      unlockDate: targetDate.toISOString(),
    };

    if (onSave) {
      onSave(newLetter);
    }
  };

  // Light/Dark Theme colors matching design
  const bgColor = isDark ? '#121212' : '#FAF8F5';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#2B2B2B';
  const subTextColor = isDark ? '#AAAAAA' : '#777777';
  const borderColor = isDark ? '#2A2A2A' : '#EAE5DF';
  const placeholderColor = isDark ? '#666666' : '#B0B0B0';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Top Header Row */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.closeBtn}
          activeOpacity={0.6}
          onPress={handleClose}
        >
          <Text style={[styles.closeBtnText, { color: textColor }]}>✕</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>New letter</Text>
        <TouchableOpacity
          style={[styles.sealButton, { backgroundColor: '#EAD1A8' }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.sealButtonText}>Seal</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
        <TextInput
          style={[styles.titleInput, { color: textColor }]}
          placeholder="Give your letter a title"
          placeholderTextColor={placeholderColor}
          value={title}
          onChangeText={setTitle}
        />

        <View style={[styles.divider, { backgroundColor: borderColor }]} />

        {/* Content Body Input */}
        <TextInput
          style={[styles.bodyInput, { color: textColor }]}
          placeholder="Dear future me, Write what you want to remember, hope, or promise yourself..."
          placeholderTextColor={placeholderColor}
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />

        {/* Attach Photo Button */}
        <TouchableOpacity
          style={[styles.photoButton, { borderColor }]}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Attach Photo', 'Photo attachment option selected.')}
        >
          <Text style={styles.photoIcon}>📷</Text>
          <Text style={[styles.photoText, { color: subTextColor }]}>Attach a photo</Text>
        </TouchableOpacity>

        {/* When Should It Arrive Section */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          📅 When should it arrive?
        </Text>

        <View style={styles.grid2Col}>
          {durationOptions.map((opt) => {
            const isSelected = selectedDuration === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.durationCard,
                  { backgroundColor: isSelected ? accentColor : cardBg, borderColor },
                ]}
                onPress={() => setSelectedDuration(opt.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.durationText,
                    { color: isSelected ? '#FFFFFF' : textColor },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Date Picker Card */}
        <TouchableOpacity
          style={[
            styles.customDateCard,
            {
              backgroundColor: cardBg,
              borderColor: selectedDuration === 'custom' ? accentColor : borderColor,
            },
          ]}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.customDateLeft}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>📅</Text>
            <Text style={[styles.customDateLabel, { color: subTextColor }]}>
              Pick a custom date
            </Text>
          </View>
          <Text style={[styles.customDateValue, { color: textColor }]}>
            {customDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.helperText, { color: subTextColor }]}>
          No limit — schedule years or even decades ahead.
        </Text>

        {/* Categories Section */}
        <Text style={[styles.sectionTitle, { color: textColor, marginTop: 24 }]}>
          Categories
        </Text>

        <View style={styles.categoryWrap}>
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: cardBg,
                    borderColor: isSelected ? accentColor : borderColor,
                    borderWidth: isSelected ? 1.5 : 1,
                  },
                ]}
                onPress={() => setCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: textColor, fontWeight: isSelected ? '700' : '500' },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* System Calendar Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={customDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 20,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
  },
  sealButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sealButtonText: {
    color: '#8C6834',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 60,
  },
  titleInput: {
    fontSize: 26,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  bodyInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    marginBottom: 20,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 28,
  },
  photoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  photoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  durationCard: {
    width: '48%',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  customDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 2,
  },
  customDateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customDateLabel: {
    fontSize: 13,
  },
  customDateValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 10,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 13,
  },
});