import InlineAdSlot from "@/components/ads/InlineAdSlot";
import { shouldShowListInlineAd, type AdPlacement } from "@/constants/ads";

type Props = {
  index: number;
  placement: AdPlacement;
};

/** Renders one inline banner after the configured list index. */
export default function ListInlineAd({ index, placement }: Props) {
  if (!shouldShowListInlineAd(index)) return null;
  return <InlineAdSlot placement={placement} />;
}
