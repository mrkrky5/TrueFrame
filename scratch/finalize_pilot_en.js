const fs = require('fs');

const cardsPath = 'data/cards.en.json';
const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));

const pilotIds = [
  'oppenheimer-trinity',
  'chernobyl-disaster',
  'shogun-tokugawa-rise-real',
  '1917-siper-savasi-flagship',
  'the-terror-arctic-tragedy-flagship',
  'ac-origins-siwa',
  'gladiator-colosseum',
  'rdr2-frontier',
  'ghost-tsushima-invasion',
  'ac-mirage-baghdad'
];

const eraMap = {
  "Antik Dünya": "Ancient World",
  "Orta Çağ": "Middle Ages",
  "Modern Tarih": "Modern History",
  "Rönesans": "Renaissance"
};

const regionMap = {
  "Mısır": "Egypt",
  "Japonya": "Japan",
  "ABD": "USA",
  "Sovyetler Birliği": "Soviet Union",
  "Roma": "Rome",
  "Fransa": "France",
  "Avrupa": "Europe",
  "İngiltere": "England"
};

const themeMap = {
  "Din": "Religion",
  "Politika": "Politics",
  "Arkeoloji": "Archaeology",
  "Savaş": "War",
  "Samuray": "Samurai",
  "Siyaset": "Politics",
  "Bilim": "Science",
  "Kriz Yönetimi": "Crisis Management",
  "Etik": "Ethics",
  "Kültür": "Culture",
  "Spor": "Sports",
  "Sosyal Değişim": "Social Change",
  "Teknoloji": "Technology",
  "Askeri Tarih": "Military History",
  "Avrupa Tarihi": "European History",
  "Viktorya Dönemi": "Victorian Era",
  "Lojistik": "Logistics",
  "Kutup Keşifleri": "Polar Exploration",
  "Altın Çağ": "Golden Age",
  "İslam Tarihi": "Islamic History"
};

const detailTranslations = {
  "oppenheimer-trinity": {
    "misconception": "It is often thought that the bomb was built solely by Oppenheimer; in reality, thousands of engineers and workers worked on the project in total secrecy.",
    "nextTopics": ["Manhattan Project", "Leslie Groves", "The Cold War"]
  },
  "chernobyl-disaster": {
    "misconception": "Radiation is often thought to cause immediate mutations; in reality, the damage occurs at a cellular level, and its effects emerge over many years.",
    "nextTopics": ["RBMK Reactors", "Mikhail Gorbachev", "The Legasov Memorandum"]
  },
  "shogun-tokugawa-rise-real": {
    "misconception": "Samurai are often thought to have been constantly fighting; during the Tokugawa period, they lived as bureaucrats and artists for 250 years.",
    "nextTopics": ["Tokugawa Ieyasu", "William Adams", "Battle of Sekigahara"]
  },
  "ac-origins-siwa": {
    "misconception": "Siwa is often thought to be just an isolated oasis; at the time, it was a wealthy theocratic center with its own army and autonomy, controlling trade routes between Egypt, Libya, and Greece.",
    "nextTopics": ["Alexander the Great", "Ptolemaic Dynasty", "Ancient Egyptian Oracles"]
  },
  "gladiator-colosseum": {
    "misconception": "It is often thought that the 'Thumbs Down' was used for death; however, 'Pollice Verso' (turned thumb) is still debated as to which direction it actually pointed.",
    "nextTopics": ["Marcus Aurelius", "Flavian Amphitheatre", "Pollice Verso"]
  },
  "rdr2-frontier": {
    "misconception": "Pinkertons are often thought to be just heroes; in reality, they were used by industrialists to break strikes and were controversial figures among the public.",
    "nextTopics": ["Pinkerton National Detective Agency", "The Frontier Thesis", "The Wild West Myth"]
  },
  "ghost-tsushima-invasion": {
    "misconception": "Samurai are often thought to have fought only with swords; in 1274, their primary weapons were the bow and arrow used on horseback.",
    "nextTopics": ["Kublai Khan", "Kamikaze", "Kamakura Period"]
  },
  "1917-siper-savasi-flagship": {
    "misconception": "It is often thought that WWI was just about trenches; while dominant on the Western Front, it was also a war of industrial production and global logistics.",
    "nextTopics": ["The Somme", "Verdun", "The Armistice"]
  },
  "the-terror-arctic-tragedy-flagship": {
    "misconception": "The 'monster' in the series is often taken literally; in reality, lead poisoning and the rigid social structures were the true horrors that destroyed the expedition.",
    "nextTopics": ["Northwest Passage", "John Franklin", "Sir John Barrow"]
  },
  "ac-mirage-baghdad": {
    "misconception": "The Middle Ages are often thought to have been 'dark' everywhere; while Europe was in darkness, Baghdad was experiencing a scientific peak.",
    "nextTopics": ["The Golden Age", "Al-Khwarizmi", "The Abbasid Caliphate"]
  }
};

cards.forEach(card => {
  if (pilotIds.includes(card.id)) {
    // Basic fields
    if (eraMap[card.era]) card.era = eraMap[card.era];
    if (regionMap[card.region]) card.region = regionMap[card.region];
    if (card.themes) {
      card.themes = card.themes.map(t => themeMap[t] || t);
    }
    
    // Detailed fields from mapping
    if (detailTranslations[card.id]) {
      Object.assign(card, detailTranslations[card.id]);
    }

    // Clean up metadata that might still be Turkish if missed
    if (card.sourceQuality === "strong") card.sourceQuality = "Strong";
    if (card.sourceQuality === "basic") card.sourceQuality = "Basic";
    if (card.verificationStatus === "verified") card.verificationStatus = "Verified";
    
    // Note: reviewerNote and other internal fields can stay or be translated
    // Let's do a simple one for reviewerNote if it's generic
    if (card.reviewerNote && card.reviewerNote.includes("uyumludur")) {
       card.reviewerNote = "Verified against official historical records.";
    }
  }
});

fs.writeFileSync(cardsPath, JSON.stringify(cards, null, 2));
console.log('Finalized translations for 10 pilot cards.');
