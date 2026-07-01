/** Paths where the floating tab bar should be hidden (in-tab detail screens). */
export function shouldHideTabBar(pathname: string): boolean {
  // Card reader lives on the root stack above tabs — it already covers the bar.
  // Hiding here unmounts the bar and pathname lags on back, causing a 1–2s gap.
  if (pathname.startsWith("/routes/") && pathname !== "/routes") return true;
  if (pathname.startsWith("/explore/media/")) return true;
  return false;
}

/** Which primary tab should appear active for a detail pathname. */
export function detailTabFromPathname(pathname: string): "routes" | "explore" | null {
  if (pathname.startsWith("/routes/") && pathname !== "/routes") return "routes";
  if (pathname.startsWith("/explore/media/")) return "explore";
  return null;
}
