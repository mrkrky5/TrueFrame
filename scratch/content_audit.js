const fs = require('fs');
const path = require('path');

const cardsData = JSON.parse(fs.readFileSync('data/cards.json', 'utf8'));

const totalCards = cardsData.length;
const flagshipCards = cardsData.filter(c => c.isFlagship);
const standardCards = cardsData.filter(c => !c.isFlagship);

// Dossier Analysis
const EXCLUDED_TITLES = [
  "Günlük Hayat",
  "Tarihi Yanılgı",
  "Popüler Kültür Yanılgıları",
  "Büyük Değişim",
  "Büyük Dönüşüm",
  "Modern Tarih",
  "Atmosfer",
  "Turning Points",
  "Unknown",
  "Genel",
  "Diğer"
];

const NORMALIZATION_MAP = {
  "Assassin’s Creed Mirage": "Assassin's Creed",
  "Assassin’s Creed Valhalla": "Assassin's Creed",
  "Assassin's Creed Origins": "Assassin's Creed",
  "Assassin's Creed Odyssey": "Assassin's Creed",
  "Ghost of Tsushima / Shōgun": "Ghost of Tsushima",
  "Shōgun (2024) / Shogun 2": "Shōgun",
  "Mafia: Definitive Edition": "Mafia",
  "Red Dead Redemption 2": "Red Dead Redemption",
  "Kingdom Come: Deliverance II": "Kingdom Come: Deliverance",
  "Oppenheimer (Film)": "Oppenheimer",
  "The Crown (Dizi)": "The Crown",
  "Gladiator II": "Gladiator"
};

const dossiers = {};

cardsData.forEach(card => {
  if (!card.mediaTitle || EXCLUDED_TITLES.includes(card.mediaTitle)) return;
  let title = card.mediaTitle;
  if (NORMALIZATION_MAP[title]) title = NORMALIZATION_MAP[title];
  
  if (!dossiers[title]) {
    dossiers[title] = {
      title,
      cardIds: [],
      flagshipCount: 0,
      standardCount: 0
    };
  }
  
  if (!dossiers[title].cardIds.includes(card.id)) {
    dossiers[title].cardIds.push(card.id);
    if (card.isFlagship) dossiers[title].flagshipCount++;
    else dossiers[title].standardCount++;
  }
});

const dossierList = Object.values(dossiers).sort((a, b) => b.flagshipCount - a.flagshipCount || b.cardIds.length - a.cardIds.length);

// Quality Analysis
const quality = {
  flagship: flagshipCards.length,
  standard: standardCards.length,
  needsEnrichment: standardCards.filter(c => !c.realHistory || c.realHistory.length < 500).length,
  needsSourceReview: cardsData.filter(c => !c.sources || c.sources.length === 0).length,
};

console.log(JSON.stringify({
  inventory: {
    totalCards,
    flagshipCount: flagshipCards.length,
    standardCount: standardCards.length,
    dossierCount: dossierList.length
  },
  dossiers: dossierList.map(d => ({
    title: d.title,
    total: d.cardIds.length,
    flagship: d.flagshipCount,
    standard: d.standardCount
  })),
  quality
}, null, 2));
