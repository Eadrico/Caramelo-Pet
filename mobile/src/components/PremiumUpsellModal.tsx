// Premium Upsell Modal - Full screen modal with iridescent Liquid Glass CTA
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  useColorScheme,
  Modal,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Crown,
  PawPrint,
  Bell,
  Calendar,
  Check,
  Sparkles,
  Ticket,
  X,
} from 'lucide-react-native';
import { useColors } from '@/components/design-system';
import { usePremiumStore } from '@/lib/premium-store';

// 'general' is for settings - no limit message
export type UpsellContext = 'pets' | 'care' | 'reminders' | 'general';

interface PremiumUpsellModalProps {
  visible: boolean;
  onClose: () => void;
  context: UpsellContext;
}

export function PremiumUpsellModal({
  visible,
  onClose,
  context,
}: PremiumUpsellModalProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const priceString = usePremiumStore((s) => s.priceString);
  const purchasePremium = usePremiumStore((s) => s.purchasePremium);
  const redeemCoupon = usePremiumStore((s) => s.redeemCoupon);
  const isLoading = usePremiumStore((s) => s.isLoading);

  // Coupon state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isRedeemingCoupon, setIsRedeemingCoupon] = useState(false);

  // Iridescent animation
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      shimmerProgress.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
      // Reset coupon state when modal opens
      setShowCouponInput(false);
      setCouponCode('');
      setCouponError(null);
    }
  }, [visible, shimmerProgress]);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        shimmerProgress.value,
        [0, 0.25, 0.5, 0.75, 1],
        [
          'rgba(212, 165, 116, 0.6)',
          'rgba(180, 200, 255, 0.6)',
          'rgba(255, 180, 220, 0.6)',
          'rgba(180, 255, 200, 0.6)',
          'rgba(212, 165, 116, 0.6)',
        ]
      ),
    };
  });

  const handlePurchase = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const result = await purchasePremium();
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Digite um cupom válido');
      return;
    }

    setIsRedeemingCoupon(true);
    setCouponError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const result = await redeemCoupon(couponCode.trim());

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setCouponError(result.error ?? 'Erro ao resgatar cupom');
    }

    setIsRedeemingCoupon(false);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  // Only show limit message for specific contexts (not 'general')
  const hasLimitContext = context !== 'general';

  const getContextTitle = () => {
    switch (context) {
      case 'pets':
        return 'Limite de Pets Atingido';
      case 'care':
        return 'Limite de Cuidados Atingido';
      case 'reminders':
        return 'Limite de Lembretes Atingido';
      case 'general':
        return 'Caramelo Premium';
    }
  };

  const getContextDescription = () => {
    switch (context) {
      case 'pets':
        return 'Você atingiu o limite de pets do plano gratuito';
      case 'care':
        return 'Você atingiu o limite de cuidados do plano gratuito';
      case 'reminders':
        return 'Você atingiu o limite de lembretes do plano gratuito';
      case 'general':
        return 'Desbloqueie todo o potencial do app';
    }
  };

  const getContextIcon = () => {
    switch (context) {
      case 'pets':
        return <PawPrint size={28} color="#FFFFFF" />;
      case 'care':
        return <Calendar size={28} color="#FFFFFF" />;
      case 'reminders':
        return <Bell size={28} color="#FFFFFF" />;
      case 'general':
        return <Crown size={28} color="#FFFFFF" />;
    }
  };

  const benefits = [
    'Pets ilimitados',
    'Cuidados ilimitados',
    'Lembretes ilimitados',
    'Compra única, acesso vitalício',
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: c.background }}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          {/* Close button */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingHorizontal: 20,
              paddingTop: 8,
            }}
          >
            <Pressable
              onPress={handleClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} color={c.textSecondary} />
            </Pressable>
          </View>

          {/* Main Content - Centered */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: 24,
              justifyContent: 'center',
            }}
          >
            {/* Context Icon */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <LinearGradient
                colors={['#D4A574', '#C4956A', '#B8855F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#D4A574',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                {getContextIcon()}
              </LinearGradient>
            </View>

            {/* Title & Subtitle */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: c.text,
                textAlign: 'center',
                marginBottom: 6,
                letterSpacing: -0.5,
              }}
            >
              {getContextTitle()}
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: c.textSecondary,
                textAlign: 'center',
                marginBottom: hasLimitContext ? 24 : 20,
              }}
            >
              {getContextDescription()}
            </Text>

            {/* Premium Badge - only show for general context */}
            {!hasLimitContext && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  gap: 6,
                }}
              >
                <Sparkles size={14} color={c.accent} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: c.accent,
                  }}
                >
                  Pagamento único, use para sempre
                </Text>
                <Sparkles size={14} color={c.accent} />
              </View>
            )}

            {/* Benefits - Compact List */}
            <View
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                borderRadius: 16,
                paddingVertical: 14,
                paddingHorizontal: 18,
                marginBottom: 24,
              }}
            >
              {benefits.map((benefit, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    paddingVertical: 6,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: c.accentLight,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={12} color={c.accent} strokeWidth={3} />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: c.text,
                      fontWeight: '500',
                    }}
                  >
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>

            {/* Price */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: '700',
                  color: c.text,
                  letterSpacing: -1,
                }}
              >
                {priceString || '$2.99'}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: c.textTertiary,
                  marginTop: 2,
                }}
              >
                Pagamento único
              </Text>
            </View>

            {/* Iridescent CTA Button */}
            <Pressable
              onPress={handlePurchase}
              disabled={isLoading}
              style={({ pressed }) => ({
                opacity: pressed ? 0.95 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                marginBottom: 12,
              })}
            >
              <Animated.View
                style={[
                  {
                    borderRadius: 16,
                    borderWidth: 1.5,
                    overflow: 'hidden',
                  },
                  animatedButtonStyle,
                ]}
              >
                {/* Outer glow layer */}
                <View
                  style={{
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    backgroundColor: isDark ? 'rgba(212, 165, 116, 0.1)' : 'rgba(212, 165, 116, 0.08)',
                    borderRadius: 40,
                  }}
                />

                {/* Iridescent gradient background */}
                <LinearGradient
                  colors={
                    isDark
                      ? ['rgba(212, 165, 116, 0.25)', 'rgba(180, 160, 220, 0.2)', 'rgba(212, 165, 116, 0.25)']
                      : ['rgba(212, 165, 116, 0.35)', 'rgba(200, 180, 240, 0.25)', 'rgba(212, 165, 116, 0.35)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />

                {/* Glass blur effect */}
                <BlurView
                  intensity={isDark ? 40 : 60}
                  tint={isDark ? 'dark' : 'light'}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator color={c.accent} size="small" />
                  ) : (
                    <>
                      <Crown size={20} color={c.accent} strokeWidth={2.5} />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '700',
                          color: c.text,
                          letterSpacing: -0.3,
                        }}
                      >
                        Desbloquear Premium
                      </Text>
                    </>
                  )}
                </BlurView>

                {/* Shimmer overlay */}
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.15)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.5,
                  }}
                />
              </Animated.View>
            </Pressable>

            {/* Coupon Section */}
            {showCouponInput ? (
              <View style={{ marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <TextInput
                    value={couponCode}
                    onChangeText={(text) => {
                      setCouponCode(text);
                      setCouponError(null);
                    }}
                    placeholder="Digite seu cupom"
                    placeholderTextColor={c.textTertiary}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    style={{
                      flex: 1,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                      borderRadius: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      fontSize: 15,
                      color: c.text,
                      borderWidth: 1,
                      borderColor: couponError ? '#EF4444' : c.border,
                    }}
                  />
                  <Pressable
                    onPress={handleRedeemCoupon}
                    disabled={isRedeemingCoupon}
                    style={{
                      backgroundColor: c.accent,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                    }}
                  >
                    {isRedeemingCoupon ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>
                        Aplicar
                      </Text>
                    )}
                  </Pressable>
                </View>
                {couponError && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#EF4444',
                      marginTop: 6,
                      marginLeft: 4,
                    }}
                  >
                    {couponError}
                  </Text>
                )}
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowCouponInput(true);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  paddingVertical: 10,
                  marginBottom: 4,
                }}
              >
                <Ticket size={16} color={c.textSecondary} />
                <Text
                  style={{
                    fontSize: 14,
                    color: c.textSecondary,
                    fontWeight: '500',
                  }}
                >
                  Tenho um cupom
                </Text>
              </Pressable>
            )}

            {/* Maybe Later Button */}
            <Pressable
              onPress={handleClose}
              style={{
                alignItems: 'center',
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: c.textTertiary,
                  fontWeight: '500',
                }}
              >
                Talvez depois
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
