// Pet Card Component for Home Screen
import React from 'react';
import { View, Text, Image, Pressable, useColorScheme } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PawPrint, ChevronRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Pet, CareItem, formatRelativeDate, getSpeciesEmoji } from '@/lib/types';
import { useColors } from '@/components/design-system';
import { useTranslation } from '@/lib/i18n';

interface PetCardProps {
  pet: Pet;
  nextCareItem?: CareItem;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PetCard({ pet, nextCareItem, onPress }: PetCardProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, { width: 160 }]}
    >
      <View
        style={{
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
        }}
      >
        {/* Photo Section */}
        <View
          style={{
            height: 200,
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
              <PawPrint size={48} color={c.accent} strokeWidth={1.5} />
            </View>
          )}
          {/* Species Badge */}
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 14 }}>
              {getSpeciesEmoji(pet.species, pet.customSpecies)}
            </Text>
          </View>

          {/* Glass Name Banner - Overlaid on Photo */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              overflow: 'hidden',
            }}
          >
            <BlurView
              intensity={isDark ? 40 : 60}
              tint={isDark ? 'dark' : 'light'}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)',
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: isDark ? '#FFFFFF' : '#1C1917',
                  marginBottom: nextCareItem ? 2 : 0,
                }}
                numberOfLines={1}
              >
                {pet.name}
              </Text>
              {nextCareItem && (
                <Text
                  style={{
                    fontSize: 13,
                    color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(28,25,23,0.7)',
                  }}
                  numberOfLines={1}
                >
                  {nextCareItem.title} • {formatRelativeDate(nextCareItem.dueDate, t)}
                </Text>
              )}
            </BlurView>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}
