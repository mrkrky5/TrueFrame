import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getDictionary, type Dictionary } from "@shared/dictionary";
import { i18n, type Locale } from "@shared/i18n";

const STORAGE_KEY = "app_locale";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
  localeReady: boolean;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: i18n.defaultLocale,
  dictionary: getDictionary(i18n.defaultLocale),
  setLocale: () => {},
  localeReady: false,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(i18n.defaultLocale);
  const [localeReady, setLocaleReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw === "tr" || raw === "en") setLocaleState(raw);
      setLocaleReady(true);
    });
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      dictionary: getDictionary(locale),
      setLocale,
      localeReady,
    }),
    [locale, setLocale, localeReady]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
