import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { useNavigationTab, type PrimaryTab } from "@/context/NavigationContext";

/** Primary tab ekranı odaklandığında son sekme hafızasını günceller */
export function usePrimaryTabFocus(tab: PrimaryTab) {
  const { setLastPrimaryTab } = useNavigationTab();
  useFocusEffect(
    useCallback(() => {
      setLastPrimaryTab(tab);
    }, [tab, setLastPrimaryTab])
  );
}
