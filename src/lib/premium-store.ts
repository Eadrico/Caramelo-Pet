// Premium Store - Manages premium subscription state
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  hasEntitlement,
  getOfferings,
  purchasePackage,
  restorePurchases,
  isRevenueCatEnabled,
} from './revenuecatClient';
import type { PurchasesPackage } from 'react-native-purchases';

const ADMIN_MODE_KEY = 'caramelo_admin_premium_mode';
const COUPON_MODE_KEY = 'caramelo_coupon_premium_mode';
const REDEEMED_COUPONS_KEY = 'caramelo_redeemed_coupons';
const FREE_PET_LIMIT = 2;
const FREE_CARE_LIMIT = 1;
const FREE_REMINDER_LIMIT = 1;
const PREMIUM_ENTITLEMENT_ID = 'premium';

// Valid promotional coupons
const VALID_COUPONS: Record<string, { name: string; expiresAt?: Date }> = {
  '#CARNAVAU#': { name: 'Carnaval 2026' },
};

interface PremiumState {
  // State
  isPremium: boolean;
  isAdminMode: boolean; // For testing purposes
  isCouponMode: boolean; // Premium via coupon
  isLoading: boolean;
  isInitialized: boolean;
  lifetimePackage: PurchasesPackage | null;
  priceString: string | null;
  redeemedCoupons: string[];

  // Actions
  initialize: () => Promise<void>;
  checkPremiumStatus: () => Promise<boolean>;
  purchasePremium: () => Promise<{ success: boolean; error?: string }>;
  restorePurchases: () => Promise<{ success: boolean; restored: boolean; error?: string }>;
  redeemCoupon: (coupon: string) => Promise<{ success: boolean; error?: string }>;

  // Admin/Test functions
  toggleAdminMode: () => Promise<void>;
  setAdminMode: (enabled: boolean) => Promise<void>;

  // Helpers
  canAddPet: (currentPetCount: number) => boolean;
  canAddCareItem: (currentCareCount: number) => boolean;
  canAddReminder: (currentReminderCount: number) => boolean;
}

export const usePremiumStore = create<PremiumState>((set, get) => ({
  isPremium: false,
  isAdminMode: false,
  isCouponMode: false,
  isLoading: false,
  isInitialized: false,
  lifetimePackage: null,
  priceString: null,
  redeemedCoupons: [],

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });

    try {
      // Check admin mode from storage
      const adminMode = await AsyncStorage.getItem(ADMIN_MODE_KEY);
      const isAdminMode = adminMode === 'true';

      // Check coupon mode from storage
      const couponMode = await AsyncStorage.getItem(COUPON_MODE_KEY);
      const isCouponMode = couponMode === 'true';

      // Load redeemed coupons
      const redeemedCouponsData = await AsyncStorage.getItem(REDEEMED_COUPONS_KEY);
      const redeemedCoupons: string[] = redeemedCouponsData ? JSON.parse(redeemedCouponsData) : [];

      // Check actual premium status from RevenueCat
      let isPremium = isAdminMode || isCouponMode;

      if (!isPremium && isRevenueCatEnabled()) {
        const result = await hasEntitlement(PREMIUM_ENTITLEMENT_ID);
        if (result.ok) {
          isPremium = result.data;
        }
      }

      // Load offerings to get price
      let lifetimePackage: PurchasesPackage | null = null;
      let priceString: string | null = null;

      if (isRevenueCatEnabled()) {
        const offeringsResult = await getOfferings();
        if (offeringsResult.ok && offeringsResult.data.current) {
          lifetimePackage = offeringsResult.data.current.availablePackages.find(
            pkg => pkg.identifier === '$rc_lifetime'
          ) ?? null;

          if (lifetimePackage) {
            priceString = lifetimePackage.product.priceString;
          }
        }
      }

      // Fallback price if not available from RevenueCat
      if (!priceString) {
        priceString = '$2.99';
      }

      set({
        isPremium,
        isAdminMode,
        isCouponMode,
        lifetimePackage,
        priceString,
        redeemedCoupons,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('[PremiumStore] Error initializing:', error);
      set({ isInitialized: true, isLoading: false });
    }
  },

  checkPremiumStatus: async () => {
    const { isAdminMode, isCouponMode } = get();

    // Admin mode or coupon mode overrides everything
    if (isAdminMode || isCouponMode) {
      set({ isPremium: true });
      return true;
    }

    if (!isRevenueCatEnabled()) {
      return false;
    }

    const result = await hasEntitlement(PREMIUM_ENTITLEMENT_ID);
    if (result.ok) {
      set({ isPremium: result.data });
      return result.data;
    }

    return false;
  },

  purchasePremium: async () => {
    const { lifetimePackage } = get();

    if (!lifetimePackage) {
      return { success: false, error: 'Product not available' };
    }

    set({ isLoading: true });

    try {
      const result = await purchasePackage(lifetimePackage);

      if (result.ok) {
        const hasPremium = Boolean(result.data.entitlements.active?.[PREMIUM_ENTITLEMENT_ID]);
        set({ isPremium: hasPremium, isLoading: false });
        return { success: hasPremium };
      }

      set({ isLoading: false });
      return { success: false, error: result.reason };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Purchase failed' };
    }
  },

  restorePurchases: async () => {
    set({ isLoading: true });

    try {
      const result = await restorePurchases();

      if (result.ok) {
        const hasPremium = Boolean(result.data.entitlements.active?.[PREMIUM_ENTITLEMENT_ID]);
        set({ isPremium: hasPremium, isLoading: false });
        return { success: true, restored: hasPremium };
      }

      set({ isLoading: false });
      return { success: false, restored: false, error: result.reason };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, restored: false, error: 'Restore failed' };
    }
  },

  redeemCoupon: async (coupon: string) => {
    const trimmedCoupon = coupon.trim();

    // Check if coupon is valid
    if (!VALID_COUPONS[trimmedCoupon]) {
      return { success: false, error: 'Cupom inválido' };
    }

    const couponData = VALID_COUPONS[trimmedCoupon];

    // Check if coupon is expired
    if (couponData.expiresAt && new Date() > couponData.expiresAt) {
      return { success: false, error: 'Cupom expirado' };
    }

    // Check if already redeemed
    const { redeemedCoupons } = get();
    if (redeemedCoupons.includes(trimmedCoupon)) {
      return { success: false, error: 'Cupom já foi utilizado' };
    }

    try {
      // Add to redeemed coupons
      const updatedCoupons = [...redeemedCoupons, trimmedCoupon];
      await AsyncStorage.setItem(REDEEMED_COUPONS_KEY, JSON.stringify(updatedCoupons));

      // Enable coupon mode
      await AsyncStorage.setItem(COUPON_MODE_KEY, 'true');

      set({
        isCouponMode: true,
        isPremium: true,
        redeemedCoupons: updatedCoupons,
      });

      return { success: true };
    } catch (error) {
      console.error('[PremiumStore] Error redeeming coupon:', error);
      return { success: false, error: 'Erro ao resgatar cupom' };
    }
  },

  toggleAdminMode: async () => {
    const { isAdminMode, isCouponMode } = get();
    const newMode = !isAdminMode;

    await AsyncStorage.setItem(ADMIN_MODE_KEY, newMode ? 'true' : 'false');

    // When turning OFF admin mode, check if there's a real premium status
    // When turning ON admin mode, force premium to true
    let actualPremium = newMode;
    if (!newMode) {
      // Check if user has premium from coupon or RevenueCat
      actualPremium = isCouponMode;
      if (!actualPremium && isRevenueCatEnabled()) {
        const result = await hasEntitlement(PREMIUM_ENTITLEMENT_ID);
        if (result.ok) {
          actualPremium = result.data;
        }
      }
    }

    set({
      isAdminMode: newMode,
      isPremium: actualPremium,
    });
  },

  setAdminMode: async (enabled: boolean) => {
    const { isCouponMode } = get();
    await AsyncStorage.setItem(ADMIN_MODE_KEY, enabled ? 'true' : 'false');

    // Same logic as toggleAdminMode
    let actualPremium = enabled;
    if (!enabled) {
      actualPremium = isCouponMode;
      if (!actualPremium && isRevenueCatEnabled()) {
        const result = await hasEntitlement(PREMIUM_ENTITLEMENT_ID);
        if (result.ok) {
          actualPremium = result.data;
        }
      }
    }

    set({
      isAdminMode: enabled,
      isPremium: actualPremium,
    });
  },

  canAddPet: (currentPetCount: number) => {
    const { isPremium } = get();
    return isPremium || currentPetCount < FREE_PET_LIMIT;
  },

  canAddCareItem: (currentCareCount: number) => {
    const { isPremium } = get();
    return isPremium || currentCareCount < FREE_CARE_LIMIT;
  },

  canAddReminder: (currentReminderCount: number) => {
    const { isPremium } = get();
    return isPremium || currentReminderCount < FREE_REMINDER_LIMIT;
  },
}));

// Export constants for use elsewhere
export const FREE_PET_LIMIT_COUNT = FREE_PET_LIMIT;
export const FREE_CARE_LIMIT_COUNT = FREE_CARE_LIMIT;
export const FREE_REMINDER_LIMIT_COUNT = FREE_REMINDER_LIMIT;
