// Onboarding Step 3: Key Info (Birthdate + Weight)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  Pressable,
  useColorScheme,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { Calendar, Scale } from 'lucide-react-native';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/types';
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

export function OnboardingInfo({ onNext, onBack }: OnboardingInfoProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      Haptics.selectionAsync();
      setBirthdate(selectedDate.toISOString());
    }
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
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ProgressIndicator current={3} total={5} />
            <Pressable
              onPress={onBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ fontSize: 15, color: c.accent, fontWeight: '500' }}>
                Back
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
              Key Info
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: c.textSecondary,
                marginTop: 8,
                lineHeight: 24,
              }}
            >
              Help us know {name} better. All optional.
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
                  Birthdate
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
                    {birthdate ? formatDate(birthdate) : 'Select birthdate'}
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
                  Weight
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
                      placeholder="0.0"
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
        <SafeAreaView edges={['bottom']}>
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={{ paddingHorizontal: 20, paddingBottom: 8, gap: 12 }}
          >
            <PrimaryButton title="Continue" onPress={onNext} />
            {!birthdate && !weightKg && (
              <Pressable
                onPress={onNext}
                style={{ paddingVertical: 12, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 15, color: c.textSecondary, fontWeight: '500' }}>
                  Skip for now
                </Text>
              </Pressable>
            )}
          </Animated.View>
        </SafeAreaView>
      </SafeAreaView>

      {/* Date Picker Modal */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
        >
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
            onPress={() => setShowDatePicker(false)}
          />
          <View
            style={{
              backgroundColor: c.surface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 34,
            }}
          >
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
              <Pressable onPress={() => setShowDatePicker(false)}>
                <Text style={{ fontSize: 17, color: c.textSecondary }}>Cancel</Text>
              </Pressable>
              <Text style={{ fontSize: 17, fontWeight: '600', color: c.text }}>
                Birthdate
              </Text>
              <Pressable onPress={() => setShowDatePicker(false)}>
                <Text style={{ fontSize: 17, color: c.accent, fontWeight: '600' }}>Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={birthdate ? new Date(birthdate) : new Date()}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              maximumDate={new Date()}
              style={{ height: 200 }}
            />
          </View>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={birthdate ? new Date(birthdate) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )
      )}
    </View>
  );
}
