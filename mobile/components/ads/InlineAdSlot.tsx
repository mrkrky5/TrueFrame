import AdBanner from "@/components/ads/AdBanner";
import AdSlotFrame from "@/components/ads/AdSlotFrame";
import { canShowAds, type AdPlacement } from "@/constants/ads";

type Props = {
  placement?: AdPlacement;
};

/** Browsing surfaces — catalog / library / route lists. */
export default function InlineAdSlot({ placement = "explore_inline" }: Props) {
  if (!canShowAds()) return null;

  return (
    <AdSlotFrame>
      <AdBanner placement={placement} />
    </AdSlotFrame>
  );
}
