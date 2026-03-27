export type Intent = 'clarity' | 'courage' | 'patience' | 'acceptance' | 'discipline' | 'perspective';

export interface Verse {
  id: number;
  chapter: number;
  verse_number: number;
  sanskrit_line: string;
  translation: string;
  modern_interpretation: string;
  action_step: string;
  reflection_prompt: string;
  stoic_parallel_quote: string;
  stoic_parallel_source: string;
  stoic_bridge: string;
  intent_tags: string[] | null;
  themes: string[] | null;
  season_context: string | null;
  priority: number | null;
  why_selected: string | null;
  is_curated: boolean | null;
  stoic_quote_verified: boolean | null;
  stoic_quote_note: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  timezone: string | null;
  preferred_send_time: string | null;
  practice_day_count: number;
  longest_practice: number | null;
  subscription_tier: 'free' | 'seeker';
  onboarding_intents: Intent[];
  push_token: string | null;
  stripe_customer_id: string | null;
  revenuecat_id: string | null;
  subscription_active: boolean | null;
  trial_ends_at: string | null;
  subscription_ends_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface DailyEntry {
  id: string;
  user_id: string;
  verse_id: number;
  intent_selected: Intent | null;
  reflection_text: string | null;
  match_quality: 'up' | 'down' | null;
  followup_question: string | null;
  source_channel: string | null;
  created_at: string;
  verse?: Verse;
}

export interface VerseBookmark {
  id: string;
  user_id: string;
  verse_id: number;
  created_at: string;
  verse?: Verse;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  IntentQuiz: undefined;
  Mirror: { intents: Intent[] };
  FirstVerse: { intents: Intent[] };
  MicroReflection: { intents: Intent[]; verseId: number; reflectionPrompt: string };
  SignUp: { intents: Intent[]; verseId: number; reflectionText: string };
  Paywall: { intents: Intent[] };
};

export interface Journey {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  verse_ids: number[];
  duration_days: number;
  is_premium: boolean;
}

export interface UserJourney {
  id: string;
  user_id: string;
  journey_id: number;
  current_day: number;
  started_at: string;
  completed_at: string | null;
  journey?: Journey;
}

export type MainTabParamList = {
  Today: undefined;
  Journal: undefined;
  Saved: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  JourneyDay: { journeyId: number; userJourneyId?: string };
  Journeys: undefined;
};
