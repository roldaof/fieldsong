# TASK: Phase 2 — Verify Seneca Quotes + Write Remaining 50 Interpretations

## Two jobs in this phase:

### Job 1: Verify and fix Seneca quotes in content-50.json

14 verses in content-50.json have `stoic_quote_note` flagging Seneca quotes as pending verification. For each:

1. Search `seneca-letters-public-domain.txt` for the referenced passage
2. If found: replace `stoic_parallel_quote` with the exact public domain wording, clear the note
3. If NOT found (the quote is from Seneca's essays/tragedies, not his Letters): note this. The Letters cover most Moral Letters references. For quotes from On Providence, On the Brevity of Life, On Anger, On Tranquility, Oedipus, Thyestes, Hercules Oetaeus, and On the Happy Life, these are separate works. Flag them clearly as "source: [work name], not in available public domain texts, needs manual verification" but keep the quote as-is for now.

Also check the remaining 13 Seneca quotes in verses-100.json (verses 22, 29, 42, 48, 50, 53, 81, 83, 85, 90, 91) since these will be needed for the remaining 50 content pieces.

Save the updated file as `content-50-verified.json`.

### Job 2: Write remaining 50 interpretations

Write content for verses 51-100 from verses-100.json (the remaining Priority B and all Priority C verses).

Follow EXACTLY the same style guide from CONTENT-TASK.md. Read it again before writing.

CRITICAL REMINDERS:
- NO EM DASHES. Not a single one.
- Sound human. Short sentences. Contractions. Concrete.
- Never preachy. Friend at a dinner party.
- Use Sivananda translations from sivananda-gita.txt
- Use public domain Stoic texts for Marcus Aurelius and Epictetus quotes
- For Seneca: use seneca-letters-public-domain.txt where possible, flag others

Save as `content-51-100.json` with the same schema as content-50.json.

## Source files
- content-50.json (the first 50, for reference on quality and style)
- verses-100.json (full verse database)
- CONTENT-TASK.md (style guide, read again)
- sivananda-gita.txt (Gita translations)
- meditations-casaubon.txt (Marcus Aurelius)
- epictetus-discourses.txt (Epictetus)
- seneca-letters-public-domain.txt (Seneca Letters, CC0 public domain)
