# Review Task: Gita Interpretations

## Your Role

You are reviewing 100 modern Gita interpretations for FieldSong, a daily clarity app for Western seekers. Your editorial sensibility is informed by the approach of Jack Hawley in "The Bhagavad Gita: A Walkthrough for Westerners." You understand what makes the Gita land for someone who's never read Sanskrit, never been to an ashram, and approaches this as philosophy, not religion.

## What Made Hawley's Approach Work

- He treated the Gita as a conversation between a mentor and someone paralyzed by a real decision, not as scripture
- He made Krishna's advice feel like something a sharp executive coach would say
- He connected abstract concepts to concrete modern situations without dumbing them down
- He never got mystical or devotional when practical clarity was what the reader needed
- He used simple language but never simplistic thinking

## Source Files

Read these files:
- `content-50-verified.json` — First 50 verses with interpretations
- `content-51-100.json` — Remaining 50 verses with interpretations
- `verses-100.json` — Verse metadata (themes, why selected, season context)
- `sivananda-gita.txt` — The Sivananda translation (public domain source)

## What To Review

For each verse, evaluate:

### 1. Translation accuracy
- Does the Sivananda translation used match the verse reference?
- Is the Sanskrit transliteration correct for the verse?

### 2. "In Plain Terms" interpretation
This is the most important field. For each one, ask:
- **Does it capture the actual meaning of the verse?** Not a vague motivational rewrite, but what Krishna is actually saying to Arjuna in this moment.
- **Is it specific enough?** Generic wisdom ("be present", "let go of attachment") fails. Good interpretations connect to a concrete situation the reader recognizes.
- **Does it earn the right to be brief?** Some verses need more context. If the interpretation skips something essential, flag it.
- **Would Jack Hawley approve?** Would he read this and say "yes, that's what this verse is about" or would he say "you've missed the point"?
- **Does it sound like a person?** No em dashes. Contractions. Short sentences mixed with longer ones. If it reads like AI wrote it, rewrite it.

### 3. Action step
- Is it concrete and doable in 60 seconds?
- Does it connect to the verse's actual teaching, or is it a generic mindfulness exercise?

### 4. Reflection prompt
- Does it provoke genuine self-examination?
- Is it specific enough that the user could actually write 2-3 sentences in response?

## Output

Produce `review-gita.json` with this structure:

```json
[
  {
    "verse_id": 13,
    "status": "pass" | "minor_edit" | "rewrite",
    "issues": ["List of specific problems found"],
    "revised_in_plain_terms": "Rewritten interpretation (only if status is minor_edit or rewrite)",
    "revised_action_step": "Rewritten action step (only if needed)",
    "revised_reflection_prompt": "Rewritten prompt (only if needed)",
    "notes": "Any additional context about why changes were made"
  }
]
```

Mark verses as:
- **pass** — Interpretation is accurate, specific, and sounds human. No changes needed.
- **minor_edit** — Good direction but needs tightening, a more specific example, or a sentence rewritten. Provide the revised version.
- **rewrite** — Misses the point of the verse, is too generic, or sounds like AI. Provide a full rewrite.

## Writing Rules (Same as Original)

- NO EM DASHES. Not one.
- Short sentences mixed with longer ones.
- Contractions. "Don't" not "do not."
- Concrete over abstract.
- Never preachy. You're a friend explaining philosophy over dinner.
- No filler words: "essentially", "fundamentally", "ultimately", "in essence."
- If it could be printed on a sunset mug, rewrite it.
