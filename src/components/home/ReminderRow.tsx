// Reminder Row Component with Swipe-to-Delete
import React from 'react';
import { View, Text, Pressable, useColorScheme, Image, Alert } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Bell, ChevronRight, PawPrint, Trash2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Reminder, Pet, formatRelativeDate, getRepeatLabel } from '@/lib/types';
import { useColors } from '@/components/design-system';
import { useTranslation } from '@/lib/i18n';

interface ReminderRowProps {
  reminder: Reminder;
  pet: Pet;
  onPress: () => void;
  onDelete?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DELETE_THRESHOLD = -80;
const DELETE_BUTTON_WIDTH = 80;

export function ReminderRow({ reminder, pet, onPress, onDelete }: ReminderRowProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const { t } = useTranslation();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const swipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: Math.min(Math.abs(translateX.value) / DELETE_BUTTON_WIDTH, 1),
    transform: [
      { scale: Math.min(Math.abs(translateX.value) / DELETE_BUTTON_WIDTH, 1) },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (Math.abs(translateX.value) < 5) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const triggerDelete = () => {
    if (onDelete) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        t('common_delete_reminder'),
        t('common_delete_reminder_confirm'),
        [
          {
            text: t('common_cancel'),
            style: 'cancel',
            onPress: () => {
              translateX.value = withSpring(0);
            },
          },
          {
            text: t('common_delete'),
            style: 'destructive',
            onPress: () => {
              onDelete();
            },
          },
        ]
      );
    }
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-5, 5])
    .onUpdate((event) => {
      // Only allow swiping left
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -DELETE_BUTTON_WIDTH - 20);
      } else if (translateX.value < 0) {
        // Allow swiping right to close
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (translateX.value < DELETE_THRESHOLD) {
        // Keep open to show delete button
        translateX.value = withSpring(-DELETE_BUTTON_WIDTH);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      } else if (translateX.value > -DELETE_THRESHOLD / 2) {
        // Close if swiped back
        translateX.value = withSpring(0);
      } else {
        // Stay in current position
        translateX.value = withSpring(-DELETE_BUTTON_WIDTH);
      }
    });

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (Math.abs(translateX.value) > 5) {
        translateX.value = withSpring(0);
      }
    });

  const reminderDate = new Date(reminder.dateTime);
  const now = new Date();
  const isPast = reminderDate < now;
  const isToday =
    reminderDate.toDateString() === now.toDateString() &&
    reminderDate >= now;

  return (
    <View style={{ position: 'relative', overflow: 'hidden', borderRadius: 14 }}>
      {/* Delete Button Background */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: DELETE_BUTTON_WIDTH,
            backgroundColor: c.destructive,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
          },
          deleteButtonStyle,
        ]}
      >
        <Pressable
          onPress={triggerDelete}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Trash2 size={24} color="#FFFFFF" />
        </Pressable>
      </Animated.View>

      {/* Swipeable Content */}
      <GestureDetector gesture={Gesture.Simultaneous(panGesture, tapGesture)}>
        <Animated.View style={swipeStyle}>
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
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
