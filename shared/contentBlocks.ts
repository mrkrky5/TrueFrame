import type { HistoryCard, AccuracyType, MediaType } from "../types/index";

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
  content?: string | unknown;
  metadata?: Record<string, unknown>;
}

function refineSplitting(
  blocks: { title?: string; content: string }[],
  continuedLabel: string
): { title?: string; content: string }[] {
  const result: { title?: string; content: string }[] = [];
  for (const block of blocks) {
    const wordCount = block.content.split(/\s+/).length;
    if (wordCount > 240) {
      const paragraphs = block.content.split(/\n\n+/).filter((p) => p.trim());
      if (paragraphs.length > 1) {
        paragraphs.forEach((p, i) => {
          const partTitle =
            i === 0
              ? block.title
              : block.title
                ? `${block.title} — ${continuedLabel}`
                : continuedLabel;
          result.push({ title: partTitle, content: p.trim() });
        });
        continue;
      }
    }
    result.push(block);
  }
  return result;
}

function splitHistoryIntoBlocks(text: string, continuedLabel: string) {
  if (!text) return [] as { title?: string; content: string }[];

  let rawBlocks: { title?: string; content: string }[] = [];

  if (text.includes("###")) {
    rawBlocks = text
      .split(/(?=### )/)
      .map((section) => {
        const match = section.match(/### (.*)\n([\s\S]*)/);
        if (match) return { title: match[1].trim(), content: match[2].trim() };
        return { content: section.trim() };
      })
      .filter((s) => {
        if (!s.content && !s.title) return false;
        const title = s.title?.toLowerCase() || "";
        return !title.startsWith("kaynakça") && !title.startsWith("source");
      });
  } else {
    rawBlocks = text
      .split(/\n\n+/)
      .map((p) => ({ content: p.trim() }))
      .filter((p) => {
        if (!p.content) return false;
        const t = p.content.toLowerCase();
        return !t.startsWith("kaynakça") && !t.startsWith("source");
      });
  }

  return refineSplitting(rawBlocks, continuedLabel);
}

export function deriveCardBlocks(card: HistoryCard, d: Record<string, any>): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  blocks.push({
    id: "hook",
    type: "hook",
    title: card.title,
    content: card.quickRealityCheck || card.subtitle || d.common.journeyHookDefault,
    metadata: {
      mediaTitle: card.mediaTitle,
      mediaType: card.mediaType,
      subtitle: card.subtitle,
    },
  });

  const historyParts = splitHistoryIntoBlocks(
    card.realHistory || "",
    d.common.continuedLabel || d.common.continued
  );

  if (historyParts.length > 0) {
    const contextPart = historyParts.shift()!;
    blocks.push({
      id: "short-context",
      type: "shortContext",
      title: contextPart.title || d.common.quickContext,
      content: contextPart.content,
    });
  }

  blocks.push({
    id: "accuracy-guess",
    type: "accuracyGuess",
    content: card.accuracyNote,
    metadata: {
      actualAccuracy: card.accuracyType,
      explanation: card.accuracyNote,
    },
  });

  if (card.mediaChanged) {
    blocks.push({
      id: "media-changed",
      type: "mediaChanged",
      title: d.common.vsReality,
      content: card.mediaChanged,
    });
  }

  historyParts.forEach((part, index) => {
    blocks.push({
      id: `history-${index}`,
      type: "history",
      title: part.title,
      content: part.content,
    });
  });

  if (card.whyItMatters) {
    blocks.push({
      id: "why-it-matters",
      type: "whyItMatters",
      title: d.common.whyItMattersHeader || d.card.whyItMatters,
      content: card.whyItMatters,
    });
  }

  if (card.sources?.length) {
    blocks.push({
      id: "sources",
      type: "sources",
      title: d.common.sourcesTitle,
      content: card.sources,
    });
  }

  blocks.push({ id: "reflection", type: "reflection" });
  blocks.push({ id: "similar", type: "similar" });

  return blocks;
}

export function formatMediaType(type: MediaType, d: Record<string, any>): string {
  return d.common?.mediaTypes?.[type]?.toUpperCase?.() || type.toUpperCase();
}

export function formatAccuracyLabel(type: AccuracyType | undefined, d: Record<string, any>): string {
  if (!type) return "";
  return d.common?.accuracyOptions?.[type] || type;
}
