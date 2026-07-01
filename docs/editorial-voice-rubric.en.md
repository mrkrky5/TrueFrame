# Editorial voice rubric (EN)

Use when rewriting card prose **outside Cursor**. Goal: native English editorial tone — not longer text, not padding.

Gold reference: `ac-odyssey-athens` (Colorful Athens) in `data/cards.en.json`.

---

## What good sounds like

1. Opens with what the player/viewer **actually sees** in the named media.
2. **One clear tension** for the whole piece.
3. **Concrete anchors**: date, place, person, institution, or named source/exhibit.
4. **Fair to the media** — explains simplification without lecturing.
5. **Fields do different jobs** — no echo between `realHistory`, `mediaChanged`, `whyItMatters`.

## Remove (AI tells)

- *Popular narratives…*
- *The series/show makes you feel…; history shows…*
- *A more balanced historical reading…*
- *The historical weight lies in…*
- *The screen version chooses sharp images…*
- *history teaches us…*
- Pasting `misconception` into `realHistory`
- Three paragraphs that only say “media simplifies, history is complex”

## Paragraph recipe (`realHistory`)

3–5 short paragraphs: media image → evidence → why the gap exists → optional why it matters today.

No fixed word count.

## Hard limits

- Do **not** change: `id`, `sources`, URLs, `relatedCardIds`, enums, flags.
- Do **not** invent facts.
- English-native prose — not a literal translation of the Turkish card.
- Keep real franchise `mediaTitle` names as in the card.

## After TR voice pass

If Turkish was already rewritten, use updated TR as **meaning source** but write fresh English sentences (same workflow as EN adaptation batches).

## External prompt skeleton

```
You are an English editor for True Frame. Rewrite localized prose fields only.
Follow docs/editorial-voice-rubric.en.md. Tone reference: ac-odyssey-athens.
Return JSON: { "cards": [ { "id", "whatWeSee", "realHistory", ... } ] }
```
