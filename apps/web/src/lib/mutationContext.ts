import { aaClass, gravy, type AaClass } from "@/lib/proteinChemistry";

const THREE: Record<string, string> = {
  ALA: "A",
  ARG: "R",
  ASN: "N",
  ASP: "D",
  CYS: "C",
  GLN: "Q",
  GLU: "E",
  GLY: "G",
  HIS: "H",
  ILE: "I",
  LEU: "L",
  LYS: "K",
  MET: "M",
  PHE: "F",
  PRO: "P",
  SER: "S",
  THR: "T",
  TRP: "W",
  TYR: "Y",
  VAL: "V",
};

const GENE_SEARCH: Record<string, string> = {
  PFN1: "profilin-1",
  PROFILIN: "profilin-1",
  PROFILIN1: "profilin-1",
  TUBA4A: "tubulin alpha-4a",
  SOD1: "superoxide dismutase 1",
  FUS: "FUS RNA binding protein",
  TARDBP: "TDP-43",
  TDP43: "TDP-43",
  C9ORF72: "C9orf72",
};

export type ParsedMutation = {
  target: string;
  pdbId: string | null;
  wt: string;
  mt: string;
  pos: number;
  label: string;
  searchTerm: string;
};

export type PatchResidue = {
  pos: number;
  aa: string;
  chem: AaClass;
  isMutation: boolean;
};

export type MutationSiteReport = {
  verdict: "yes" | "partial" | "no";
  headline: string;
  detail: string;
  wtMatch: boolean | null;
  observedWt: string | null;
  windowGravy: number;
  chargedNeighbors: number;
  polarNeighbors: number;
  hydrophobicNeighbors: number;
  patch: PatchResidue[];
};

function canonAa(x: string): string | null {
  const u = x.toUpperCase();
  if (u.length === 1 && /[A-Z]/.test(u)) return u;
  if (u.length === 3) return THREE[u] || null;
  return null;
}

/** Parse Complement-style queries: PFN1-G118V, G118V, KRAS G12C, 2PAV G118V */
export function parseMutationQuery(raw: string): ParsedMutation | null {
  const s = raw.trim().replace(/\s+/g, " ");
  if (!s) return null;
  const t =
    /(?:p\.)?\(?([A-Za-z]{3}|[A-Za-z])[\s\-_.]*(\d+)[\s\-_.]*([A-Za-z]{3}|[A-Za-z])\)?\s*$/.exec(
      s,
    );
  if (!t) return null;
  const wt = canonAa(t[1]);
  const mt = canonAa(t[3]);
  if (!wt || !mt) return null;
  let target = s.slice(0, t.index).replace(/[\s\-_:,.]+$/g, "").trim();
  let pdbId: string | null = null;
  const pm = /\b([0-9][A-Za-z0-9]{3})\b/.exec(target);
  if (pm && target.replace(pm[0], "").trim().length === 0) {
    pdbId = pm[1].toUpperCase();
    target = "";
  }
  const geneKey = target.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const searchTerm = pdbId || GENE_SEARCH[geneKey] || (target ? target : "profilin-1");
  return {
    target,
    pdbId,
    wt,
    mt,
    pos: Number(t[2]),
    label: `${wt}${t[2]}${mt}`,
    searchTerm,
  };
}

/**
 * Sequence-local site gate inspired by Complement.
 * Full surface geometry needs coordinates; this is the chemistry-first filter.
 */
export function assessMutationSite(
  sequence: string,
  mut: ParsedMutation,
  window = 8,
): MutationSiteReport {
  const seq = sequence.toUpperCase().replace(/[^A-Z]/g, "");
  const pos = mut.pos;
  const observed = pos >= 1 && pos <= seq.length ? seq[pos - 1] : null;
  const wtMatch = observed == null ? null : observed === mut.wt;

  const start = Math.max(1, pos - window);
  const end = Math.min(seq.length, pos + window);
  const patch: PatchResidue[] = [];
  let charged = 0;
  let polar = 0;
  let hydrophobic = 0;
  let windowSeq = "";

  for (let p = start; p <= end; p++) {
    const aa = seq[p - 1];
    windowSeq += aa;
    const chem = aaClass(aa);
    patch.push({ pos: p, aa, chem, isMutation: p === pos });
    if (p === pos) continue;
    if (chem === "basic" || chem === "acidic") charged += 1;
    else if (chem === "polar") polar += 1;
    else if (chem === "hydrophobic") hydrophobic += 1;
  }

  const windowGravy = gravy(windowSeq);
  let verdict: MutationSiteReport["verdict"] = "partial";
  let headline = "Site context is ambiguous from sequence alone.";
  let detail =
    "Local chemistry is mixed. Use the 3D fold to judge whether the side chain faces solvent or packing.";

  if (observed == null) {
    verdict = "no";
    headline = "Mutation position is outside this chain’s sequence.";
    detail = `Asked for ${mut.label}, but this polymer is ${seq.length} residues. Pick another structure or chain.`;
  } else if (wtMatch === false) {
    verdict = "partial";
    headline = `Sequence has ${observed}${pos}, not ${mut.wt}${pos}.`;
    detail =
      "Numbering may differ between UniProt and this PDB entity, or this is a different isoform/construct. Treat mapping with care.";
  } else if (windowGravy < -0.5 || charged + polar >= hydrophobic) {
    verdict = "yes";
    headline = `${mut.label} sits in a relatively polar local window.`;
    detail =
      "Neighborhood chemistry is not a deep hydrophobic core — a candidate surface/interface site to inspect in 3D (Complement-style first gate).";
  } else if (windowGravy > 0.8 && hydrophobic >= charged + polar + 2) {
    verdict = "partial";
    headline = `${mut.label} sits in a hydrophobic-leaning window.`;
    detail =
      "Local GRAVY is high — often buried or packing-critical. Confirm exposure in the 3D view.";
  } else {
    verdict = "partial";
    headline = `${mut.label} maps to the deposited sequence.`;
    detail =
      "WT letter matches. Inspect the local patch and the 3D fold for exposure and neighbor chemistry.";
  }

  return {
    verdict,
    headline,
    detail,
    wtMatch,
    observedWt: observed,
    windowGravy,
    chargedNeighbors: charged,
    polarNeighbors: polar,
    hydrophobicNeighbors: hydrophobic,
    patch,
  };
}

export const ALS_MUTATION_CHIPS = [
  { label: "PFN1-G118V", q: "PFN1-G118V" },
  { label: "PFN1-C71G", q: "PFN1-C71G" },
  { label: "PFN1-T109M", q: "PFN1-T109M" },
  { label: "TUBA4A-R320C", q: "TUBA4A-R320C" },
  { label: "SOD1-A4V", q: "SOD1-A4V" },
];
