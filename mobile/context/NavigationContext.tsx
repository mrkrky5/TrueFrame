import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type PrimaryTab = "index" | "explore" | "routes" | "saved";

export type ReaderReturn =
  | { kind: "route"; routeId: string }
  | { kind: "dossier"; slug: string }
  | { kind: "tab"; tab: PrimaryTab };

type NavigationContextValue = {
  lastPrimaryTab: PrimaryTab;
  setLastPrimaryTab: (tab: PrimaryTab) => void;
  readerReturn: ReaderReturn | null;
  setReaderReturn: (value: ReaderReturn | null) => void;
  getExploreScrollOffset: () => number;
  setExploreScrollOffset: (offset: number) => void;
  tabBarSuppressed: boolean;
  setTabBarSuppressed: (value: boolean) => void;
};

const NavigationContext = createContext<NavigationContextValue>({
  lastPrimaryTab: "index",
  setLastPrimaryTab: () => {},
  readerReturn: null,
  setReaderReturn: () => {},
  getExploreScrollOffset: () => 0,
  setExploreScrollOffset: () => {},
  tabBarSuppressed: false,
  setTabBarSuppressed: () => {},
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [lastPrimaryTab, setLastPrimaryTabState] = useState<PrimaryTab>("index");
  const [readerReturn, setReaderReturnState] = useState<ReaderReturn | null>(null);
  const [tabBarSuppressed, setTabBarSuppressedState] = useState(false);
  const exploreScrollOffsetRef = useRef(0);

  const setLastPrimaryTab = useCallback((tab: PrimaryTab) => {
    setLastPrimaryTabState(tab);
  }, []);

  const setReaderReturn = useCallback((value: ReaderReturn | null) => {
    setReaderReturnState(value);
  }, []);

  const setExploreScrollOffset = useCallback((offset: number) => {
    exploreScrollOffsetRef.current = offset;
  }, []);

  const setTabBarSuppressed = useCallback((value: boolean) => {
    setTabBarSuppressedState(value);
  }, []);

  const getExploreScrollOffset = useCallback(() => exploreScrollOffsetRef.current, []);

  const value = useMemo(
    () => ({
      lastPrimaryTab,
      setLastPrimaryTab,
      readerReturn,
      setReaderReturn,
      getExploreScrollOffset,
      setExploreScrollOffset,
      tabBarSuppressed,
      setTabBarSuppressed,
    }),
    [
      lastPrimaryTab,
      setLastPrimaryTab,
      readerReturn,
      setReaderReturn,
      getExploreScrollOffset,
      setExploreScrollOffset,
      tabBarSuppressed,
      setTabBarSuppressed,
    ]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigationTab() {
  return useContext(NavigationContext);
}

/** Which primary tab should glow when a detail screen is open */
export function detailScreenParentTab(routeName: string, lastPrimaryTab: PrimaryTab): PrimaryTab {
  if (routeName === "route/[id]") return "routes";
  if (routeName === "media/[slug]") return "explore";
  if (routeName === "card/[id]") return lastPrimaryTab;
  return lastPrimaryTab;
}
