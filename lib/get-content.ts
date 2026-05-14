import { Locale, i18n, ENGLISH_ACTIVE_IDS } from '@/lib/i18n-config'
import { HistoryCard, ReadingRoute } from '@/types'
import { getDailyCard } from '@/utils/daily'

export const isEnglishActiveCard = (id: string) => ENGLISH_ACTIVE_IDS.includes(id);

export const getCards = async (locale: Locale): Promise<HistoryCard[]> => {
  if (locale === 'en') {
    const cards = await import('@/data/cards.en.json').then(m => m.default as HistoryCard[]);
    // Strict boundary check: only whitelisted IDs from pre-cleaned cards.en.json
    return cards.filter(card => isEnglishActiveCard(card.id));
  }
  return import('@/data/cards.tr.json').then(m => m.default as HistoryCard[]);
}

export const getRoutes = async (locale: Locale): Promise<ReadingRoute[]> => {
  if (locale === 'en') {
    const routes = await import('@/data/routes.en.json').then(m => m.default as ReadingRoute[]);
    // Only show routes that have at least one active English card
    return routes.filter(route => 
      route.cardIds.some(id => isEnglishActiveCard(id))
    );
  }
  return import('@/data/routes.tr.json').then(m => m.default as ReadingRoute[]);
}

export const getGlobalDailyCardId = async (): Promise<string> => {
  const trCards = await import('@/data/cards.tr.json').then(m => m.default as HistoryCard[]);
  const daily = getDailyCard(trCards);
  return daily.id;
}
