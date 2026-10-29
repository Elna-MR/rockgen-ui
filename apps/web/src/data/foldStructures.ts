/**
 * Experimentally solved structures drawn by FoldAssembly. Backbone and secondary-structure
 * records were trimmed from the PDB into /public/brand/folds/pdb/<id>.pdb.
 */
export const FOLD_STRUCTURES = [
  {
    id: "pfn1",
    name: "Profilin-1",
    meta: "PFN1 · actin assembly · familial ALS",
    heroCaption: "ALS · actin dynamics",
    source: "PDB 1FIL · human profilin-1 · X-ray 2.0 Å",
  },
  {
    id: "sod1",
    name: "Superoxide dismutase",
    meta: "SOD1 · oxidative stress · ALS",
    heroCaption: "ALS · oxidative stress",
    source: "PDB 2C9V · human SOD1, chain A · X-ray 1.07 Å",
  },
  {
    id: "snca",
    name: "α-synuclein",
    meta: "SNCA · Lewy pathology · Parkinson’s",
    heroCaption: "Parkinson’s · Lewy pathology",
    source: "PDB 1XQ8 · micelle-bound form, NMR. Free α-synuclein is largely disordered.",
  },
  {
    id: "mapt",
    name: "Tau",
    meta: "MAPT · microtubules · Alzheimer’s",
    heroCaption: "Alzheimer’s · tau filament",
    source: "PDB 5O3L · one chain of the Alzheimer’s paired helical filament, cryo-EM",
  },
  {
    id: "htt",
    name: "Huntingtin",
    meta: "HTT · polyglutamine · Huntington’s",
    heroCaption: "Huntington’s · polyglutamine",
    source: "PDB 6X9O · huntingtin chain A from the HAP40 complex, cryo-EM",
  },
  {
    id: "tardbp",
    name: "TDP-43",
    meta: "TARDBP · RNA binding · FTD / ALS",
    heroCaption: "FTD / ALS · RNA binding",
    source: "PDB 4BS2 · RRM1–2 domains with RNA, NMR (first model)",
  },
] as const;

export type FoldId = (typeof FOLD_STRUCTURES)[number]["id"];
