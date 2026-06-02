import type { MediaDossier } from "./dossier";

function dossierGroup(dossier: MediaDossier, readIds: string[]): "active" | "complete" {
  const done = dossier.cardIds.filter((id) => readIds.includes(id)).length;
  if (dossier.cardIds.length > 0 && done >= dossier.cardIds.length) return "complete";
  return "active";
}

/** Incomplete dossiers first; fully read collections sink and fade in UI. */
export function sortDossiersByReadState(dossiers: MediaDossier[], readIds: string[]): MediaDossier[] {
  const indexed = dossiers.map((dossier, index) => ({ dossier, index }));
  indexed.sort((a, b) => {
    const ga = dossierGroup(a.dossier, readIds) === "complete" ? 1 : 0;
    const gb = dossierGroup(b.dossier, readIds) === "complete" ? 1 : 0;
    if (ga !== gb) return ga - gb;
    return a.index - b.index;
  });
  return indexed.map((x) => x.dossier);
}

export function isDossierComplete(dossier: MediaDossier, readIds: string[]): boolean {
  return dossierGroup(dossier, readIds) === "complete";
}
