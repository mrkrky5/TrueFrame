const fs = require('fs');
const path = require('path');

const cardsPath = path.join(__dirname, '..', 'data', 'cards.json');
const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8').replace(/^\uFEFF/, ''));

const totalCards = cards.length;
const flagshipCards = cards.filter(c => c.isFlagship).length;
const standardCards = totalCards - flagshipCards;
const mediaTitles = [...new Set(cards.map(c => c.mediaTitle))];
const dossierCount = mediaTitles.length;

// Count unique routes if applicable
const routes = [...new Set(cards.flatMap(c => c.routes || []))];
const routeCount = routes.length;

const fileSizeKB = (fs.statSync(cardsPath).size / 1024).toFixed(2);

console.log(JSON.stringify({
    totalCards,
    flagshipCards,
    standardCards,
    dossierCount,
    routeCount,
    fileSizeKB,
    uiLanguage: "Turkish (TR)",
    currentRouteStructure: "Next.js App Router (Standard)"
}, null, 2));
