const fs = require('fs');
const path = require('path');

const cardsPath = path.join(__dirname, '../data/cards.json');
let cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));

const filler1 = "Bu konu üzerindeki tarihsel perspektif, sadece olayların bir listesi değil, o çağın insan ruhunu ve teknik imkanlarını anlama çabasıdır.";
const filler2 = "Günümüze ulaşan belgeler, geçmişin sanıldığı kadar basit olmadığını, aksine son derece sofistike bir sistemler bütünü olduğunu göstermektedir.";

let removedCount = 0;

cards = cards.map(card => {
  let changed = false;
  if (card.realHistory) {
    const original = card.realHistory;
    card.realHistory = card.realHistory.replace(filler1, "").replace(filler2, "").trim();
    if (original !== card.realHistory) changed = true;
  }
  if (changed) removedCount++;
  return card;
});

fs.writeFileSync(cardsPath, JSON.stringify(cards, null, 2), 'utf8');
console.log(`Cleaned filler from ${removedCount} cards.`);
