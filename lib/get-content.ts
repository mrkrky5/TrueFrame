import { Locale, i18n, ENGLISH_ACTIVE_IDS } from '@/lib/i18n-config'
import { HistoryCard, ReadingRoute } from '@/types'
import { getDailyCard } from '@/utils/daily'

import fs from 'fs';
import path from 'path';

export const isEnglishActiveCard = (id: string) => ENGLISH_ACTIVE_IDS.includes(id);

export const getCards = async (locale: Locale): Promise<HistoryCard[]> => {
  const filePath = path.join(process.cwd(), `data/cards.${locale === 'en' ? 'en' : 'tr'}.json`);
  const cards = JSON.parse(fs.readFileSync(filePath, 'utf8')) as HistoryCard[];
  
  if (locale === 'en') {
    return cards.filter(card => isEnglishActiveCard(card.id));
  }
  return cards;
}

export const getRoutes = async (locale: Locale): Promise<ReadingRoute[]> => {
  const filePath = path.join(process.cwd(), `data/routes.${locale === 'en' ? 'en' : 'tr'}.json`);
  const routes = JSON.parse(fs.readFileSync(filePath, 'utf8')) as ReadingRoute[];

  if (locale === 'en') {
    return routes.filter(route => 
      route.cardIds.some(id => isEnglishActiveCard(id))
    );
  }
  return routes;
}

export const getGlobalDailyCardId = async (): Promise<string> => {
  const trCards = await import('@/data/cards.tr.json').then(m => m.default as HistoryCard[]);
  const daily = getDailyCard(trCards);
  return daily.id;
}
