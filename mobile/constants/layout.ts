import { Platform } from "react-native";

/** Custom tab bar content height (excluding safe area) */
export const TAB_BAR_HEIGHT = 56;

export const TAB_BAR_MARGIN = Platform.OS === "web" ? 12 : 8;

export { shouldHideTabBar, detailTabFromPathname } from "@/constants/navigation";

/** @deprecated Use shouldHideTabBar(pathname) */
export function isDetailTabRoute(_routeName: string): boolean {
  return false;
}

/** Total vertical space reserved above screen bottom for floating tab bar */
export function tabBarBottomInset(safeBottom: number) {
  return TAB_BAR_HEIGHT + TAB_BAR_MARGIN + Math.max(safeBottom, Platform.OS === "web" ? 12 : 0);
}

/** Bottom padding for scroll content — tab bar hidden on detail/reader screens */
export function screenBottomInset(safeBottom: number, options?: { includeTabBar?: boolean }) {
  const includeTabBar = options?.includeTabBar ?? true;
  if (!includeTabBar) return Math.max(safeBottom, 16);
  return tabBarBottomInset(safeBottom) + 16;
}

/** Bottom offset for fixed reader controls when tab bar is hidden */
export function readerControlsBottom(safeBottom: number) {
  return Math.max(safeBottom, 12);
}
