# CLAUDE.md

## Project Overview

FieldSong is a cross-platform mobile app (iOS, Android, web) built with Expo/React Native. It delivers a daily "clarity ritual" — a Bhagavad Gita verse paired with a Stoic philosophy quote. Target audience: Western mindfulness practitioners (28-50), spiritual but not religious. Dark-only UI.

## Tech Stack

- **Language:** TypeScript (strict mode)
- **Framework:** React Native via Expo SDK ~54, React 19, RN 0.81
- **Navigation:** React Navigation v7 (native-stack + bottom-tabs)
- **Backend:** Supabase (auth, Postgres DB, RLS, RPC functions)
- **Edge Functions:** Deno/TypeScript (Supabase Edge Functions) — daily email via Resend, inbound reply processing
- **Fonts:** Newsreader (serif, display/headlines) + Manrope (sans-serif, body/UI)
- **Icons:** Ionicons via @expo/vector-icons
- **State:** Local useState/useEffect + AuthContext. No global state library.

## Commands

```bash
npm start        # Expo dev server
npm run android  # Android emulator/device
npm run ios      # iOS simulator/device
npm run web      # Expo web
```

No test framework or linting tooling is configured.

## Project Structure

```
App.tsx                     # Root: nav setup, font loading, auth gate
src/
  config/
    supabase.ts             # Supabase client (URL + anon key hardcoded)
    theme.ts                # Design tokens: colors, fonts, spacing, typography
  hooks/
    useAuth.tsx             # AuthContext + AuthProvider
    useProfile.ts           # Profile CRUD
    useVerse.ts             # Verse fetch, bookmarks
  types/index.ts            # All TS types + navigation param lists
  components/               # Reusable UI (Button, VerseCard, StoicCard, etc.)
  screens/
    onboarding/             # Welcome, IntentQuiz, Mirror, FirstVerse, SignUp, Paywall
    main/                   # Today, Journal, Saved, Profile, Journeys, JourneyDay
supabase/functions/         # Edge functions (send-daily-verse, process-reply)
schema.sql                  # Full DB schema + RLS + helper functions
```

## Code Conventions

- **Components/screens:** Named exports, PascalCase function components
- **Hooks:** Named exports, camelCase with `use` prefix
- **Styles:** Co-located `StyleSheet.create()` at bottom of each file
- **Types:** Centralized in `src/types/index.ts`
- **Theme:** Always import tokens from `src/config/theme.ts` — no magic numbers
- **Supabase calls:** Made directly in hooks/components, no service layer
- **Errors:** `Alert.alert()` for user-facing, `console.warn` for non-critical

## Architecture Notes

- **Freemium model:** Free tier enforced client-side (5 bookmark cap, 30-day journal, no journeys/search). Paid tier = `'seeker'`. Payment not yet implemented — paywall shows "coming soon."
- **Subscription tiers in DB:** `'free'`, `'seeker'`, `'lifetime'` — but TS types only declare `'free' | 'seeker'`
- **Email loop:** Edge function sends daily verse emails; users reply to save journal reflections. Reply-to address encodes user UUID: `journal+{uuid}@fieldsong.app`
- **Verse selection:** `get_next_verse()` RPC picks highest-priority unshown verse matching user's first intent
- **Inactive screens:** `AllSetScreen`, `MicroReflectionScreen`, `RitualTimeScreen` exist but are not in the active navigation
- **pgvector extension** enabled in schema but unused — planned for future AI features
- **Onboarding flow:** Welcome → IntentQuiz → Mirror → FirstVerse → SignUp → Paywall
