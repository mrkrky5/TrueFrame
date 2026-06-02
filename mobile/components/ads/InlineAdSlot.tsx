import AdBanner from "@/components/ads/AdBanner";
import AdSlotFrame from "@/components/ads/AdSlotFrame";
import { canShowAds } from "@/constants/ads";

/** Browsing surfaces — e.g. Explore catalog list. */
export default function InlineAdSlot() {
  if (!canShowAds()) return null;

  return (
    <AdSlotFrame>
      <AdBanner placement="explore_inline" />
    </AdSlotFrame>
  );
}
