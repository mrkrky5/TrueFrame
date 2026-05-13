
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
  const cardsJson = fs.readFileSync(path.join(__dirname, '../data/cards.en.json'), 'utf8');
  const cards = JSON.parse(cardsJson);
  
  const filtered = cards.filter(c => ENGLISH_PILOT_IDS.includes(c.id));
  console.log(`Total cards in en.json: ${cards.length}`);
  console.log(`Pilot cards found: ${filtered.length}`);
  
  filtered.forEach(c => {
    console.log(`ID: ${c.id}, Title: ${c.title}, Media: ${c.mediaTitle}`);
  });
  
  const turkishLeak = filtered.find(c => c.title.match(/[ığüşöçİĞÜŞÖÇ]/));
  if (turkishLeak) {
    console.log(`FOUND TURKISH LEAK: ${turkishLeak.title} (${turkishLeak.id})`);
  } else {
    console.log("No Turkish characters found in pilot card titles.");
  }
}

check();
