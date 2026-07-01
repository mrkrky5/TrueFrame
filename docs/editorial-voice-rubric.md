# Editorial voice rubric (TR)

Use this when rewriting card prose **outside Cursor**. Goal: human editorial tone — not longer text, not more headings for their own sake.

Gold reference in repo: `ac-odyssey-athens` (Renkli Atina).

Anti-reference: `tf26-067-seppuku`, `tf26-069-sekigahara` (template tone).

---

## What good sounds like

1. **Opens with something the player/viewer actually sees** in the named media.
2. **One clear tension** for the whole piece (not three generic themes).
3. **Concrete anchors**: a date, place, person, institution, or named source/exhibit.
4. **Fair to the media**: explain why it simplifies, without lecturing.
5. **Fields do different jobs** — do not repeat the same sentence in `realHistory`, `mediaChanged`, and `whyItMatters`.

## What to remove (AI tells)

- *Popüler anlatılar…*
- *Dizi/Oyun … hissettirir; gerçek tarih ise…*
- *Daha dengeli tarihsel okuma…*
- *Tarihsel ağırlık ise…*
- *Bu okuma, sahnenin kurduğu duyguyu bozmaz…*
- *…asıl merak, ekrandaki etkinin arkasında…*
- Pasting `misconception` or `whyInteresting` into `realHistory`
- Three paragraphs that all say “media simplifies, history is complex” with no new detail

## Paragraph recipe (realHistory)

Prefer 3–5 short paragraphs:

1. What the media shows (specific scene or design choice).
2. What historians/archaeology/sources show (named evidence).
3. Why the gap exists (production, modern taste, record survival — pick one).
4. Optional: why it still matters / how to read the media fairly.

No fixed word count. Stop when the tension is resolved.

## Field rules

| Field | Job |
|-------|-----|
| `whatWeSee` | 1–2 sentences, viewer POV, spoiler-safe |
| `realHistory` | Main essay; media ↔ history |
| `mediaChanged` | One sharp contrast sentence |
| `whyItMatters` | Why **today's reader** should care (not a repeat of mediaChanged) |
| `misconception` | One myth, plainly stated |
| `accuracyNote` | Calibrated verdict on the media |

## Hard limits

- Do **not** change: `id`, `sources`, URLs, `relatedCardIds`, enums, flags, `isFlagship`, `isPremium`.
- Do **not** invent facts or sources.
- Do **not** pad with filler to hit a word target.
- Keep `mediaTitle` franchise names as in the card (TR canonical for real titles).

## TR + EN workflow

1. **TR voice pass** → `docs/voice-pass/chunks/tr/` → batches in `docs/voice-pass/batches/tr/`
2. **EN voice pass** → `docs/voice-pass/chunks/en/` → batches in `docs/voice-pass/batches/en/` (see `docs/editorial-voice-rubric.en.md`)
3. Or: fix TR first, then run existing EN adaptation from updated TR (separate pipeline).

## External prompt skeleton

```
You are a Turkish editor for True Frame. Rewrite the localized prose fields only.
Follow docs/editorial-voice-rubric.md. Use ac-odyssey-athens as tone reference.
Return JSON: { "cards": [ { "id", "whatWeSee", "realHistory", ... } ] }
No markdown outside JSON.
```
