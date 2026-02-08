// Premium Upsell Modal - Liquid Glass design with app icon
import React, { useEffect, useState, useRef } from 'react';
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
  Image,
  Dimensions,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
  withSequence,
  withDelay,
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
  Heart,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Pre-load the app icon for instant display
const APP_ICON = require('../../assets/icon.png');

export function PremiumUpsellModal({
  visible,
  onClose,
  context,
}: PremiumUpsellModalProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();

  const priceString = usePremiumStore((s) => s.priceString);
  const purchasePremium = usePremiumStore((s) => s.purchasePremium);
  const redeemCoupon = usePremiumStore((s) => s.redeemCoupon);
  const restorePurchases = usePremiumStore((s) => s.restorePurchases);
  const isLoading = usePremiumStore((s) => s.isLoading);

  // Coupon state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isRedeemingCoupon, setIsRedeemingCoupon] = useState(false);
  const couponInputRef = useRef<TextInput>(null);

  // Animations
  const shimmerProgress = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      // Iridescent border animation
      shimmerProgress.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
      // Glow pulse animation
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      // Icon subtle pulse
      iconScale.value = withRepeat(
        withSequence(
          withDelay(500, withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) })),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      // Reset coupon state
      setShowCouponInput(false);
      setCouponCode('');
      setCouponError(null);
    }
  }, [visible, shimmerProgress, glowOpacity, iconScale]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      shimmerProgress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [
        'rgba(212, 165, 116, 0.7)',
        'rgba(180, 200, 255, 0.7)',
        'rgba(255, 180, 220, 0.7)',
        'rgba(180, 255, 200, 0.7)',
        'rgba(212, 165, 116, 0.7)',
      ]
    ),
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

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

  const handleRestorePurchases = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCouponError(null);
    const result = await restorePurchases();
    if (result.success && result.restored) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } else if (result.success && !result.restored) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setCouponError('Nenhuma compra encontrada para restaurar');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setCouponError('Erro ao restaurar compras');
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const getContextTitle = () => {
    switch (context) {
      case 'pets': return 'Limite de Pets Atingido';
      case 'care': return 'Limite de Cuidados Atingido';
      case 'reminders': return 'Limite de Lembretes Atingido';
      case 'general': return 'Caramelo Premium';
    }
  };

  const getContextSubtitle = () => {
    switch (context) {
      case 'pets': return 'Você atingiu o limite de pets do plano gratuito';
      case 'care': return 'Você atingiu o limite de cuidados do plano gratuito';
      case 'reminders': return 'Você atingiu o limite de lembretes do plano gratuito';
      case 'general': return 'Cuide de todos os seus pets sem limites';
    }
  };

  const benefits = [
    { icon: PawPrint, text: 'Pets ilimitados' },
    { icon: Calendar, text: 'Cuidados ilimitados' },
    { icon: Bell, text: 'Lembretes ilimitados' },
    { icon: Heart, text: 'Acesso vitalício' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={
            isDark
              ? ['#0C0A09', '#1A1412', '#0C0A09']
              : ['#FDF8F3', '#F5EDE4', '#FDF8F3']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Decorative gradient orbs */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: -100,
              right: -80,
              width: 300,
              height: 300,
              borderRadius: 150,
              backgroundColor: isDark ? 'rgba(212, 165, 116, 0.15)' : 'rgba(212, 165, 116, 0.2)',
            },
            animatedGlowStyle,
          ]}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 100,
              left: -100,
              width: 250,
              height: 250,
              borderRadius: 125,
              backgroundColor: isDark ? 'rgba(180, 160, 220, 0.1)' : 'rgba(180, 160, 220, 0.15)',
            },
            animatedGlowStyle,
          ]}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 20,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Close button */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingHorizontal: 20,
                paddingTop: 8,
                paddingBottom: 16,
              }}
            >
              <Pressable
                onPress={handleClose}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} color={c.textSecondary} />
              </Pressable>
            </View>

            {/* Main Content */}
            <View
              style={{
                flex: 1,
                paddingHorizontal: 24,
                justifyContent: 'center',
              }}
            >
              {/* App Icon with glow effect */}
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View
                  style={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                  }}
                >
                  {/* Glow behind icon */}
                  <Animated.View
                    style={[
                      {
                        position: 'absolute',
                        top: -10,
                        left: -10,
                        right: -10,
                        bottom: -10,
                        borderRadius: 35,
                        backgroundColor: '#D4A574',
                      },
                      animatedGlowStyle,
                    ]}
                  />
                  {/* App icon */}
                  <Image
                    source={APP_ICON}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 24,
                    }}
                    fadeDuration={0}
                    resizeMode="cover"
                  />
                  {/* Crown badge */}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -8,
                      right: -8,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#D4A574',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#D4A574',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.4,
                      shadowRadius: 8,
                      elevation: 8,
                    }}
                  >
                    <Crown size={20} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                </View>
              </View>

              {/* Title */}
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: '700',
                  color: c.text,
                  textAlign: 'center',
                  marginBottom: 8,
                  letterSpacing: -0.5,
                }}
              >
                {getContextTitle()}
              </Text>

              {/* Subtitle */}
              <Text
                style={{
                  fontSize: 15,
                  color: c.textSecondary,
                  textAlign: 'center',
                  marginBottom: 24,
                  lineHeight: 22,
                }}
              >
                {getContextSubtitle()}
              </Text>

              {/* Benefits Card - Liquid Glass */}
              <View
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  marginBottom: 24,
                }}
              >
                <BlurView
                  intensity={isDark ? 30 : 50}
                  tint={isDark ? 'dark' : 'light'}
                  style={{
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  }}
                >
                  <LinearGradient
                    colors={
                      isDark
                        ? ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']
                        : ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.4)']
                    }
                    style={{ padding: 16 }}
                  >
                    {benefits.map((benefit, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                          paddingVertical: 10,
                          borderBottomWidth: index < benefits.length - 1 ? 1 : 0,
                          borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        }}
                      >
                        <View
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            backgroundColor: isDark ? 'rgba(212, 165, 116, 0.15)' : 'rgba(212, 165, 116, 0.12)',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <benefit.icon size={18} color={c.accent} />
                        </View>
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 15,
                            color: c.text,
                            fontWeight: '500',
                          }}
                        >
                          {benefit.text}
                        </Text>
                        <Check size={18} color="#22C55E" strokeWidth={2.5} />
                      </View>
                    ))}
                  </LinearGradient>
                </BlurView>
              </View>

              {/* Price with sparkles */}
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color={c.accent} />
                  <Text
                    style={{
                      fontSize: 36,
                      fontWeight: '700',
                      color: c.text,
                      letterSpacing: -1,
                    }}
                  >
                    {priceString || '$2.99'}
                  </Text>
                  <Sparkles size={18} color={c.accent} />
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: c.textSecondary,
                    marginTop: 4,
                  }}
                >
                  Pagamento único • Use para sempre
                </Text>
              </View>

              {/* CTA Button - Iridescent Liquid Glass */}
              <Pressable
                onPress={handlePurchase}
                disabled={isLoading}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.95 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  marginBottom: 16,
                })}
              >
                <Animated.View
                  style={[
                    {
                      borderRadius: 18,
                      borderWidth: 2,
                      overflow: 'hidden',
                    },
                    animatedButtonStyle,
                  ]}
                >
                  <LinearGradient
                    colors={
                      isDark
                        ? ['rgba(212, 165, 116, 0.3)', 'rgba(180, 160, 220, 0.2)', 'rgba(212, 165, 116, 0.3)']
                        : ['rgba(212, 165, 116, 0.4)', 'rgba(200, 180, 240, 0.3)', 'rgba(212, 165, 116, 0.4)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                  />
                  <BlurView
                    intensity={isDark ? 50 : 70}
                    tint={isDark ? 'dark' : 'light'}
                    style={{
                      paddingVertical: 18,
                      paddingHorizontal: 32,
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
                        <Crown size={22} color={c.accent} strokeWidth={2.5} />
                        <Text
                          style={{
                            fontSize: 17,
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
                </Animated.View>
              </Pressable>

              {/* Coupon/Restore Button */}
              {!showCouponInput ? (
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowCouponInput(true);
                    // Focus input after a small delay to ensure it's rendered
                    setTimeout(() => {
                      couponInputRef.current?.focus();
                    }, 100);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    paddingVertical: 12,
                    marginBottom: 4,
                  }}
                >
                  <Ticket size={17} color={c.textSecondary} />
                  <Text style={{ fontSize: 15, color: c.textSecondary, fontWeight: '500' }}>
                    Use um cupom, ou restaure uma compra
                  </Text>
                </Pressable>
              ) : (
                <View style={{ marginTop: 8, marginBottom: 16 }}>
                  {/* Header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                    <Ticket size={24} color={c.text} strokeWidth={2.5} />
                    <Text style={{ fontSize: 20, fontWeight: '700', color: c.text, letterSpacing: -0.5 }}>
                      Cupom Promocional
                    </Text>
                  </View>

                  {/* Input */}
                  <View
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      borderRadius: 16,
                      borderWidth: 1.5,
                      borderColor: couponError
                        ? '#EF4444'
                        : isDark
                        ? 'rgba(255,255,255,0.12)'
                        : 'rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                      marginBottom: 24,
                    }}
                  >
                    <TextInput
                      ref={couponInputRef}
                      value={couponCode}
                      onChangeText={(text) => {
                        setCouponCode(text);
                        setCouponError(null);
                      }}
                      placeholder="Digite seu cupom"
                      placeholderTextColor={c.textTertiary}
                      autoCapitalize="characters"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleRedeemCoupon}
                      style={{
                        paddingVertical: 18,
                        paddingHorizontal: 20,
                        fontSize: 17,
                        color: c.text,
                        fontWeight: '500',
                      }}
                    />
                  </View>

                  {/* Error message */}
                  {couponError && (
                    <View
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: 14,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        marginBottom: 24,
                        borderWidth: 1,
                        borderColor: 'rgba(239, 68, 68, 0.2)',
                      }}
                    >
                      <Text style={{ fontSize: 14, color: '#EF4444', textAlign: 'center', lineHeight: 20 }}>
                        {couponError}
                      </Text>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                    <Pressable
                      onPress={handleRedeemCoupon}
                      disabled={isRedeemingCoupon || !couponCode.trim() || isLoading}
                      style={({ pressed }) => ({
                        flex: 1,
                        backgroundColor: c.accent,
                        borderRadius: 16,
                        paddingVertical: 16,
                        alignItems: 'center',
                        opacity: pressed ? 0.85 : 1,
                        shadowColor: c.accent,
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.25,
                        shadowRadius: 6,
                        elevation: 3,
                      })}
                    >
                      {isRedeemingCoupon ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: '700',
                            color: '#FFFFFF',
                            letterSpacing: -0.2,
                          }}
                        >
                          Resgatar
                        </Text>
                      )}
                    </Pressable>

                    <Pressable
                      onPress={handleRestorePurchases}
                      disabled={isLoading || isRedeemingCoupon}
                      style={({ pressed }) => ({
                        flex: 1,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                        borderRadius: 16,
                        paddingVertical: 16,
                        alignItems: 'center',
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '600',
                          color: c.text,
                          letterSpacing: -0.2,
                        }}
                      >
                        Restaurar
                      </Text>
                    </Pressable>
                  </View>

                  {/* Helper Text */}
                  <Text
                    style={{
                      fontSize: 14,
                      color: c.textSecondary,
                      textAlign: 'center',
                      lineHeight: 20,
                      paddingHorizontal: 8,
                    }}
                  >
                    Insira um cupom válido ou restaure suas compras anteriores
                  </Text>
                </View>
              )}

              {/* Maybe Later */}
              <Pressable
                onPress={handleClose}
                style={{ alignItems: 'center', paddingVertical: 10 }}
              >
                <Text style={{ fontSize: 14, color: c.textTertiary, fontWeight: '500' }}>
                  Talvez depois
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
