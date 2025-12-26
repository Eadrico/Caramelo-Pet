// Paywall Screen - Premium upgrade flow
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  X,
  Crown,
  PawPrint,
  Headphones,
  Infinity,
  Check,
  Sparkles,
} from 'lucide-react-native';
import { useColors } from '@/components/design-system';
import { usePremiumStore } from '@/lib/premium-store';
import { useTranslation } from '@/lib/i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PaywallScreenProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseSuccess?: () => void;
}

interface FeatureRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureRow({ icon, title, description, delay }: FeatureRowProps) {
  const c = useColors();

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(delay)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          backgroundColor: 'rgba(196, 167, 125, 0.15)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
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
          {title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: c.textSecondary,
          }}
        >
          {description}
        </Text>
      </View>
      <Check size={20} color={c.accent} strokeWidth={2.5} />
    </Animated.View>
  );
}

export function PaywallScreen({
  visible,
  onClose,
  onPurchaseSuccess,
}: PaywallScreenProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const priceString = usePremiumStore((s) => s.priceString);
  const isLoading = usePremiumStore((s) => s.isLoading);
  const purchasePremium = usePremiumStore((s) => s.purchasePremium);
  const restorePurchasesFn = usePremiumStore((s) => s.restorePurchases);

  const buyScale = useSharedValue(1);
  const restoreScale = useSharedValue(1);

  const buyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buyScale.value }],
  }));

  const restoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: restoreScale.value }],
  }));

  const handlePurchase = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMessage(null);

    const result = await purchasePremium();

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMessage({ type: 'success', text: t('paywall_purchase_success') });
      setTimeout(() => {
        onPurchaseSuccess?.();
        onClose();
      }, 1500);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setMessage({ type: 'error', text: t('paywall_error') });
    }
  };

  const handleRestore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessage(null);

    const result = await restorePurchasesFn();

    if (result.success && result.restored) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMessage({ type: 'success', text: t('paywall_restore_success') });
      setTimeout(() => {
        onPurchaseSuccess?.();
        onClose();
      }, 1500);
    } else if (result.success && !result.restored) {
      setMessage({ type: 'error', text: t('paywall_restore_none') });
    } else {
      setMessage({ type: 'error', text: t('paywall_error') });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={
            isDark
              ? ['#1C1917', '#0C0A09', '#1C1917']
              : ['#FFFBF5', '#F5F2EE', '#FFFBF5']
          }
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          {/* Close Button */}
          <View style={{ alignItems: 'flex-end', padding: 16 }}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: c.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} color={c.textSecondary} strokeWidth={2} />
            </Pressable>
          </View>

          {/* Header */}
          <Animated.View
            entering={FadeInDown.duration(500)}
            style={{ alignItems: 'center', paddingHorizontal: 24, marginBottom: 8 }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: 'rgba(196, 167, 125, 0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Crown size={40} color={c.accent} strokeWidth={1.5} />
            </View>

            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                color: c.text,
                textAlign: 'center',
                marginBottom: 8,
                letterSpacing: -0.5,
              }}
            >
              {t('paywall_title')}
            </Text>

            <Text
              style={{
                fontSize: 17,
                color: c.textSecondary,
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              {t('paywall_subtitle')}
            </Text>
          </Animated.View>

          {/* Limit Banner */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(100)}
            style={{
              marginHorizontal: 20,
              marginTop: 16,
              marginBottom: 8,
              backgroundColor: 'rgba(196, 167, 125, 0.1)',
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: 'rgba(196, 167, 125, 0.3)',
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: c.accent,
                textAlign: 'center',
                fontWeight: '500',
              }}
            >
              {t('paywall_limit_reached')}
            </Text>
          </Animated.View>

          {/* Features */}
          <View style={{ marginTop: 16 }}>
            <FeatureRow
              icon={<Infinity size={24} color={c.accent} strokeWidth={2} />}
              title={t('paywall_feature_unlimited')}
              description={t('paywall_feature_unlimited_desc')}
              delay={200}
            />
            <FeatureRow
              icon={<Headphones size={24} color={c.accent} strokeWidth={2} />}
              title={t('paywall_feature_support')}
              description={t('paywall_feature_support_desc')}
              delay={300}
            />
            <FeatureRow
              icon={<Sparkles size={24} color={c.accent} strokeWidth={2} />}
              title={t('paywall_feature_lifetime')}
              description={t('paywall_feature_lifetime_desc')}
              delay={400}
            />
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Message */}
          {message && (
            <Animated.View
              entering={FadeIn.duration(300)}
              style={{
                marginHorizontal: 20,
                marginBottom: 16,
                padding: 14,
                borderRadius: 12,
                backgroundColor:
                  message.type === 'success'
                    ? 'rgba(34, 197, 94, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: message.type === 'success' ? '#22C55E' : '#EF4444',
                  textAlign: 'center',
                  fontWeight: '500',
                }}
              >
                {message.text}
              </Text>
            </Animated.View>
          )}

          {/* Purchase Button */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(500)}
            style={{ paddingHorizontal: 20, marginBottom: 12 }}
          >
            <AnimatedPressable
              onPress={handlePurchase}
              onPressIn={() => {
                buyScale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
              }}
              onPressOut={() => {
                buyScale.value = withSpring(1, { damping: 15, stiffness: 400 });
              }}
              disabled={isLoading}
              style={[
                buyAnimatedStyle,
                {
                  backgroundColor: c.accent,
                  borderRadius: 16,
                  paddingVertical: 18,
                  alignItems: 'center',
                  shadowColor: c.accent,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: '#FFFFFF',
                    }}
                  >
                    {t('paywall_buy_button')} - {priceString}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginTop: 2,
                    }}
                  >
                    {t('paywall_one_time')}
                  </Text>
                </View>
              )}
            </AnimatedPressable>
          </Animated.View>

          {/* Restore Button */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(600)}
            style={{ paddingHorizontal: 20, marginBottom: 8 }}
          >
            <AnimatedPressable
              onPress={handleRestore}
              onPressIn={() => {
                restoreScale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
              }}
              onPressOut={() => {
                restoreScale.value = withSpring(1, { damping: 15, stiffness: 400 });
              }}
              disabled={isLoading}
              style={[
                restoreAnimatedStyle,
                {
                  paddingVertical: 14,
                  alignItems: 'center',
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: c.textSecondary,
                }}
              >
                {t('paywall_restore')}
              </Text>
            </AnimatedPressable>
          </Animated.View>

          {/* Close Button */}
          <Animated.View
            entering={FadeIn.duration(400).delay(700)}
            style={{ paddingHorizontal: 20, marginBottom: 16 }}
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={{
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: c.textTertiary,
                }}
              >
                {t('paywall_close')}
              </Text>
            </Pressable>
          </Animated.View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
