export type Intent = 'clarity' | 'courage' | 'patience' | 'acceptance' | 'discipline' | 'perspective';

export interface Verse {
  id: number;
  verse_id: number;
  chapter: number;
  verse: number;
  sanskrit_line: string;
  translation: string;
  in_plain_terms: string;
  stoic_parallel_quote: string;
  stoic_parallel_source: string;
  stoic_bridge: string;
  action_step: string;
  reflection_prompt: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  onboarding_intents: Intent[];
  ritual_time: string | null;
  email_reminders: boolean;
  day_count: number;
  subscription_tier: 'free' | 'seeker';
  created_at: string;
}

export interface DailyEntry {
  id: string;
  user_id: string;
  verse_id: number;
  journal_text: string | null;
  intent: Intent;
  feedback: 'up' | 'down' | null;
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
  RitualTime: { intents: Intent[] };
  SignUp: { intents: Intent[]; ritualTime: string };
  AllSet: undefined;
};

export type MainTabParamList = {
  Today: undefined;
  Journal: undefined;
  Saved: undefined;
  Profile: undefined;
};
