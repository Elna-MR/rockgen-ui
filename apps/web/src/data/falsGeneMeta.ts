/** Curated fALS gene notes, programmes, and colors (from the reference network viewer). */

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
  /** Short hover text (programme pipeline note when available). */
  hoverNote?: string;
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

export const MODULE_COLOR: Record<string, string> = {
  rna: "#2a78d6",
  pro: "#eb6834",
  cyt: "#1baf7a",
  mit: "#eda100",
  ddr: "#6250d6",
  oth: "#898781",
};

export const STATUS_COLOR: Record<GeneProgramme["status"], string> = {
  approved: "#008300",
  clinic: "#2a78d6",
  preclinical: "#898781",
  discontinued: "#d03b3b",
};

export const STATUS_LABEL: Record<GeneProgramme["status"], string> = {
  approved: "Approved",
  clinic: "In clinic",
  preclinical: "Preclinical",
  discontinued: "Discontinued",
};

/** Primary ring status + full hover blurb from the curated viewer. */
export const PROGRAMME_BLURB: Record<
  string,
  { status: GeneProgramme["status"]; blurb: string }
> = {
  SOD1: {
    status: "approved",
    blurb:
      "Tofersen (Qalsody) — Biogen/Ionis, intrathecal ASO. Approved 2023; phase 3 ATLAS in presymptomatic carriers ongoing.",
  },
  FUS: {
    status: "clinic",
    blurb:
      "Ulefnersen (ION363) — Ionis/Otsuka, intrathecal ASO. Phase 3 FUSION fully enrolled, readout 2H 2026.",
  },
  STMN2: {
    status: "clinic",
    blurb:
      "QRL-201 — QurAlis, splice-switching ASO. Phase 1/2 ANQUR, 69 dosed; phase 3 planned 2027.",
  },
  SARM1: {
    status: "clinic",
    blurb:
      "NB-4746, NB-9402 — Nura Bio; LY3873862 — Lilly; SIR2501 — Sironax. Oral inhibitors, phase 1b/2a.",
  },
  TARDBP: {
    status: "clinic",
    blurb:
      "VTx-002 — VectorY, AAV intrabody, phase 1/2. ATLX-1282 — Alchemab/Lilly. PMN267 — ProMIS, preclinical. n-Lorem n-of-1 ASOs.",
  },
  UNC13A: {
    status: "clinic",
    blurb:
      "QRL-204 / LY4256984 — QurAlis to Lilly, splice-switching ASO. Phase 1.",
  },
  CHCHD10: {
    status: "clinic",
    blurb: "nL-CHCHD-001, nL18576 — n-Lorem personalised ASOs. 13 patients treated.",
  },
  SIGMAR1: {
    status: "clinic",
    blurb:
      "Pridopidine — Prilenia, oral sigma-1 agonist. HEALEY primary endpoint missed; subgroup signal, phase 3 planned.",
  },
  C9orf72: {
    status: "discontinued",
    blurb:
      "BIIB078 and WVE-004 both discontinued. PBFT02 — Passage Bio, AAV progranulin, phase 1/2 in C9-FTD. Base editing preclinical.",
  },
  ATXN2: {
    status: "discontinued",
    blurb:
      "BIIB105 (ION541) — Biogen/Ionis. Terminated 2024: target engaged, no NfL or clinical effect.",
  },
  TBK1: {
    status: "preclinical",
    blurb:
      "PPM1A-targeting ASOs — QurAlis. Preclinical, restoring TBK1 activity indirectly.",
  },
};

const DETAILS: Record<string, GeneDetail> = {
  C9orf72: {
    id: "C9orf72",
    fullName: "Chromosome 9 open reading frame 72",
    locus: "9p21.2",
    summary:
      "Most common genetic cause of fALS / FTD in European ancestry. Hexanucleotide repeat expansion; RNA foci and DPR proteinopathy themes.",
    hoverNote: PROGRAMME_BLURB.C9orf72.blurb,
    programmes: [
      { name: "BIIB078", status: "discontinued", note: "ASO — discontinued" },
      { name: "WVE-004", status: "discontinued", note: "ASO — discontinued" },
      {
        name: "PBFT02",
        status: "clinic",
        note: "Passage Bio AAV progranulin, phase 1/2 in C9-FTD",
      },
      { name: "Base editing", status: "preclinical" },
    ],
  },
  SOD1: {
    id: "SOD1",
    fullName: "Superoxide dismutase 1",
    locus: "21q22.11",
    summary:
      "Classic fALS gene. Misfolding and aggregation of mutant SOD1 remain central teaching cases for biology-first thinking.",
    hoverNote: PROGRAMME_BLURB.SOD1.blurb,
    programmes: [
      {
        name: "Tofersen (Qalsody)",
        status: "approved",
        note: "Biogen/Ionis intrathecal ASO. Approved 2023; ATLAS ongoing",
      },
    ],
  },
  TARDBP: {
    id: "TARDBP",
    fullName: "TAR DNA-binding protein 43 (TDP-43)",
    locus: "1p36.22",
    summary:
      "RNA-binding protein; TDP-43 proteinopathy is a hallmark pathology across ALS and related spectrum disease.",
    hoverNote: PROGRAMME_BLURB.TARDBP.blurb,
    programmes: [
      { name: "VTx-002", status: "clinic", note: "VectorY AAV intrabody, phase 1/2" },
      { name: "ATLX-1282", status: "clinic", note: "Alchemab/Lilly" },
      { name: "PMN267", status: "preclinical", note: "ProMIS" },
      { name: "n-Lorem n-of-1 ASOs", status: "clinic" },
    ],
  },
  FUS: {
    id: "FUS",
    fullName: "Fused in sarcoma",
    locus: "16p11.2",
    summary: "RNA/DNA-binding protein; nuclear-cytoplasmic mislocalization themes overlap with other RBP genes.",
    hoverNote: PROGRAMME_BLURB.FUS.blurb,
    programmes: [
      {
        name: "Ulefnersen (ION363)",
        status: "clinic",
        note: "Ionis/Otsuka ASO. Phase 3 FUSION; readout 2H 2026",
      },
    ],
  },
  ATXN2: {
    id: "ATXN2",
    fullName: "Ataxin-2",
    locus: "12q24.12",
    summary: "Intermediate polyQ expansions associate with ALS risk; RNA metabolism and stress-granule context.",
    hoverNote: PROGRAMME_BLURB.ATXN2.blurb,
    programmes: [
      {
        name: "BIIB105 (ION541)",
        status: "discontinued",
        note: "Biogen/Ionis — terminated 2024",
      },
    ],
  },
  STMN2: {
    id: "STMN2",
    fullName: "Stathmin-2",
    locus: "8q21.13",
    summary: "TDP-43–regulated axon-related transcript; emerging ALS therapeutic target.",
    hoverNote: PROGRAMME_BLURB.STMN2.blurb,
    programmes: [
      {
        name: "QRL-201",
        status: "clinic",
        note: "QurAlis splice-switching ASO. ANQUR phase 1/2",
      },
    ],
  },
  SARM1: {
    id: "SARM1",
    fullName: "Sterile alpha and TIR motif containing 1",
    locus: "17q11.2",
    summary: "Axon degeneration NADase; inhibitor programmes in early clinical development.",
    hoverNote: PROGRAMME_BLURB.SARM1.blurb,
    programmes: [
      { name: "NB-4746 / NB-9402", status: "clinic", note: "Nura Bio" },
      { name: "LY3873862", status: "clinic", note: "Lilly" },
      { name: "SIR2501", status: "clinic", note: "Sironax" },
    ],
  },
  UNC13A: {
    id: "UNC13A",
    fullName: "Unc-13 homolog A",
    locus: "19p13.11",
    summary: "Synaptic gene with ALS risk variants and cryptic-exon / TDP-43 splicing themes.",
    hoverNote: PROGRAMME_BLURB.UNC13A.blurb,
    programmes: [
      {
        name: "QRL-204 / LY4256984",
        status: "clinic",
        note: "QurAlis to Lilly splice-switching ASO, phase 1",
      },
    ],
  },
  CHCHD10: {
    id: "CHCHD10",
    fullName: "Coiled-coil-helix-coiled-coil-helix domain containing 10",
    locus: "22q11.23",
    summary: "Mitochondrial protein; rare fALS / myopathy genetics.",
    hoverNote: PROGRAMME_BLURB.CHCHD10.blurb,
    programmes: [
      {
        name: "nL-CHCHD-001 / nL18576",
        status: "clinic",
        note: "n-Lorem personalised ASOs",
      },
    ],
  },
  SIGMAR1: {
    id: "SIGMAR1",
    fullName: "Sigma non-opioid intracellular receptor 1",
    locus: "9p13.3",
    summary: "ER chaperone / lipid-related ALS genetics; agonist programmes explored clinically.",
    hoverNote: PROGRAMME_BLURB.SIGMAR1.blurb,
    programmes: [
      {
        name: "Pridopidine",
        status: "clinic",
        note: "Prilenia sigma-1 agonist; HEALEY miss with subgroup signal",
      },
    ],
  },
  TBK1: {
    id: "TBK1",
    fullName: "TANK-binding kinase 1",
    locus: "12q14.2",
    summary: "Innate immunity / autophagy signalling; links proteostasis and inflammation themes in ALS genetics.",
    hoverNote: PROGRAMME_BLURB.TBK1.blurb,
    programmes: [
      {
        name: "PPM1A-targeting ASOs",
        status: "preclinical",
        note: "QurAlis — restore TBK1 activity indirectly",
      },
    ],
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
  MATR3: {
    id: "MATR3",
    fullName: "Matrin-3",
    locus: "5q31.2",
    summary: "Nuclear matrix RNA-binding protein; rare fALS genetics in the RNA module.",
  },
  HNRNPA1: {
    id: "HNRNPA1",
    fullName: "Heterogeneous nuclear ribonucleoprotein A1",
    locus: "12q13.13",
    summary: "RNA splicing / RNP granule biology; overlaps ALS–MSP spectrum themes.",
  },
  HNRNPA2B1: {
    id: "HNRNPA2B1",
    fullName: "Heterogeneous nuclear ribonucleoprotein A2/B1",
    locus: "7p15.2",
    summary: "RNA-binding protein; related to hnRNPA1 disease mechanisms.",
  },
  TAF15: {
    id: "TAF15",
    fullName: "TATA-box binding protein associated factor 15",
    locus: "17q12",
    summary: "FET-family RNA-binding protein; related to FUS / EWSR1 biology.",
  },
  EWSR1: {
    id: "EWSR1",
    fullName: "EWS RNA binding protein 1",
    locus: "22q12.2",
    summary: "FET-family RBP; rare ALS genetics adjacent to FUS / TAF15.",
  },
  ANXA11: {
    id: "ANXA11",
    fullName: "Annexin A11",
    locus: "10q22.3",
    summary: "Membrane trafficking / RNA granule–adjacent ALS genetics.",
  },
  TIA1: {
    id: "TIA1",
    fullName: "TIA1 cytotoxic granule associated RNA binding protein",
    locus: "2p26.3",
    summary: "Stress-granule RBP; rare ALS / FTD genetics.",
  },
  UBQLN2: {
    id: "UBQLN2",
    fullName: "Ubiquilin 2",
    locus: "Xp11.21",
    summary: "Proteostasis shuttle; X-linked fALS.",
  },
  CHMP2B: {
    id: "CHMP2B",
    fullName: "Charged multivesicular body protein 2B",
    locus: "3p11.2",
    summary: "ESCRT-III / endolysosomal trafficking; FTD–ALS spectrum genetics.",
  },
  VAPB: {
    id: "VAPB",
    fullName: "VAMP associated protein B and C",
    locus: "20q13.32",
    summary: "ER contact-site protein; rare fALS genetics.",
  },
  DNAJC7: {
    id: "DNAJC7",
    fullName: "DnaJ heat shock protein family (Hsp40) member C7",
    locus: "17q21.2",
    summary: "Chaperone co-factor; emerging ALS genetics in proteostasis.",
  },
  DCTN1: {
    id: "DCTN1",
    fullName: "Dynactin subunit 1",
    locus: "2p13.1",
    summary: "Retrograde transport; Perry syndrome / rare motor neuron genetics.",
  },
  NEFH: {
    id: "NEFH",
    fullName: "Neurofilament heavy chain",
    locus: "22q12.2",
    summary: "Axonal cytoskeleton; rare ALS genetics and biomarker adjacency (NfL).",
  },
  PRPH: {
    id: "PRPH",
    fullName: "Peripherin",
    locus: "12q13.12",
    summary: "Intermediate filament; rare ALS genetics in cytoskeleton module.",
  },
  ALS2: {
    id: "ALS2",
    fullName: "Alsin Rho guanine nucleotide exchange factor ALS2",
    locus: "2q33.1",
    summary: "Juvenile ALS / HSP genetics; vesicle trafficking themes.",
  },
  SPG11: {
    id: "SPG11",
    fullName: "SPG11 vesicle trafficking associated, spatacsin",
    locus: "15q21.1",
    summary: "HSP / complicated motor neuron phenotypes; lysosomal trafficking.",
  },
  FIG4: {
    id: "FIG4",
    fullName: "FIG4 phosphoinositide 5-phosphatase",
    locus: "6q21",
    summary: "Phosphoinositide metabolism; CMT / ALS spectrum genetics.",
  },
  ANG: {
    id: "ANG",
    fullName: "Angiogenin",
    locus: "14q11.2",
    summary: "Ribonuclease; rare ALS genetics with RNA / stress themes.",
  },
  SPTLC1: {
    id: "SPTLC1",
    fullName: "Serine palmitoyltransferase long chain base subunit 1",
    locus: "9q22.31",
    summary: "Sphingolipid synthesis; juvenile ALS / HSAN genetics.",
  },
  GLT8D1: {
    id: "GLT8D1",
    fullName: "Glycosyltransferase 8 domain containing 1",
    locus: "3p21.1",
    summary: "Emerging ALS genetics with metabolic / lipid adjacency.",
  },
  DAO: {
    id: "DAO",
    fullName: "D-amino acid oxidase",
    locus: "12q24.11",
    summary: "Rare ALS genetics; redox / metabolism module.",
  },
  CAV1: {
    id: "CAV1",
    fullName: "Caveolin 1",
    locus: "7q31.2",
    summary: "Membrane signaling scaffold; rare ALS genetics.",
  },
  ERBB4: {
    id: "ERBB4",
    fullName: "Erb-b2 receptor tyrosine kinase 4",
    locus: "2q34",
    summary: "Receptor tyrosine kinase; rare ALS genetics.",
  },
  CCNF: {
    id: "CCNF",
    fullName: "Cyclin F",
    locus: "16p13.3",
    summary: "Ubiquitin ligase substrate receptor; ALS genetics at proteostasis / cell-cycle edge.",
  },
  CFAP410: {
    id: "CFAP410",
    fullName: "Cilia and flagella associated protein 410",
    locus: "21q22.3",
    summary: "DNA damage / cilia biology adjacency with NEK1.",
  },
  SETX: {
    id: "SETX",
    fullName: "Senataxin",
    locus: "9q34.13",
    summary: "RNA/DNA helicase; AOA2 / juvenile ALS genetics.",
  },
  GLE1: {
    id: "GLE1",
    fullName: "GLE1 RNA export mediator",
    locus: "9q34.11",
    summary: "mRNA export; rare ALS genetics in RNA module.",
  },
  ARPP21: {
    id: "ARPP21",
    fullName: "cAMP regulated phosphoprotein 21",
    locus: "3p22.3",
    summary: "Emerging RNA-module ALS genetics.",
  },
};

export function getGeneDetail(id: string): GeneDetail {
  const base = DETAILS[id];
  const prog = PROGRAMME_BLURB[id];
  if (base) {
    return {
      ...base,
      hoverNote: base.hoverNote || prog?.blurb,
    };
  }
  return {
    id,
    fullName: id,
    summary: "Familial ALS panel gene. Frequencies are approximate and population-dependent.",
    hoverNote: prog?.blurb,
    programmes: prog
      ? [{ name: id + " programmes", status: prog.status, note: prog.blurb }]
      : undefined,
  };
}

export function primaryProgrammeStatus(id: string): GeneProgramme["status"] | null {
  if (PROGRAMME_BLURB[id]) return PROGRAMME_BLURB[id].status;
  const programmes = DETAILS[id]?.programmes;
  if (!programmes?.length) return null;
  const order: GeneProgramme["status"][] = ["approved", "clinic", "preclinical", "discontinued"];
  for (const s of order) {
    if (programmes.some((p) => p.status === s)) return s;
  }
  return programmes[0]?.status ?? null;
}

export function geneHoverText(id: string, familialPct: number): string {
  const detail = getGeneDetail(id);
  const pct = familialPct < 0.15 ? "<0.1" : String(familialPct);
  const note = detail.hoverNote || "No disclosed programme.";
  return `${id} · ~${pct}% of fALS — ${note}`;
}
