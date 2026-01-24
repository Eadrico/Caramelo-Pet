// Onboarding Step 1: Pet Basics (Name + Species)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const setName = useStore((s) => s.setOnboardingName);
  const setSpecies = useStore((s) => s.setOnboardingSpecies);

  const isValid = name.trim().length >= 1;

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
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
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
            </View>

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
                    onSelect={setSpecies}
                  />
                </View>
              </GlassCard>
            </Animated.View>

            <View style={{ flex: 1 }} />
          </ScrollView>

          {/* Bottom Button */}
          <SafeAreaView edges={['bottom']}>
            <Animated.View
              entering={FadeInDown.duration(400).delay(300)}
              style={{ paddingHorizontal: 20, paddingBottom: 8 }}
            >
              <PrimaryButton
                title={t('onboarding_continue')}
                onPress={onNext}
                disabled={!isValid}
              />
            </Animated.View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
