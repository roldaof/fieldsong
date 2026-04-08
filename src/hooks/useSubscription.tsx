import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import Constants from 'expo-constants';
import { supabase } from '../config/supabase';

const RC_API_KEY = Constants.expoConfig?.extra?.revenueCatApiKey as string;
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

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPaid, setIsPaid] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize RevenueCat SDK
  useEffect(() => {
    if (!RC_API_KEY || initialized) return;

    const init = async () => {
      try {
        if (__DEV__) {
          Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        }
        Purchases.configure({ apiKey: RC_API_KEY });
        setInitialized(true);

        // Fetch offerings
        const offs = await Purchases.getOfferings();
        setOfferings(offs);

        // Check current entitlement
        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
        setIsPaid(!!info.entitlements.active[ENTITLEMENT_ID]);
      } catch (e) {
        console.warn('RevenueCat init error:', e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [initialized]);

  // Listen for customer info changes
  useEffect(() => {
    if (!initialized) return;
    const listener = (info: CustomerInfo) => {
      setCustomerInfo(info);
      setIsPaid(!!info.entitlements.active[ENTITLEMENT_ID]);
    };
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => { Purchases.removeCustomerInfoUpdateListener(listener); };
  }, [initialized]);

  // Identify user with RevenueCat (call after auth)
  const identify = useCallback(async (userId: string) => {
    if (!initialized) return;
    try {
      const { customerInfo: info } = await Purchases.logIn(userId);
      setCustomerInfo(info);
      const paid = !!info.entitlements.active[ENTITLEMENT_ID];
      setIsPaid(paid);

      // Sync to Supabase
      const tier = paid ? 'seeker' : 'free';
      await supabase
        .from('profiles')
        .update({
          subscription_tier: tier,
          revenuecat_id: userId,
          subscription_active: paid,
        })
        .eq('id', userId);
    } catch (e) {
      console.warn('RevenueCat identify error:', e);
    }
  }, [initialized]);

  // Purchase a package
  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      const { customerInfo: info } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(info);
      const paid = !!info.entitlements.active[ENTITLEMENT_ID];
      setIsPaid(paid);

      if (paid) {
        // Sync to Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .update({
              subscription_tier: 'seeker',
              subscription_active: true,
            })
            .eq('id', user.id);
        }
      }
      return paid;
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Purchase failed', e.message || 'Something went wrong. Please try again.');
      }
      return false;
    }
  }, []);

  // Restore purchases
  const restore = useCallback(async (): Promise<boolean> => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      const paid = !!info.entitlements.active[ENTITLEMENT_ID];
      setIsPaid(paid);

      if (paid) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .update({
              subscription_tier: 'seeker',
              subscription_active: true,
            })
            .eq('id', user.id);
        }
        Alert.alert('Restored', 'Your subscription has been restored.');
      } else {
        Alert.alert('No subscription found', 'No active subscription was found for this account.');
      }
      return paid;
    } catch (e: any) {
      Alert.alert('Restore failed', e.message || 'Could not restore purchases.');
      return false;
    }
  }, []);

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
