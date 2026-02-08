// Language Context - Global language management with React Context
import React, { createContext, useContext, useCallback, useMemo, useEffect, useState } from 'react';
import { Platform, NativeModules } from 'react-native';
import { translations, SupportedLanguage, TranslationKey, languageNames, languageFlags } from './translations';
import { useSettingsStore } from '../settings-store';

// Get device language using multiple detection methods
function getDeviceLanguage(): Exclude<SupportedLanguage, 'system'> {
  try {
    let locale = 'en';
    let region = '';

    // Method 1: Try Intl API (works on modern React Native)
    try {
      if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
        const dtf = new Intl.DateTimeFormat();
        const resolvedOptions = dtf.resolvedOptions();
        if (resolvedOptions.locale) {
          locale = resolvedOptions.locale;
          console.log('[i18n] 🌍 Intl.DateTimeFormat locale:', locale);
        }
      }
    } catch (e) {
      console.log('[i18n] ⚠️ Intl API not available');
    }

    // Method 2: Platform-specific NativeModules (fallback)
    if (locale === 'en') {
      if (Platform.OS === 'ios') {
        const settings = NativeModules.SettingsManager?.settings;
        const appleLocale = settings?.AppleLocale;
        const appleLanguages = settings?.AppleLanguages;

        console.log('[i18n] 🍎 iOS SettingsManager available:', !!settings);
        if (appleLocale || appleLanguages) {
          locale = appleLocale || appleLanguages?.[0] || 'en-US';
          console.log('[i18n] 🍎 iOS NativeModules locale:', locale);
        }
      } else if (Platform.OS === 'android') {
        const i18nLocale = NativeModules.I18nManager?.localeIdentifier;
        if (i18nLocale) {
          locale = i18nLocale;
          console.log('[i18n] 🤖 Android I18nManager locale:', locale);
        }
      } else if (Platform.OS === 'web') {
        locale = typeof navigator !== 'undefined'
          ? (navigator.language || (navigator as any).userLanguage || 'en')
          : 'en';
        console.log('[i18n] 🌐 Web locale from navigator:', locale);
      }
    }

    console.log('[i18n] 📍 Final detected locale:', locale);

    // Extract language code and region
    const parts = locale.split(/[-_]/);
    const languageCode = parts[0].toLowerCase();
    region = parts[1]?.toUpperCase() || '';

    console.log('[i18n] 🔤 Extracted language:', languageCode, 'region:', region);

    // Special case: If region is BR (Brazil), use Portuguese
    // This handles cases like "en-BR" which should be "pt-BR"
    if (region === 'BR') {
      console.log('[i18n] 🇧🇷 Detected Brazil region, using Portuguese!');
      return 'pt';
    }

    // Special case: If region is ES (Spain), use Spanish
    if (region === 'ES') {
      console.log('[i18n] 🇪🇸 Detected Spain region, using Spanish!');
      return 'es';
    }

    // Special case: If region is FR (France), use French
    if (region === 'FR') {
      console.log('[i18n] 🇫🇷 Detected France region, using French!');
      return 'fr';
    }

    // Special case: If region is CN/TW/HK (China/Taiwan/Hong Kong), use Chinese
    if (['CN', 'TW', 'HK'].includes(region)) {
      console.log('[i18n] 🇨🇳 Detected Chinese region, using Chinese!');
      return 'zh';
    }

    // Map language code to supported languages
    if (languageCode === 'pt') {
      console.log('[i18n] ✅ Detected Portuguese!');
      return 'pt';
    }
    if (languageCode === 'es') {
      console.log('[i18n] ✅ Detected Spanish!');
      return 'es';
    }
    if (languageCode === 'fr') {
      console.log('[i18n] ✅ Detected French!');
      return 'fr';
    }
    if (languageCode === 'zh') {
      console.log('[i18n] ✅ Detected Chinese!');
      return 'zh';
    }

    console.log('[i18n] ℹ️ Using English');
    return 'en';
  } catch (error) {
    console.error('[i18n] ❌ Error detecting device language:', error);
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
