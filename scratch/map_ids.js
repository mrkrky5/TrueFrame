const fs = require('fs');
const en = JSON.parse(fs.readFileSync('data/cards.en.json', 'utf8'));
const tr = JSON.parse(fs.readFileSync('data/cards.tr.json', 'utf8'));

const activeEnIds = [
  "oppenheimer-trinity", "chernobyl-disaster", "shogun-tokugawa-rise-real", "ac-origins-siwa", "gladiator-colosseum", "rdr2-frontier", "ghost-tsushima-invasion", "ac-mirage-baghdad", "ac-odyssey-athens", "vikings-raid", "shogun-trade-sakoku", "shogun-hostage-politics", "shogun2-shinobi", "ac-valhalla-vikings", "napoleon-height", "gladiator-bread-circuses", "chernobyl-secrecy", "mafia-prohibition", "mafia-omerta", "rdr-railroads-frontier", "kingdom-of-heaven-crusades", "the-crown-monarchy", "last-emperor-china-fall", "kcd-bohemia", "ryan-higgins-boats", "last-kingdom-danelaw", "band-of-brothers-airborne", "shogun-edo", "ac-unity-revolution", "bf1-harlem-hellfighters", "ghost-onna-musha", "got-roses", "ac2-davinci-tank", "napoleon-myth-reality", "prestige-currents", "roman-fast-food", "viking-horned-helmet", "iron-maiden-myth", "london-fire-plague", "medieval-hygiene", "medieval-lifespan-myth", "pentiment-printing-press", "1917-trenches", "lanoire-policing", "the-terror-arctic", "rome-series-spectacle", "pirate-maps-myth", "nero-fiddling-myth", "spartan-war-machines-myth", "witch-hunts-period", "ancient-roman-day", "medieval-night-life", "ancient-city-smells", "rome2-legions", "tsushima-samurai-power", "mongol-efficiency-yam", "flat-earth-myth-medieval", "three-kingdoms-legend", "house-wisdom-baghdad", "marco-polo-court", "ottoman-gunpowder-1453", "ottoman-harem-reality", "persian-empire-admin", "mongol-horse-archery", "empire-collapse-speed", "sengoku-japan-hostage", "cold-war-proxy-wars", "utopia-political-history", "crusader-states-daily", "early-islamic-expansion", "mongols-culture-exchange", "mesopotamia-legacy", "baghdad-daily-life-new", "ac-revelations-istanbul", "onna-musha-samurai-women", "chernobyl-bureaucracy-truth", "oppenheimer-science-state", "pirates-democracy-myth", "black-death-labor-shift", "printing-press-authority", "ac-brotherhood-rome", "ac-valhalla-settlement", "rdr-pinkerton-agency", "rdr-railroad-conquest", "shogun-christian-daimyo", "shogun-sankin-kotai", "mafia-prohibition-economics", "mafia-five-families", "chernobyl-rbmk-flaw", "oppenheimer-los-alamos-culture", "vikings-silk-road-trade", "medieval-magic-vs-reason", "samurai-loyalty-myth", "harem-pleasure-myth", "wild-west-gunfights-myth", "ancient-gods-explanation", "pre-news-news", "roman-empire-stability-myth", "civ-alphabet-revolution-real", "industrial-rev-daily-life", "oppenheimer-hearing-1954", "oppenheimer-downwinders", "cold-war-fear-system", "the-crown-suez-crisis-empire-end", "the-crown-aberfan-tragedy-real", "lanoire-postwar-trauma", "ac-syndicate-london", "pre-clock-time", "mafia-rico-law", "mafia-immigration", "rome-collapse-attila", "constantinople-1453", "mesopotamia-banking", "mongol-yam-system", "medieval-castles-power", "medieval-justice-kcd", "last-emperor-eunuchs", "crown-empire-transition", "band-of-brothers-hedgerows-real", "last-samurai-satsuma", "rome-patronage-mobs", "gladiator-political-theater", "gladiator-commodus-real", "gladiator-spartacus-legacy-real", "oppenheimer-trinity-reality", "chernobyl-biorobots-cost", "chernobyl-pripyat-evacuation-real", "band-of-brothers-heroism", "saving-private-ryan-snipers-reality", "1917-gas-masks-evolution-real", "got-war-of-roses-real", "got-battle-of-bastards-hastings-real", "last-kingdom-alfred-england", "kcd-medieval-diet", "total-war-siege-starvation-real", "total-war-medieval-diplomacy-real", "medieval-japan-daily-life", "ghost-samurai-reality", "ghost-mongol-navy", "ac-assassin-order-real", "ac-templar-fall", "ac-crusader-urban-life", "ottoman-beyond-war", "ottoman-diet-culture", "silk-road-travel-new", "vikings-not-only-raiders", "ancient-travel-myth", "medieval-city-diet", "ancient-childhood", "night-fears-pre-lighting", "medieval-monastery-science", "roman-entertainment-ordinary", "pre-modern-hospitals", "medieval-knights-reality", "1917-siper-savasi-flagship", "the-terror-arctic-tragedy-flagship", "napoleon-code-legacy-real", "civ-great-library-alexandria-real", "300-thermopylae-masterclass", "saving-private-ryan-omaha", "last-emperor-manchukuo-propaganda", "gladiator-arena-economics", "crusaders-poverty-myth", "decolonization-complexity", "300-persian-immortals-real", "valiant-hearts-wwi"
];

const trIds = new Set(tr.map(c => c.id));
const mapping = {};

activeEnIds.forEach(id => {
  if (!trIds.has(id)) {
    const card = en.find(c => c.id === id);
    if (!card) return;
    
    // Find candidate in TR by mediaTitle similarity
    const candidates = tr.filter(c => c.mediaTitle === card.mediaTitle);
    
    // Simplest heuristic: title similarity or keyword match
    let bestMatch = null;
    let bestScore = 0;
    
    candidates.forEach(c => {
      // Basic overlap score
      const mTitle = c.title.toLowerCase();
      const eTitle = card.title.toLowerCase();
      const words = eTitle.split(' ').filter(w => w.length > 3);
      let score = 0;
      words.forEach(w => { if (mTitle.includes(w)) score++; });
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = c;
      }
    });
    
    if (bestMatch) {
      mapping[id] = bestMatch.id;
    } else {
      mapping[id] = "NOT_FOUND";
    }
  }
});

console.log(JSON.stringify(mapping, null, 2));
