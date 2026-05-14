const fs = require('fs');
const path = require('path');

const PILOT_IDS = [
  "oppenheimer-trinity",
  "chernobyl-disaster",
  "shogun-tokugawa-rise-real",
  "ac-origins-siwa",
  "gladiator-colosseum",
  "rdr2-frontier",
  "ghost-tsushima-invasion",
  "1917-siper-savasi-flagship",
  "the-terror-arctic-tragedy-flagship",
  "ac-mirage-baghdad"
];

const cardsEnPath = path.join(__dirname, 'data', 'cards.en.json');
const quarantinePath = path.join(__dirname, 'data', 'quarantine', 'cards.en.untranslated.json');

const cards = JSON.parse(fs.readFileSync(cardsEnPath, 'utf8'));

const activeCards = cards.filter(c => PILOT_IDS.includes(c.id));
const untranslatedCards = cards.filter(c => !PILOT_IDS.includes(c.id));

fs.writeFileSync(cardsEnPath, JSON.stringify(activeCards, null, 2), 'utf8');
fs.writeFileSync(quarantinePath, JSON.stringify(untranslatedCards, null, 2), 'utf8');

console.log(`Cleaned cards.en.json: ${activeCards.length} cards kept.`);
console.log(`Moved to quarantine: ${untranslatedCards.length} cards.`);
