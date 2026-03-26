# TASK: Write First 50 Verse Interpretations for FieldSong

## Context

FieldSong is a daily clarity ritual app pairing Bhagavad Gita verses with Stoic parallels. Read `verses-100.json` for the curated verse database. You are writing the content that users will see each morning.

## Source Files

- `verses-100.json` — The 100 curated verses with intent tags, Stoic parallels, themes
- `sivananda-gita.txt` — Swami Sivananda's Gita translation (PUBLIC DOMAIN, use freely)
- `meditations-casaubon.txt` — Marcus Aurelius Meditations (PUBLIC DOMAIN)
- `epictetus-discourses.txt` — Epictetus Discourses (PUBLIC DOMAIN)
- `seneca-campbell-REFERENCE-ONLY.txt` — Seneca Letters (COPYRIGHTED, reference only for thematic understanding, DO NOT copy wording)

## What To Produce

### Output File: `content-50.json`

Write content for the first 50 verses (all 30 Priority A + the first 20 Priority B verses from verses-100.json).

For each verse, produce:

```json
{
  "verse_id": 13,
  "chapter": 2,
  "verse": 47,
  "sanskrit_line": "karmanye vadhikaraste ma phaleshu kadachana",
  "translation": "The Sivananda translation of this verse, copied exactly from sivananda-gita.txt",
  "in_plain_terms": "2-3 sentence modern interpretation...",
  "stoic_parallel_quote": "The actual Stoic quote from public domain source",
  "stoic_parallel_source": "Marcus Aurelius, Meditations, 6.2",
  "stoic_bridge": "1 sentence connecting the two traditions",
  "action_step": "1 concrete thing to try today",
  "reflection_prompt": "1 question for journaling"
}
```

## CRITICAL: Writing Style

This is the MOST IMPORTANT section. Read it three times.

### Voice

You're writing as a smart friend, not a teacher. Someone who's read widely, thinks clearly, and talks like a real person. Think: the guy at the dinner party who makes philosophy feel obvious and useful, never academic or lofty.

### Specific Rules

1. **NO EM DASHES.** Not a single one. Use periods, commas, or restructure the sentence. This is the #1 tell of AI writing.

2. **Short sentences mixed with longer ones.** Vary the rhythm. Some sentences are three words. Others build out an idea over a full line. Never let three long sentences stack up in a row.

3. **Be direct.** Don't "explore" or "delve into." Don't "invite reflection." Just say the thing.

4. **No filler words.** Cut "essentially," "fundamentally," "ultimately," "in essence," "it's worth noting," "interestingly," "importantly."

5. **No motivational poster language.** If it could be printed on a sunset mug, rewrite it. "Embrace your journey" is dead on arrival.

6. **Use "you" not "one."** "You already know what to do" not "One might consider..."

7. **Contractions.** "Don't" not "do not." "You're" not "you are." People talk this way.

8. **Concrete over abstract.** Instead of "practice detachment from outcomes," try "send the email and close the laptop. The reply isn't your problem."

9. **Slightly wry.** A little humor where it fits naturally. Not jokes. Just the occasional line that makes someone half-smile because it's unexpectedly honest.

10. **Never preachy, never devotional.** You're offering a perspective, not delivering truth. "This verse says X. The Stoics said something similar. Here's why that might matter today." Not "Krishna teaches us that we must..."

11. **No Sanskrit jargon without explanation.** If you reference dharma, explain it in the same sentence. Better yet, just use the English concept.

12. **Cultural respect without reverence.** Treat the Gita like a brilliant book, not a holy text. The way you'd talk about Marcus Aurelius' journal.

### Example of what GOOD content looks like:

**In plain terms:** "You only control what you do. You don't control what happens next. That sounds simple, but most of your anxiety comes from forgetting it. The job interview, the product launch, the difficult conversation... you can prepare and show up. The outcome? That's not yours to hold."

**Action step:** "Pick one thing you've been agonizing over today. Do the part that's yours. Then put it down."

**Reflection:** "What are you holding onto right now that was never yours to carry?"

### Example of what BAD content looks like:

**In plain terms:** "This profound verse invites us to explore the nature of attachment to outcomes. Krishna's timeless teaching reminds us that true fulfillment comes not from the fruits of our actions, but from the dedicated performance of our duty itself."

**Action step:** "Practice mindful detachment by setting an intention to release expectations about a current endeavor."

That second version is dead. Generic, safe, could be about anything. The first version lands because it's specific and sounds like a person said it.

## Translation Source

For each verse, look up the Sivananda translation in `sivananda-gita.txt` (search by chapter and verse number). Copy it exactly for the "translation" field. Sivananda's translations are clear and accessible.

The `sanskrit_line` should be the transliterated Sanskrit opening (first line or key phrase) from the verse.

## Stoic Quotes

For Marcus Aurelius and Epictetus quotes, find the actual passage in the public domain texts (meditations-casaubon.txt, epictetus-discourses.txt) and use that wording.

For Seneca quotes: use the quote as recorded in verses-100.json but note that these will need verification against a public domain Seneca source later. Mark any Seneca quotes with a note.

## Action Steps

Must be doable in under 60 seconds. Concrete, specific. Not "practice mindfulness" but "next time you reach for your phone, wait 10 seconds and notice what you were avoiding." Think of the smallest possible action that makes the verse real.

## Reflection Prompts

One question. Open-ended but specific enough to spark actual writing. Not "how does this make you feel?" but "what decision are you putting off because you're afraid of the answer?"
