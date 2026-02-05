// Onboarding Step 1: Pet Basics (Name + Species)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  useColorScheme,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useStore } from '@/lib/store';
import { Species } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import {
  GlassCard,
  PrimaryButton,
  SegmentedControl,
  ProgressIndicator,
  useColors,
} from '@/components/design-system';

interface OnboardingBasicsProps {
  onNext: () => void;
}

export function OnboardingBasics({ onNext }: OnboardingBasicsProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();

  const name = useStore((s) => s.onboardingData.name);
  const species = useStore((s) => s.onboardingData.species);
  const customSpecies = useStore((s) => s.onboardingData.customSpecies);
  const setName = useStore((s) => s.setOnboardingName);
  const setSpecies = useStore((s) => s.setOnboardingSpecies);
  const setCustomSpecies = useStore((s) => s.setOnboardingCustomSpecies);

  const [localCustomSpecies, setLocalCustomSpecies] = useState(customSpecies || '');

  const isValid = name.trim().length >= 1 && (species !== 'other' || localCustomSpecies.trim().length >= 1);

  const handleNext = () => {
    if (species === 'other' && localCustomSpecies.trim()) {
      setCustomSpecies(localCustomSpecies.trim());
    }
    onNext();
  };

  const handleSpeciesChange = (newSpecies: Species) => {
    setSpecies(newSpecies);
    if (newSpecies !== 'other') {
      setCustomSpecies(undefined);
      setLocalCustomSpecies('');
    }
  };

  const speciesOptions: { value: Species; label: string }[] = [
    { value: 'dog', label: t('onboarding_species_dog') },
    { value: 'cat', label: t('onboarding_species_cat') },
    { value: 'other', label: t('onboarding_species_other') },
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Safe Area Top Padding */}
          <SafeAreaView edges={['top']} style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <ProgressIndicator current={1} total={5} />
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
                {t('onboarding_add_pet_title')}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: c.textSecondary,
                  marginTop: 8,
                  lineHeight: 24,
                }}
              >
                {t('onboarding_add_pet_subtitle')}
              </Text>
            </Animated.View>
          </SafeAreaView>

          {/* Content */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={{ paddingHorizontal: 20, marginTop: 32 }}
          >
            <GlassCard>
              {/* Name Input */}
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: c.textTertiary,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {t('onboarding_pet_name')}
                </Text>
                <RNTextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={t('onboarding_pet_name_example')}
                  placeholderTextColor={c.textTertiary}
                  autoFocus
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={30}
                  returnKeyType="next"
                  style={{
                    fontSize: 24,
                    fontWeight: '600',
                    color: c.text,
                    paddingVertical: 12,
                    borderBottomWidth: 2,
                    borderBottomColor: name ? c.accent : c.border,
                  }}
                />
              </View>

              {/* Species Selection */}
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
                  {t('onboarding_species_question')}
                </Text>
                <SegmentedControl
                  options={speciesOptions}
                  selected={species}
                  onSelect={handleSpeciesChange}
                />

                {/* Custom Species Input - shown when "other" is selected */}
                {species === 'other' && (
                  <Animated.View
                    entering={FadeInDown.duration(300).delay(100)}
                    style={{ marginTop: 16 }}
                  >
                    <RNTextInput
                      value={localCustomSpecies}
                      onChangeText={setLocalCustomSpecies}
                      placeholder="Ex: Coelho, Hamster, Peixe..."
                      placeholderTextColor={c.textTertiary}
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={30}
                      returnKeyType="done"
                      style={{
                        fontSize: 17,
                        color: c.text,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: localCustomSpecies ? c.accent : c.border,
                      }}
                    />
                  </Animated.View>
                )}
              </View>
            </GlassCard>
          </Animated.View>
        </ScrollView>

        {/* Bottom Button - Inside KeyboardAvoidingView */}
        <SafeAreaView edges={['bottom']}>
          <View style={{ paddingHorizontal: 20, paddingBottom: 8, backgroundColor: isDark ? '#0C0A09' : '#F5F2EE' }}>
            <PrimaryButton
              title={t('onboarding_continue')}
              onPress={handleNext}
              disabled={!isValid}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
