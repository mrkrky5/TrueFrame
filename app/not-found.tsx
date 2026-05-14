"use client";

import { usePathname } from "next/navigation";
import NotFoundContent from "@/components/ui/NotFoundContent";

export default function RootNotFound() {
  const pathname = usePathname();
  // Try to guess locale from pathname even if it's the root 404
  const locale = pathname?.startsWith('/tr') ? 'tr' : 'en';

  return <NotFoundContent locale={locale} />;
}
