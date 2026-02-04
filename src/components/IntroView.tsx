// IntroView - Welcome splash screen
import React from 'react';
import { View, Text, useColorScheme, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { PawPrint, Bell, Calendar } from 'lucide-react-native';
import { useColors, PrimaryButton } from '@/components/design-system';
import { useTranslation } from '@/lib/i18n';

interface IntroViewProps {
  onContinue: () => void;
}

export function IntroView({ onContinue }: IntroViewProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const c = useColors();
  const { t } = useTranslation();

  const features = [
    {
      icon: PawPrint,
      titleKey: 'intro_feature_pets_title' as const,
      descKey: 'intro_feature_pets_desc' as const,
    },
    {
      icon: Calendar,
      titleKey: 'intro_feature_schedule_title' as const,
      descKey: 'intro_feature_schedule_desc' as const,
    },
    {
      icon: Bell,
      titleKey: 'intro_feature_reminders_title' as const,
      descKey: 'intro_feature_reminders_desc' as const,
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

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          {/* Logo / Icon Area */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(800).springify()}
            style={{
              alignItems: 'center',
              marginTop: 60,
              marginBottom: 40,
            }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 36,
                overflow: 'hidden',
                backgroundColor: 'transparent',
                shadowColor: c.accent,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 24,
              }}
            >
              <Image
                source={{ uri: 'https://images.composerapi.com/019b3c58-3269-7708-b5ff-6eb362d545a7/assets/images/image_1769364705_1769364707105_019bf65a-d721-73e9-abdc-38ca9ff86f42.png' }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 36,
                }}
                resizeMode="cover"
              />
            </View>
          </Animated.View>

          {/* Welcome Text */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(800).springify()}
            style={{ alignItems: 'center', marginBottom: 48 }}
          >
            <Text
              style={{
                fontSize: 34,
                fontWeight: '700',
                color: c.text,
                textAlign: 'center',
                letterSpacing: -0.5,
                marginBottom: 12,
              }}
            >
              {t('intro_welcome_title')}
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: c.textSecondary,
                textAlign: 'center',
                lineHeight: 24,
                maxWidth: 300,
              }}
            >
              {t('intro_welcome_subtitle')}
            </Text>
          </Animated.View>

          {/* Features List */}
          <View style={{ gap: 20 }}>
            {features.map((feature, index) => (
              <Animated.View
                key={feature.titleKey}
                entering={FadeInDown.delay(600 + index * 150)
                  .duration(600)
                  .springify()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: c.surface,
                    borderWidth: 1,
                    borderColor: c.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <feature.icon size={24} color={c.accent} strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: c.text,
                      marginBottom: 2,
                    }}
                  >
                    {t(feature.titleKey)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: c.textSecondary,
                      lineHeight: 20,
                    }}
                  >
                    {t(feature.descKey)}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Continue Button */}
          <Animated.View
            entering={FadeInUp.delay(1200).duration(600).springify()}
            style={{ paddingBottom: 20 }}
          >
            <PrimaryButton title={t('intro_continue')} onPress={onContinue} />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}
