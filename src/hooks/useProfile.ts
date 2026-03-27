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
      console.log('updateIntents: userId=', userId, 'intents=', intents);
      const { data, error, count } = await supabase
        .from('profiles')
        .update({ onboarding_intents: intents })
        .eq('id', userId)
        .select();
      console.log('updateIntents result:', { data, error, count });
      if (error) {
        console.warn('updateIntents error:', error.message, error.details, error.hint);
      } else if (!data || data.length === 0) {
        // RLS might be silently blocking - no rows matched
        console.warn('updateIntents: no rows updated, RLS might be blocking');
        // Try upsert as fallback
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({ id: userId, onboarding_intents: intents }, { onConflict: 'id' });
        if (upsertError) {
          console.warn('updateIntents upsert fallback error:', upsertError.message);
          return { error: upsertError };
        }
        setProfile((prev) => (prev ? { ...prev, onboarding_intents: intents } : null));
      } else {
        setProfile((prev) => (prev ? { ...prev, onboarding_intents: intents } : null));
      }
      return { error };
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
