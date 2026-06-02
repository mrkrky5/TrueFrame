/** Paths where the floating tab bar should be hidden (detail / immersive screens). */
export function shouldHideTabBar(pathname: string): boolean {
  if (pathname.startsWith("/card/") && pathname.length > "/card/".length) return true;
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
