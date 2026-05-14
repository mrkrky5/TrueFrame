"use client";

import { useParams } from "next/navigation";
import NotFoundContent from "@/components/ui/NotFoundContent";
import { useDictionary } from "@/components/utils/DictionaryProvider";

export default function LocalizedNotFound() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const dictionary = useDictionary();

  return <NotFoundContent locale={lang} dictionary={dictionary} />;
}
