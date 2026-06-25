import { useEffect, useRef } from "react";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

import { parseDeepLink } from "@shared/deepLink";

/** Opens card/dossier/route URLs from universal links or trueframe:// scheme. */
export default function DeepLinkBootstrap() {
  const router = useRouter();
  const handled = useRef(new Set<string>());

  useEffect(() => {
    const open = (raw: string | null) => {
      if (!raw || handled.current.has(raw)) return;
      const target = parseDeepLink(raw);
      if (!target) return;
      handled.current.add(raw);
      router.push(target.href as never);
    };

    void Linking.getInitialURL().then(open);
    const sub = Linking.addEventListener("url", ({ url }) => open(url));
    return () => sub.remove();
  }, [router]);

  return null;
}
