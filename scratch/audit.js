const fs = require('fs');
const path = require('path');

const cardsPath = path.join(__dirname, '..', 'data', 'cards.json');
const routesPath = path.join(__dirname, '..', 'data', 'routes.json');

const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

const results = {
    totalAudited: 0,
    duplicateSentences: [],
    repeatedParagraphs: [],
    brokenText: [],
    fillerWriting: [],
    turkishLanguageIssues: [],
    metadataConsistency: [],
    sourceConsistency: []
};

const fillerPhrases = [
    "Bu konu tarihsel açıdan önemlidir",
    "tarih bize gösterir",
    "tarihsel açıdan büyük önem taşır",
    "tarihin akışını değiştirmiştir",
    "önemli bir dönüm noktasıdır",
    "tarih boyunca her zaman",
    "tarihin derinliklerinde",
    "geçmişten günümüze",
    "tarihsel süreçte"
];

// Refined sentence splitter for Turkish (ignoring dots in abbreviations and numbers)
function splitSentences(text) {
    if (!text) return [];
    // This is a rough regex: matches dot/!/? followed by space and Uppercase letter, 
    // or end of string, while trying to ignore abbreviations like M.Ö. or 19.
    // Actually, a simpler way is to look for [.!?] followed by whitespace and a CAPITAL letter.
    return text.split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ])/);
}

function auditText(cardId, field, text) {
    if (!text || typeof text !== 'string') return;

    // 1. Duplicate sentences (Internal and External)
    const sentences = splitSentences(text);
    const seenInCard = new Set();
    sentences.forEach(s => {
        const clean = s.trim().toLowerCase();
        if (clean.length > 30) {
            if (seenInCard.has(clean)) {
                results.duplicateSentences.push({
                    cardId,
                    field,
                    type: 'Internal Duplicate sentence',
                    text: s.trim(),
                    severity: 'P1'
                });
            }
            seenInCard.add(clean);
        }
    });

    // 2. Broken/Unfinished text
    const trimmed = text.trim();
    if (trimmed.endsWith(',') || trimmed.endsWith(' ve') || trimmed.endsWith(' ile') || trimmed.endsWith(':')) {
        // Ending with colon is usually fine if it's a list, but let's check
        if (!trimmed.includes('\n-')) {
             results.brokenText.push({
                cardId,
                field,
                type: 'Unfinished ending',
                text: trimmed.slice(-30),
                severity: 'P1'
            });
        }
    }
    
    // Check for "..." at the end which might indicate cut content
    if (trimmed.endsWith('...') && field === 'realHistory') {
        results.brokenText.push({
            cardId,
            field,
            type: 'Ellipsis ending (potential cut)',
            text: trimmed.slice(-30),
            severity: 'P2'
        });
    }

    // 3. Filler writing
    fillerPhrases.forEach(phrase => {
        if (text.includes(phrase)) {
            results.fillerWriting.push({
                cardId,
                field,
                type: 'Filler phrase',
                text: phrase,
                severity: 'P2'
            });
        }
    });

    // 4. Turkish Language Quality
    // Check for spaces before punctuation
    if (/\s[.,!?]/.test(text)) {
        results.turkishLanguageIssues.push({
            cardId,
            field,
            type: 'Space before punctuation',
            text: text.match(/.{0,10}\s[.,!?].{0,10}/)[0],
            severity: 'P3'
        });
    }
    
    // Check for common AI "In conclusion" patterns
    if (text.includes('Sonuç olarak,') || text.includes('Özetle,')) {
         results.fillerWriting.push({
            cardId,
            field,
            type: 'Generic conclusion',
            text: 'Sonuç olarak / Özetle',
            severity: 'P3'
        });
    }

    // 5. Source/Content consistency
    if (text.toLowerCase().includes('kaynakça')) {
        results.sourceConsistency.push({
            cardId,
            field,
            type: 'Inline Bibliography marker',
            text: 'Found "Kaynakça"',
            severity: 'P2'
        });
    }
}

// Global seen sentences to detect cross-card duplicates
const globalSeenSentences = new Map();

cards.forEach(card => {
    results.totalAudited++;
    
    const textFields = [
        'title', 'subtitle', 'whatWeSee', 'realHistory', 'accuracyNote', 
        'whyInteresting', 'misconception', 'mediaConnection', 'mediaChanged', 
        'whyItMatters', 'quickRealityCheck', 'reviewerNote'
    ];
    
    textFields.forEach(field => {
        const text = card[field];
        if (text) {
            auditText(card.id, field, text);
            
            // Cross-card duplicate detection
            const sentences = splitSentences(text);
            sentences.forEach(s => {
                const clean = s.trim().toLowerCase();
                if (clean.length > 50) {
                    if (globalSeenSentences.has(clean)) {
                        const original = globalSeenSentences.get(clean);
                        if (original.cardId !== card.id) {
                            results.duplicateSentences.push({
                                cardId: card.id,
                                field,
                                type: 'Cross-card Duplicate',
                                text: s.trim(),
                                originalCardId: original.cardId,
                                severity: 'P1'
                            });
                        }
                    } else {
                        globalSeenSentences.set(clean, { cardId: card.id, field });
                    }
                }
            });
        }
    });

    // Metadata consistency
    if (card.isFlagship && (!card.realHistory || card.realHistory.length < 500)) {
         results.metadataConsistency.push({
            cardId: card.id,
            field: 'realHistory',
            type: 'Flagship card too short',
            text: `Length: ${card.realHistory ? card.realHistory.length : 0}`,
            severity: 'P2'
        });
    }
    
    // Reading time check
    const wordCount = (card.realHistory || '').split(/\s+/).length;
    const expectedTime = Math.ceil(wordCount / 150); // roughly 150-200 wpm
    if (card.readingTimeMinutes && Math.abs(card.readingTimeMinutes - expectedTime) > 3) {
         results.metadataConsistency.push({
            cardId: card.id,
            field: 'readingTimeMinutes',
            type: 'Inconsistent reading time',
            text: `Got ${card.readingTimeMinutes}, expected ~${expectedTime}`,
            severity: 'P3'
        });
    }
});

console.log(JSON.stringify(results, null, 2));
