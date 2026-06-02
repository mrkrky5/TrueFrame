import { Platform } from "react-native";

import type { AdPlacement } from "@/constants/ads";

type Props = {
  placement: AdPlacement;
};

/** Web: native AdMob SDK is unavailable. */
export default function AdBanner(_props: Props) {
  if (__DEV__ && Platform.OS === "web") {
    return null;
  }
  return null;
}
