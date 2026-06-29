# High-risk content review (diagnosis only)

Source: top 10 of `docs/content-quality-audit.json` → `highRiskShortlist`.
Scope: TR locale (all 10 top entries are TR). **No content was edited.** This is a manual verification of the mechanical audit against the real `data/cards.tr.json` text.

## Summary table

| id | locale | confirmedProblem | problemType | recommendedAction | rewritePriority |
|----|--------|------------------|-------------|-------------------|-----------------|
| total-war-three-kingdoms-warlords | tr | yes | cross-field duplication; repeated/broken wording; structure | rewrite from existing | P0 |
| medieval-japan-daily-life | tr | yes | cross-field duplication; repeated/broken wording; weak media-to-history connection | rewrite from existing | P0 |
| rome2-legions | tr | yes | shallow research (off-topic body); weak angle; repeated/broken wording | rebuild from fresh research brief | P0 |
| baghdad-daily-life-new | tr | yes | repeated/broken wording; structure; cross-field duplication | rewrite from existing | P0 |
| band-of-brothers-heroism | tr | yes | repeated/broken wording (truncated field); structure; cross-field duplication | rewrite from existing | P0 |
| last-kingdom-alfred-england | tr | partial | cross-field duplication; repeated/broken wording | rewrite from existing | P1 |
| gladiator-political-theater | tr | partial | cross-field duplication; repeated/broken wording | rewrite from existing | P1 |
| shogun-hostage-politics | tr | partial | cross-field duplication; repeated/broken wording | rewrite from existing | P1 |
| ac-odyssey-athens | tr | partial | cross-field duplication; repeated/broken wording; weak angle | small edit | P1 |
| tf26-018-provincial-life | tr | partial | repeated/broken wording (minor); low specificity | small edit | P1 |

---

## Per-entry notes

### 1. total-war-three-kingdoms-warlords — P0
- **riskScore:** 16.5 · **auditReasons:** adjacent-word-repeat(7); grammar-doubling(2); cross-field-dupe(1)
- **confirmedProblem:** yes
- **whatIsWrong:** `realHistory` ends with the same misconception sentence pasted **twice**, plus a mangled `quickRealityCheck` question dumped into the body. Grammar doubling: `"...savaşı olduğu olduğudur"`. `whyItMatters` is a verbatim copy of `whyInteresting` (the "Cao Cao deyince Cao Cao gelir" idiom), which doesn't belong in either slot and is a folk etymology. `mediaChanged` repeats itself (`"...yoğunlaştırır; total War: Three Kingdoms..."`).
- **editorBrief:** Angle = legitimacy (meşruiyet) over raw military power in the Three Kingdoms era. Keep the strong opening (Cao Cao/Liu Bei/Sun Quan, meritocracy vs aristocracy, Zhuge Liang as logistician not wizard — already in `accuracyNote`). Remove all duplicated tails; make `misconception` appear once; give `whyItMatters` a real "why it matters today" line. Drop the unverifiable idiom claim. Avoid the `"olduğu olduğudur"` template and the recycled `quickRealityCheck` question inside the body.

### 2. medieval-japan-daily-life — P0
- **riskScore:** 13.5 · **auditReasons:** cross-field-dupe(4); grammar-doubling(2); low-specificity
- **confirmedProblem:** yes
- **whatIsWrong:** `realHistory` body has `whyInteresting` + `misconception` pasted in, an off-topic "Sengoku dönemi oyunları..." sentence, the doubling `"...güçsüz olduğu olduğudur"` (twice), and a trailing dumped question. `mediaTitle` is generic ("Günlük Hayat") with `whatWeSee` a vague claim ("Medyada Japonya her zaman sadece savaşan samuraylar...") — weak media-to-history link.
- **editorBrief:** Angle = peasant economic power (rice as currency/`koku`, village autonomy, Ikkō-ikki revolts toppling samurai). Good specifics already exist (90% peasantry, temples as schools/banks). Tie to a concrete title (e.g. Shōgun) instead of "Günlük Hayat", or keep as a daily-life card but make `whatWeSee` specific. De-duplicate; one clean `misconception`. Avoid generic "medyada her zaman" openings and the doubling template.

### 3. rome2-legions — P0
- **riskScore:** 9.5 · **auditReasons:** grammar-doubling(2); cross-field-dupe(2); low-specificity
- **confirmedProblem:** yes
- **whatIsWrong:** Most serious: the **body is off-topic**. Title/`whatWeSee` promise "legions & military discipline", but `realHistory` after the first sentence drifts into generic Roman daily life (aqueducts, `insula`, bakeries, slaves) — content apparently pasted from a daily-life card. Plus the usual doubling `"...üstün olduğu olduğudur"` ×2 and a dumped question. `whyItMatters` duplicates `whyInteresting`.
- **editorBrief:** Rebuild the body on the actual topic: Marian reforms, the centurion system, drill/`disciplina`, marching-camp engineering, the testudo, logistics, winning while outnumbered. The one strong seed sentence (Marian professionalization) and `whyInteresting` (legionary as engineer) should anchor it. Remove all daily-life filler. Avoid copying generic "Antik Akdeniz dünyası..." paragraphs across cards.

### 4. baghdad-daily-life-new — P0
- **riskScore:** 9.5 · **auditReasons:** grammar-doubling(2); cross-field-dupe(2); low-specificity
- **confirmedProblem:** yes
- **whatIsWrong:** `quickRealityCheck` starts with a stray `"Gerçek."` token. `realHistory` contains a broken fragment beginning mid-phrase `"yüzyıl Bağdat'ını işleyen yapımlar..."` (missing "9."), the doubling `"...çöl kasabası olduğu olduğudur"` ×2, and a dumped question. Otherwise the factual core (House of Wisdom, bimaristans, paper, canals) is solid.
- **editorBrief:** Angle = 9th-c. Baghdad as the world's most advanced metropolis (sanitation, paper, hospitals, Round City plan). Keep the strong specifics. Fix `quickRealityCheck` to a clean question; repair the truncated "9. yüzyıl" fragments; remove doubling and the dumped question. Avoid the `"Gerçek."` prefix artifact.

### 5. band-of-brothers-heroism — P0
- **riskScore:** 9.5 · **auditReasons:** grammar-doubling(2); cross-field-dupe(2); repeated-sentence(1)
- **confirmedProblem:** yes
- **whatIsWrong:** `quickRealityCheck` is **truncated**: `"Band of Brothers ve II."` (cuts off mid-sentence) — visibly broken in a primary field. `realHistory` tail has `whyInteresting` pasted in, the doubling `"...macera dolu olduğu olduğudur"` ×2, and a meta filler sentence. `mediaChanged` duplicated twice.
- **editorBrief:** Angle = the gap between heroism myth and combat psychology (combat fatigue/PTSD, primary-group loyalty, the "silent generation"). Strong factual base already present. Rewrite `quickRealityCheck` as a complete question; de-duplicate body and `mediaChanged`; remove doubling. Avoid the "%90 bekleyiş, %10 dehşet" line being both `misconception` and body tail.

### 6. last-kingdom-alfred-england — P1
- **riskScore:** 11 · **auditReasons:** cross-field-dupe(3); grammar-doubling(2); repeated-sentence(1)
- **confirmedProblem:** partial (research is strong; defects are mechanical)
- **whatIsWrong:** Accurate, specific body (Edington 878, Burh system, Heptarchy, Asser). But `whyInteresting`'s three short facts are pasted into `realHistory`, followed by `"...tek bir krallık olduğu olduğudur"` ×2 and a template meta sentence. `whyItMatters` is an ungrammatical splice: `"Bu başlık, o dönemde okuma-yazma bilen nadir hükümdarlardan biridir fikrini..."`. `mediaChanged` duplicated.
- **editorBrief:** Keep the body as-is in substance; just remove the pasted tail and de-duplicate. Rewrite `whyItMatters` as a proper sentence about why Alfred's unification idea matters. Avoid the `"Bu başlık, [fact] fikrini medya anlatısından ayrı okumayı sağlar"` template.

### 7. gladiator-political-theater — P1
- **riskScore:** 9.5 · **auditReasons:** cross-field-dupe(2); repeated-sentence(1); grammar-doubling(1)
- **confirmedProblem:** partial (strong body + excellent `accuracyNote`)
- **whatIsWrong:** Body is good (munera as political theater, panem et circenses, thumb-gesture correction, Commodus death). Defects: `whyInteresting` (gladiator blood as cosmetic) pasted into body tail + `"...öldürmek üzerine kurulu olduğu olduğudur"` doubling; `whyItMatters` mangled splice (`"Bu başlık, romalı kadınlar... inanırlardı fikrini..."`); `mediaChanged` duplicated twice.
- **editorBrief:** Keep substance. De-duplicate the body tail, fix `whyItMatters` into a coherent sentence, collapse the doubled `mediaChanged`. Avoid pasting the cosmetic-blood trivia verbatim into multiple fields.

### 8. shogun-hostage-politics — P1
- **riskScore:** 9.5 · **auditReasons:** cross-field-dupe(2); repeated-sentence(1); grammar-doubling(1)
- **confirmedProblem:** partial (rich, accurate body + strong `accuracyNote`)
- **whatIsWrong:** Strong content (hostage system, Tokugawa Ieyasu's hostage youth, "saving face" diplomacy). Defects: `whyInteresting` pasted into body tail + `"...vahşet olduğu olduğudur"` doubling; `whyItMatters` mangled splice; `mediaChanged` duplicated twice.
- **editorBrief:** Keep substance. Remove pasted tail + doubling, rewrite `whyItMatters` properly, de-duplicate `mediaChanged`. Avoid the recycled "sahne diliyle konuyu yoğunlaştırır" boilerplate twice.

### 9. ac-odyssey-athens — P1
- **riskScore:** 8.5 · **auditReasons:** cross-field-dupe(3); grammar-doubling(2)
- **confirmedProblem:** partial (high-quality core narrative)
- **whatIsWrong:** Excellent polychromy explanation, but two **off-topic** sentences about Ostracism (from `whyInteresting`) are spliced into the middle of the statue-color narrative, breaking coherence; body ends with `"...sade beyaz olduğu olduğudur"` doubling. `whyItMatters` = "Atina demokrasisinde 'Ostracism'..." which is off the card's actual angle (statue color).
- **editorBrief:** Small edit: remove the Ostracism sentences from `realHistory` (or move to a dedicated card), fix the doubling ending, and set `whyItMatters` to relate to polychromy/perception of antiquity. Keep the Met "Chroma" sources (verified).

### 10. tf26-018-provincial-life — P1
- **riskScore:** 9 · **auditReasons:** grammar-doubling(2); low-specificity; cross-field-dupe(1)
- **confirmedProblem:** partial (genuinely good, well-structured body; 3 verified sources)
- **whatIsWrong:** The `realHistory` is the cleanest of the ten — coherent, multi-paragraph, accurate. Problems are confined to short fields: `whyInteresting` and `whyItMatters` are identical and contain the doubling `"...Kolezyum çevresi çevresindeki"`; `subtitle` is a fragment ("...sadece dekor değil"). Low-specificity flag reflects its deliberately thematic (not date-heavy) style — partly a soft signal.
- **editorBrief:** Small edit only: fix the `"çevresi çevresindeki"` doubling, differentiate `whyInteresting` vs `whyItMatters`, complete the `subtitle`. No research work needed. Treat low-specificity here as acceptable (thematic daily-life card).

---

## Outcome

- **Confirmed real problems:** 10 / 10 (5 `yes`, 5 `partial`). All flags corresponded to genuine text defects.
- **False positives:** 0. (Closest to benign: `tf26-018-provincial-life`, whose body is strong; only short fields and a soft low-specificity signal flagged it.)
- **P0 (fix before next release):** total-war-three-kingdoms-warlords, medieval-japan-daily-life, rome2-legions, baghdad-daily-life-new, band-of-brothers-heroism.
- **P1 (should fix, lower urgency):** last-kingdom-alfred-england, gladiator-political-theater, shogun-hostage-politics, ac-odyssey-athens, tf26-018-provincial-life.

### Cross-cutting pattern (applies to most of the corpus, not just these 10)
A single bulk-generation template caused: (a) `"...olduğu olduğudur"` grammar doubling, (b) `whyInteresting`/`misconception` pasted verbatim into the end of `realHistory`, (c) `quickRealityCheck` questions dumped into the body, (d) `whyItMatters` built from an ungrammatical `"Bu başlık, [fact] fikrini medya anlatısından ayrı okumayı sağlar"` splice, (e) `mediaChanged` duplicated twice. A targeted cleanup of these five mechanical patterns would resolve the bulk of the cross-field/grammar flags catalog-wide; `rome2-legions` (off-topic body) and `band-of-brothers` (truncated field) need individual attention beyond the template fix.
