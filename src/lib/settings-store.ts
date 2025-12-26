// Settings store for user preferences
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'system' | 'light' | 'dark';
export type LanguageMode = 'system' | 'pt' | 'en';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photoUri?: string;
}

interface SettingsState {
  // User profile
  profile: UserProfile;

  // Preferences
  theme: ThemeMode;
  language: LanguageMode;

  // Initialization
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setLanguage: (language: LanguageMode) => Promise<void>;
  resetAll: () => Promise<void>;
}

const SETTINGS_KEY = 'caramelo_settings';
const PROFILE_KEY = 'caramelo_user_profile';

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  phone: '',
  photoUri: undefined,
};

const defaultSettings = {
  theme: 'system' as ThemeMode,
  language: 'system' as LanguageMode,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  profile: { ...defaultProfile },
  theme: 'system',
  language: 'system',
  isInitialized: false,

  initialize: async () => {
    try {
      const [settingsData, profileData] = await Promise.all([
        AsyncStorage.getItem(SETTINGS_KEY),
        AsyncStorage.getItem(PROFILE_KEY),
      ]);

      const settings = settingsData ? JSON.parse(settingsData) : defaultSettings;
      const profile = profileData ? JSON.parse(profileData) : defaultProfile;

      set({
        theme: settings.theme ?? 'system',
        language: settings.language ?? 'system',
        profile,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Error initializing settings:', error);
      set({ isInitialized: true });
    }
  },

  updateProfile: async (updates) => {
    try {
      const { profile } = get();
      const newProfile = { ...profile, ...updates };
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
      set({ profile: newProfile });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  },

  setTheme: async (theme) => {
    try {
      const settingsData = await AsyncStorage.getItem(SETTINGS_KEY);
      const settings = settingsData ? JSON.parse(settingsData) : defaultSettings;
      settings.theme = theme;
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      set({ theme });
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  },

  setLanguage: async (language) => {
    try {
      const settingsData = await AsyncStorage.getItem(SETTINGS_KEY);
      const settings = settingsData ? JSON.parse(settingsData) : defaultSettings;
      settings.language = language;
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      set({ language });
    } catch (error) {
      console.error('Error setting language:', error);
    }
  },

  resetAll: async () => {
    try {
      // Clear all AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);

      // Reset state
      set({
        profile: { ...defaultProfile },
        theme: 'system',
        language: 'system',
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  },
}));
