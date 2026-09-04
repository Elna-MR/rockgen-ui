import type { DiseaseDetail } from "@/lib/api";

/** Offline ALS hub catalog when Neo4j/API is unavailable. */
export const ALS_FALLBACK: DiseaseDetail = {
  slug: "als",
  name: "Amyotrophic lateral sclerosis",
  synopsis:
    "A progressive motor-neuron disease. RockGen maps program proteins (PFN1, TUBA4A) and shared mechanisms before molecule design.",
  protein_count: 5,
  proteins: [
    { uniprot_id: "P07737", symbol: "PFN1", name: "Profilin-1" },
    { uniprot_id: "P68366", symbol: "TUBA4A", name: "Tubulin alpha-4A chain" },
    { uniprot_id: "P00441", symbol: "SOD1", name: "Superoxide dismutase [Cu-Zn]" },
    { uniprot_id: "P35637", symbol: "FUS", name: "RNA-binding protein FUS" },
    { uniprot_id: "Q13148", symbol: "TARDBP", name: "TAR DNA-binding protein 43" },
  ],
  mutations: [
    { key: "PFN1:G118V", hgvs_p: "p.Gly118Val", significance: "Pathogenic association (familial ALS)" },
  ],
  biomarkers: [],
  clinical_trials: [],
  publications: [],
  drugs: [],
  drug_programs: [],
  experiments: [],
};
