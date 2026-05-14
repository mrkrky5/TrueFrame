import { HistoryCard, AccuracyType } from "@/types";

export type BlockType = 
  | "hook" 
  | "shortContext"
  | "accuracyGuess" 
  | "mediaChanged" 
  | "history" 
  | "whyItMatters" 
  | "sources" 
  | "reflection" 
  | "similar";

export interface ContentBlock {
  id: string;
  type: BlockType;
  title?: string;
  content?: string | any;
  metadata?: any;
}

/**
 * Splits text into blocks while trying to maintain ideal word counts (60-140 words).
 */
function refineSplitting(blocks: { title?: string; content: string }[], continuedLabel: string): { title?: string; content: string }[] {
  const result: { title?: string; content: string }[] = [];
  
  for (const block of blocks) {
    const wordCount = block.content.split(/\s+/).length;
    
    // If block is too long (> 240 words), split it by paragraphs
    if (wordCount > 240) {
      const paragraphs = block.content.split(/\n\n+/).filter(p => p.trim());
      if (paragraphs.length > 1) {
        paragraphs.forEach((p, i) => {
          const partTitle = i === 0 ? block.title : (block.title ? `${block.title} — ${continuedLabel}` : continuedLabel);
          result.push({
            title: partTitle,
            content: p.trim()
          });
        });
        continue;
      }
    }
    
    result.push(block);
  }
  
  return result;
}

/**
 * Splits the realHistory text into blocks based on markdown headings (###).
 * If no headings exist, it splits by paragraphs.
 */
function splitHistoryIntoBlocks(text: string, continuedLabel: string): { title?: string; content: string }[] {
  if (!text) return [];

  let rawBlocks: { title?: string; content: string }[] = [];

  // Check for ### headings
  if (text.includes("###")) {
    const sections = text.split(/(?=### )/);
    rawBlocks = sections.map(section => {
      const match = section.match(/### (.*)\n([\s\S]*)/);
      if (match) {
        return {
          title: match[1].trim(),
          content: match[2].trim()
        };
      }
      return { content: section.trim() };
    }).filter(s => {
      if (!s.content && !s.title) return false;
      const title = s.title?.toLowerCase() || "";
      // Filter out manual source headers
      return !title.startsWith('kaynakça') && !title.startsWith('source');
    });
  } else {
    // Fallback: Split by paragraphs (double newlines)
    const paragraphs = text.split(/\n\n+/);
    rawBlocks = paragraphs
      .map(p => ({ content: p.trim() }))
      .filter(p => {
        if (!p.content) return false;
        const text = p.content.toLowerCase();
        return !text.startsWith('kaynakça') && !text.startsWith('source');
      });
  }

  return refineSplitting(rawBlocks, continuedLabel);
}

/**
 * Derives an ordered list of content blocks for a flagship card.
 */
export function deriveCardBlocks(card: HistoryCard, d: any): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // 1. Hook Block
  blocks.push({
    id: "hook",
    type: "hook",
    title: card.title,
    content: card.quickRealityCheck || card.subtitle || d.common.journeyHookDefault,
    metadata: {
      mediaTitle: card.mediaTitle,
      mediaType: card.mediaType,
      subtitle: card.subtitle
    }
  });

  // 2. Short Context / Bite of Knowledge (Value First)
  // Take the first history block as context if it exists and isn't too long
  const historyParts = splitHistoryIntoBlocks(card.realHistory || "", d.common.continuedLabel || d.common.continued);
  let contextPart: { title?: string; content: string } | null = null;
  
  if (historyParts.length > 0) {
    contextPart = historyParts.shift()!;
    blocks.push({
      id: "short-context",
      type: "shortContext",
      title: contextPart.title || d.common.quickContext,
      content: contextPart.content
    });
  }

  // 3. Accuracy Guess Block (Interactive)
  blocks.push({
    id: "accuracy-guess",
    type: "accuracyGuess",
    content: card.accuracyNote,
    metadata: {
      actualAccuracy: card.accuracyType,
      explanation: card.accuracyNote
    }
  });

  // 4. Media vs Reality Block
  if (card.mediaChanged) {
    blocks.push({
      id: "media-changed",
      type: "mediaChanged",
      title: d.common.vsReality,
      content: card.mediaChanged
    });
  }

  // 5. Deep History Blocks (Remaining)
  historyParts.forEach((part, index) => {
    blocks.push({
      id: `history-${index}`,
      type: "history",
      title: part.title,
      content: part.content
    });
  });

  // 6. Why It Matters Block
  if (card.whyItMatters) {
    blocks.push({
      id: "why-it-matters",
      type: "whyItMatters",
      title: d.common.whyItMattersHeader || d.card.whyItMatters,
      content: card.whyItMatters
    });
  }

  // 7. Sources Block
  if (card.sources && card.sources.length > 0) {
    blocks.push({
      id: "sources",
      type: "sources",
      title: d.common.sourcesTitle,
      content: card.sources
    });
  }

  // 8. Reflection Block
  blocks.push({
    id: "reflection",
    type: "reflection"
  });

  // 9. Similar Discoveries Block
  blocks.push({
    id: "similar",
    type: "similar"
  });

  return blocks;
}
