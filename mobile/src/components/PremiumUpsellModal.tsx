// Premium Upsell Modal - Liquid Glass design with app icon
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
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const isLoading = usePremiumStore((s) => s.isLoading);

  // Coupon state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isRedeemingCoupon, setIsRedeemingCoupon] = useState(false);

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
                <Animated.View style={animatedIconStyle}>
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
                      source={require('../../assets/icon.png')}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 24,
                      }}
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
                </Animated.View>
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

              {/* Coupon Section */}
              {showCouponInput ? (
                <View style={{ marginBottom: 12 }}>
                  {/* Input container with Apple-style design */}
                  <View
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderRadius: 14,
                      borderWidth: 1.5,
                      borderColor: couponError
                        ? '#EF4444'
                        : isDark
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {/* Icon */}
                      <View
                        style={{
                          paddingLeft: 16,
                          paddingRight: 12,
                        }}
                      >
                        <Ticket size={18} color={c.textSecondary} />
                      </View>

                      {/* Input */}
                      <TextInput
                        value={couponCode}
                        onChangeText={(text) => {
                          setCouponCode(text);
                          setCouponError(null);
                        }}
                        placeholder="Código do cupom"
                        placeholderTextColor={c.textTertiary}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleRedeemCoupon}
                        style={{
                          flex: 1,
                          paddingVertical: 14,
                          fontSize: 16,
                          color: c.text,
                          fontWeight: '500',
                        }}
                      />

                      {/* Apply button */}
                      <Pressable
                        onPress={handleRedeemCoupon}
                        disabled={isRedeemingCoupon || !couponCode.trim()}
                        style={({ pressed }) => ({
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          opacity: pressed ? 0.6 : 1,
                        })}
                      >
                        {isRedeemingCoupon ? (
                          <ActivityIndicator color={c.accent} size="small" />
                        ) : (
                          <Text
                            style={{
                              color: couponCode.trim() ? c.accent : c.textTertiary,
                              fontWeight: '600',
                              fontSize: 16,
                            }}
                          >
                            Aplicar
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  </View>

                  {/* Error message */}
                  {couponError && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        marginTop: 8,
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text style={{ fontSize: 13, color: '#EF4444', lineHeight: 18 }}>
                        {couponError}
                      </Text>
                    </View>
                  )}

                  {/* Cancel button */}
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowCouponInput(false);
                      setCouponCode('');
                      setCouponError(null);
                    }}
                    style={{
                      alignItems: 'center',
                      paddingVertical: 12,
                      marginTop: 4,
                    }}
                  >
                    <Text style={{ fontSize: 14, color: c.textSecondary, fontWeight: '500' }}>
                      Cancelar
                    </Text>
                  </Pressable>
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
                    gap: 8,
                    paddingVertical: 12,
                    marginBottom: 4,
                  }}
                >
                  <Ticket size={17} color={c.textSecondary} />
                  <Text style={{ fontSize: 15, color: c.textSecondary, fontWeight: '500' }}>
                    Tenho um cupom
                  </Text>
                </Pressable>
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
