const fs = require('fs');

let enCards = JSON.parse(fs.readFileSync('./data/cards.en.json', 'utf8'));

// 1. Fix 'فقط' in rome-series-spectacle
const romeCard = enCards.find(c => c.id === 'rome-series-spectacle');
if (romeCard) {
  romeCard.mediaChanged = romeCard.mediaChanged.replace('فقط', 'only');
  console.log('Fixed rome-series-spectacle contamination.');
}

// 2. Remove duplicates
const idsToRemove = ['the-terror-arctic-tragedy-flagship', '1917-siper-savasi-flagship'];
const initialCount = enCards.length;
enCards = enCards.filter(c => !idsToRemove.includes(c.id));
console.log('Removed duplicates. Count from ' + initialCount + ' to ' + enCards.length);

fs.writeFileSync('./data/cards.en.json', JSON.stringify(enCards, null, 2));

// 3. Update i18n-config.ts
let config = fs.readFileSync('./lib/i18n-config.ts', 'utf8');
idsToRemove.forEach(id => {
  // Matches "id", with optional leading whitespace and optional trailing comma
  const regex = new RegExp(`\\s*"${id}",?`, 'g');
  config = config.replace(regex, '');
});

// Ensure the array ends cleanly if we removed the last item
config = config.replace(/,\s*\]/, '\n]');
fs.writeFileSync('./lib/i18n-config.ts', config);
console.log('Updated i18n-config.ts');
