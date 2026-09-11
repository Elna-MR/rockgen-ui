/** Curated display metadata for familial ALS network genes. */

export type GeneProgramme = {
  name: string;
  status: "approved" | "clinic" | "preclinical" | "discontinued";
  note?: string;
};

export type GeneDetail = {
  id: string;
  fullName: string;
  summary: string;
  locus?: string;
  programmes?: GeneProgramme[];
};

export const MODULE_LABEL: Record<string, string> = {
  rna: "RNA",
  pro: "Proteostasis",
  cyt: "Cytoskeleton",
  mit: "Mitochondria, lipid",
  ddr: "DNA damage",
  oth: "Modifier",
};

/** Match the curated viewer palette from the fALS network reference. */
export const MODULE_COLOR: Record<string, string> = {
  rna: "#4C7BD9",
  pro: "#D4543C",
  cyt: "#3FA36A",
  mit: "#D4A017",
  ddr: "#7B5EA7",
  oth: "#8A93A0",
};

export const STATUS_COLOR: Record<GeneProgramme["status"], string> = {
  approved: "#2F9E5F",
  clinic: "#3B82C4",
  preclinical: "#8A93A0",
  discontinued: "#C0392B",
};

export const STATUS_LABEL: Record<GeneProgramme["status"], string> = {
  approved: "Approved",
  clinic: "In clinic",
  preclinical: "Preclinical",
  discontinued: "Discontinued",
};

const DETAILS: Record<string, GeneDetail> = {
  C9orf72: {
    id: "C9orf72",
    fullName: "Chromosome 9 open reading frame 72",
    locus: "9p21.2",
    summary:
      "Most common genetic cause of fALS / FTD in European ancestry. Hexanucleotide repeat expansion; RNA foci and DPR proteinopathy themes.",
    programmes: [
      {
        name: "BIIB078",
        status: "discontinued",
        note: "ASO against C9orf72 — discontinued",
      },
      {
        name: "WVE-004",
        status: "discontinued",
        note: "ASO — discontinued",
      },
      {
        name: "PBFT02",
        status: "clinic",
        note: "Passage Bio IV progranulin, phase 1/2 in C9-FTD",
      },
      {
        name: "Base editing",
        status: "preclinical",
      },
    ],
  },
  SOD1: {
    id: "SOD1",
    fullName: "Superoxide dismutase 1",
    locus: "21q22.11",
    summary:
      "Classic fALS gene. Misfolding and aggregation of mutant SOD1 remain central teaching cases for mechanism-first thinking.",
    programmes: [
      { name: "Tofersen (Qalsody)", status: "approved", note: "SOD1 ASO — approved in selected settings" },
      { name: "Other SOD1 ASOs", status: "clinic" },
    ],
  },
  TARDBP: {
    id: "TARDBP",
    fullName: "TAR DNA-binding protein 43 (TDP-43)",
    locus: "1p36.22",
    summary: "RNA-binding protein; TDP-43 proteinopathy is a hallmark pathology across ALS and related spectrum disease.",
  },
  FUS: {
    id: "FUS",
    fullName: "Fused in sarcoma",
    locus: "16p11.2",
    summary: "RNA/DNA-binding protein; nuclear-cytoplasmic mislocalization themes overlap with other RBP genes.",
  },
  ATXN2: {
    id: "ATXN2",
    fullName: "Ataxin-2",
    locus: "12q24.12",
    summary: "Intermediate polyQ expansions associate with ALS risk; RNA metabolism and stress-granule context.",
    programmes: [{ name: "ATXN2 ASO programmes", status: "clinic" }],
  },
  PFN1: {
    id: "PFN1",
    fullName: "Profilin-1",
    locus: "17p13.2",
    summary: "Actin dynamics; RockGen program focus protein with alleles such as G118V.",
  },
  TUBA4A: {
    id: "TUBA4A",
    fullName: "Tubulin alpha-4A",
    locus: "2q35",
    summary: "Microtubule subunit; axonal transport and cytoskeleton stress context. RockGen program focus protein.",
  },
  TBK1: {
    id: "TBK1",
    fullName: "TANK-binding kinase 1",
    locus: "12q14.2",
    summary: "Innate immunity / autophagy signalling; links proteostasis and inflammation themes in ALS genetics.",
  },
  OPTN: {
    id: "OPTN",
    fullName: "Optineurin",
    locus: "10p13",
    summary: "Autophagy adaptor; NF-κB and mitophagy-related hypotheses.",
  },
  SQSTM1: {
    id: "SQSTM1",
    fullName: "Sequestosome-1 / p62",
    locus: "5q35.3",
    summary: "Selective autophagy receptor; frequent teaching link between proteostasis and ALS–FTD spectrum.",
  },
  VCP: {
    id: "VCP",
    fullName: "Valosin-containing protein",
    locus: "9p13.3",
    summary: "AAA+ ATPase in protein quality control; multisystem proteinopathy overlap.",
  },
  KIF5A: {
    id: "KIF5A",
    fullName: "Kinesin family member 5A",
    locus: "12q13.3",
    summary: "Anterograde axonal transport motor; cytoskeleton / transport module.",
  },
  NEK1: {
    id: "NEK1",
    fullName: "NIMA-related kinase 1",
    locus: "4q33",
    summary: "DNA damage response and cilia biology; growing genetic support in ALS cohorts.",
  },
};

export function getGeneDetail(id: string): GeneDetail {
  return (
    DETAILS[id] || {
      id,
      fullName: id,
      summary: "Familial ALS panel gene. Expand evidence in Research tools; frequencies are approximate.",
    }
  );
}

export function primaryProgrammeStatus(
  id: string
): GeneProgramme["status"] | null {
  const programmes = DETAILS[id]?.programmes;
  if (!programmes?.length) return null;
  const order: GeneProgramme["status"][] = ["approved", "clinic", "preclinical", "discontinued"];
  for (const s of order) {
    if (programmes.some((p) => p.status === s)) return s;
  }
  return programmes[0]?.status ?? null;
}
