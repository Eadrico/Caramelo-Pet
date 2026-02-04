// Reminder Row Component for unified list
import React from 'react';
import { View, Text, Pressable, useColorScheme, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Bell, ChevronRight, PawPrint } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Reminder, Pet, formatRelativeDate, getRepeatLabel } from '@/lib/types';
import { useColors } from '@/components/design-system';
import { useTranslation } from '@/lib/i18n';

interface ReminderRowProps {
  reminder: Reminder;
  pet: Pet;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ReminderRow({ reminder, pet, onPress }: ReminderRowProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const scale = useSharedValue(1);
  const { t } = useTranslation();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const reminderDate = new Date(reminder.dateTime);
  const now = new Date();
  const isPast = reminderDate < now;
  const isToday =
    reminderDate.toDateString() === now.toDateString() &&
    reminderDate >= now;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 14,
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : c.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: isToday
            ? isDark
              ? 'rgba(212, 184, 150, 0.3)'
              : 'rgba(196, 167, 125, 0.3)'
            : c.border,
          gap: 12,
          opacity: reminder.isEnabled ? 1 : 0.6,
        }}
      >
        {/* Pet Avatar with Reminder Badge */}
        <View style={{ position: 'relative' }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              overflow: 'hidden',
              backgroundColor: c.accentLight,
            }}
          >
            {pet.photoUri ? (
              <Image
                source={{ uri: pet.photoUri }}
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
                <PawPrint size={20} color={c.accent} strokeWidth={1.5} />
              </View>
            )}
          </View>

          {/* Reminder Badge with Liquid Glass */}
          <View
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <BlurView
              intensity={isDark ? 50 : 70}
              tint={isDark ? 'dark' : 'light'}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
                borderWidth: 1.5,
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
              }}
            >
              <Bell size={11} color={c.accent} strokeWidth={2.5} />
            </BlurView>
          </View>
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: c.text,
              marginBottom: 2,
            }}
            numberOfLines={1}
          >
            {reminder.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: c.textSecondary,
            }}
          >
            {pet.name}
            {reminder.repeatType !== 'none' && ` • ${getRepeatLabel(reminder.repeatType, t)}`}
          </Text>
        </View>

        {/* Status Indicator */}
        {isToday && (
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor: isDark
                ? 'rgba(212, 184, 150, 0.2)'
                : 'rgba(196, 167, 125, 0.15)',
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: c.accent,
              }}
            >
              {t('common_today')}
            </Text>
          </View>
        )}

        <ChevronRight size={18} color={c.textTertiary} />
      </View>
    </AnimatedPressable>
  );
}

