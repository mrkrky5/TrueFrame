const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/cards.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const replacements = {
  "shgun": "shogun",
  "sava": "savas",
  "orta-a": "orta-cag",
  "valyelik": "sovalyelik",
  "sovyetler-birlii": "sovyetler-birligi",
  "hal-seferleri": "hacli-seferleri",
  "orta-dou": "orta-dogu",
  "elence": "eglence",
  "valilik": "sovalyelik" // Assuming valyelik was meant to be sovalyelik
};

let fixCount = 0;

data.forEach(card => {
  if (card.tags) {
    card.tags = card.tags.map(tag => {
      const lowerTag = tag.toLowerCase();
      if (replacements[lowerTag]) {
        fixCount++;
        return replacements[lowerTag];
      }
      return tag;
    });
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Fixed ${fixCount} tags in cards.json`);
