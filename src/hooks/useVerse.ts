import { useState, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { Verse, Intent } from '../types';

export function useVerse() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayVerse = useCallback(async (userId: string, intent: Intent) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('get_next_verse', {
        p_user_id: userId,
        p_intent: intent,
      });
      if (rpcError) throw rpcError;
      if (data && data.length > 0) setVerse(data[0]);
    } catch (e: any) {
      setError(e.message);
      // Fallback: fetch a random verse
      const { data } = await supabase.from('verses').select('*').limit(1).single();
      if (data) setVerse(data);
    } finally {
      setLoading(false);
    }
  }, []);

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
