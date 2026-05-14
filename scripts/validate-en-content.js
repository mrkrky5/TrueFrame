const fs = require('fs');
const path = require('path');

const cardsEnPath = path.join(__dirname, '..', 'data', 'cards.en.json');
const cards = JSON.parse(fs.readFileSync(cardsEnPath, 'utf8'));

const TURKISH_UNIQUE_CHARS = /[ıİğĞşŞ]/;
const TURKISH_WORDS = [
  ' ve ', ' bir ', ' için ', ' olan ', ' ama ', ' fakat ', ' lakin ', 
  ' ancak ', ' çünkü ', ' gibi ', ' kadar ', ' ile ', ' veya ', ' ya da '
];

let errors = 0;

console.log(`Auditing ${cards.length} active English cards for Turkish contamination...`);

cards.forEach(card => {
  const checkText = (text, path) => {
    if (!text || typeof text !== 'string') return;

    const charMatch = text.match(TURKISH_UNIQUE_CHARS);
    if (charMatch) {
      console.error(`[CONTAMINATION] ID: ${card.id} - Found character "${charMatch[0]}" in field: ${path}`);
      console.error(`  Context: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
      errors++;
    }

    const lowerText = text.toLowerCase();
    TURKISH_WORDS.forEach(word => {
      if (lowerText.includes(word)) {
        console.error(`[CONTAMINATION] ID: ${card.id} - Found Turkish stopword "${word.trim()}" in field: ${path}`);
        const index = lowerText.indexOf(word);
        console.error(`  Context: "...${text.substring(Math.max(0, index - 20), Math.min(text.length, index + 20))}..."`);
        errors++;
      }
    });
  };

  // 1. Root level string fields
  const rootFields = [
    'title', 'subtitle', 'whatWeSee', 'quickRealityCheck', 'realHistory', 
    'mediaChanged', 'whyInteresting', 'misconception', 'accuracyNote', 
    'mediaConnection', 'whyItMatters', 'reviewerNote', 'mediaTitle'
  ];
  rootFields.forEach(f => checkText(card[f], f));

  // 2. Tags
  if (card.tags && Array.isArray(card.tags)) {
    card.tags.forEach((tag, i) => checkText(tag, `tags[${i}]`));
  }

  // 3. Sources
  if (card.sources && Array.isArray(card.sources)) {
    card.sources.forEach((source, i) => {
      checkText(source.title, `sources[${i}].title`);
      checkText(source.label, `sources[${i}].label`);
    });
  }

  // 4. Guided Journey sections (if present)
  if (card.sections && Array.isArray(card.sections)) {
    card.sections.forEach((section, i) => {
      checkText(section.title, `sections[${i}].title`);
      checkText(section.content, `sections[${i}].content`);
    });
  }
});

if (errors > 0) {
  console.error(`\nFAILED: Found ${errors} potential Turkish contamination issues in cards.en.json.`);
  process.exit(1);
} else {
  console.log('\nPASSED: No Turkish contamination detected in active English cards.');
  process.exit(0);
}
