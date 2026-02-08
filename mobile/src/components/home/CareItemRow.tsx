// Care Item Row Component with Swipe-to-Delete
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
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import {
  Syringe,
  Scissors,
  Pill,
  Stethoscope,
  Calendar,
  ChevronRight,
  PawPrint,
  Trash2,
} from 'lucide-react-native';
import { CareItem, Pet, formatRelativeDate, CareType } from '@/lib/types';
import { useColors } from '@/components/design-system';
import { useTranslation } from '@/lib/i18n';

interface CareItemRowProps {
  item: CareItem;
  pet: Pet;
  onPress: () => void;
  onDelete?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DELETE_THRESHOLD = -80;
const DELETE_BUTTON_WIDTH = 80;

export function CareItemRow({ item, pet, onPress, onDelete }: CareItemRowProps) {
  const c = useColors();
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

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
        t('care_delete_item'),
        t('care_delete_confirm', { title: item.title }),
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

  const getIcon = (type: CareType) => {
    const iconProps = { size: 11, color: c.accent, strokeWidth: 2.5 };
    switch (type) {
      case 'vaccine':
        return <Syringe {...iconProps} />;
      case 'grooming':
        return <Scissors {...iconProps} />;
      case 'medication':
        return <Pill {...iconProps} />;
      case 'vet_visit':
        return <Stethoscope {...iconProps} />;
      default:
        return <Calendar {...iconProps} />;
    }
  };

  // Determine if item is due soon (within 3 days)
  const dueDate = new Date(item.dueDate);
  const now = new Date();
  const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil <= 3 && daysUntil >= 0;
  const isOverdue = daysUntil < 0;

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
                borderColor: isOverdue
                  ? isDark
                    ? 'rgba(239, 68, 68, 0.3)'
                    : 'rgba(220, 38, 38, 0.2)'
                  : isUrgent
                  ? isDark
                    ? 'rgba(212, 184, 150, 0.3)'
                    : 'rgba(196, 167, 125, 0.3)'
                  : c.border,
                gap: 12,
              }}
            >
              {/* Pet Avatar with Care Type Badge */}
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
                {/* Care Type Badge with Liquid Glass */}
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
                      backgroundColor: isOverdue
                        ? isDark
                          ? 'rgba(239, 68, 68, 0.6)'
                          : 'rgba(220, 38, 38, 0.7)'
                        : isDark
                        ? 'rgba(0,0,0,0.5)'
                        : 'rgba(255,255,255,0.7)',
                      borderWidth: 1.5,
                      borderColor: isOverdue
                        ? isDark
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'rgba(220, 38, 38, 0.2)'
                        : isDark
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(0,0,0,0.08)',
                    }}
                  >
                    {getIcon(item.type)}
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
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: c.textSecondary,
                  }}
                >
                  {pet.name} • {formatRelativeDate(item.dueDate, t)}
                </Text>
              </View>

              {/* Status Indicator */}
              {(isUrgent || isOverdue) && (
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    backgroundColor: isOverdue
                      ? isDark
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(220, 38, 38, 0.1)'
                      : isDark
                      ? 'rgba(212, 184, 150, 0.2)'
                      : 'rgba(196, 167, 125, 0.15)',
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: isOverdue ? c.destructive : c.accent,
                    }}
                  >
                    {isOverdue ? t('common_overdue') : t('common_soon')}
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
