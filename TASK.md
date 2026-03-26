# TASK: Curate 100 Gita Verses + Stoic Parallels for FieldSong

## Context

FieldSong (formerly GitaWise) is a daily clarity ritual app that pairs Bhagavad Gita verses with Stoic philosophy parallels. The target audience is Western mindfulness/yoga practitioners (28-50, "spiritual but not religious") who want practical ancient wisdom, not religious instruction.

## Source Materials

Two extracted text files are available in this directory:
- `gita-full.txt` — Nicholas Sutton's Bhagavad Gita translation (294 pages). USE FOR RESEARCH/SELECTION ONLY — this is copyrighted. Do NOT copy his interpretations.
- `stoic-full.txt` — Ryan Holiday's The Daily Stoic (423 pages). USE FOR RESEARCH/THEMATIC MAPPING ONLY — this is copyrighted. Do NOT copy his commentary.

## What To Produce

### Output File: `verses-100.json`

A JSON array of 100 curated verse objects:

```json
[
  {
    "id": 1,
    "chapter": 2,
    "verse": 47,
    "sanskrit_key": "karmanye vadhikaraste...",
    "why_selected": "One of the most universally applicable verses — speaks directly to attachment to outcomes, relevant to any modern decision-maker",
    "intent_tags": ["discipline", "acceptance"],
    "themes": ["detachment from outcomes", "duty", "action without anxiety"],
    "stoic_parallel": {
      "quote": "...",
      "source": "Marcus Aurelius, Meditations, Book 6.2",
      "theme_bridge": "Both traditions teach that virtue lies in the action itself, not in what follows"
    },
    "season_context": "Useful when facing a big decision or launch — the anxiety of 'will it work?' vs. 'am I doing the right thing?'",
    "priority": "A"
  }
]
```

### Field Definitions

- **id**: Sequential 1-100
- **chapter/verse**: Gita chapter and verse number
- **sanskrit_key**: First few words of the Sanskrit (for identification/texture, from the Sutton text)
- **why_selected**: 1-2 sentences on why this verse matters for modern clarity-seekers. This is YOUR editorial judgment.
- **intent_tags**: Array from: `["clarity", "courage", "patience", "acceptance", "discipline", "perspective"]`
- **themes**: 2-4 specific theme tags (freeform but consistent)
- **stoic_parallel**: An actual Stoic quote that resonates with the same theme. Must include:
  - `quote`: The Stoic quote (this should be from the ORIGINAL Stoic authors — Marcus Aurelius, Seneca, Epictetus — NOT Ryan Holiday's commentary)
  - `source`: Precise attribution (author, work, book/letter number)
  - `theme_bridge`: 1 sentence connecting the Gita verse to the Stoic quote
- **season_context**: When this verse is most useful (e.g., "during career transitions", "when grieving", "when facing imposter syndrome")
- **priority**: "A" (top 30 — first month of any user's experience), "B" (next 30), "C" (remaining 40)

### Selection Criteria

**Include verses that:**
- Address universal human challenges (duty, fear, purpose, attachment, grief, action, identity)
- Can be interpreted practically for modern life without theological framework
- Would resonate with someone who reads Ryan Holiday or listens to Huberman
- Have clear Stoic parallels (not forced — genuine philosophical overlap)
- Cover all 6 intent categories roughly equally

**Exclude verses that:**
- Are primarily theological/ritualistic (specific worship instructions, deity descriptions)
- Require deep Hindu cosmological knowledge to understand
- Are purely metaphysical with no practical application
- Would feel preachy or dogmatic to a secular Western reader

**Distribution targets:**
- Chapters 1-6: ~40 verses (most practical/philosophical content)
- Chapters 7-12: ~30 verses (devotional but selectively applicable)
- Chapters 13-18: ~30 verses (synthesis, applicable)
- Intent coverage: ~15-18 verses per intent category
- Priority A: 30 verses, B: 30 verses, C: 40 verses

### Stoic Parallel Guidelines

- Use ORIGINAL Stoic quotes from Marcus Aurelius (Meditations), Seneca (Letters, On the Shortness of Life, On Anger, etc.), Epictetus (Discerta, Enchiridion)
- Use the thematic connections in The Daily Stoic as INSPIRATION for finding parallels, but write your own theme_bridge
- The Stoic quote should genuinely echo the Gita verse's core message — don't force connections
- Variety: don't over-rely on Marcus Aurelius. Mix all three Stoics roughly equally.

### Also Produce: `verses-100-summary.md`

A markdown summary with:
- Overview stats (verses per chapter, per intent, per priority)
- The 30 Priority A verses listed with brief rationale
- Any notes on selection decisions or gaps

## Important

- Read BOTH source texts thoroughly before selecting
- The Sutton Gita text will have verse numbers clearly marked — reference these
- The Daily Stoic will help you understand which Stoic themes map to which life situations — use this thematic understanding, not the actual text
- Quality over speed — this curation IS the product
