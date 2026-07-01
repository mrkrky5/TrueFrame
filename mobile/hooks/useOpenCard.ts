import { useRouter } from "expo-router";

import { useNavigationTab, type ReaderReturn } from "@/context/NavigationContext";
import { navigateToCard } from "@/utils/navigationExit";

export function useOpenCard() {
  const router = useRouter();
  const { setReaderReturn } = useNavigationTab();

  return (cardId: string, returnTo: ReaderReturn, mode: "push" | "replace" = "push") => {
    navigateToCard(router, cardId, setReaderReturn, returnTo, mode);
  };
}
