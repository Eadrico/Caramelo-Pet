// Onboarding Step 5: Review & Save
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Check,
  Calendar,
  Scale,
  Syringe,
  Scissors,
  Pill,
  Stethoscope,
  PawPrint,
} from 'lucide-react-native';
import { useStore } from '@/lib/store';
import {
  formatDate,
  getSpeciesEmoji,
  getSpeciesTranslationKey,
  CareType,
} from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import {
  GlassCard,
  PrimaryButton,
  ProgressIndicator,
  useColors,
} from '@/components/design-system';

interface OnboardingReviewProps {
  onComplete: () => void;
  onBack: () => void;
}

export function OnboardingReview({ onComplete, onBack }: OnboardingReviewProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const onboardingData = useStore((s) => s.onboardingData);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await completeOnboarding();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
    } catch (error) {
      console.error('Error saving pet:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsSaving(false);
    }
  };

  const getIconComponent = (type: CareType) => {
    const icons = {
      vaccine: Syringe,
      grooming: Scissors,
      medication: Pill,
      vet_visit: Stethoscope,
    };
    const Icon = icons[type] || Calendar;
    return <Icon size={16} color={c.accent} />;
  };

  const calculateAge = (birthdate: string) => {
    const birth = new Date(birthdate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Adjust if we haven't reached the birth day this month
    if (now.getDate() < birth.getDate()) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
    }

    // Format the age string
    if (years === 0 && months === 0) {
      return t('common_less_than_month');
    }
    if (years === 0) {
      return `${months} ${months === 1 ? t('common_month') : t('common_months')}`;
    }
    if (months === 0) {
      return `${years} ${years === 1 ? t('common_year') : t('common_years')}`;
    }
    // Show both years and months
    const yearStr = `${years} ${years === 1 ? t('common_year') : t('common_years')}`;
    const monthStr = `${months} ${months === 1 ? t('common_month') : t('common_months')}`;
    return `${yearStr} ${t('common_and')} ${monthStr}`;
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
      <View style={{ flex: 1, paddingTop: insets.top }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ProgressIndicator current={4} total={4} />
            <Pressable
              onPress={onBack}
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
              {t('onboarding_review_title')}
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: c.textSecondary,
                marginTop: 8,
                lineHeight: 24,
              }}
            >
              {t('onboarding_review_subtitle')}
            </Text>
          </Animated.View>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <GlassCard>
              {/* Pet Profile Header */}
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                {/* Photo */}
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: c.accentLight,
                    overflow: 'hidden',
                    borderWidth: 3,
                    borderColor: c.accent,
                    marginBottom: 16,
                  }}
                >
                  {onboardingData.photoUri ? (
                    <Image
                      source={{ uri: onboardingData.photoUri }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PawPrint size={40} color={c.accent} />
                    </View>
                  )}
                </View>

                {/* Name & Species */}
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '700',
                    color: c.text,
                    marginBottom: 4,
                    letterSpacing: -0.5,
                  }}
                >
                  {onboardingData.name}
                </Text>
                <Text
                  style={{
                    fontSize: 17,
                    color: c.textSecondary,
                  }}
                >
                  {getSpeciesEmoji(onboardingData.species)}{' '}
                  {t(getSpeciesTranslationKey(onboardingData.species))}
                </Text>
              </View>

              {/* Info Section */}
              {(onboardingData.birthdate || onboardingData.weightKg) && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 24,
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: c.border,
                    marginBottom:
                      onboardingData.careItems.length > 0 ? 24 : 0,
                  }}
                >
                  {onboardingData.birthdate && (
                    <View style={{ alignItems: 'center' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          marginBottom: 4,
                        }}
                      >
                        <Calendar size={16} color={c.textSecondary} />
                        <Text
                          style={{
                            fontSize: 13,
                            color: c.textSecondary,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          }}
                        >
                          {t('onboarding_review_age')}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '600',
                          color: c.text,
                        }}
                      >
                        {calculateAge(onboardingData.birthdate)}
                      </Text>
                    </View>
                  )}
                  {onboardingData.weightKg && (
                    <View style={{ alignItems: 'center' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          marginBottom: 4,
                        }}
                      >
                        <Scale size={16} color={c.textSecondary} />
                        <Text
                          style={{
                            fontSize: 13,
                            color: c.textSecondary,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          }}
                        >
                          {t('onboarding_review_weight')}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '600',
                          color: c.text,
                        }}
                      >
                        {onboardingData.weightKg} kg
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Care Items */}
              {onboardingData.careItems.length > 0 && (
                <View
                  style={{
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: c.border,
                  }}
                >
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
                    {t('pet_details_upcoming_care')}
                  </Text>
                  <View style={{ gap: 8 }}>
                    {onboardingData.careItems.map((item, index) => (
                      <Animated.View
                        key={`${item.type}-${index}`}
                        entering={FadeIn.duration(200).delay(index * 50)}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            backgroundColor: isDark
                              ? 'rgba(255,255,255,0.03)'
                              : 'rgba(0,0,0,0.02)',
                            borderRadius: 10,
                            gap: 10,
                          }}
                        >
                          {getIconComponent(item.type)}
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 15,
                              color: c.text,
                            }}
                            numberOfLines={1}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: c.textSecondary,
                            }}
                          >
                            {formatDate(item.dueDate)}
                          </Text>
                        </View>
                      </Animated.View>
                    ))}
                  </View>
                </View>
              )}
            </GlassCard>
          </Animated.View>

          {/* Success Message */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={{
              marginTop: 24,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: c.accentLight,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Check size={24} color={c.accent} />
            </View>
            <Text
              style={{
                fontSize: 15,
                color: c.textSecondary,
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              {t('onboarding_review_ready_message').replace('{name}', onboardingData.name)}
            </Text>
          </Animated.View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={{ position: 'absolute', bottom: insets.bottom, left: 0, right: 0 }}>
          <View
            style={{
              backgroundColor: isDark ? '#0C0A09' : '#F5F2EE',
              paddingTop: 16,
              paddingHorizontal: 20,
              paddingBottom: 8,
            }}
          >
            <PrimaryButton
              title={isSaving ? t('common_saving') : t('onboarding_save_pet')}
              onPress={handleSave}
              disabled={isSaving}
              loading={isSaving}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
