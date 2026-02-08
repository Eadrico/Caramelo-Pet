// Onboarding Step 3: Key Info (Birthdate + Weight)
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  Pressable,
  useColorScheme,
  Modal,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Calendar, Scale, Check } from 'lucide-react-native';
import { useStore } from '@/lib/store';
import { useTranslation, useLanguage } from '@/lib/i18n';
import {
  GlassCard,
  PrimaryButton,
  SegmentedControl,
  ProgressIndicator,
  useColors,
} from '@/components/design-system';

interface OnboardingInfoProps {
  onNext: () => void;
  onBack: () => void;
}

type WeightUnit = 'kg' | 'lb';

// Month/Year picker component
function MonthYearPicker({
  selectedMonth,
  selectedYear,
  onSelect,
  onClose,
}: {
  selectedMonth: number;
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
}) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();
  const { effectiveLanguage } = useLanguage();

  const [tempMonth, setTempMonth] = useState(selectedMonth);
  const [tempYear, setTempYear] = useState(selectedYear);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Generate years (last 30 years)
  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = currentYear; y >= currentYear - 30; y--) {
      arr.push(y);
    }
    return arr;
  }, [currentYear]);

  // Map language codes to locale codes for Intl
  const getLocale = (lang: string): string => {
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'pt': 'pt-BR',
      'es': 'es-ES',
    };
    return localeMap[lang] || 'en-US';
  };

  // Month names
  const months = useMemo(() => {
    const locale = getLocale(effectiveLanguage);
    const formatter = new Intl.DateTimeFormat(locale, { month: 'long' });
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2024, i, 1);
      return formatter.format(date);
    });
  }, [effectiveLanguage]);

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(tempMonth, tempYear);
    onClose();
  };

  const isMonthDisabled = (month: number) => {
    // Disable future months in current year
    return tempYear === currentYear && month > currentMonth;
  };

  return (
    <Modal visible transparent animationType="slide">
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={onClose}
      />
      <View
        style={{
          backgroundColor: c.surface,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 34,
          maxHeight: '70%',
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: c.border,
          }}
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
          >
            <Text style={{ fontSize: 17, color: c.textSecondary }}>{t('common_cancel')}</Text>
          </Pressable>
          <Text style={{ fontSize: 17, fontWeight: '600', color: c.text }}>
            {t('onboarding_birthdate')}
          </Text>
          <Pressable onPress={handleConfirm}>
            <Text style={{ fontSize: 17, color: c.accent, fontWeight: '600' }}>{t('common_done')}</Text>
          </Pressable>
        </View>

        {/* Picker Content */}
        <View style={{ flexDirection: 'row', height: 300 }}>
          {/* Month Picker */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
          >
            {months.map((month, index) => {
              const isSelected = index === tempMonth;
              const disabled = isMonthDisabled(index);
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    if (!disabled) {
                      Haptics.selectionAsync();
                      setTempMonth(index);
                    }
                  }}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    backgroundColor: isSelected
                      ? isDark
                        ? 'rgba(196, 167, 125, 0.2)'
                        : 'rgba(196, 167, 125, 0.15)'
                      : 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: disabled ? 0.4 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      color: isSelected ? c.accent : c.text,
                      fontWeight: isSelected ? '600' : '400',
                    }}
                  >
                    {month}
                  </Text>
                  {isSelected && <Check size={20} color={c.accent} strokeWidth={2.5} />}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Divider */}
          <View
            style={{
              width: 1,
              backgroundColor: c.border,
              marginVertical: 8,
            }}
          />

          {/* Year Picker */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
          >
            {years.map((year) => {
              const isSelected = year === tempYear;
              return (
                <Pressable
                  key={year}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setTempYear(year);
                    // If selecting current year and month is in future, reset to current month
                    if (year === currentYear && tempMonth > currentMonth) {
                      setTempMonth(currentMonth);
                    }
                  }}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    backgroundColor: isSelected
                      ? isDark
                        ? 'rgba(196, 167, 125, 0.2)'
                        : 'rgba(196, 167, 125, 0.15)'
                      : 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      color: isSelected ? c.accent : c.text,
                      fontWeight: isSelected ? '600' : '400',
                    }}
                  >
                    {year}
                  </Text>
                  {isSelected && <Check size={20} color={c.accent} strokeWidth={2.5} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// Format month/year for display
function formatMonthYear(dateString: string, language: string): string {
  const date = new Date(dateString);
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'pt': 'pt-BR',
    'es': 'es-ES',
  };
  const locale = localeMap[language] || 'en-US';
  const formatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  return formatter.format(date);
}

export function OnboardingInfo({ onNext, onBack }: OnboardingInfoProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();
  const { effectiveLanguage } = useLanguage();
  const insets = useSafeAreaInsets();

  const name = useStore((s) => s.onboardingData.name);
  const birthdate = useStore((s) => s.onboardingData.birthdate);
  const weightKg = useStore((s) => s.onboardingData.weightKg);
  const setBirthdate = useStore((s) => s.setOnboardingBirthdate);
  const setWeightKg = useStore((s) => s.setOnboardingWeight);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [weightInput, setWeightInput] = useState(
    weightKg ? (weightUnit === 'kg' ? weightKg.toString() : (weightKg * 2.205).toFixed(1)) : ''
  );

  // Get current month/year from birthdate or use current date
  const currentDate = birthdate ? new Date(birthdate) : new Date();
  const selectedMonth = currentDate.getMonth();
  const selectedYear = currentDate.getFullYear();

  const handleMonthYearSelect = (month: number, year: number) => {
    Haptics.selectionAsync();
    // Set to first day of the month
    const date = new Date(year, month, 1);
    setBirthdate(date.toISOString());
  };

  const handleWeightChange = (text: string) => {
    // Only allow numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;

    setWeightInput(formatted);

    if (formatted) {
      const value = parseFloat(formatted);
      if (!isNaN(value)) {
        // Convert to kg for storage
        const kg = weightUnit === 'kg' ? value : value / 2.205;
        setWeightKg(Math.round(kg * 10) / 10);
      }
    } else {
      setWeightKg(undefined);
    }
  };

  const handleUnitChange = (unit: WeightUnit) => {
    setWeightUnit(unit);
    if (weightKg) {
      setWeightInput(
        unit === 'kg' ? weightKg.toString() : (weightKg * 2.205).toFixed(1)
      );
    }
  };

  const unitOptions: { value: WeightUnit; label: string }[] = [
    { value: 'kg', label: 'kg' },
    { value: 'lb', label: 'lb' },
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
      <View style={{ flex: 1, paddingTop: insets.top }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ProgressIndicator current={3} total={4} />
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onBack();
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ fontSize: 15, color: c.accent, fontWeight: '500' }}>
                {t('onboarding_back')}
              </Text>
            </Pressable>
          </View>
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <Text
              style={{
                fontSize: 34,
                fontWeight: '700',
                color: c.text,
                marginTop: 24,
                letterSpacing: -0.8,
              }}
            >
              {t('onboarding_key_info_title')}
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: c.textSecondary,
                marginTop: 8,
                lineHeight: 24,
              }}
            >
              {t('onboarding_key_info_subtitle', { name })}
            </Text>
          </Animated.View>
        </View>

        {/* Content */}
        <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 32 }}>
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <GlassCard>
              {/* Birthdate */}
              <View style={{ marginBottom: 28 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: c.textTertiary,
                    marginBottom: 12,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {t('onboarding_birthdate')}
                </Text>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowDatePicker(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 12,
                    gap: 12,
                  }}
                >
                  <Calendar size={22} color={c.accent} />
                  <Text
                    style={{
                      fontSize: 17,
                      color: birthdate ? c.text : c.textTertiary,
                      fontWeight: birthdate ? '500' : '400',
                    }}
                  >
                    {birthdate ? formatMonthYear(birthdate, effectiveLanguage) : t('onboarding_select_birthdate')}
                  </Text>
                </Pressable>
              </View>

              {/* Weight */}
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: c.textTertiary,
                    marginBottom: 12,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {t('onboarding_weight')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 4,
                      paddingHorizontal: 16,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderRadius: 12,
                      gap: 12,
                    }}
                  >
                    <Scale size={22} color={c.accent} />
                    <RNTextInput
                      value={weightInput}
                      onChangeText={handleWeightChange}
                      placeholder={t('onboarding_weight_placeholder')}
                      placeholderTextColor={c.textTertiary}
                      keyboardType="decimal-pad"
                      returnKeyType="done"
                      style={{
                        flex: 1,
                        fontSize: 17,
                        color: c.text,
                        paddingVertical: 10,
                      }}
                    />
                  </View>
                  <View style={{ width: 100 }}>
                    <SegmentedControl
                      options={unitOptions}
                      selected={weightUnit}
                      onSelect={handleUnitChange}
                    />
                  </View>
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        </View>

        {/* Bottom Button */}
        <View style={{ paddingBottom: insets.bottom }}>
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={{ paddingHorizontal: 20, paddingBottom: 8, gap: 12 }}
          >
            <PrimaryButton title={t('onboarding_continue')} onPress={onNext} />
            {!birthdate && !weightKg && (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onNext();
                }}
                style={{ paddingVertical: 12, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 15, color: c.textSecondary, fontWeight: '500' }}>
                  {t('onboarding_skip_for_now')}
                </Text>
              </Pressable>
            )}
          </Animated.View>
        </View>
      </View>

      {/* Month/Year Picker Modal */}
      {showDatePicker && (
        <MonthYearPicker
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onSelect={handleMonthYearSelect}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </View>
  );
}
