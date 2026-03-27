import { useState, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';
import { Verse, Intent } from '../types';

export function useVerse() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const todayVerseId = useRef<number | null>(null);

  const fetchTodayVerse = useCallback(async (userId: string, intent: Intent) => {
    // If we already have today's verse, don't fetch a new one
    if (todayVerseId.current && verse) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // First check if user already has an entry for today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingEntry } = await supabase
        .from('daily_entries')
        .select('verse_id')
        .eq('user_id', userId)
        .gte('created_at', today)
        .limit(1)
        .maybeSingle();

      if (existingEntry?.verse_id) {
        // User already has a verse for today, fetch that one
        const { data: existingVerse } = await supabase
          .from('verses')
          .select('*')
          .eq('id', existingEntry.verse_id)
          .single();
        if (existingVerse) {
          setVerse(existingVerse);
          todayVerseId.current = existingVerse.id;
          setLoading(false);
          return;
        }
      }

      // No verse today yet, get a new one
      const { data, error: rpcError } = await supabase.rpc('get_next_verse', {
        p_user_id: userId,
        p_intent: intent,
      });
      if (rpcError) throw rpcError;
      if (data && data.length > 0) {
        setVerse(data[0]);
        todayVerseId.current = data[0].id;

        // Record in verse_history so it won't be shown again
        await supabase.from('verse_history').upsert({
          user_id: userId,
          verse_id: data[0].id,
        }, { onConflict: 'user_id,verse_id' }).select();
      }
    } catch (e: any) {
      setError(e.message);
      const { data } = await supabase.from('verses').select('*').limit(1).single();
      if (data) {
        setVerse(data);
        todayVerseId.current = data.id;
      }
    } finally {
      setLoading(false);
    }
  }, [verse]);

  const bookmarkVerse = useCallback(async (userId: string, verseId: number) => {
    const { error } = await supabase
      .from('verse_bookmarks')
      .insert({ user_id: userId, verse_id: verseId });
    return { error };
  }, []);

  const removeBookmark = useCallback(async (userId: string, verseId: number) => {
    const { error } = await supabase
      .from('verse_bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('verse_id', verseId);
    return { error };
  }, []);

  const isBookmarked = useCallback(async (userId: string, verseId: number) => {
    const { data } = await supabase
      .from('verse_bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('verse_id', verseId)
      .maybeSingle();
    return !!data;
  }, []);

  return { verse, loading, error, fetchTodayVerse, bookmarkVerse, removeBookmark, isBookmarked };
}
