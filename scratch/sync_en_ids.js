const fs = require('fs');
const en = JSON.parse(fs.readFileSync('data/cards.en.json', 'utf8'));

const mapping = {
  "oppenheimer-hearing-1954": "oppenheimer-gray-board-1954-real",
  "oppenheimer-downwinders": "oppenheimer-rad-downwinders",
  "mafia-rico-law": "mafia-rico-law-impact-real",
  "mafia-immigration": "mafia-immigration-crime",
  "rome-collapse-attila": "total-war-attila-collapse",
  "constantinople-1453": "constantinople-fall-turning-new",
  "mesopotamia-banking": "mesopotamian-markets-new",
  "mongol-yam-system": "aoe4-mongol-logistics",
  "medieval-castles-power": "aoe2-castles-politics",
  "medieval-justice-kcd": "kcd2-medieval-law",
  "last-emperor-eunuchs": "last-emperor-forbidden-city-eunuchs-real",
  "crown-empire-transition": "crown-commonwealth-empire",
  "last-samurai-satsuma": "last-samurai-rebellion",
  "chernobyl-pripyat-evacuation-real": "chernobyl-pripyat-delay"
};

en.forEach(card => {
  if (mapping[card.id]) {
    card.id = mapping[card.id];
  }
});

fs.writeFileSync('data/cards.en.json', JSON.stringify(en, null, 2));
console.log('Synchronized 14 card IDs in cards.en.json');
