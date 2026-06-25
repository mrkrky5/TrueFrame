import { useCallback, useState } from "react";

import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { useCards } from "@/context/ContentContext";
import { getRoutes } from "@shared/content";
import { detectRouteJustCompleted, getNextIncompleteRoute, type RouteCompletion } from "@shared/routeCompletion";

export function useCompleteReading(cardId: string) {
  const { markAsRead, readIds } = useHistory();
  const { locale } = useLocale();
  const cards = useCards();
  const routes = getRoutes(locale);
  const [routeCompletion, setRouteCompletion] = useState<RouteCompletion | null>(null);

  const completeReading = useCallback(() => {
    const completion = detectRouteJustCompleted(cardId, readIds, routes, cards);
    markAsRead(cardId);
    if (completion) {
      const nextReadIds = readIds.includes(cardId) ? readIds : [...readIds, cardId];
      const nextRoute = getNextIncompleteRoute(routes, cards, nextReadIds, completion.routeId);
      setRouteCompletion({
        ...completion,
        nextRouteId: nextRoute?.id,
        nextRouteTitle: nextRoute?.title,
      });
    }
  }, [cardId, readIds, routes, cards, markAsRead]);

  const dismissRouteCompletion = useCallback(() => setRouteCompletion(null), []);

  return { completeReading, routeCompletion, dismissRouteCompletion };
}
