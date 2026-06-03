import { useEffect, type RefObject } from "react";
import type { FlatList, ScrollView } from "react-native";

import { useNavigationTab, type PrimaryTab } from "@/context/NavigationContext";

type ScrollableRef = RefObject<ScrollView | FlatList<unknown> | null>;

export function useTabScrollToTop(tab: PrimaryTab, scrollRef: ScrollableRef) {
  const { registerTabScrollToTop } = useNavigationTab();

  useEffect(() => {
    const scrollToTop = () => {
      const node = scrollRef.current;
      if (!node) return;
      if ("scrollToOffset" in node) {
        node.scrollToOffset({ offset: 0, animated: true });
      } else if ("scrollTo" in node) {
        node.scrollTo({ y: 0, animated: true });
      }
    };
    return registerTabScrollToTop(tab, scrollToTop);
  }, [tab, scrollRef, registerTabScrollToTop]);
}
