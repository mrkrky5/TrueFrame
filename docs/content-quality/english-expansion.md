# English Expansion Model: Batch Enrollment

This document defines the process and quality standards for moving content from the Turkish catalog to the active English library.

## 1. The Content Boundary
We use a **Strict Enrollment** model. No card should be visible in the English UI unless it has been explicitly whitelisted and verified.

- **Storage**: All untranslated English placeholders are stored in `data/quarantine/cards.en.untranslated.json`.
- **Runtime**: Only `data/cards.en.json` is loaded for the English locale.
- **Whitelist**: `lib/i18n-config.ts` maintains `ENGLISH_ACTIVE_IDS`.

## 2. Expansion Rule: 5-Point QA Check
A card can ONLY be moved from quarantine to `cards.en.json` and whitelisted after passing:

1. **English Editorial Quality Check**:
   - Natural flow (no direct/literal translation from Turkish).
   - Simple but concrete language.
   - Preserves the premium "archival" tone.
2. **No Turkish Contamination Check**:
   - Must pass `npm run validate:en-content`.
   - No Turkish special characters (ı, ğ, ş, etc.) or stopwords (ve, bir, için, etc.).
3. **Source/Reference Check**:
   - At least one English-language citation (e.g., Britannica, Museum archives).
   - Source labels and types must be localized.
4. **UI/Routing Check**:
   - Verify card detail renders correctly at `/en/card/[id]`.
   - Verify image alt texts and media titles are translated.
5. **Dossier/Discovery Check**:
   - Verify the card appears correctly in the English "Explore" categories and its respective "Media Dossier".

## 3. How to Expand
1. Select a card from `data/quarantine/cards.en.untranslated.json`.
2. Perform full editorial translation.
3. Move the completed object to `data/cards.en.json`.
4. Add the ID to `ENGLISH_ACTIVE_IDS` in `lib/i18n-config.ts`.
5. Run `npm run validate:en-content`.
6. Deploy and verify.
