import type { HistoryCard, SpoilerLevel } from "../types/index";

/** Okuyucu kapısı: flagship her zaman; standart kartta minor/major. */
export function needsSpoilerGate(card: HistoryCard): boolean {
  if (card.isFlagship) return true;
  return card.spoilerLevel === "major" || card.spoilerLevel === "minor";
}

export function spoilerGateTitle(card: HistoryCard, d: Record<string, any>): string {
  const cardDict = d.card ?? d;
  if (card.isFlagship) return cardDict.deepReadGateTitle ?? "Derin okuma";
  if (card.spoilerLevel === "major") return cardDict.heavySpoilers;
  if (card.spoilerLevel === "minor") return cardDict.minorSpoilers;
  return cardDict.spoilers;
}

export function spoilerGateDescription(card: HistoryCard, d: Record<string, any>): string {
  const cardDict = d.card ?? d;
  const common = d.common ?? d;

  if (card.isFlagship) {
    if (card.spoilerLevel === "major") return cardDict.deepReadGateDescMajor ?? cardDict.deepReadGateDesc;
    if (card.spoilerLevel === "minor") return cardDict.deepReadGateDescMinor ?? cardDict.deepReadGateDesc;
    return cardDict.deepReadGateDesc;
  }

  if (card.spoilerNote?.trim()) return card.spoilerNote.trim();

  if (card.spoilerLevel === "major") {
    return (cardDict.gateDescMajor ?? common.containsSpoilers).replace(
      "{{media}}",
      card.mediaTitle ?? ""
    );
  }
  if (card.spoilerLevel === "minor") {
    return (cardDict.gateDescMinor ?? common.containsSpoilers).replace(
      "{{media}}",
      card.mediaTitle ?? ""
    );
  }
  return common.containsSpoilers;
}

export function spoilerBadgeLabel(level: SpoilerLevel | undefined, d: Record<string, any>): string | null {
  const cardDict = d.card ?? d;
  if (level === "major") return cardDict.spoilerShortMajor;
  if (level === "minor") return cardDict.spoilerShortMinor;
  return null;
}
