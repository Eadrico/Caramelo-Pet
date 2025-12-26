// IntroView - Welcome splash screen
import React from 'react';
import { View, Text, useColorScheme, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { Heart, PawPrint, Bell, Calendar } from 'lucide-react-native';
import { useColors, PrimaryButton } from '@/components/design-system';

const { width } = Dimensions.get('window');

interface IntroViewProps {
  onContinue: () => void;
}

export function IntroView({ onContinue }: IntroViewProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const c = useColors();

  const features = [
    {
      icon: PawPrint,
      title: 'Cadastre seus pets',
      description: 'Mantenha todas as informações importantes em um só lugar',
    },
    {
      icon: Calendar,
      title: 'Agende cuidados',
      description: 'Vacinas, banhos, consultas e muito mais',
    },
    {
      icon: Bell,
      title: 'Lembretes inteligentes',
      description: 'Nunca mais esqueça um compromisso importante',
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
                backgroundColor: c.accentLight,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: c.accent,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 24,
              }}
            >
              <Heart
                size={56}
                color={c.accent}
                strokeWidth={1.5}
                fill={c.accent}
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
              Bem-vindo ao Caramelo
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
              O app completo para cuidar dos seus pets com carinho e organização
            </Text>
          </Animated.View>

          {/* Features List */}
          <View style={{ gap: 20 }}>
            {features.map((feature, index) => (
              <Animated.View
                key={feature.title}
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
                    {feature.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: c.textSecondary,
                      lineHeight: 20,
                    }}
                  >
                    {feature.description}
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
            <PrimaryButton title="Continuar" onPress={onContinue} />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}
