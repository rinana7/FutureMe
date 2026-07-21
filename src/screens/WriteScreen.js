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

export default function WriteScreen({ onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('future'); // 'future' | 'reminder'
  const [category, setCategory] = useState('Future');

  // Time Capsule lock duration (years)
  const [unlockYears, setUnlockYears] = useState(1);

  // Quick Reminder notification settings
  const [reminderDays, setReminderDays] = useState(1);
  const [customDate, setCustomDate] = useState(null); // Stores native Date object
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ['Future', 'Personal', 'School', 'Work'];

  const capsuleOptions = [
    { label: '6 Months', years: 0.5 },
    { label: '1 Year', years: 1 },
    { label: '3 Years', years: 3 },
    { label: '5 Years', years: 5 },
  ];

  const reminderPresets = [
    { label: '1 Day', days: 1 },
    { label: '2 Days', days: 2 },
    { label: '3 Days', days: 3 },
    { label: '1 Week', days: 7 },
    { label: 'None', days: 0 },
  ];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // On Android, picker dismisses automatically after selection
    if (selectedDate) {
      setCustomDate(selectedDate);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your letter.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please write some content before saving.');
      return;
    }

    let targetDate = new Date();

    if (type === 'future') {
      targetDate.setFullYear(targetDate.getFullYear() + unlockYears);
    } else if (type === 'reminder') {
      if (customDate) {
        targetDate = customDate;
      } else if (reminderDays > 0) {
        targetDate.setDate(targetDate.getDate() + reminderDays);
      } else {
        targetDate = null;
      }
    }

    const newLetter = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      type: type,
      category: category,
      isFavorite: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      unlockDate: targetDate ? targetDate.toISOString() : null,
      notificationDays: reminderDays,
    };

    onSave(newLetter);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Create New Letter</Text>

      {/* Type Switcher */}
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'future' && styles.typeButtonActive]}
          onPress={() => {
            setType('future');
            setCategory('Future');
          }}
        >
          <Text style={[styles.typeText, type === 'future' && styles.typeTextActive]}>
            🔒 Time Capsule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, type === 'reminder' && styles.typeButtonActive]}
          onPress={() => {
            setType('reminder');
            setCategory('Personal');
          }}
        >
          <Text style={[styles.typeText, type === 'reminder' && styles.typeTextActive]}>
            📝 Quick Reminder
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Message to my future self..."
          placeholderTextColor="#666"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Category Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lock Duration (Time Capsule) */}
      {type === 'future' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Lock Duration</Text>
          <View style={styles.durationGrid}>
            {capsuleOptions.map((opt) => {
              const isActive = unlockYears === opt.years;
              return (
                <TouchableOpacity
                  key={opt.label}
                  style={[styles.durationBox, isActive && styles.durationBoxActive]}
                  onPress={() => setUnlockYears(opt.years)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      isActive && styles.durationTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Remind Me Duration (Quick Reminder) */}
      {type === 'reminder' && (
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Remind Me In</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.calendarLink}>📅 Select Date</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.durationGrid}>
            {reminderPresets.map((opt) => {
              const isActive = !customDate && reminderDays === opt.days;
              return (
                <TouchableOpacity
                  key={opt.label}
                  style={[styles.durationBox, isActive && styles.durationBoxActive]}
                  onPress={() => {
                    setReminderDays(opt.days);
                    setCustomDate(null);
                  }}
                >
                  <Text
                    style={[
                      styles.durationText,
                      isActive && styles.durationTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {customDate ? (
            <View style={styles.selectedDateBadge}>
              <Text style={styles.selectedDateText}>
                📆 Target Date: {customDate.toLocaleDateString()}
              </Text>
              <TouchableOpacity onPress={() => setCustomDate(null)}>
                <Text style={styles.clearDateText}>Clear</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Native System Calendar Dialog */}
          {showDatePicker && (
            <DateTimePicker
              value={customDate || new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
        </View>
      )}

      {/* Body Content Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write your story, goals, or reminders here..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {type === 'future' ? '🔒 Seal & Lock Letter' : '💾 Save Reminder'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#ff9f43',
  },
  typeText: {
    color: '#888888',
    fontWeight: '600',
    fontSize: 14,
  },
  typeTextActive: {
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#888888',
    fontSize: 13,
    fontWeight: '600',
  },
  calendarLink: {
    color: '#ff9f43',
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  textArea: {
    minHeight: 140,
  },
  pillRow: {
    flexDirection: 'row',
  },
  pill: {
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  pillActive: {
    backgroundColor: '#ff9f43',
    borderColor: '#ff9f43',
  },
  pillText: {
    color: '#888888',
    fontSize: 13,
  },
  pillTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  durationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationBox: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  durationBoxActive: {
    backgroundColor: '#382247',
    borderColor: '#bb86fc',
  },
  durationText: {
    color: '#888888',
    fontSize: 12,
  },
  durationTextActive: {
    color: '#bb86fc',
    fontWeight: 'bold',
  },
  selectedDateBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ff9f43',
  },
  selectedDateText: {
    color: '#ff9f43',
    fontSize: 13,
    fontWeight: 'bold',
  },
  clearDateText: {
    color: '#ff5555',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#ff9f43',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});