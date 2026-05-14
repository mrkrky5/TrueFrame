const fs = require('fs');

const cards1_10 = JSON.parse(fs.readFileSync('./scratch/batch5_cards_1_10.json', 'utf8'));
const cards11_20 = JSON.parse(fs.readFileSync('./scratch/batch5_cards_11_20.json', 'utf8'));

const batch5Cards = [...cards1_10, ...cards11_20];
const batch5Ids = batch5Cards.map(c => c.id);

// 1. Update cards.en.json
let enCards = JSON.parse(fs.readFileSync('./data/cards.en.json', 'utf8'));
enCards = enCards.filter(c => !batch5Ids.includes(c.id));
enCards = [...enCards, ...batch5Cards];
fs.writeFileSync('./data/cards.en.json', JSON.stringify(enCards, null, 2));
console.log(`Enrolled ${batch5Cards.length} cards into cards.en.json. Total count: ${enCards.length}`);

// 2. Update cards.en.untranslated.json
let untranslatedCards = JSON.parse(fs.readFileSync('./data/quarantine/cards.en.untranslated.json', 'utf8'));
untranslatedCards = untranslatedCards.filter(c => !batch5Ids.includes(c.id));
fs.writeFileSync('./data/quarantine/cards.en.untranslated.json', JSON.stringify(untranslatedCards, null, 2));
console.log(`Removed enrolled cards from quarantine. Remaining: ${untranslatedCards.length}`);

// 3. Update lib/i18n-config.ts
let configText = fs.readFileSync('./lib/i18n-config.ts', 'utf8');
const activeIdsMatch = configText.match(/export const ENGLISH_ACTIVE_IDS = \[([\s\S]*?)\];/);

if (activeIdsMatch) {
  let existingIds = activeIdsMatch[1]
    .split(',')
    .map(id => id.trim().replace(/['"]/g, ''))
    .filter(id => id && !batch5Ids.includes(id));
  
  const updatedIds = [...existingIds, ...batch5Ids];
  const formattedIds = updatedIds.map(id => `  "${id}"`).join(',\n');
  
  const newConfigText = configText.replace(
    /export const ENGLISH_ACTIVE_IDS = \[[\s\S]*?\];/,
    `export const ENGLISH_ACTIVE_IDS = [\n${formattedIds}\n];`
  );
  
  fs.writeFileSync('./lib/i18n-config.ts', newConfigText);
  console.log(`Updated ENGLISH_ACTIVE_IDS in i18n-config.ts. Total active: ${updatedIds.length}`);
} else {
  console.error('Could not find ENGLISH_ACTIVE_IDS in i18n-config.ts');
}
