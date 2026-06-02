import { useRouter } from "expo-router";

import { navigateDetailExit } from "@/utils/navigationExit";

export type DetailBackMode = "stack" | "replace";

/**
 * stack — modal / ayar ekranları: önce geri yığını, yoksa fallback.
 * replace — dosya detayı: yığın tuzağı olmasın diye doğrudan fallback.
 */
export function useDetailBack(fallbackHref: string, mode: DetailBackMode = "stack") {
  const router = useRouter();

  return () => {
    if (mode === "stack" && router.canGoBack()) {
      router.back();
      return;
    }
    navigateDetailExit(router, fallbackHref);
  };
}
