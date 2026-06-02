# Manual source URL review

Automated checks fixed obvious `http://` → `https://` issues in `data/cards.en.json`.  
The following still need **manual browser verification** (do not change URLs without confirming the page loads and matches the citation).

| Card ID | Note |
|---------|------|
| *(none flagged as broken in this pass)* | Re-run `node scripts/audit-content.mjs` after content edits |

**How to verify:** Open each source link from a card in the app → confirm 200 OK, correct institution, and that the title still matches the page.

**Audit note:** `audit-content.mjs` reports many TR flagships as “without contentBlocks” because blocks are derived at runtime via `deriveCardBlocks()` — not a runtime bug.
