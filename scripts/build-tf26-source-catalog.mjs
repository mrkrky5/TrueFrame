#!/usr/bin/env node
/** Generates data/tf26-source-backfill.json from slug catalog. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/** @type {Record<string, { primary?: {title:string,url:string,type:string}, second: {title:string,url:string,type:string} }>} */
const SLUG = {
  // Red Dead Redemption
  "outlaw-myth": {
    primaryFix: {
      title: "Outlaws and Lawmen of the American West (History.com)",
      url: "https://www.history.com/topics/wild-west/outlaws-lawmen-american-west",
      type: "article",
    },
    second: {
      title: "The Closing of the American Frontier (Library of Congress)",
      url: "https://www.loc.gov/classroom-materials/united-states-history-primary-source-timeline/rise-of-industrial-america-1876-1900/westward-expansion-impact-on-native-americans/",
      type: "official",
    },
  },
  "cattle-drives": {
    primaryFix: {
      title: "Cattle Drive (Britannica)",
      url: "https://www.britannica.com/topic/cattle-drive",
      type: "article",
    },
    second: {
      title: "The End of the Open Range (National Archives)",
      url: "https://www.archives.gov/milestone-documents/homestead-act",
      type: "archive",
    },
  },
  "pinkertons": {
    primaryFix: {
      title: "Pinkerton National Detective Agency (Britannica)",
      url: "https://www.britannica.com/topic/Pinkerton-National-Detective-Agency",
      type: "article",
    },
    second: {
      title: "The Real History of the Pinkertons (Smithsonian)",
      url: "https://www.smithsonianmag.com/history/the-real-history-behind-the-pinkerton-detective-agency-180983804/",
      type: "article",
    },
  },
  "reservation-system": {
    primaryFix: {
      title: "Indian Reservation System (Britannica)",
      url: "https://www.britannica.com/topic/Indian-reservation-United-States",
      type: "article",
    },
    second: {
      title: "Dawes Act and Native Lands (National Archives)",
      url: "https://www.archives.gov/milestone-documents/dawes-act",
      type: "archive",
    },
  },
  "bounty-hunters": {
    primaryFix: {
      title: "Bounty Hunter (Britannica)",
      url: "https://www.britannica.com/topic/bounty-hunter",
      type: "article",
    },
    second: {
      title: "Wild West Law Enforcement (Smithsonian)",
      url: "https://www.smithsonianmag.com/history/wild-west-lawmen-180949289/",
      type: "article",
    },
  },
  "women-frontier": {
    primaryFix: {
      title: "Women on the American Frontier (Britannica)",
      url: "https://www.britannica.com/topic/frontier-American-history",
      type: "article",
    },
    second: {
      title: "Women in the West (National Park Service)",
      url: "https://www.nps.gov/articles/women-in-the-west.htm",
      type: "official",
    },
  },
  // Assassin's Creed Origins
  "desert-routes": {
    second: {
      title: "Eastern Desert Routes in Roman Egypt (Britannica)",
      url: "https://www.britannica.com/place/Egypt/The-Roman-period-30-bce-395-ce",
      type: "article",
    },
  },
  "afterlife": {
    second: {
      title: "Ancient Egyptian Afterlife Beliefs (Met Museum)",
      url: "https://www.metmuseum.org/exhibitions/listings/2016/egyptian-art",
      type: "museum",
    },
  },
  // Gladiator
  "legion-discipline": {
    second: {
      title: "Roman Army Discipline (Britannica)",
      url: "https://www.britannica.com/topic/Roman-army",
      type: "article",
    },
  },
  "citizenship": {
    second: {
      title: "Roman Citizenship (Britannica)",
      url: "https://www.britannica.com/topic/civitas-Roman-law",
      type: "article",
    },
  },
  roads: {
    second: {
      title: "Roman Roads (Britannica)",
      url: "https://www.britannica.com/technology/Roman-road-system",
      type: "article",
    },
  },
  "provincial-life": {
    second: {
      title: "Roman Empire Provinces (Britannica)",
      url: "https://www.britannica.com/place/Roman-Empire/Provinces",
      type: "article",
    },
  },
  "colosseum-labor": {
    second: {
      title: "Building the Colosseum (Smithsonian)",
      url: "https://www.smithsonianmag.com/history/the-colosseum-180947814/",
      type: "article",
    },
  },
  // Odyssey
  "peloponnesian-war": {
    second: {
      title: "Peloponnesian War (World History Encyclopedia)",
      url: "https://www.worldhistory.org/Peloponnesian_War/",
      type: "article",
    },
  },
  "olympic-games": {
    second: {
      title: "Ancient Olympic Games (Britannica)",
      url: "https://www.britannica.com/sports/Olympic-Games/The-ancient-Olympic-Games",
      type: "article",
    },
  },
  triremes: {
    second: {
      title: "Trireme (Britannica)",
      url: "https://www.britannica.com/technology/trireme",
      type: "article",
    },
  },
  "myth-history": {
    second: {
      title: "Greek Mythology and History (Britannica)",
      url: "https://www.britannica.com/topic/Greek-mythology",
      type: "article",
    },
  },
  "persian-wars": {
    second: {
      title: "Greco-Persian Wars (Britannica)",
      url: "https://www.britannica.com/event/Greco-Persian-Wars",
      type: "article",
    },
  },
  // Vikings
  longships: {
    second: {
      title: "Longship (Britannica)",
      url: "https://www.britannica.com/technology/longship",
      type: "article",
    },
  },
  runes: {
    second: {
      title: "Runic Alphabet (Britannica)",
      url: "https://www.britannica.com/topic/runic-alphabet",
      type: "article",
    },
  },
  "norse-religion": {
    second: {
      title: "Norse Religion (Britannica)",
      url: "https://www.britannica.com/topic/Norse-religion",
      type: "article",
    },
  },
  danelaw: {
    second: {
      title: "Danelaw (Britannica)",
      url: "https://www.britannica.com/place/Danelaw",
      type: "article",
    },
  },
  christianization: {
    second: {
      title: "Christianization of Scandinavia (Britannica)",
      url: "https://www.britannica.com/place/Scandinavia/Christianity",
      type: "article",
    },
  },
  // The Last Kingdom
  wessex: {
    second: {
      title: "Wessex (Britannica)",
      url: "https://www.britannica.com/place/Wessex",
      type: "article",
    },
  },
  "law-codes": {
    second: {
      title: "Anglo-Saxon Law (Britannica)",
      url: "https://www.britannica.com/topic/Anglo-Saxon-law",
      type: "article",
    },
  },
  monasteries: {
    second: {
      title: "Anglo-Saxon Monasticism (Britannica)",
      url: "https://www.britannica.com/topic/monasticism/Christianity",
      type: "article",
    },
  },
  "norman-conquest": {
    second: {
      title: "Norman Conquest (Britannica)",
      url: "https://www.britannica.com/event/Norman-Conquest",
      type: "article",
    },
  },
  "bayeux-tapestry": {
    second: {
      title: "Bayeux Tapestry (Britannica)",
      url: "https://www.britannica.com/topic/Bayeux-Tapestry",
      type: "article",
    },
  },
  // Ghost of Tsushima
  archery: {
    second: {
      title: "Japanese Archery (Britannica)",
      url: "https://www.britannica.com/sports/kyudo",
      type: "article",
    },
  },
  "peasants-war": {
    second: {
      title: "Peasant Revolts in Japan (Britannica)",
      url: "https://www.britannica.com/event/Shimabara-Rebellion",
      type: "article",
    },
  },
  "shrine-culture": {
    second: {
      title: "Shinto Shrines (Britannica)",
      url: "https://www.britannica.com/topic/Shinto-shrine",
      type: "article",
    },
  },
  // Shogun
  "daimyo-politics": {
    second: {
      title: "Daimyo (Britannica)",
      url: "https://www.britannica.com/topic/daimyo",
      type: "article",
    },
  },
  "jesuit-missions": {
    second: {
      title: "Christianity in Japan (Britannica)",
      url: "https://www.britannica.com/place/Japan/Christianity",
      type: "article",
    },
  },
  "tea-ceremony": {
    second: {
      title: "Tea Ceremony (Britannica)",
      url: "https://www.britannica.com/topic/tea-ceremony",
      type: "article",
    },
  },
  "castle-towns": {
    second: {
      title: "Japanese Castle Towns (Britannica)",
      url: "https://www.britannica.com/place/Japan/The-Tokugawa-period-1603-1868",
      type: "article",
    },
  },
  sekigahara: {
    second: {
      title: "Battle of Sekigahara (Britannica)",
      url: "https://www.britannica.com/event/Battle-of-Sekigahara",
      type: "article",
    },
  },
  "edo-peace": {
    second: {
      title: "Tokugawa Period (Britannica)",
      url: "https://www.britannica.com/event/Tokugawa-period",
      type: "article",
    },
  },
  // Kingdom Come
  "village-life": {
    second: {
      title: "Medieval Village Life (Britannica)",
      url: "https://www.britannica.com/event/Middle-Ages/Daily-life",
      type: "article",
    },
  },
  "noble-duty": {
    second: {
      title: "Feudalism in Europe (Britannica)",
      url: "https://www.britannica.com/topic/feudalism",
      type: "article",
    },
  },
  "church-calendar": {
    second: {
      title: "Medieval Church Calendar (Britannica)",
      url: "https://www.britannica.com/topic/church-year",
      type: "article",
    },
  },
  "armor-cost": {
    second: {
      title: "Medieval Armour (Britannica)",
      url: "https://www.britannica.com/technology/armour-body-protective",
      type: "article",
    },
  },
  sieges: {
    second: {
      title: "Siege Warfare in the Middle Ages (Britannica)",
      url: "https://www.britannica.com/technology/siege-warfare",
      type: "article",
    },
  },
  // Pirates
  privateers: {
    second: {
      title: "Privateer (Britannica)",
      url: "https://www.britannica.com/topic/privateer",
      type: "article",
    },
  },
  "pirate-code": {
    second: {
      title: "Pirate Code of Conduct (Royal Museums Greenwich)",
      url: "https://www.rmg.co.uk/stories/topics/pirates/pirate-codes",
      type: "museum",
    },
  },
  "port-royal": {
    second: {
      title: "Port Royal (Britannica)",
      url: "https://www.britannica.com/place/Port-Royal-Jamaica",
      type: "article",
    },
  },
  "women-pirates": {
    second: {
      title: "Women Pirates (Smithsonian)",
      url: "https://www.smithsonianmag.com/history/female-pirates-180964177/",
      type: "article",
    },
  },
  "enslaved-labor": {
    second: {
      title: "Atlantic Slave Trade (Britannica)",
      url: "https://www.britannica.com/topic/Atlantic-slave-trade",
      type: "article",
    },
  },
  "pirate-democracy": {
    second: {
      title: "Piracy in the Caribbean (Britannica)",
      url: "https://www.britannica.com/topic/piracy",
      type: "article",
    },
  },
  // AC Unity
  bastille: {
    second: {
      title: "Storming of the Bastille (Britannica)",
      url: "https://www.britannica.com/event/Storming-of-the-Bastille",
      type: "article",
    },
  },
  "estates-general": {
    second: {
      title: "Estates-General (Britannica)",
      url: "https://www.britannica.com/topic/Estates-General",
      type: "article",
    },
  },
  "declaration-rights": {
    second: {
      title: "Declaration of the Rights of Man (Britannica)",
      url: "https://www.britannica.com/event/Declaration-of-the-Rights-of-Man-and-of-the-Citizen",
      type: "article",
    },
  },
  "reign-terror": {
    second: {
      title: "Reign of Terror (Britannica)",
      url: "https://www.britannica.com/event/Reign-of-Terror",
      type: "article",
    },
  },
  "revolutionary-calendar": {
    second: {
      title: "French Revolutionary Calendar (Britannica)",
      url: "https://www.britannica.com/topic/French-revolutionary-calendar",
      type: "article",
    },
  },
  vendee: {
    second: {
      title: "War in the Vendée (Britannica)",
      url: "https://www.britannica.com/event/War-in-the-Vendee",
      type: "article",
    },
  },
  // Hamilton
  federalists: {
    second: {
      title: "Federalist Party (Britannica)",
      url: "https://www.britannica.com/topic/Federalist-Party",
      type: "article",
    },
  },
  "dueling-culture": {
    second: {
      title: "Duel (Britannica)",
      url: "https://www.britannica.com/topic/duel",
      type: "article",
    },
  },
  loyalists: {
    second: {
      title: "Loyalist (American Revolution) (Britannica)",
      url: "https://www.britannica.com/topic/loyalist-American-colonial-history",
      type: "article",
    },
  },
  "native-nations": {
    second: {
      title: "Native American Policy in the Early Republic (Britannica)",
      url: "https://www.britannica.com/topic/Native-American/Native-Americans-and-colonization",
      type: "article",
    },
  },
  // 1917
  "no-mans-land": {
    second: {
      title: "No Man's Land (Britannica)",
      url: "https://www.britannica.com/event/World-War-I/Trench-warfare",
      type: "article",
    },
  },
  "shell-shock": {
    second: {
      title: "Shell Shock (Britannica)",
      url: "https://www.britannica.com/science/shell-shock",
      type: "article",
    },
  },
  armistice: {
    second: {
      title: "Armistice of 1918 (Britannica)",
      url: "https://www.britannica.com/event/Armistice",
      type: "article",
    },
  },
  "home-front": {
    second: {
      title: "Home Front (World War I) (Britannica)",
      url: "https://www.britannica.com/event/World-War-I",
      type: "article",
    },
  },
  // Saving Private Ryan
  airborne: {
    second: {
      title: "D-Day Airborne Operations (U.S. Army)",
      url: "https://www.army.mil/article/116382/d-day-the-airborne-assault",
      type: "official",
    },
  },
  "mulberry-harbours": {
    second: {
      title: "Mulberry Harbour (Britannica)",
      url: "https://www.britannica.com/technology/Mulberry",
      type: "article",
    },
  },
  hedgerows: {
    second: {
      title: "Battle of Normandy (Britannica)",
      url: "https://www.britannica.com/event/Battle-of-Normandy",
      type: "article",
    },
  },
  medics: {
    second: {
      title: "Combat Medics in World War II (Britannica)",
      url: "https://www.britannica.com/event/World-War-II",
      type: "article",
    },
  },
  "german-defenses": {
    second: {
      title: "Atlantic Wall (Britannica)",
      url: "https://www.britannica.com/topic/Atlantic-Wall",
      type: "article",
    },
  },
  // Oppenheimer
  "oak-ridge": {
    second: {
      title: "Oak Ridge National Laboratory History",
      url: "https://www.ornl.gov/content/history",
      type: "official",
    },
  },
  security: {
    second: {
      title: "Manhattan Project Security (U.S. DOE)",
      url: "https://www.energy.gov/management/manhattan-project",
      type: "official",
    },
  },
  "women-workers": {
    second: {
      title: "Women and the Manhattan Project (Britannica)",
      url: "https://www.britannica.com/event/Manhattan-Project",
      type: "article",
    },
  },
  "cold-war-start": {
    second: {
      title: "Cold War Origins (Britannica)",
      url: "https://www.britannica.com/event/Cold-War",
      type: "article",
    },
  },
  // Chernobyl
  "reactor-test": {
    second: {
      title: "Chernobyl Accident (IAEA)",
      url: "https://www.iaea.org/topics/emergency-preparedness-and-response/chernobyl",
      type: "official",
    },
  },
  liquidators: {
    second: {
      title: "Chernobyl Liquidators (WHO)",
      url: "https://www.who.int/health-topics/radiation",
      type: "official",
    },
  },
  "radiation-myth": {
    second: {
      title: "Health Effects of the Chernobyl Accident (WHO)",
      url: "https://www.who.int/publications/m/item/health-effects-of-the-chernobyl-accident",
      type: "official",
    },
  },
  "exclusion-zone": {
    second: {
      title: "Chernobyl Exclusion Zone (IAEA)",
      url: "https://www.iaea.org/topics/emergency-preparedness-and-response/chernobyl",
      type: "official",
    },
  },
  trial: {
    second: {
      title: "Chernobyl Trial and Accountability (Britannica)",
      url: "https://www.britannica.com/event/Chernobyl-disaster/Aftermath",
      type: "article",
    },
  },
  // Hidden Figures
  "human-computers": {
    second: {
      title: "Human Computers at NASA (NASA)",
      url: "https://www.nasa.gov/history/human-computers/",
      type: "official",
    },
  },
  "mercury-program": {
    second: {
      title: "Project Mercury (NASA)",
      url: "https://www.nasa.gov/history/mercury/",
      type: "official",
    },
  },
  "katherine-johnson": {
    second: {
      title: "Project Mercury Overview (NASA)",
      url: "https://www.nasa.gov/history/mercury/",
      type: "official",
    },
  },
  "cold-war-prestige": {
    second: {
      title: "Space Race (Britannica)",
      url: "https://www.britannica.com/event/space-race",
      type: "article",
    },
  },
  risk: {
    second: {
      title: "Human Spaceflight Risk (NASA)",
      url: "https://www.nasa.gov/human-spaceflight/",
      type: "official",
    },
  },
  "public-memory": {
    second: {
      title: "Hidden Figures and NASA History (Smithsonian)",
      url: "https://www.smithsonianmag.com/smithsonian-institution/nasas-hidden-figures-180962177/",
      type: "article",
    },
  },
  // Boardwalk Empire
  speakeasies: {
    second: {
      title: "Speakeasies and Prohibition (History.com)",
      url: "https://www.history.com/topics/roaring-twenties/prohibition",
      type: "article",
    },
  },
  temperance: {
    second: {
      title: "Temperance Movement (Britannica)",
      url: "https://www.britannica.com/topic/temperance-movement",
      type: "article",
    },
  },
  "federal-enforcement": {
    second: {
      title: "Prohibition Enforcement (U.S. National Archives)",
      url: "https://www.archives.gov/exhibits/charters/constitution_amendments_11-27",
      type: "archive",
    },
  },
  "organized-crime": {
    second: {
      title: "Organized Crime in the 1920s (Britannica)",
      url: "https://www.britannica.com/topic/organized-crime",
      type: "article",
    },
  },
  "jazz-age": {
    second: {
      title: "Jazz Age (Britannica)",
      url: "https://www.britannica.com/event/Jazz-Age",
      type: "article",
    },
  },
  corruption: {
    second: {
      title: "Political Corruption in the Gilded Age (Britannica)",
      url: "https://www.britannica.com/event/Gilded-Age",
      type: "article",
    },
  },
  // The Crown
  "constitutional-role": {
    second: {
      title: "British Constitutional Monarchy (Britannica)",
      url: "https://www.britannica.com/topic/monarchy/Monarchy-in-the-modern-world",
      type: "article",
    },
  },
  commonwealth: {
    second: {
      title: "Commonwealth of Nations (Britannica)",
      url: "https://www.britannica.com/topic/Commonwealth",
      type: "article",
    },
  },
  "prime-ministers": {
    second: {
      title: "Prime Minister of the United Kingdom (Britannica)",
      url: "https://www.britannica.com/topic/prime-minister",
      type: "article",
    },
  },
  "empire-memory": {
    second: {
      title: "British Empire (Britannica)",
      url: "https://www.britannica.com/place/British-Empire",
      type: "article",
    },
  },
  privacy: {
    second: {
      title: "British Royal Family and the Media (Britannica)",
      url: "https://www.britannica.com/topic/house-of-Windsor",
      type: "article",
    },
  },
  // Period Films / plague
  "plague-spread": {
    second: {
      title: "Plague History (CDC)",
      url: "https://www.cdc.gov/plague/history/index.html",
      type: "official",
    },
  },
  flagellants: {
    second: {
      title: "Flagellants (Britannica)",
      url: "https://www.britannica.com/topic/flagellant",
      type: "article",
    },
  },
  antisemitism: {
    second: {
      title: "Black Death and Anti-Semitism (Britannica)",
      url: "https://www.britannica.com/event/Black-Death/Effects-and-significance",
      type: "article",
    },
  },
  "labor-shortage": {
    second: {
      title: "Aftermath of the Black Death (Britannica)",
      url: "https://www.britannica.com/event/Black-Death/Effects-and-significance",
      type: "article",
    },
  },
  "death-art": {
    second: {
      title: "Danse Macabre (Britannica)",
      url: "https://www.britannica.com/art/danse-macabre",
      type: "article",
    },
  },
  "rural-impact": {
    second: {
      title: "Peasant Life After the Black Death (Britannica)",
      url: "https://www.britannica.com/event/Middle-Ages",
      type: "article",
    },
  },
};

const cards = JSON.parse(fs.readFileSync(path.join(root, "data/cards.tr.json"), "utf8"));
const catalog = {};
const slugToId = new Map();

for (const card of cards) {
  if (!card.id.startsWith("tf26-")) continue;
  const slug = card.id.replace(/^tf26-\d+-/, "");
  slugToId.set(slug, card.id);
}

const missingSlugs = [];
for (const [slug, entry] of Object.entries(SLUG)) {
  const id = slugToId.get(slug);
  if (!id) {
    missingSlugs.push(slug);
    continue;
  }
  catalog[id] = entry;
}

const orphanSlugs = Object.keys(SLUG).filter((s) => !slugToId.has(s));
if (missingSlugs.length || orphanSlugs.length) {
  if (missingSlugs.length) console.error("SLUG without card id:", missingSlugs);
  if (orphanSlugs.length) console.error("SLUG keys not in cards:", orphanSlugs);
  process.exit(1);
}

const out = path.join(root, "data/tf26-source-backfill.json");
fs.writeFileSync(out, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Wrote ${Object.keys(catalog).length} entries → ${out}`);
