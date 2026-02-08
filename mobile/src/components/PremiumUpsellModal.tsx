// Premium Upsell Modal - Full screen modal to encourage upgrade
import React from 'react';
import {
  View,
  Text,
  Pressable,
  useColorScheme,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  X,
  Crown,
  PawPrint,
  Bell,
  Calendar,
  Heart,
  Sparkles,
  Shield,
  Infinity,
} from 'lucide-react-native';
import { useColors } from '@/components/design-system';
import { useTranslation } from '@/lib/i18n';
import { usePremiumStore } from '@/lib/premium-store';

export type UpsellContext = 'pets' | 'care' | 'reminders';

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
  const { t } = useTranslation();

  const priceString = usePremiumStore((s) => s.priceString);
  const purchasePremium = usePremiumStore((s) => s.purchasePremium);
  const isLoading = usePremiumStore((s) => s.isLoading);

  const handlePurchase = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await purchasePremium();
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const getContextTitle = () => {
    switch (context) {
      case 'pets':
        return 'Limite de Pets Atingido';
      case 'care':
        return 'Limite de Cuidados Atingido';
      case 'reminders':
        return 'Limite de Lembretes Atingido';
    }
  };

  const getContextDescription = () => {
    switch (context) {
      case 'pets':
        return 'No plano gratuito, você pode cadastrar até 2 pets. Desbloqueie o plano completo para adicionar todos os seus amiguinhos!';
      case 'care':
        return 'No plano gratuito, você pode criar apenas 1 cuidado. Desbloqueie o plano completo para organizar todos os cuidados dos seus pets!';
      case 'reminders':
        return 'No plano gratuito, você pode criar apenas 1 lembrete. Desbloqueie o plano completo para nunca esquecer dos cuidados importantes!';
    }
  };

  const getContextIcon = () => {
    switch (context) {
      case 'pets':
        return <PawPrint size={32} color="#FFFFFF" />;
      case 'care':
        return <Calendar size={32} color="#FFFFFF" />;
      case 'reminders':
        return <Bell size={32} color="#FFFFFF" />;
    }
  };

  const benefits = [
    {
      icon: <Infinity size={24} color={c.accent} />,
      title: 'Pets Ilimitados',
      description: 'Cadastre todos os seus amiguinhos de 4 patas',
    },
    {
      icon: <Calendar size={24} color={c.accent} />,
      title: 'Cuidados Ilimitados',
      description: 'Vacinas, consultas, medicamentos e muito mais',
    },
    {
      icon: <Bell size={24} color={c.accent} />,
      title: 'Lembretes Ilimitados',
      description: 'Nunca mais esqueça um compromisso importante',
    },
    {
      icon: <Heart size={24} color={c.accent} />,
      title: 'Histórico Completo',
      description: 'Acompanhe toda a vida dos seus pets',
    },
    {
      icon: <Shield size={24} color={c.accent} />,
      title: 'Compra Única',
      description: 'Pague uma vez, use para sempre',
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: c.background }}>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          {/* Header with close button */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} color={c.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Context Icon & Title */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <LinearGradient
                colors={['#D4A574', '#C4A77D', '#B8956F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  shadowColor: '#D4A574',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                {getContextIcon()}
              </LinearGradient>

              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '700',
                  color: c.text,
                  textAlign: 'center',
                  marginBottom: 12,
                }}
              >
                {getContextTitle()}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: c.textSecondary,
                  textAlign: 'center',
                  lineHeight: 24,
                  paddingHorizontal: 12,
                }}
              >
                {getContextDescription()}
              </Text>
            </View>

            {/* Crown Badge */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                gap: 8,
              }}
            >
              <Crown size={20} color={c.accent} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: c.accent,
                }}
              >
                Caramelo Premium
              </Text>
              <Sparkles size={16} color={c.accent} />
            </View>

            {/* Benefits List */}
            <View
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                borderRadius: 20,
                padding: 20,
                gap: 16,
                marginBottom: 32,
              }}
            >
              {benefits.map((benefit, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: c.accentLight,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {benefit.icon}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: c.text,
                        marginBottom: 2,
                      }}
                    >
                      {benefit.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: c.textSecondary,
                      }}
                    >
                      {benefit.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Price & CTA */}
            <View style={{ alignItems: 'center', gap: 16 }}>
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: c.textSecondary,
                    marginBottom: 4,
                  }}
                >
                  Pagamento único
                </Text>
                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: '700',
                    color: c.text,
                  }}
                >
                  {priceString || '$2.99'}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: c.textTertiary,
                    marginTop: 4,
                  }}
                >
                  Acesso vitalício • Sem assinaturas
                </Text>
              </View>

              {/* Purchase Button */}
              <Pressable
                onPress={handlePurchase}
                disabled={isLoading}
                style={({ pressed }) => ({
                  width: '100%',
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <LinearGradient
                  colors={['#D4A574', '#C4A77D', '#B8956F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 18,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 10,
                    shadowColor: '#D4A574',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Crown size={22} color="#FFFFFF" />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '700',
                          color: '#FFFFFF',
                        }}
                      >
                        Desbloquear Agora
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>

              {/* Secondary text */}
              <Text
                style={{
                  fontSize: 12,
                  color: c.textTertiary,
                  textAlign: 'center',
                  marginTop: 8,
                }}
              >
                Pagamento seguro via App Store
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
