import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { Profile, Intent } from '../types';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [userId, fetchProfile]);

  const updateIntents = useCallback(
    async (intents: Intent[]) => {
      if (!userId) return { error: new Error('No user') };
      // Use RPC function to bypass RLS issues
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

  return { profile, loading, fetchProfile, updateIntents, updateRitualTime };
}
