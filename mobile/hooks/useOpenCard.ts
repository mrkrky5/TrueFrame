import { useRouter } from "expo-router";

import { useNavigationTab, type ReaderReturn } from "@/context/NavigationContext";
import { navigateToCard } from "@/utils/navigationExit";
import { maybeShowInterstitial } from "@/utils/interstitial";

export function useOpenCard() {
  const router = useRouter();
  const { setReaderReturn } = useNavigationTab();

  return (cardId: string, returnTo: ReaderReturn, mode: "push" | "replace" = "push") => {
    maybeShowInterstitial();
    navigateToCard(router, cardId, setReaderReturn, returnTo, mode);
  };
}
