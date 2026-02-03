// Caramelo Design System - Liquid Glass Components
// Apple HIG compliant with warm, premium aesthetic

import React from 'react';
import { View, Text, Pressable, useColorScheme, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/cn';

// Color palette - warm, refined, Apple-native
export const colors = {
  light: {
    background: '#F5F2EE', // Warm off-white
    surface: '#FFFFFF',
    surfaceElevated: 'rgba(255, 255, 255, 0.85)',
    text: '#1C1917', // Stone 900
    textSecondary: '#78716C', // Stone 500
    textTertiary: '#A8A29E', // Stone 400
    accent: '#C4A77D', // Warm caramel/gold
    accentLight: '#E8DCC8',
    border: 'rgba(0, 0, 0, 0.06)',
    destructive: '#DC2626',
    success: '#16A34A',
  },
  dark: {
    background: '#0C0A09', // Stone 950
    surface: '#1C1917', // Stone 900
    surfaceElevated: 'rgba(28, 25, 23, 0.85)',
    text: '#FAFAF9', // Stone 50
    textSecondary: '#A8A29E', // Stone 400
    textTertiary: '#78716C', // Stone 500
    accent: '#D4B896', // Lighter caramel for dark mode
    accentLight: '#3D3630',
    border: 'rgba(255, 255, 255, 0.08)',
    destructive: '#EF4444',
    success: '#22C55E',
  },
};

export function useColors() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? colors.dark : colors.light;
}

// Glass Card Component
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, className, style, intensity = 60 }: GlassCardProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View
      className={cn('overflow-hidden rounded-2xl', className)}
      style={[{ borderRadius: 20 }, style]}
    >
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark
              ? 'rgba(28, 25, 23, 0.7)'
              : 'rgba(255, 255, 255, 0.75)',
          },
        ]}
      />
      <View
        style={{
          borderWidth: 1,
          borderColor: isDark
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.04)',
          borderRadius: 20,
          padding: 16,
        }}
      >
        {children}
      </View>
    </View>
  );
}

// Primary Button with haptic feedback
interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'destructive';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const c = useColors();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const bgColors = {
    primary: isDark ? ['#D4B896', '#C4A77D'] : ['#C4A77D', '#B69660'],
    secondary: isDark
      ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
      : ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.08)'],
    destructive: ['#DC2626', '#B91C1C'],
  };

  const textColor = {
    primary: '#FFFFFF',
    secondary: c.text,
    destructive: '#FFFFFF',
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[animatedStyle, { opacity: disabled ? 0.5 : 1 }]}
    >
      <LinearGradient
        colors={bgColors[variant] as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 52,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: '600',
            color: textColor[variant],
            letterSpacing: -0.2,
          }}
        >
          {loading ? '...' : title}
        </Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

// Secondary Button (glass style)
interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function SecondaryButton({
  title,
  onPress,
  disabled = false,
  icon,
}: SecondaryButtonProps) {
  const scale = useSharedValue(1);
  const c = useColors();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
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
      disabled={disabled}
      style={[animatedStyle, { opacity: disabled ? 0.5 : 1 }]}
    >
      <View
        style={{
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: c.border,
          backgroundColor: c.surfaceElevated,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {icon}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: c.text,
            letterSpacing: -0.2,
          }}
        >
          {title}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

// Icon Button (circular)
interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'filled';
}

export function IconButton({
  icon,
  onPress,
  size = 'medium',
  variant = 'default',
}: IconButtonProps) {
  const scale = useSharedValue(1);
  const c = useColors();

  const sizes = {
    small: 36,
    medium: 44,
    large: 52,
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
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
      style={animatedStyle}
    >
      <View
        style={{
          width: sizes[size],
          height: sizes[size],
          borderRadius: sizes[size] / 2,
          backgroundColor: variant === 'filled' ? c.accent : c.surfaceElevated,
          borderWidth: variant === 'default' ? 1 : 0,
          borderColor: c.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
    </AnimatedPressable>
  );
}

// Text Input with floating label
interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  returnKeyType?: 'done' | 'next' | 'go';
  onSubmitEditing?: () => void;
  maxLength?: number;
}

export function TextInput({
  value,
  onChangeText,
  placeholder,
  autoFocus,
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
  maxLength,
}: TextInputProps) {
  const c = useColors();
  const scheme = useColorScheme();

  return (
    <View
      style={{
        backgroundColor: c.surfaceElevated,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: c.border,
        paddingHorizontal: 16,
        paddingVertical: 14,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '500',
          color: c.textTertiary,
          marginBottom: 4,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {placeholder}
      </Text>
      <Pressable>
        <View>
          <Text
            style={{
              fontSize: 17,
              color: value ? c.text : c.textTertiary,
              minHeight: 24,
            }}
          >
            {value || `Enter ${placeholder.toLowerCase()}`}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

// Segmented Control (Apple style)
interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  selected,
  onSelect,
}: SegmentedControlProps<T>) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        borderRadius: 10,
        padding: 2,
      }}
    >
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(option.value);
            }}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: isSelected ? c.surface : 'transparent',
              shadowColor: isSelected ? '#000' : 'transparent',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isSelected ? 0.1 : 0,
              shadowRadius: 2,
              elevation: isSelected ? 2 : 0,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 14,
                fontWeight: isSelected ? '600' : '500',
                color: isSelected ? c.text : c.textSecondary,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Progress Indicator
interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const c = useColors();

  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', paddingTop: 12 }}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={{
            width: index < current ? 24 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: index < current ? c.accent : c.border,
          }}
        />
      ))}
    </View>
  );
}

// Section Header
interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  const c = useColors();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          color: c.text,
          letterSpacing: -0.4,
        }}
      >
        {title}
      </Text>
      {action && (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            action.onPress();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: '500',
              color: c.accent,
            }}
          >
            {action.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// List Item
interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}

export function ListItem({
  title,
  subtitle,
  leftIcon,
  rightContent,
  onPress,
  showChevron = false,
}: ListItemProps) {
  const c = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withTiming(0.98, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: c.surface,
        borderRadius: 12,
        gap: 12,
      }}
    >
      {leftIcon && (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: c.accentLight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {leftIcon}
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: c.text,
            marginBottom: subtitle ? 2 : 0,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontSize: 14,
              color: c.textSecondary,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightContent}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
}

// Empty State
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const c = useColors();

  return (
    <GlassCard className="mx-4">
      <View style={{ alignItems: 'center', paddingVertical: 24 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: c.accentLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: c.text,
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: c.textSecondary,
            textAlign: 'center',
            lineHeight: 22,
            maxWidth: 280,
            marginBottom: action ? 20 : 0,
          }}
        >
          {description}
        </Text>
        {action && (
          <SecondaryButton title={action.label} onPress={action.onPress} />
        )}
      </View>
    </GlassCard>
  );
}
