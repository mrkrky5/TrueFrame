const fs = require('fs');
const path = require('path');

const cardsPath = path.join(__dirname, '../data/cards.json');
const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));

const audit = {
  total: cards.length,
  flagship: 0,
  standard: 0,
  compliance: {
    A: 0, // Fully Compliant
    B: 0, // Needs Polish
    C: 0, // Missing Fields
    D: 0, // Too Thin
    E: 0  // Manual Review
  },
  wordCounts: {
    flagship: [],
    standard: [],
    all: []
  },
  missingFields: {
    accuracyNote: [],
    mediaChanged: [],
    whyItMatters: [],
    sources: [],
    realHistory: []
  },
  thinCards: [],
  longCards: []
};

cards.forEach(card => {
  const isFlagship = !!card.isFlagship;
  if (isFlagship) audit.flagship++;
  else audit.standard++;

  const text = (card.realHistory || '') + ' ' + (card.accuracyNote || '') + ' ' + (card.mediaChanged || '') + ' ' + (card.whyItMatters || '');
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  
  audit.wordCounts.all.push(wordCount);
  if (isFlagship) audit.wordCounts.flagship.push(wordCount);
  else audit.wordCounts.standard.push(wordCount);

  // Check required fields
  const missing = [];
  if (!card.accuracyNote) missing.push('accuracyNote');
  if (!card.mediaChanged && isFlagship) missing.push('mediaChanged');
  if (!card.realHistory) missing.push('realHistory');
  if (!card.whyItMatters && isFlagship) missing.push('whyItMatters');
  if (!card.sources || card.sources.length === 0) missing.push('sources');

  missing.forEach(f => audit.missingFields[f]?.push(card.id));

  // Classification
  let category = 'A';
  if (missing.length > 0) category = 'C';
  else if (wordCount < 400) category = 'D';
  else if (text.includes('Tarih bize gösterir ki') || text.includes('Geçmiş sadece')) category = 'B';
  
  audit.compliance[category]++;

  if (wordCount < 400) audit.thinCards.push({ id: card.id, words: wordCount });
  if (wordCount > 900) audit.longCards.push({ id: card.id, words: wordCount });
});

const avg = (arr) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

console.log('--- Content Audit Report ---');
console.log(`Total Cards: ${audit.total}`);
console.log(`Flagship Cards: ${audit.flagship}`);
console.log(`Standard Cards: ${audit.standard}`);
console.log(`Avg Word Count (All): ${avg(audit.wordCounts.all)}`);
console.log(`Avg Word Count (Flagship): ${avg(audit.wordCounts.flagship)}`);
console.log(`Avg Word Count (Standard): ${avg(audit.wordCounts.standard)}`);
console.log('\nCompliance Categories:');
console.log(JSON.stringify(audit.compliance, null, 2));
console.log('\nMissing Fields Count:');
console.log(`- accuracyNote: ${audit.missingFields.accuracyNote.length}`);
console.log(`- mediaChanged (Flagship): ${audit.missingFields.mediaChanged.length}`);
console.log(`- whyItMatters (Flagship): ${audit.missingFields.whyItMatters.length}`);
console.log(`- sources: ${audit.missingFields.sources.length}`);
console.log('\nWord Count Ranges:');
console.log(`- Below 400: ${audit.wordCounts.all.filter(c => c < 400).length}`);
console.log(`- 400-700: ${audit.wordCounts.all.filter(c => c >= 400 && c < 700).length}`);
console.log(`- 700-900: ${audit.wordCounts.all.filter(c => c >= 700 && c < 900).length}`);
console.log(`- Above 900: ${audit.wordCounts.all.filter(c => c >= 900).length}`);

const shortest = [...audit.thinCards].sort((a, b) => a.words - b.words).slice(0, 20);
const longest = [...audit.longCards].sort((a, b) => b.words - a.words).slice(0, 20);

console.log('\nShortest 20 Cards:');
console.log(shortest.map(c => `${c.id} (${c.words})`).join(', '));
console.log('\nLongest 20 Cards:');
console.log(longest.map(c => `${c.id} (${c.words})`).join(', '));
