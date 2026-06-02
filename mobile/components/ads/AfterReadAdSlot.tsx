import AdBanner from "@/components/ads/AdBanner";
import AdSlotFrame from "@/components/ads/AdSlotFrame";
import { canShowAds } from "@/constants/ads";

/** After user finishes a read — below primary actions, never inside article body. */
export default function AfterReadAdSlot() {
  if (!canShowAds()) return null;

  return (
    <AdSlotFrame>
      <AdBanner placement="after_read" />
    </AdSlotFrame>
  );
}
