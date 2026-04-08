import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { Profile, Intent } from '../types';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [practiceDays, setPracticeDays] = useState(0);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) console.warn('fetchProfile error:', error.message);
    setProfile(data);
    setLoading(false);
  }, [userId]);

  const fetchPracticeDays = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('daily_entries')
      .select('created_at')
      .eq('user_id', userId);
    if (error || !data || data.length === 0) {
      setPracticeDays(0);
      return;
    }
    // Count total unique days with entries (not consecutive)
    const uniqueDays = new Set<string>();
    for (const entry of data) {
      const d = new Date(entry.created_at);
      uniqueDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    }
    setPracticeDays(uniqueDays.size);
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchProfile();
    fetchPracticeDays();
  }, [userId, fetchProfile, fetchPracticeDays]);

  const updateIntents = useCallback(
    async (intents: Intent[]) => {
      if (!userId) return { error: new Error('No user') };
      const { error } = await supabase.rpc('save_onboarding_intents', {
        p_user_id: userId,
        p_intents: intents,
      });
      if (error) {
        console.warn('updateIntents RPC error:', error.message);
        return { error };
      }
      setProfile((prev) => (prev ? { ...prev, onboarding_intents: intents } : null));
      return { error: null };
    },
    [userId],
  );

  const updateRitualTime = useCallback(
    async (time: string, _emailReminders: boolean) => {
      if (!userId) return { error: new Error('No user') };
      const { error } = await supabase
        .from('profiles')
        .update({ preferred_send_time: time })
        .eq('id', userId);
      if (error) {
        console.warn('updateRitualTime error:', error.message);
      } else {
        setProfile((prev) =>
          prev ? { ...prev, preferred_send_time: time } : null,
        );
      }
      return { error };
    },
    [userId],
  );

  const updateEmailsPaused = useCallback(
    async (paused: boolean) => {
      if (!userId) return { error: new Error('No user') };
      const { error } = await supabase
        .from('profiles')
        .update({ emails_paused: paused })
        .eq('id', userId);
      if (error) {
        console.warn('updateEmailsPaused error:', error.message);
      } else {
        setProfile((prev) =>
          prev ? { ...prev, emails_paused: paused } : null,
        );
      }
      return { error };
    },
    [userId],
  );

  const updatePushNotifications = useCallback(
    async (enabled: boolean) => {
      if (!userId) return { error: new Error('No user') };
      const { error } = await supabase
        .from('profiles')
        .update({ push_notifications_enabled: enabled })
        .eq('id', userId);
      if (error) {
        console.warn('updatePushNotifications error:', error.message);
      } else {
        setProfile((prev) =>
          prev ? { ...prev, push_notifications_enabled: enabled } : null,
        );
      }
      return { error };
    },
    [userId],
  );

  return {
    profile,
    loading,
    practiceDays,
    fetchProfile,
    updateIntents,
    updateRitualTime,
    updateEmailsPaused,
    updatePushNotifications,
  };
}
