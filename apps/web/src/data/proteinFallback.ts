import type { ProteinDetail } from "@/lib/api";

const BASE = {
  mutations: [] as ProteinDetail["mutations"],
  structures: [] as ProteinDetail["structures"],
  pathways: [] as ProteinDetail["pathways"],
  interaction_partners: [] as ProteinDetail["interaction_partners"],
  publications: [] as ProteinDetail["publications"],
  drug_programs: [] as ProteinDetail["drug_programs"],
};

/** Minimal protein records when the live API/Neo4j graph is down. */
export const PROTEIN_FALLBACK: Record<string, ProteinDetail> = {
  P07737: {
    ...BASE,
    uniprot_id: "P07737",
    symbol: "PFN1",
    name: "Profilin-1",
    length: 140,
    function:
      "Actin-binding protein involved in cytoskeletal dynamics. ALS-linked alleles (e.g. G118V) are a RockGen case study for misfolding and aggregation hypotheses.",
    gene: { symbol: "PFN1", name: "profilin 1" },
    mutations: [
      {
        key: "PFN1:G118V",
        hgvs_p: "p.Gly118Val",
        significance: "Pathogenic association (familial ALS)",
        position: 118,
        from_aa: "G",
        to_aa: "V",
      },
    ],
    structures: [{ id: "2PAV", source: "PDB", method: "X-ray", url: "https://www.rcsb.org/structure/2PAV" }],
  },
  P68366: {
    ...BASE,
    uniprot_id: "P68366",
    symbol: "TUBA4A",
    name: "Tubulin alpha-4A chain",
    function:
      "Alpha-tubulin isoform contributing to microtubules. Studied in RockGen alongside PFN1 for shared vs unique ALS mechanism routes.",
    gene: { symbol: "TUBA4A", name: "tubulin alpha 4a" },
  },
  P00441: {
    ...BASE,
    uniprot_id: "P00441",
    symbol: "SOD1",
    name: "Superoxide dismutase [Cu-Zn]",
    gene: { symbol: "SOD1" },
  },
  P35637: {
    ...BASE,
    uniprot_id: "P35637",
    symbol: "FUS",
    name: "RNA-binding protein FUS",
    gene: { symbol: "FUS" },
  },
  Q13148: {
    ...BASE,
    uniprot_id: "Q13148",
    symbol: "TARDBP",
    name: "TAR DNA-binding protein 43",
    gene: { symbol: "TARDBP" },
  },
};

export function proteinFallback(id: string): ProteinDetail | null {
  const upper = id.toUpperCase();
  if (PROTEIN_FALLBACK[upper]) return PROTEIN_FALLBACK[upper];
  const bySymbol = Object.values(PROTEIN_FALLBACK).find((p) => p.symbol === upper);
  return bySymbol ?? null;
}
