// Sandbox Developer Menu - Only visible in development/sandbox environment
// NEVER appears in App Store or TestFlight builds

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  useColorScheme,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import {
  X,
  Bug,
  Crown,
  CreditCard,
  RefreshCw,
  Info,
  Copy,
  CheckCircle,
  AlertCircle,
  Package,
  Smartphone,
  Server,
} from 'lucide-react-native';
import { useColors } from '@/components/design-system';
import { usePremiumStore } from '@/lib/premium-store';
import { getEnvironmentInfo } from '@/lib/sandboxDetection';
import { isRevenueCatEnabled, getOfferings, getCustomerInfo } from '@/lib/revenuecatClient';

interface SandboxDevMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function SandboxDevMenu({ visible, onClose }: SandboxDevMenuProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Premium store
  const isPremium = usePremiumStore((s) => s.isPremium);
  const isAdminMode = usePremiumStore((s) => s.isAdminMode);
  const isCouponMode = usePremiumStore((s) => s.isCouponMode);
  const toggleAdminMode = usePremiumStore((s) => s.toggleAdminMode);
  const priceString = usePremiumStore((s) => s.priceString);
  const lifetimePackage = usePremiumStore((s) => s.lifetimePackage);
  const checkPremiumStatus = usePremiumStore((s) => s.checkPremiumStatus);

  // Local state
  const [envInfo, setEnvInfo] = useState<ReturnType<typeof getEnvironmentInfo> | null>(null);
  const [revenueCatInfo, setRevenueCatInfo] = useState<{
    enabled: boolean;
    offerings: string[];
    customerInfo: Record<string, unknown> | null;
  }>({
    enabled: false,
    offerings: [],
    customerInfo: null,
  });
  const [isLoadingRC, setIsLoadingRC] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load environment info when modal opens
  useEffect(() => {
    if (visible) {
      setEnvInfo(getEnvironmentInfo());
      loadRevenueCatInfo();
    }
  }, [visible]);

  const loadRevenueCatInfo = async () => {
    setIsLoadingRC(true);
    try {
      const enabled = isRevenueCatEnabled();
      let offerings: string[] = [];
      let customerInfo: Record<string, unknown> | null = null;

      if (enabled) {
        const offeringsResult = await getOfferings();
        if (offeringsResult.ok && offeringsResult.data.current) {
          offerings = offeringsResult.data.current.availablePackages.map(
            (pkg) => `${pkg.identifier}: ${pkg.product.priceString}`
          );
        }

        const customerResult = await getCustomerInfo();
        if (customerResult.ok) {
          customerInfo = {
            originalAppUserId: customerResult.data.originalAppUserId,
            activeSubscriptions: customerResult.data.activeSubscriptions,
            entitlements: Object.keys(customerResult.data.entitlements.active || {}),
            allPurchasedProductIds: customerResult.data.allPurchasedProductIdentifiers,
          };
        }
      }

      setRevenueCatInfo({ enabled, offerings, customerInfo });
    } catch (error) {
      console.error('[SandboxDevMenu] Error loading RevenueCat info:', error);
    } finally {
      setIsLoadingRC(false);
    }
  };

  const handleTogglePremium = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleAdminMode();
  };

  const handleRefreshPremium = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await checkPremiumStatus();
    await loadRevenueCatInfo();
  };

  const handleCopyInfo = async () => {
    const info = {
      environment: envInfo,
      premium: {
        isPremium,
        isAdminMode,
        isCouponMode,
        priceString,
        hasLifetimePackage: !!lifetimePackage,
      },
      revenueCat: revenueCatInfo,
    };

    await Clipboard.setStringAsync(JSON.stringify(info, null, 2));
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPremiumSource = () => {
    if (isAdminMode) return 'Admin Mode (Simulado)';
    if (isCouponMode) return 'Cupom Promocional';
    if (isPremium) return 'RevenueCat (Compra Real)';
    return 'Não Premium';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: c.background }}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: c.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: 'rgba(234, 179, 8, 0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bug size={20} color="#EAB308" />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: c.text,
                  }}
                >
                  Dev Sandbox
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#EAB308',
                    fontWeight: '500',
                  }}
                >
                  Apenas em desenvolvimento
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
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

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, gap: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Premium Status Card */}
            <View
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Crown size={20} color={c.accent} />
                <Text style={{ fontSize: 16, fontWeight: '600', color: c.text }}>
                  Status Premium
                </Text>
              </View>

              {/* Current Status */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: c.border,
                }}
              >
                <Text style={{ fontSize: 14, color: c.textSecondary }}>Estado atual</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {isPremium ? (
                    <CheckCircle size={16} color="#22C55E" />
                  ) : (
                    <AlertCircle size={16} color={c.textTertiary} />
                  )}
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: isPremium ? '#22C55E' : c.textSecondary,
                    }}
                  >
                    {isPremium ? 'Premium Ativo' : 'Gratuito'}
                  </Text>
                </View>
              </View>

              {/* Source */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: c.border,
                }}
              >
                <Text style={{ fontSize: 14, color: c.textSecondary }}>Origem</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: c.text }}>
                  {getPremiumSource()}
                </Text>
              </View>

              {/* Price */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: c.border,
                }}
              >
                <Text style={{ fontSize: 14, color: c.textSecondary }}>Preço configurado</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: c.text }}>
                  {priceString ?? 'N/A'}
                </Text>
              </View>

              {/* Admin Toggle */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 12,
                }}
              >
                <View>
                  <Text style={{ fontSize: 14, color: c.text, fontWeight: '500' }}>
                    Simular Premium
                  </Text>
                  <Text style={{ fontSize: 12, color: c.textSecondary, marginTop: 2 }}>
                    Ativa premium sem compra real
                  </Text>
                </View>
                <Switch
                  value={isAdminMode}
                  onValueChange={handleTogglePremium}
                  trackColor={{ false: c.border, true: c.accent }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* RevenueCat Info Card */}
            <View
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <CreditCard size={20} color={c.accent} />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: c.text }}>
                    RevenueCat
                  </Text>
                </View>
                <Pressable
                  onPress={handleRefreshPremium}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: c.accentLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RefreshCw size={16} color={c.accent} />
                </Pressable>
              </View>

              {/* Connection Status */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: c.border,
                }}
              >
                <Text style={{ fontSize: 14, color: c.textSecondary }}>Conexão</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: revenueCatInfo.enabled ? '#22C55E' : '#EF4444',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: revenueCatInfo.enabled ? '#22C55E' : '#EF4444',
                    }}
                  >
                    {revenueCatInfo.enabled ? 'Conectado' : 'Não configurado'}
                  </Text>
                </View>
              </View>

              {/* Offerings */}
              <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.border }}>
                <Text style={{ fontSize: 14, color: c.textSecondary, marginBottom: 8 }}>
                  Produtos disponíveis
                </Text>
                {isLoadingRC ? (
                  <Text style={{ fontSize: 13, color: c.textTertiary, fontStyle: 'italic' }}>
                    Carregando...
                  </Text>
                ) : revenueCatInfo.offerings.length > 0 ? (
                  revenueCatInfo.offerings.map((offering, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: index > 0 ? 6 : 0,
                      }}
                    >
                      <Package size={14} color={c.accent} />
                      <Text style={{ fontSize: 13, color: c.text }}>{offering}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ fontSize: 13, color: c.textTertiary, fontStyle: 'italic' }}>
                    Nenhum produto encontrado
                  </Text>
                )}
              </View>

              {/* Customer Info */}
              {revenueCatInfo.customerInfo && (
                <View style={{ paddingTop: 12 }}>
                  <Text style={{ fontSize: 14, color: c.textSecondary, marginBottom: 8 }}>
                    Informações do usuário
                  </Text>
                  <Text style={{ fontSize: 12, color: c.textTertiary, fontFamily: 'monospace' }}>
                    ID: {(revenueCatInfo.customerInfo.originalAppUserId as string)?.substring(0, 20)}...
                  </Text>
                  <Text style={{ fontSize: 12, color: c.textTertiary, fontFamily: 'monospace', marginTop: 4 }}>
                    Entitlements: {(revenueCatInfo.customerInfo.entitlements as string[])?.join(', ') || 'Nenhum'}
                  </Text>
                </View>
              )}
            </View>

            {/* Environment Info Card */}
            <View
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Smartphone size={20} color={c.accent} />
                <Text style={{ fontSize: 16, fontWeight: '600', color: c.text }}>
                  Ambiente
                </Text>
              </View>

              {envInfo && (
                <>
                  <InfoRow label="App Ownership" value={envInfo.appOwnership ?? 'N/A'} c={c} />
                  <InfoRow label="Execution Env" value={envInfo.executionEnvironment} c={c} />
                  <InfoRow label="Plataforma" value={envInfo.platform} c={c} />
                  <InfoRow label="Dispositivo" value={envInfo.isDevice ? 'Sim' : 'Simulador'} c={c} />
                  <InfoRow label="Modo Dev" value={envInfo.isDev ? 'Sim' : 'Não'} c={c} />
                  <InfoRow label="Versão App" value={envInfo.appVersion} c={c} />
                  <InfoRow label="Build" value={envInfo.buildNumber} c={c} />
                  <InfoRow label="Expo SDK" value={envInfo.expoVersion ?? 'N/A'} c={c} isLast />
                </>
              )}
            </View>

            {/* Copy All Info Button */}
            <Pressable
              onPress={handleCopyInfo}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                backgroundColor: c.accentLight,
                paddingVertical: 14,
                borderRadius: 12,
              }}
            >
              {copied ? (
                <>
                  <CheckCircle size={18} color={c.accent} />
                  <Text style={{ fontSize: 15, fontWeight: '600', color: c.accent }}>
                    Copiado!
                  </Text>
                </>
              ) : (
                <>
                  <Copy size={18} color={c.accent} />
                  <Text style={{ fontSize: 15, fontWeight: '600', color: c.accent }}>
                    Copiar todas as informações
                  </Text>
                </>
              )}
            </Pressable>

            {/* Warning */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 10,
                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                padding: 12,
                borderRadius: 10,
              }}
            >
              <AlertCircle size={18} color="#EAB308" style={{ marginTop: 2 }} />
              <Text style={{ flex: 1, fontSize: 12, color: '#EAB308', lineHeight: 18 }}>
                Este menu só aparece no ambiente sandbox (Expo Go / desenvolvimento).
                Nunca será visível na App Store ou TestFlight.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

// Helper component for info rows
function InfoRow({
  label,
  value,
  c,
  isLast = false,
}: {
  label: string;
  value: string;
  c: ReturnType<typeof useColors>;
  isLast?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: c.border,
      }}
    >
      <Text style={{ fontSize: 13, color: c.textSecondary }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '500', color: c.text }}>{value}</Text>
    </View>
  );
}
