# BUILD TASK: FieldSong Expo App

## Overview

Build the FieldSong mobile app using Expo (React Native + TypeScript). This is a daily clarity ritual app pairing Bhagavad Gita verses with Stoic philosophy.

## Reference Materials

All in the `reference/` directory:
- `reference/wireframes/` — PNG screenshots of each screen design
- `reference/wireframes/fieldsong_editorial/DESIGN.md` — Full design system (colors, typography, spacing, components)
- `reference/content-50-verified.json` + `reference/content-51-100.json` — Verse content
- `reference/verses-100.json` — Verse metadata with intent tags, themes, priorities

## Supabase Config

```
URL: https://rgbzqnbegozpcgdnfxfy.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnYnpxbmJlZ296cGNnZG5meGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDg3NjYsImV4cCI6MjA5MDEyNDc2Nn0.qs6RH_rBXf46jbqFcl3IdJut4Ss9FP9ucregSBayI7c
```

The database already has these tables with RLS:
- `profiles` (auto-created on auth signup)
- `verses` (100 seeded, with all content)
- `daily_entries` (user journal entries)
- `verse_bookmarks`
- `verse_history` (tracks which verses shown to which user)
- RPC function: `get_next_verse(user_id, intent)` — returns next unshown verse matching intent

## Design System (from DESIGN.md)

### Colors
- Surface/background: #131313 (base), #1C1B1B (sections), #20201F (containers), #2A2A2A (prominent), #353535 (active)
- Primary accent: #F2CA50 to #D4AF37 gradient (gold/amber)
- Text primary: #E8E2D6 (warm cream/off-white)
- Text secondary: #A09A8E (muted)
- Outline: #4D4635 at 20% opacity

### Typography
- Headlines/Display: Newsreader (serif) — use expo-google-fonts or a similar serif
- Body/Labels: Manrope (sans-serif)
- Labels: UPPERCASE with letter-spacing 0.05rem

### Key Rules
- NO borders for sectioning — use background color shifts
- No pure black (#000000)
- Left-align text (never center for more than 3 lines)
- Rounded corners: xl (1.5rem) for cards
- Transitions: 400ms ease

## Screens to Build

### 1. Onboarding Flow (5 screens)

**Screen 1 — Welcome:**
- "FieldSong" wordmark centered
- "Ancient clarity for modern decisions." subtitle
- One line: "A 2-minute daily ritual pairing the Bhagavad Gita with Stoic philosophy."
- "Begin" button (gold gradient)
- Reference: `reference/wireframes/fieldsong_welcome_updated_clarity/screen.png`

**Screen 2 — Intent Quiz:**
- "What are you seeking most right now?" with "Pick up to 3"
- 6 cards in 2x3 grid: Clarity in decisions, Courage to act, Patience with uncertainty, Acceptance of what I can't control, Discipline and focus, Perspective on what matters
- Multi-select with gold border + checkmark on selected
- Step indicator "STEP 1 OF 3"
- "Continue" button + "Skip" link
- Reference: `reference/wireframes/intent_quiz_clearer_selection/screen.png`

**Screen 3 — Ritual Time:**
- "When shall we meet?"
- Time picker (hour/minute/AM-PM)
- Email toggle with email input
- Seneca quote: "It's not at all that we have too short a time to live, but that we squander a great deal of it."
- Reference: `reference/wireframes/set_your_ritual_time_updated_quote/screen.png`

**Screen 4 — Sign Up:**
- Apple Sign In + Google Sign In buttons
- Email/password form
- "Your practice, your journal, your data. Private by default."
- Supabase Auth (email/password for MVP, OAuth stubs)
- Reference: `reference/wireframes/sign_up/screen.png`

**Screen 5 — You're Set:**
- "Your first ritual awaits."
- Preview card with actual verse (2.47): Sanskrit, translation, "In plain terms", Stoic parallel
- "Open FieldSong" button
- "Day 1 of your clarity practice"
- Reference: `reference/wireframes/daily_ritual_preview_final/screen.png`

### 2. Main App (Tab Navigation)

**Tab 1 — Today (Daily Ritual):**
- Day counter at top: "Day X of your clarity practice"
- Intent selection: 6 pills, one pre-selected
- Verse display: Sanskrit (muted italic), translation (serif), chapter reference
- "In plain terms" section (sans-serif body)
- Stoic parallel card (inset, slightly lighter bg)
- "Try this today" action step
- Reflection prompt with journal text input (280 char)
- Save button
- Feedback (thumbs up/down, first 3 days only)
- Bookmark icon
- Reference: `reference/wireframes/daily_ritual_view/screen.png`
- Data comes from Supabase `get_next_verse()` RPC + `verses` table

**Tab 2 — Journal:**
- List of past daily entries with date, verse reference, and journal text preview
- Tap to expand full entry
- Query: `daily_entries` ordered by created_at DESC

**Tab 3 — Saved:**
- Bookmarked verses
- List with verse reference, Sanskrit line, first line of interpretation
- Tap to see full verse
- Query: `verse_bookmarks` joined with `verses`

**Tab 4 — Profile:**
- Practice day count
- Subscription tier (free/seeker)
- Notification time setting
- Quiet hours
- Sign out button

## App Structure

```
src/
├── app.tsx                    # Entry point, navigation setup
├── config/
│   ├── supabase.ts           # Supabase client init
│   └── theme.ts              # Colors, typography, spacing from design system
├── hooks/
│   ├── useAuth.ts            # Auth state management
│   ├── useVerse.ts           # Fetch today's verse
│   └── useProfile.ts         # User profile management
├── screens/
│   ├── onboarding/
│   │   ├── WelcomeScreen.tsx
│   │   ├── IntentQuizScreen.tsx
│   │   ├── RitualTimeScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   └── AllSetScreen.tsx
│   ├── main/
│   │   ├── TodayScreen.tsx   # Daily ritual
│   │   ├── JournalScreen.tsx
│   │   ├── SavedScreen.tsx
│   │   └── ProfileScreen.tsx
├── components/
│   ├── VerseCard.tsx          # Sanskrit + translation + reference
│   ├── InterpretationCard.tsx # "In plain terms" section
│   ├── StoicCard.tsx          # Stoic parallel inset card
│   ├── ActionStep.tsx         # "Try this today"
│   ├── ReflectionInput.tsx    # Journal prompt + text input
│   ├── IntentPills.tsx        # Intent selection row
│   ├── FeedbackWidget.tsx     # Thumbs up/down (first 3 days)
│   └── Button.tsx             # Gold gradient primary button
└── types/
    └── index.ts               # TypeScript types
```

## Technical Notes

- Use `expo-font` to load Newsreader (serif) and Manrope (sans-serif)
- Store auth token via `expo-secure-store`
- Navigation: `@react-navigation/native-stack` for onboarding, `@react-navigation/bottom-tabs` for main app
- Onboarding state: check if profile has `onboarding_intents` set; if empty, show onboarding
- All data fetched from Supabase; no local state persistence needed for MVP
- Use the gold gradient (#F2CA50 → #D4AF37) on primary buttons via LinearGradient from expo-linear-gradient
