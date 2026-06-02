import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

import { adsConfig, getBannerUnitId, type AdPlacement } from "@/constants/ads";

type Props = {
  placement: AdPlacement;
};

export default function AdBanner({ placement }: Props) {
  const unitId = getBannerUnitId(placement);
  const [failed, setFailed] = useState(false);

  if (!adsConfig.enabled || !unitId || failed) {
    return null;
  }

  return (
    <View style={styles.bannerWrap}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerWrap: {
    width: "100%",
    alignItems: "center",
    overflow: "hidden",
  },
});
