// Settings Screen
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  useColorScheme,
  Image,
  Platform,
  Appearance,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  User,
  Mail,
  Phone,
  Globe,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Check,
  Crown,
  Bug,
  Calendar,
} from 'lucide-react-native';
import { useSettingsStore, ThemeMode, LanguageMode } from '@/lib/settings-store';
import { useStore } from '@/lib/store';
import { usePremiumStore, FREE_PET_LIMIT_COUNT } from '@/lib/premium-store';
import { useColors } from '@/components/design-system';
import { PaywallScreen } from '@/components/PaywallScreen';
import { router } from 'expo-router';
import { useTranslation } from '@/lib/i18n';
import { isSandboxEnvironment } from '@/lib/sandboxDetection';
import { SandboxDevMenu } from '@/components/SandboxDevMenu';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Language labels - these are native language names so they don't need translation
const languageLabels: Record<LanguageMode, string> = {
  system: '', // This will be replaced with translated string
  en: 'English',
  pt: 'Português',
  es: 'Español',
  fr: 'Français',
  zh: '中文',
};

// Setting Row Component
interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}

function SettingRow({
  icon,
  title,
  subtitle,
  rightContent,
  onPress,
  destructive,
}: SettingRowProps) {
  const c = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 14,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: destructive ? 'rgba(220, 38, 38, 0.1)' : c.accentLight,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: destructive ? c.destructive : c.text,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontSize: 14,
              color: c.textSecondary,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightContent}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
}

// Section Component
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: c.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 8,
          marginLeft: 20,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: c.surface,
          borderRadius: 16,
          overflow: 'hidden',
          marginHorizontal: 16,
          borderWidth: 1,
          borderColor: c.border,
        }}
      >
        {children}
      </View>
    </View>
  );
}

// Selection Modal Component
interface SelectionModalProps<T extends string> {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: { value: T; label: string; icon?: React.ReactNode }[];
  selected: T;
  onSelect: (value: T) => void;
}

function SelectionModal<T extends string>({
  visible,
  onClose,
  title,
  options,
  selected,
  onSelect,
}: SelectionModalProps<T>) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: c.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: Platform.OS === 'ios' ? 34 : 24,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              paddingTop: 12,
              paddingBottom: 8,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: c.border,
              }}
            />
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: c.text,
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            {title}
          </Text>

          <View style={{ paddingHorizontal: 16 }}>
            {options.map((option, index) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  Haptics.selectionAsync();
                  onSelect(option.value);
                  onClose();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  backgroundColor:
                    selected === option.value ? c.accentLight : 'transparent',
                  borderRadius: 12,
                  marginBottom: index < options.length - 1 ? 4 : 0,
                }}
              >
                {option.icon && (
                  <View style={{ marginRight: 12 }}>{option.icon}</View>
                )}
                <Text
                  style={{
                    flex: 1,
                    fontSize: 17,
                    fontWeight: selected === option.value ? '600' : '400',
                    color: c.text,
                  }}
                >
                  {option.label}
                </Text>
                {selected === option.value && (
                  <Check size={20} color={c.accent} strokeWidth={2.5} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Confirmation Modal Component
function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}) {
  const c = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: c.surface,
            borderRadius: 20,
            width: '100%',
            maxWidth: 340,
            overflow: 'hidden',
          }}
        >
          <View style={{ padding: 24, alignItems: 'center' }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <AlertTriangle size={32} color={c.destructive} strokeWidth={2} />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: c.text,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              {title}
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: c.textSecondary,
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              {message}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderTopColor: c.border,
            }}
          >
            <Pressable
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: 16,
                alignItems: 'center',
                borderRightWidth: 1,
                borderRightColor: c.border,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '500',
                  color: c.accent,
                }}
              >
                {cancelText}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                onConfirm();
              }}
              style={{
                flex: 1,
                paddingVertical: 16,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: c.destructive,
                }}
              >
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Edit Profile Modal
function EditProfileModal({
  visible,
  onClose,
  field,
  value,
  onSave,
  fieldLabel,
  editText,
  cancelText,
  saveText,
}: {
  visible: boolean;
  onClose: () => void;
  field: 'name' | 'email' | 'phone';
  value: string;
  onSave: (value: string) => void;
  fieldLabel: string;
  editText: string;
  cancelText: string;
  saveText: string;
}) {
  const c = useColors();
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value, visible]);

  const keyboardTypes: Record<string, 'default' | 'email-address' | 'phone-pad'> = {
    name: 'default',
    email: 'email-address',
    phone: 'phone-pad',
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: c.surface,
            borderRadius: 20,
            width: '100%',
            maxWidth: 340,
            padding: 24,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: c.text,
              marginBottom: 16,
            }}
          >
            {editText} {fieldLabel}
          </Text>

          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholderTextColor={c.textTertiary}
            keyboardType={keyboardTypes[field]}
            autoCapitalize={field === 'name' ? 'words' : 'none'}
            autoFocus
            style={{
              fontSize: 17,
              color: c.text,
              backgroundColor: c.background,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: c.border,
              marginBottom: 20,
            }}
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: c.background,
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: c.textSecondary,
                }}
              >
                {cancelText}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onSave(inputValue);
                onClose();
              }}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: c.accent,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                }}
              >
                {saveText}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Main Settings Screen
export default function SettingsScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const c = useColors();
  const { t } = useTranslation();

  // Settings state
  const profile = useSettingsStore((s) => s.profile);
  const theme = useSettingsStore((s) => s.theme);
  const language = useSettingsStore((s) => s.language);
  const isInitialized = useSettingsStore((s) => s.isInitialized);
  const initialize = useSettingsStore((s) => s.initialize);
  const updateProfile = useSettingsStore((s) => s.updateProfile);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const resetAll = useSettingsStore((s) => s.resetAll);

  // Premium state
  const isPremium = usePremiumStore((s) => s.isPremium);
  const initializePremium = usePremiumStore((s) => s.initialize);
  const isPremiumInitialized = usePremiumStore((s) => s.isInitialized);

  // App store for full reset
  const refreshData = useStore((s) => s.refreshData);
  const pets = useStore((s) => s.pets);
  const upcomingCareDays = useStore((s) => s.upcomingCareDays);
  const setUpcomingCareDays = useStore((s) => s.setUpcomingCareDays);

  // Modal states
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCareDaysModal, setShowCareDaysModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [editField, setEditField] = useState<'name' | 'email' | 'phone' | null>(null);
  const [showSandboxMenu, setShowSandboxMenu] = useState(false);

  // Check if running in sandbox environment
  const isSandbox = isSandboxEnvironment();

  // Admin mode tap counter for secret access - removed, now using sandbox menu

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!isPremiumInitialized) {
      initializePremium();
    }
  }, [isPremiumInitialized]);

  // Apply theme
  useEffect(() => {
    if (theme === 'system') {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(theme);
    }
  }, [theme]);

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await updateProfile({ photoUri: result.assets[0].uri });
    }
  };

  const handleReset = async () => {
    try {
      await resetAll();
      await refreshData();
      setShowResetModal(false);
      // Navigate to onboarding - resetAll sets hasCompletedOnboarding to false
      router.replace('/onboarding');
    } catch (error) {
      console.error('Error resetting app:', error);
    }
  };

  const languageOptions: { value: LanguageMode; label: string; icon: React.ReactNode }[] = [
    {
      value: 'system',
      label: t('common_system_default'),
      icon: <Monitor size={20} color={c.textSecondary} />,
    },
    {
      value: 'en',
      label: 'English',
      icon: <Text style={{ fontSize: 18 }}>🇺🇸</Text>,
    },
    {
      value: 'pt',
      label: 'Português',
      icon: <Text style={{ fontSize: 18 }}>🇧🇷</Text>,
    },
    {
      value: 'es',
      label: 'Español',
      icon: <Text style={{ fontSize: 18 }}>🇪🇸</Text>,
    },
    {
      value: 'fr',
      label: 'Français',
      icon: <Text style={{ fontSize: 18 }}>🇫🇷</Text>,
    },
    {
      value: 'zh',
      label: '中文',
      icon: <Text style={{ fontSize: 18 }}>🇨🇳</Text>,
    },
  ];

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      value: 'system',
      label: t('settings_theme_system'),
      icon: <Monitor size={20} color={c.textSecondary} />,
    },
    {
      value: 'light',
      label: t('settings_theme_light'),
      icon: <Sun size={20} color={c.textSecondary} />,
    },
    {
      value: 'dark',
      label: t('settings_theme_dark'),
      icon: <Moon size={20} color={c.textSecondary} />,
    },
  ];

  const careDaysOptions: { value: number; label: string }[] = [
    { value: 7, label: t('settings_upcoming_care_days_7') },
    { value: 14, label: t('settings_upcoming_care_days_14') },
    { value: 30, label: t('settings_upcoming_care_days_30') },
    { value: 60, label: t('settings_upcoming_care_days_60') },
  ];

  // Get app version
  const getAppVersion = (): string => {
    const version = Constants.expoConfig?.version || '1.0.0';
    return `v${version}`;
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={
          isDark
            ? ['#0C0A09', '#1C1917', '#0C0A09']
            : ['#F5F2EE', '#FFFFFF', '#F5F2EE']
        }
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 34,
              fontWeight: '700',
              color: c.text,
              letterSpacing: -0.5,
            }}
          >
            {t('settings_title')}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Profile Section */}
          <Section title={t('settings_profile')}>
            {/* Profile Photo */}
            <Pressable
              onPress={handlePickPhoto}
              style={{
                alignItems: 'center',
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: c.border,
              }}
            >
              <View
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  backgroundColor: c.accentLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {profile.photoUri ? (
                  <Image
                    source={{ uri: profile.photoUri }}
                    style={{ width: 88, height: 88 }}
                  />
                ) : (
                  <User size={36} color={c.accent} strokeWidth={1.5} />
                )}
              </View>
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  color: c.accent,
                  fontWeight: '500',
                }}
              >
                {t('settings_change_photo')}
              </Text>
            </Pressable>

            <SettingRow
              icon={<User size={18} color={c.accent} strokeWidth={2} />}
              title={t('settings_name')}
              subtitle={profile.name || t('settings_not_set')}
              onPress={() => setEditField('name')}
              rightContent={<ChevronRight size={18} color={c.textTertiary} />}
            />
            <View style={{ height: 1, backgroundColor: c.border, marginLeft: 66 }} />
            <SettingRow
              icon={<Mail size={18} color={c.accent} strokeWidth={2} />}
              title={t('settings_email')}
              subtitle={profile.email || t('settings_not_set')}
              onPress={() => setEditField('email')}
              rightContent={<ChevronRight size={18} color={c.textTertiary} />}
            />
            <View style={{ height: 1, backgroundColor: c.border, marginLeft: 66 }} />
            <SettingRow
              icon={<Phone size={18} color={c.accent} strokeWidth={2} />}
              title={t('settings_phone')}
              subtitle={profile.phone || t('settings_not_set')}
              onPress={() => setEditField('phone')}
              rightContent={<ChevronRight size={18} color={c.textTertiary} />}
            />
          </Section>

          {/* Preferences Section */}
          <Section title={t('settings_preferences')}>
            <SettingRow
              icon={<Globe size={18} color={c.accent} strokeWidth={2} />}
              title={t('settings_language')}
              subtitle={language === 'system' ? t('common_system_default') : languageLabels[language]}
              onPress={() => setShowLanguageModal(true)}
              rightContent={<ChevronRight size={18} color={c.textTertiary} />}
            />
            <View style={{ height: 1, backgroundColor: c.border, marginLeft: 66 }} />
            <SettingRow
              icon={
                theme === 'dark' ? (
                  <Moon size={18} color={c.accent} strokeWidth={2} />
                ) : (
                  <Sun size={18} color={c.accent} strokeWidth={2} />
                )
              }
              title={t('settings_theme')}
              subtitle={themeOptions.find(o => o.value === theme)?.label ?? ''}
              onPress={() => setShowThemeModal(true)}
              rightContent={<ChevronRight size={18} color={c.textTertiary} />}
            />
            <View style={{ height: 1, backgroundColor: c.border, marginLeft: 66 }} />
            <SettingRow
              icon={<Calendar size={18} color={c.accent} strokeWidth={2} />}
              title={t('settings_upcoming_care_days')}
              subtitle={`${t('settings_upcoming_care_days_desc')} ${careDaysOptions.find(o => o.value === upcomingCareDays)?.label ?? ''}`}
              onPress={() => setShowCareDaysModal(true)}
              rightContent={<ChevronRight size={18} color={c.textTertiary} />}
            />
          </Section>

          {/* Premium Section */}
          <Section title={t('settings_premium')}>
            <SettingRow
              icon={<Crown size={18} color={c.accent} strokeWidth={2} />}
              title={isPremium ? t('settings_premium_active') : t('settings_premium_upgrade')}
              subtitle={
                isPremium
                  ? t('settings_premium_desc_active')
                  : t('settings_premium_desc', { limit: FREE_PET_LIMIT_COUNT, current: pets.length })
              }
              onPress={isPremium ? undefined : () => setShowPaywall(true)}
              rightContent={
                isPremium ? (
                  <View
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: '#22C55E', fontSize: 12, fontWeight: '600' }}>
                      {t('settings_premium_badge')}
                    </Text>
                  </View>
                ) : (
                  <ChevronRight size={18} color={c.textTertiary} />
                )
              }
            />
          </Section>

          {/* Sandbox Developer Menu - Only visible in development */}
          {isSandbox && (
            <Section title="Sandbox">
              <SettingRow
                icon={<Bug size={18} color="#EAB308" strokeWidth={2} />}
                title="Dev Sandbox Menu"
                subtitle="Ferramentas de desenvolvimento e debug"
                onPress={() => setShowSandboxMenu(true)}
                rightContent={<ChevronRight size={18} color={c.textTertiary} />}
              />
            </Section>
          )}

          {/* Danger Zone */}
          <Section title={t('settings_danger_zone')}>
            <SettingRow
              icon={<RotateCcw size={18} color={c.destructive} strokeWidth={2} />}
              title={t('settings_reset_app')}
              subtitle={t('settings_reset_desc')}
              onPress={() => setShowResetModal(true)}
              destructive
            />
          </Section>

          {/* Footer with Pet Photos */}
          <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 16 }}>
            {/* Fan-style photo cards */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 80,
                marginBottom: 16,
              }}
            >
              {/* Loki - leftmost card */}
              <View
                style={{
                  width: 56,
                  height: 72,
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: '#F5A623',
                  transform: [{ rotate: '-15deg' }, { translateX: 24 }],
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 6,
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                  zIndex: 3,
                }}
              >
                <Image
                  source={require('../../../assets/loki-1766762610452-0.png')}
                  style={{ width: 56, height: 72 }}
                  resizeMode="cover"
                />
              </View>

              {/* Brownie */}
              <View
                style={{
                  width: 56,
                  height: 72,
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: '#D4A87C',
                  transform: [{ rotate: '-5deg' }, { translateX: 8 }],
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 5,
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                  zIndex: 2,
                }}
              >
                <Image
                  source={require('../../../assets/brownie-1766763191626-1.png')}
                  style={{ width: 56, height: 72 }}
                  resizeMode="cover"
                />
              </View>

              {/* Fuba */}
              <View
                style={{
                  width: 56,
                  height: 72,
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: '#F5A623',
                  transform: [{ rotate: '5deg' }, { translateX: -8 }],
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 4,
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                  zIndex: 1,
                }}
              >
                <Image
                  source={require('../../../assets/fuba-1766763191626-2.png')}
                  style={{ width: 56, height: 72 }}
                  resizeMode="cover"
                />
              </View>

              {/* Baunilia - rightmost card */}
              <View
                style={{
                  width: 56,
                  height: 72,
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: '#D4A574',
                  transform: [{ rotate: '15deg' }, { translateX: -24 }],
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 3,
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                }}
              >
                <Image
                  source={require('../../../assets/Baunilia-1766763191626-0.png')}
                  style={{ width: 56, height: 72 }}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Footer text */}
            <Text
              style={{
                fontSize: 13,
                color: c.textTertiary,
                textAlign: 'center',
                fontStyle: 'italic',
                paddingHorizontal: 24,
              }}
            >
              Feito pensando no Loki, Brownie, Fuba e Baunilia.
            </Text>

            {/* Version number */}
            <Text
              style={{
                fontSize: 10,
                color: c.textTertiary,
                textAlign: 'center',
                opacity: 0.5,
                marginTop: 8,
              }}
            >
              {getAppVersion()}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modals */}
      <SelectionModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title={t('common_select_language')}
        options={languageOptions}
        selected={language}
        onSelect={setLanguage}
      />

      <SelectionModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        title={t('common_select_theme')}
        options={themeOptions}
        selected={theme}
        onSelect={setTheme}
      />

      <SelectionModal
        visible={showCareDaysModal}
        onClose={() => setShowCareDaysModal(false)}
        title={t('settings_upcoming_care_days')}
        options={careDaysOptions.map(opt => ({
          value: String(opt.value),
          label: opt.label,
        }))}
        selected={String(upcomingCareDays)}
        onSelect={(value) => setUpcomingCareDays(Number(value))}
      />

      <ConfirmationModal
        visible={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
        title={t('settings_reset_confirm_title')}
        message={t('settings_reset_confirm_message')}
        confirmText={t('settings_reset_confirm')}
        cancelText={t('settings_cancel')}
      />

      <EditProfileModal
        visible={editField !== null}
        onClose={() => setEditField(null)}
        field={editField ?? 'name'}
        value={editField ? profile[editField] : ''}
        onSave={(value) => {
          if (editField) {
            updateProfile({ [editField]: value });
          }
        }}
        fieldLabel={editField === 'name' ? t('settings_name') : editField === 'email' ? t('settings_email') : t('settings_phone')}
        editText={t('settings_edit')}
        cancelText={t('settings_cancel')}
        saveText={t('settings_save')}
      />

      {/* Paywall */}
      <PaywallScreen
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
      />

      {/* Sandbox Developer Menu */}
      <SandboxDevMenu
        visible={showSandboxMenu}
        onClose={() => setShowSandboxMenu(false)}
      />
    </View>
  );
}
