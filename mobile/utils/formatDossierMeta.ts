import type { MediaDossier } from "@shared/dossier";

type DictionaryCommon = {
  exploreDossierCardCountOne?: string;
  exploreDossierCardCountMany?: string;
  exploreDossierReadTime?: string;
  exploreDossierFlagshipOne?: string;
  exploreDossierFlagshipMany?: string;
  cardsCountLabel?: string;
  minutes?: string;
  flagship?: string;
};

function fillCount(template: string | undefined, count: number, fallback: string) {
  return (template ?? fallback).replace("{{count}}", String(count));
}

export function formatExploreDossierMeta(
  dossier: MediaDossier,
  dictionary: { common: DictionaryCommon },
  locale: string
) {
  const c = dictionary.common;
  const cardFallback =
    locale === "en"
      ? `{{count}} ${c.cardsCountLabel ?? "cards"}`
      : `{{count}} ${c.cardsCountLabel ?? "kart"}`;
  const readFallback =
    locale === "en"
      ? `{{count}} min read`
      : `{{count}} ${c.minutes ?? "dk"} okuma`;
  const flagshipFallback =
    locale === "en" ? "{{count}} deep reads" : `{{count}} ${c.flagship ?? "derin dosya"}`;

  const cardTpl =
    dossier.cardIds.length === 1 && locale === "en"
      ? c.exploreDossierCardCountOne
      : c.exploreDossierCardCountMany;
  const parts = [
    fillCount(cardTpl, dossier.cardIds.length, cardFallback),
    fillCount(c.exploreDossierReadTime, dossier.totalReadingTime, readFallback),
  ];

  if (dossier.flagshipCount > 0) {
    const flagshipTpl =
      dossier.flagshipCount === 1 && locale === "en"
        ? c.exploreDossierFlagshipOne
        : c.exploreDossierFlagshipMany;
    parts.push(fillCount(flagshipTpl, dossier.flagshipCount, flagshipFallback));
  }

  return parts.join(" · ");
}

export function formatDossierCollectionProgress(
  dictionary: { common?: { dossierCollection?: string } },
  done: number,
  total: number
): string {
  const template = dictionary.common?.dossierCollection ?? "{{done}}/{{total}}";
  return template.replace("{{done}}", String(done)).replace("{{total}}", String(total));
}

export function formatDossierRemainingLabel(
  dictionary: { explore?: { dossierRemaining?: string } },
  left: number,
  total: number
): string {
  const template = dictionary.explore?.dossierRemaining ?? "{{left}}/{{total}} left";
  return template.replace("{{left}}", String(left)).replace("{{total}}", String(total));
}
