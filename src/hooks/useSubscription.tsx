import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import Constants from 'expo-constants';
import { supabase } from '../config/supabase';

const RC_API_KEY = Constants.expoConfig?.extra?.revenueCatApiKey as string | undefined;
const ENTITLEMENT_ID = 'seeker';

interface SubscriptionState {
  isPaid: boolean;
  offerings: PurchasesOfferings | null;
  customerInfo: CustomerInfo | null;
  loading: boolean;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<boolean>;
  identify: (userId: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

function getActiveEntitlement(info: CustomerInfo) {
  return info.entitlements.active[ENTITLEMENT_ID] ?? null;
}

function hasSeekerAccess(info: CustomerInfo) {
  return !!getActiveEntitlement(info)?.isActive;
}

async function syncCustomerInfoToProfile(info: CustomerInfo, userId?: string | null) {
  const uid = userId ?? (await supabase.auth.getUser()).data.user?.id;
  if (!uid) return;

  const entitlement = getActiveEntitlement(info);
  const paid = !!entitlement;

  await supabase
    .from('profiles')
    .update({
      subscription_tier: paid ? 'seeker' : 'free',
      revenuecat_id: uid,
      subscription_active: paid,
      trial_ends_at: entitlement?.periodType === 'TRIAL' ? entitlement.expirationDate : null,
      subscription_ends_at: entitlement?.periodType === 'TRIAL' ? null : entitlement?.expirationDate ?? null,
    })
    .eq('id', uid);
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPaid, setIsPaid] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const applyCustomerInfo = useCallback((info: CustomerInfo) => {
    setCustomerInfo(info);
    setIsPaid(hasSeekerAccess(info));
  }, []);

  // Initialize RevenueCat SDK
  useEffect(() => {
    if (initialized) return;

    if (!RC_API_KEY) {
      console.warn('RevenueCat API key is missing. Purchases are disabled.');
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        if (__DEV__) {
          Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        }

        Purchases.configure({ apiKey: RC_API_KEY });
        setInitialized(true);

        const [offs, info] = await Promise.all([
          Purchases.getOfferings(),
          Purchases.getCustomerInfo(),
        ]);

        setOfferings(offs);
        applyCustomerInfo(info);
      } catch (e) {
        console.warn('RevenueCat init error:', e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [applyCustomerInfo, initialized]);

  // Listen for customer info changes
  useEffect(() => {
    if (!initialized) return;

    const listener = (info: CustomerInfo) => {
      applyCustomerInfo(info);
      void syncCustomerInfoToProfile(info);
    };

    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [applyCustomerInfo, initialized]);

  // Identify user with RevenueCat (call after auth)
  const identify = useCallback(async (userId: string) => {
    if (!initialized) return;

    try {
      const { customerInfo: info } = await Purchases.logIn(userId);
      applyCustomerInfo(info);
      await syncCustomerInfoToProfile(info, userId);
    } catch (e) {
      console.warn('RevenueCat identify error:', e);
    }
  }, [applyCustomerInfo, initialized]);

  // Purchase a package
  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      const { customerInfo: info } = await Purchases.purchasePackage(pkg);
      applyCustomerInfo(info);
      const paid = hasSeekerAccess(info);

      if (paid) {
        await syncCustomerInfoToProfile(info);
      }

      return paid;
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Purchase failed', e.message || 'Something went wrong. Please try again.');
      }
      return false;
    }
  }, [applyCustomerInfo]);

  // Restore purchases
  const restore = useCallback(async (): Promise<boolean> => {
    try {
      const info = await Purchases.restorePurchases();
      applyCustomerInfo(info);
      const paid = hasSeekerAccess(info);
      await syncCustomerInfoToProfile(info);

      if (paid) {
        Alert.alert('Restored', 'Your FieldSong+ access has been restored.');
      } else {
        Alert.alert('No subscription found', 'No active subscription was found for this account.');
      }

      return paid;
    } catch (e: any) {
      Alert.alert('Restore failed', e.message || 'Could not restore purchases.');
      return false;
    }
  }, [applyCustomerInfo]);

  return (
    <SubscriptionContext.Provider
      value={{ isPaid, offerings, customerInfo, loading, purchase, restore, identify }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider');
  return context;
}
