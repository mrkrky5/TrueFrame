const fs = require('fs');
const path = require('path');

const chunk1 = JSON.parse(fs.readFileSync('./scratch/batch3_chunk1.json', 'utf8'));
const chunk2 = JSON.parse(fs.readFileSync('./scratch/batch3_chunk2.json', 'utf8'));
const chunk3 = JSON.parse(fs.readFileSync('./scratch/batch3_chunk3.json', 'utf8'));
const newCards = [...chunk1, ...chunk2, ...chunk3];
const newIds = newCards.map(c => c.id);

// 1. Update cards.en.json
const currentEnCards = JSON.parse(fs.readFileSync('./data/cards.en.json', 'utf8'));
const updatedEnCards = [...currentEnCards, ...newCards];
fs.writeFileSync('./data/cards.en.json', JSON.stringify(updatedEnCards, null, 2));

// 2. Update quarantine
const quarantine = JSON.parse(fs.readFileSync('./data/quarantine/cards.en.untranslated.json', 'utf8'));
const updatedQuarantine = quarantine.filter(c => !newIds.includes(c.id));
fs.writeFileSync('./data/quarantine/cards.en.untranslated.json', JSON.stringify(updatedQuarantine, null, 2));

// 3. Update i18n-config.ts
let config = fs.readFileSync('./lib/i18n-config.ts', 'utf8');
const activeIdsMatch = config.match(/export const ENGLISH_ACTIVE_IDS = \[([\s\S]*?)\];/);
if (activeIdsMatch) {
  const currentIdsContent = activeIdsMatch[1];
  // Clean up current content to avoid trailing comma issues
  let currentIdsArray = currentIdsContent
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => s.replace(/\"/g, ''));
    
  const updatedIdsArray = [...currentIdsArray, ...newIds];
  const updatedIdsText = '\n' + updatedIdsArray.map(id => `  "${id}"`).join(',\n') + '\n';
  
  const newConfig = config.replace(/export const ENGLISH_ACTIVE_IDS = \[[\s\S]*?\];/, `export const ENGLISH_ACTIVE_IDS = [${updatedIdsText}];`);
  fs.writeFileSync('./lib/i18n-config.ts', newConfig);
}

console.log(`Successfully enrolled ${newIds.length} cards.`);
console.log('New IDs:', newIds);
