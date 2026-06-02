import { useRouter } from "expo-router";

import { useNavigationTab } from "@/context/NavigationContext";
import { navigateReaderExit } from "@/utils/navigationExit";

export function useReaderBack() {
  const router = useRouter();
  const { lastPrimaryTab, readerReturn } = useNavigationTab();

  return () => {
    navigateReaderExit(router, readerReturn, lastPrimaryTab);
  };
}
