import type { ReactNode } from "react";
import FadeSlideIn from "@/components/motion/FadeSlideIn";

type Props = {
  children: ReactNode;
};

/** Icon → title → body stagger for empty states. */
export default function EmptyStateEnter({ children }: Props) {
  return <FadeSlideIn enterKey="empty">{children}</FadeSlideIn>;
}

export function EmptyStateIcon({ children }: { children: ReactNode }) {
  return <FadeSlideIn delay={0}>{children}</FadeSlideIn>;
}

export function EmptyStateText({ children, delay = 50 }: { children: ReactNode; delay?: number }) {
  return <FadeSlideIn delay={delay}>{children}</FadeSlideIn>;
}
