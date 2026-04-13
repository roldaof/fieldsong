-- FieldSong Database Schema
-- Run via Supabase SQL Editor

-- Enable pgvector for future AI features
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------------
-- USERS (extends Supabase auth.users)
-----------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  preferred_send_time TIME DEFAULT '07:00:00',
  practice_day_count INT DEFAULT 0,
  longest_practice INT DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'seeker', 'lifetime')),
  onboarding_intents TEXT[] DEFAULT '{}',
  emails_paused BOOLEAN DEFAULT FALSE,
  push_token TEXT,
  push_notifications_enabled BOOLEAN DEFAULT TRUE,
  stripe_customer_id TEXT,
  revenuecat_id TEXT,
  subscription_active BOOLEAN DEFAULT FALSE,
  trial_ends_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-----------------------------------------------
-- VERSES (content database)
-----------------------------------------------
CREATE TABLE public.verses (
  id SERIAL PRIMARY KEY,
  chapter SMALLINT NOT NULL,
  verse_number SMALLINT NOT NULL,
  sanskrit_line TEXT,
  translation TEXT NOT NULL,
  modern_interpretation TEXT NOT NULL,
  action_step TEXT NOT NULL,
  reflection_prompt TEXT NOT NULL,
  stoic_parallel_quote TEXT,
  stoic_parallel_source TEXT,
  stoic_bridge TEXT,
  intent_tags TEXT[] DEFAULT '{}',
  themes TEXT[] DEFAULT '{}',
  season_context TEXT,
  priority CHAR(1) DEFAULT 'C' CHECK (priority IN ('A', 'B', 'C')),
  why_selected TEXT,
  is_curated BOOLEAN DEFAULT TRUE,
  stoic_quote_verified BOOLEAN DEFAULT FALSE,
  stoic_quote_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(chapter, verse_number)
);

-- Index for intent-based matching
CREATE INDEX idx_verses_intent ON public.verses USING GIN (intent_tags);
CREATE INDEX idx_verses_priority ON public.verses (priority);

-----------------------------------------------
-- DAILY ENTRIES (user's daily interactions)
-----------------------------------------------
CREATE TABLE public.daily_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  verse_id INT NOT NULL REFERENCES public.verses(id),
  intent_selected TEXT CHECK (intent_selected IN ('clarity', 'courage', 'patience', 'acceptance', 'discipline', 'perspective')),
  reflection_text TEXT,
  match_quality SMALLINT CHECK (match_quality IN (-1, 0, 1)), -- thumbs down, neutral, thumbs up
  followup_question TEXT,
  source_channel TEXT DEFAULT 'app' CHECK (source_channel IN ('app', 'email')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_daily_entries_user ON public.daily_entries (user_id, created_at DESC);
CREATE INDEX idx_daily_entries_verse ON public.daily_entries (verse_id);

-----------------------------------------------
-- VERSE BOOKMARKS
-----------------------------------------------
CREATE TABLE public.verse_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  verse_id INT NOT NULL REFERENCES public.verses(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, verse_id)
);

CREATE INDEX idx_bookmarks_user ON public.verse_bookmarks (user_id);

-----------------------------------------------
-- VERSE HISTORY (track which verses shown to which user)
-----------------------------------------------
CREATE TABLE public.verse_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  verse_id INT NOT NULL REFERENCES public.verses(id),
  shown_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, verse_id)
);

CREATE INDEX idx_verse_history_user ON public.verse_history (user_id, shown_at DESC);

-----------------------------------------------
-- ROW LEVEL SECURITY
-----------------------------------------------

-- Profiles: users can only read/update their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Verses: readable by everyone (public content)
ALTER TABLE public.verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Verses are publicly readable"
  ON public.verses FOR SELECT
  USING (true);

-- Daily entries: users can only access their own
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entries"
  ON public.daily_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON public.daily_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON public.daily_entries FOR UPDATE
  USING (auth.uid() = user_id);

-- Bookmarks: users can only access their own
ALTER TABLE public.verse_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON public.verse_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON public.verse_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON public.verse_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Verse history: users can only access their own
ALTER TABLE public.verse_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verse history"
  ON public.verse_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verse history"
  ON public.verse_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-----------------------------------------------
-- HELPER FUNCTIONS
-----------------------------------------------

-- Get next verse for a user based on intent, avoiding repeats
CREATE OR REPLACE FUNCTION public.get_next_verse(
  p_user_id UUID,
  p_intent TEXT
)
RETURNS SETOF public.verses AS $$
  SELECT v.*
  FROM public.verses v
  WHERE p_intent = ANY(v.intent_tags)
    AND v.id NOT IN (
      SELECT verse_id FROM public.verse_history
      WHERE user_id = p_user_id
    )
  ORDER BY
    CASE v.priority
      WHEN 'A' THEN 1
      WHEN 'B' THEN 2
      WHEN 'C' THEN 3
    END,
    random()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Delete the currently authenticated user.
-- Relies on ON DELETE CASCADE from auth.users → profiles → daily_entries,
-- verse_bookmarks, and verse_history to remove all user-owned rows.
-- SECURITY DEFINER lets the function delete from auth.users even though
-- the calling role (authenticated) has no direct privilege on that table.
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS VOID AS $$
DECLARE
  uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  DELETE FROM auth.users WHERE id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE ALL ON FUNCTION public.delete_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;
