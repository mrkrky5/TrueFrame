import React, { memo } from "react";

import HistoryCard from "@/components/HistoryCard";
import ListInlineAd from "@/components/ads/ListInlineAd";
import FadeSlideIn from "@/components/motion/FadeSlideIn";
import { motion } from "@/constants/motion";
import type { HistoryCard as Card } from "../../types/index";
import type { ReaderReturn } from "@/context/NavigationContext";

const STAGGER_MAX = 6;

type Props = {
  card: Card;
  index: number;
  isRead: boolean;
  isAnyFilterActive: boolean;
  exploreReturn: ReaderReturn;
};

function ExploreCatalogRow({
  card,
  index,
  isRead,
  isAnyFilterActive,
  exploreReturn,
}: Props) {
  const stagger = !isAnyFilterActive && index < STAGGER_MAX;
  const row = (
    <>
      <ListInlineAd index={index} placement="explore_inline" />
      <HistoryCard card={card} isRead={isRead} showPreview returnTo={exploreReturn} />
    </>
  );

  if (!stagger) return row;

  return (
    <FadeSlideIn enterKey={`${card.id}-${index}`} delay={index * motion.stagger}>
      {row}
    </FadeSlideIn>
  );
}

export default memo(ExploreCatalogRow);
