import { HistoryCard } from "@/types";

export function getDailyCard(cards: HistoryCard[]) {
  const today = new Date();
  // Stable seed based on date
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  const candidates = cards.filter(c => c.isFlagship || c.quickRealityCheck);
  if (candidates.length === 0) return cards[0];
  
  // Sort by ID for stability across versions if the order changes
  const sortedCandidates = [...candidates].sort((a, b) => a.id.localeCompare(b.id));
  
  const index = dateSeed % sortedCandidates.length;
  return sortedCandidates[index];
}
