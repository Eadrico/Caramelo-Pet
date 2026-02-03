// Language Context - Global language management with React Context
import React, { createContext, useContext, useCallback, useMemo, useEffect, useState } from 'react';
import { Platform, NativeModules } from 'react-native';
import { translations, SupportedLanguage, TranslationKey, languageNames, languageFlags } from './translations';
import { useSettingsStore } from '../settings-store';

// Get device language using React Native's built-in approach
function getDeviceLanguage(): Exclude<SupportedLanguage, 'system'> {
  try {
    let locale = 'en';

    if (Platform.OS === 'ios') {
      // iOS: Try multiple approaches
      const settings = NativeModules.SettingsManager?.settings;
      locale = settings?.AppleLocale ||
               settings?.AppleLanguages?.[0] ||
               'en';
    } else if (Platform.OS === 'android') {
      // Android: Use I18nManager or NativeModules
      locale = NativeModules.I18nManager?.localeIdentifier ||
               NativeModules.DeviceInfo?.locale ||
               'en';
    } else if (Platform.OS === 'web') {
      // Web: Use navigator
      locale = typeof navigator !== 'undefined'
        ? (navigator.language || (navigator as any).userLanguage || 'en')
        : 'en';
    }

    // Extract language code (first 2 characters)
    const languageCode = locale.substring(0, 2).toLowerCase();

    console.log('[i18n] Device locale detected:', locale);
    console.log('[i18n] Language code:', languageCode);

    // Map to supported languages
    if (languageCode === 'pt') return 'pt';
    if (languageCode === 'es') return 'es';
    if (languageCode === 'fr') return 'fr';
    if (languageCode === 'zh') return 'zh';

    console.log('[i18n] Defaulting to English');
    return 'en';
  } catch (error) {
    console.error('[i18n] Error detecting device language:', error);
    return 'en';
  }
}

interface LanguageContextType {
  language: SupportedLanguage;
  effectiveLanguage: Exclude<SupportedLanguage, 'system'>;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  supportedLanguages: SupportedLanguage[];
  getLanguageName: (lang: SupportedLanguage) => string;
  getLanguageFlag: (lang: SupportedLanguage) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Get language from settings store
  const storedLanguage = useSettingsStore((s) => s.language);
  const setStoredLanguage = useSettingsStore((s) => s.setLanguage);
  const isInitialized = useSettingsStore((s) => s.isInitialized);

  // Track device language for 'system' option
  const [deviceLanguage, setDeviceLanguage] = useState<Exclude<SupportedLanguage, 'system'>>('en');

  useEffect(() => {
    setDeviceLanguage(getDeviceLanguage());
  }, []);

  // Map stored language to SupportedLanguage type
  const language: SupportedLanguage = useMemo(() => {
    // All valid LanguageMode values are also valid SupportedLanguage values
    if (['system', 'en', 'pt', 'es', 'fr', 'zh'].includes(storedLanguage)) {
      return storedLanguage as SupportedLanguage;
    }
    return 'system';
  }, [storedLanguage]);

  // Effective language (resolved 'system' to actual language)
  const effectiveLanguage: Exclude<SupportedLanguage, 'system'> = useMemo(() => {
    if (language === 'system') {
      return deviceLanguage;
    }
    // Ensure it's a valid language
    if (['en', 'pt', 'es', 'fr', 'zh'].includes(language)) {
      return language as Exclude<SupportedLanguage, 'system'>;
    }
    return 'en';
  }, [language, deviceLanguage]);

  // Set language
  const setLanguage = useCallback(async (lang: SupportedLanguage) => {
    // All SupportedLanguage values are valid LanguageMode values
    await setStoredLanguage(lang as any);
  }, [setStoredLanguage]);

  // Translation function
  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    const translation = translations[effectiveLanguage]?.[key] || translations.en[key] || key;

    if (params) {
      return Object.entries(params).reduce(
        (str, [paramKey, value]) => str.replace(`{${paramKey}}`, String(value)),
        translation
      );
    }

    return translation;
  }, [effectiveLanguage]);

  // Supported languages list
  const supportedLanguages: SupportedLanguage[] = ['system', 'en', 'pt', 'es', 'fr', 'zh'];

  // Get language display name
  const getLanguageName = useCallback((lang: SupportedLanguage): string => {
    if (lang === 'system') {
      const deviceLangName = languageNames[deviceLanguage] || 'English';
      return `${languageNames.system} (${deviceLangName})`;
    }
    return languageNames[lang] || lang;
  }, [deviceLanguage]);

  // Get language flag
  const getLanguageFlag = useCallback((lang: SupportedLanguage): string => {
    if (lang === 'system') {
      return languageFlags.system;
    }
    return languageFlags[lang] || '🌐';
  }, []);

  const value = useMemo(() => ({
    language,
    effectiveLanguage,
    setLanguage,
    t,
    supportedLanguages,
    getLanguageName,
    getLanguageFlag,
  }), [language, effectiveLanguage, setLanguage, t, getLanguageName, getLanguageFlag]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Convenience hook for just translations
export function useTranslation() {
  const { t, effectiveLanguage } = useLanguage();
  return { t, language: effectiveLanguage };
}
