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
  Alert,
  Appearance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeOut,
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
} from 'lucide-react-native';
import { useSettingsStore, ThemeMode, LanguageMode } from '@/lib/settings-store';
import { useStore } from '@/lib/store';
import { colors, useColors } from '@/components/design-system';
import { cn } from '@/lib/cn';
import { router } from 'expo-router';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Language labels
const languageLabels: Record<LanguageMode, string> = {
  system: 'Padrão do Sistema',
  pt: 'Português',
  en: 'English',
};

// Theme labels
const themeLabels: Record<ThemeMode, string> = {
  system: 'Sistema',
  light: 'Claro',
  dark: 'Escuro',
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
          marginLeft: 16,
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
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
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
              Resetar App?
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: c.textSecondary,
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              Tem certeza? Todos os dados serão apagados permanentemente,
              incluindo seus pets e configurações.
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
                Cancelar
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
                Resetar
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
}: {
  visible: boolean;
  onClose: () => void;
  field: 'name' | 'email' | 'phone';
  value: string;
  onSave: (value: string) => void;
}) {
  const c = useColors();
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value, visible]);

  const fieldLabels = {
    name: 'Nome',
    email: 'E-mail',
    phone: 'Telefone',
  };

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
            Editar {fieldLabels[field]}
          </Text>

          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={`Digite seu ${fieldLabels[field].toLowerCase()}`}
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
                Cancelar
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
                Salvar
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

  // App store for full reset
  const refreshData = useStore((s) => s.refreshData);

  // Modal states
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [editField, setEditField] = useState<'name' | 'email' | 'phone' | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized]);

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
      label: 'Padrão do Sistema',
      icon: <Monitor size={20} color={c.textSecondary} />,
    },
    {
      value: 'pt',
      label: 'Português',
      icon: <Text style={{ fontSize: 18 }}>🇧🇷</Text>,
    },
    {
      value: 'en',
      label: 'English',
      icon: <Text style={{ fontSize: 18 }}>🇺🇸</Text>,
    },
  ];

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      value: 'system',
      label: 'Sistema',
      icon: <Monitor size={20} color={c.textSecondary} />,
    },
    {
      value: 'light',
      label: 'Claro',
      icon: <Sun size={20} color={c.textSecondary} />,
    },
    {
      value: 'dark',
      label: 'Escuro',
      icon: <Moon size={20} color={c.textSecondary} />,
    },
  ];

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
            Configurações
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Profile Section */}
          <Section title="Perfil do Usuário">
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
                Alterar Foto
              </Text>
            </Pressable>

            <SettingRow
              icon={<User size={18} color={c.accent} strokeWidth={2} />}
              title="Nome"
              subtitle={profile.name || 'Não informado'}
              onPress={() => setEditField('name')}
              rightContent={<ChevronRight size={18} color={c.textTertiary} />}
            />
            <View style={{ height: 1, backgroundColor: c.border, marginLeft: 66 }} />
            <SettingRow
              icon={<Mail size={18} color={c.accent} strokeWidth={2} />}
              title="E-mail"
              subtitle={profile.email || 'Não informado'}
              onPress={() => setEditField('email')}
              rightContent={<ChevronRight size={18} color={c.textTertiary} />}
            />
            <View style={{ height: 1, backgroundColor: c.border, marginLeft: 66 }} />
            <SettingRow
              icon={<Phone size={18} color={c.accent} strokeWidth={2} />}
              title="Telefone"
              subtitle={profile.phone || 'Não informado'}
              onPress={() => setEditField('phone')}
              rightContent={<ChevronRight size={18} color={c.textTertiary} />}
            />
          </Section>

          {/* Preferences Section */}
          <Section title="Preferências Gerais">
            <SettingRow
              icon={<Globe size={18} color={c.accent} strokeWidth={2} />}
              title="Idioma"
              subtitle={languageLabels[language]}
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
              title="Tema"
              subtitle={themeLabels[theme]}
              onPress={() => setShowThemeModal(true)}
              rightContent={<ChevronRight size={18} color={c.textTertiary} />}
            />
          </Section>

          {/* Danger Zone */}
          <Section title="Zona de Perigo">
            <SettingRow
              icon={<RotateCcw size={18} color={c.destructive} strokeWidth={2} />}
              title="Resetar App"
              subtitle="Apaga todos os dados"
              onPress={() => setShowResetModal(true)}
              destructive
            />
          </Section>
        </ScrollView>
      </SafeAreaView>

      {/* Modals */}
      <SelectionModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title="Selecionar Idioma"
        options={languageOptions}
        selected={language}
        onSelect={setLanguage}
      />

      <SelectionModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        title="Selecionar Tema"
        options={themeOptions}
        selected={theme}
        onSelect={setTheme}
      />

      <ConfirmationModal
        visible={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
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
      />
    </View>
  );
}
