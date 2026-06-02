import { CARD_ID_ALIASES, normalizeCardIds, resolveCardId } from "../shared/cardAliases";

export { CARD_ID_ALIASES, resolveCardId, normalizeCardIds };

export function getCardAliasIds(): string[] {
  return Object.keys(CARD_ID_ALIASES);
}
