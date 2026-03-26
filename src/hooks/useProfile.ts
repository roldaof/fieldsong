import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { Profile, Intent } from '../types';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
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
      if (!userId) return;
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_intents: intents })
        .eq('user_id', userId);
      if (!error)
        setProfile((prev) => (prev ? { ...prev, onboarding_intents: intents } : null));
      return { error };
    },
    [userId],
  );

  const updateRitualTime = useCallback(
    async (time: string, emailReminders: boolean) => {
      if (!userId) return;
      const { error } = await supabase
        .from('profiles')
        .update({ ritual_time: time, email_reminders: emailReminders })
        .eq('user_id', userId);
      if (!error)
        setProfile((prev) =>
          prev ? { ...prev, ritual_time: time, email_reminders: emailReminders } : null,
        );
      return { error };
    },
    [userId],
  );

  return { profile, loading, fetchProfile, updateIntents, updateRitualTime };
}
