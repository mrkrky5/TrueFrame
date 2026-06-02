import type { PrimaryTab, ReaderReturn } from "@/context/NavigationContext";

type RouterReplace = { replace: (href: never) => void };
type RouterPushReplace = { push: (href: never) => void; replace: (href: never) => void };

const TAB_HREF: Record<PrimaryTab, string> = {
  index: "/",
  explore: "/explore",
  routes: "/routes",
  saved: "/saved",
};

export function hrefForReaderReturn(target: ReaderReturn): string {
  switch (target.kind) {
    case "route":
      return `/routes/${target.routeId}`;
    case "dossier":
      return `/explore/media/${target.slug}`;
    case "tab":
      return TAB_HREF[target.tab];
  }
}

/** Leave card reader to the screen the user entered from (not history stack). */
export function navigateReaderExit(
  router: RouterReplace,
  readerReturn: ReaderReturn | null,
  lastPrimaryTab: PrimaryTab
): void {
  const target = readerReturn ?? { kind: "tab", tab: lastPrimaryTab };
  router.replace(hrefForReaderReturn(target) as never);
}

/** Leave dossier/route detail — always replace to avoid dossier→dossier stack traps. */
export function navigateDetailExit(router: RouterReplace, fallbackHref: string): void {
  router.replace(fallbackHref as never);
}

export function navigateToCard(
  router: RouterPushReplace,
  cardId: string,
  setReaderReturn: (value: ReaderReturn) => void,
  returnTo: ReaderReturn,
  mode: "push" | "replace" = "push"
): void {
  setReaderReturn(returnTo);
  const href = `/card/${cardId}` as never;
  if (mode === "replace") {
    router.replace(href);
  } else {
    router.push(href);
  }
}
