import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@futureme_letters_v1';

// Save letters array to local storage
export const saveLettersToStorage = async (letters) => {
  try {
    const jsonValue = JSON.stringify(letters);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save letters:', e);
  }
};

// Load letters array from local storage
export const loadLettersFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to load letters:', e);
    return null;
  }
};

export const clearLettersFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear letters:', e);
  }
};