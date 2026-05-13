
const ENGLISH_PILOT_IDS = [
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

async function check() {
  const fs = require('fs');
  const path = require('path');
  const cards = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cards.en.json'), 'utf8'));
  
  const pilotCards = cards.filter(c => ENGLISH_PILOT_IDS.includes(c.id));
  
  const textFields = [
    'title', 'subtitle', 'mediaTitle', 'quickRealityCheck', 'mediaChanged', 
    'realHistory', 'whyItMatters', 'accuracyNote', 'whyInteresting', 
    'misconception', 'reviewerNote', 'whatWeSee', 'historicalBackground'
  ];
  
  pilotCards.forEach(c => {
    console.log(`--- CARD: ${c.id} ---`);
    textFields.forEach(field => {
      if (c[field]) {
        const text = c[field];
        if (text.match(/[ığüşöçİĞÜŞÖÇ]/)) {
          console.log(`[TURKISH FOUND in ${field}]: ${text.substring(0, 100)}...`);
        }
      }
    });
    if (c.themes) {
      c.themes.forEach(t => {
        if (t.match(/[ığüşöçİĞÜŞÖÇ]/)) console.log(`[TURKISH FOUND in themes]: ${t}`);
      });
    }
    if (c.tags) {
      c.tags.forEach(t => {
        if (t.match(/[ığüşöçİĞÜŞÖÇ]/)) console.log(`[TURKISH FOUND in tags]: ${t}`);
      });
    }
  });
}

check();
