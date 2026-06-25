/**
 * Deep link / universal link URL parsing → Expo Router paths.
 */
export type DeepLinkTarget = {
  href: `/card/${string}` | `/explore/media/${string}` | `/routes/${string}`;
};

export function parseDeepLink(url: string): DeepLinkTarget | null {
  if (!url?.trim()) return null;

  try {
    const normalized = url.includes("://") ? url : `trueframe://${url}`;
    const parsed = new URL(normalized);

    const path = parsed.pathname.replace(/^\/+/, "");
    const host = parsed.hostname;

    if (parsed.protocol === "trueframe:") {
      const segments = path ? path.split("/").filter(Boolean) : host ? [host] : [];
      if (segments[0] === "card" && segments[1]) return { href: `/card/${segments[1]}` };
      if (segments[0] === "media" && segments[1]) return { href: `/explore/media/${segments[1]}` };
      if (segments[0] === "routes" && segments[1]) return { href: `/routes/${segments[1]}` };
      if (segments.length === 1 && segments[0]) return { href: `/card/${segments[0]}` };
    }

    if (host === "trueframe.app" || host === "www.trueframe.app") {
      const parts = path.split("/").filter(Boolean);
      const locale = parts[0];
      const kind = parts[1];
      const id = parts[2];
      if ((locale === "tr" || locale === "en") && kind === "card" && id) {
        return { href: `/card/${id}` };
      }
      if ((locale === "tr" || locale === "en") && kind === "media" && id) {
        return { href: `/explore/media/${id}` };
      }
      if (kind === "card" && id && !locale) {
        return { href: `/card/${id}` };
      }
    }
  } catch {
    return null;
  }

  return null;
}
