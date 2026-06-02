import type { HistoryCard } from "../../types/index";

export type RealHistorySection =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

/** Matches web StandardLiteReader fallback order */
export function liteRealitySummary(card: HistoryCard): string | undefined {
  return card.accuracyNote || card.quickRealityCheck || card.whatWeSee || undefined;
}

/** Matches web StandardLiteReader paragraph parsing */
export function parseRealHistorySections(text: string | undefined): RealHistorySection[] {
  if (!text) return [];

  return text
    .split("\n\n")
    .filter((p) => {
      const t = p.trim().toLowerCase();
      return (
        !t.startsWith("kaynakça") &&
        !t.startsWith("sources") &&
        !t.startsWith("### kaynakça") &&
        !t.startsWith("### sources")
      );
    })
    .map((p) => {
      const trimmed = p.trim();
      if (trimmed.startsWith("### ")) {
        return { kind: "heading" as const, text: trimmed.replace(/^###\s+/, "").trim() };
      }
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        return {
          kind: "list" as const,
          items: trimmed.split("\n").map((li) => li.replace(/^[\*\-]\s+/, "").trim()),
        };
      }
      return { kind: "paragraph" as const, text: trimmed };
    });
}
