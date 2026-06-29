import { useEffect } from "react";

import { initAds } from "@/utils/ads-init";
import { primeInterstitial } from "@/utils/interstitial";

export default function AdsBootstrap() {
  useEffect(() => {
    void initAds().then(() => primeInterstitial());
  }, []);
  return null;
}
