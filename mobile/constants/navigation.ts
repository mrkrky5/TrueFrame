/** Paths where the floating tab bar should be hidden (in-tab detail screens). */
export function shouldHideTabBar(_pathname: string): boolean {
  // Keep the bar mounted on all tab-stack screens. Hiding on /routes/[id] or
  // /explore/media/* unmounts it; pathname lags on back from /card/* → 1–2s flicker.
  // Card reader lives on the root stack and covers the bar without hiding here.
  return false;
}

/** Which primary tab should appear active for a detail pathname. */
export function detailTabFromPathname(pathname: string): "routes" | "explore" | null {
  if (pathname.startsWith("/routes/") && pathname !== "/routes") return "routes";
  if (pathname.startsWith("/explore/media/")) return "explore";
  return null;
}
