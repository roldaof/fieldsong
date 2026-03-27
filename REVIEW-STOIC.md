# Review Task: Stoic Parallels

## Your Role

You are reviewing 100 Stoic parallel pairings for FieldSong, a daily clarity app that bridges the Bhagavad Gita with Stoic philosophy. Your editorial sensibility is informed by the approach of Ryan Holiday and Stephen Hanselman in "The Daily Stoic." You understand what makes a Stoic quote land for a modern reader and, critically, what makes a cross-tradition pairing feel genuine rather than forced.

## What Made The Daily Stoic Work

- Every entry started with a real Stoic quote, properly attributed, then made it immediate and practical
- The commentary never explained the obvious. It connected the ancient insight to something the reader is dealing with right now.
- Holiday never forced a connection. If a quote was about death, the commentary was about death, not awkwardly bent into being about productivity.
- The writing was direct, slightly provocative, and never academic.
- He treated Stoicism as a living practice, not a historical curiosity.

## Source Files

Read these files:
- `content-50-verified.json` — First 50 verses with Stoic parallels
- `content-51-100.json` — Remaining 50 verses
- `verses-100.json` — Verse metadata including original Stoic quote selection
- `meditations-casaubon.txt` — Marcus Aurelius, public domain
- `epictetus-discourses.txt` — Epictetus, public domain
- `seneca-letters-public-domain.txt` — Seneca Letters, public domain

## What To Review

For each verse, evaluate:

### 1. Stoic quote selection
- **Is this a genuine quote from the attributed source?** Cross-check against the public domain texts where possible.
- **Is the attribution precise?** "Marcus Aurelius, Meditations, 6.2" is good. "Marcus Aurelius" alone is not.
- **Is it the BEST quote for this pairing?** Sometimes a different Stoic passage would create a stronger resonance with the Gita verse. If you can find a better match in the source texts, suggest it.

### 2. The pairing itself
- **Is the connection genuine?** Both traditions must actually be saying something similar. If you have to squint to see the parallel, it's forced.
- **Are we avoiding the obvious?** "Both say be calm" is lazy. What specifically do both traditions reveal about the same human problem?
- **Does the Gita verse and the Stoic quote illuminate each other?** The best pairings make you understand both traditions better. The worst feel like two random quotes stapled together.

### 3. The bridge sentence
- **Does it articulate the specific point of convergence?** Not "both traditions teach wisdom" but "both locate the measure of a life in the quality of engagement, not in the results."
- **Is it one sentence?** It should be tight.
- **Does it sound like a person wrote it?** No em dashes. No academic tone.

### 4. Quote verification status
- For quotes flagged with `stoic_quote_note` as needing verification, check if you can find the passage in the available public domain texts.
- For Seneca Moral Letters quotes, search `seneca-letters-public-domain.txt`.
- For Marcus Aurelius, search `meditations-casaubon.txt`.
- For Epictetus Discourses, search `epictetus-discourses.txt`.
- Note: Epictetus Enchiridion and Seneca's essays/tragedies are NOT in our source files. Flag these but don't reject them.

## Output

Produce `review-stoic.json` with this structure:

```json
[
  {
    "verse_id": 13,
    "status": "pass" | "minor_edit" | "rewrite" | "replace_quote",
    "issues": ["List of specific problems found"],
    "revised_stoic_quote": "Better quote if replacing",
    "revised_stoic_source": "Precise attribution",
    "revised_stoic_bridge": "Rewritten bridge sentence",
    "quote_verified": true | false,
    "verification_note": "Found in meditations-casaubon.txt Book 6" or "Not in available sources",
    "notes": "Why this change improves the pairing"
  }
]
```

Mark verses as:
- **pass** — Quote is genuine, pairing is strong, bridge is clear. No changes.
- **minor_edit** — Bridge sentence needs tightening or the attribution needs precision. Provide revised version.
- **rewrite** — Bridge misses the point of convergence. Provide rewritten bridge.
- **replace_quote** — A different Stoic quote would create a much stronger parallel. Provide the replacement with source and new bridge.

## Writing Rules

- NO EM DASHES.
- Bridge sentences: one sentence, tight, specific.
- Never academic. "Both traditions teach..." is fine as a starter but the content must be concrete.
- The reader should finish the Stoic parallel thinking "huh, they really were saying the same thing 2000 years apart."
