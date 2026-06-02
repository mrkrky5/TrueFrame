import { useEffect } from "react";

import { initAds } from "@/utils/ads-init";

export default function AdsBootstrap() {
  useEffect(() => {
    void initAds();
  }, []);
  return null;
}
