import { useEffect } from "react";

import { useLocale } from "@/context/LocaleContext";
import { prefetchCardImages } from "@/utils/imageCache";
import { getCards } from "@shared/content";

/** Locale kartlarının kapak görsellerini arka planda önbelleğe alır. */
export default function ImageCacheBootstrap() {
  const { locale } = useLocale();

  useEffect(() => {
    const cards = getCards(locale);
    void prefetchCardImages(cards);
  }, [locale]);

  return null;
}
