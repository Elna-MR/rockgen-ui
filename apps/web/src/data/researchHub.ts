/** Research hub — multi-disease workspaces (deep tools for ALS; growing primers elsewhere). */

export type ResearchProtein = {
  symbol: string;
  name: string;
  role: string;
  href?: string;
};

export type ResearchTool = {
  title: string;
  summary: string;
  href: string;
  status: "ready" | "soon";
};

export type ResearchDisease = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  synopsis: string;
  category: string;
  accent: string;
  status: "ready" | "growing";
  focus: string[];
  proteins: ResearchProtein[];
  mechanisms: string[];
  researchNotes: string[];
  tools: ResearchTool[];
  searchTerms: string[];
};

export const RESEARCH_DISEASES: ResearchDisease[] = [
  {
    slug: "als",
    name: "Amyotrophic lateral sclerosis",
    shortName: "ALS",
    tagline: "Motor neurons · cytoskeleton · aggregation",
    synopsis:
      "Full mechanism-first workspace: prioritize shared routes across PFN1 and TUBA4A, map biology axes, compare pathways, and review mutation–biomarker evidence.",
    category: "Motor neuron",
    accent: "#4a8b86",
    status: "ready",
    focus: ["PFN1", "TUBA4A", "Mechanism prioritization"],
    proteins: [
      {
        symbol: "PFN1",
        name: "Profilin-1",
        role: "Actin dynamics; ALS-linked alleles such as G118V",
        href: "/proteins/P07737",
      },
      {
        symbol: "TUBA4A",
        name: "Tubulin alpha-4A",
        role: "Microtubules and axonal transport context",
        href: "/proteins/P68366",
      },
      {
        symbol: "SOD1",
        name: "Superoxide dismutase",
        role: "Classic familial ALS protein case study",
      },
    ],
    mechanisms: ["Protein aggregation", "Cytoskeleton stress", "Axonal transport"],
    researchNotes: [
      "Deep tools live here today — mechanisms, map, compare, and evidence.",
      "Program focus proteins are PFN1 and TUBA4A; other panel proteins stay secondary.",
      "Structure explorer and Ask work across the catalog from this workspace.",
    ],
    tools: [
      {
        title: "Mechanisms",
        summary: "What is shared between PFN1 and TUBA4A — and what to investigate first.",
        href: "/diseases/als/mechanisms",
        status: "ready",
      },
      {
        title: "Disease map",
        summary: "Browse ALS by biology axis (cytoskeleton, RNA, proteostasis…).",
        href: "/diseases/als/map",
        status: "ready",
      },
      {
        title: "Pathway compare",
        summary: "Side-by-side causal paths for PFN1 vs TUBA4A.",
        href: "/diseases/als/compare",
        status: "ready",
      },
      {
        title: "Mutations & biomarkers",
        summary: "Mutation intelligence, NfL context, and research gaps.",
        href: "/diseases/als/evidence",
        status: "ready",
      },
      {
        title: "Structure explorer",
        summary: "Search a protein — primary chemistry through 3D and assembly.",
        href: "/proteins/explore",
        status: "ready",
      },
      {
        title: "Ask a review",
        summary: "Structured scientific Q&A with citations.",
        href: "/ask",
        status: "ready",
      },
    ],
    searchTerms: ["als", "motor neuron", "pfn1", "tuba4a", "sod1", "aggregation", "mnd"],
  },
  {
    slug: "parkinsons",
    name: "Parkinson’s disease",
    shortName: "Parkinson’s",
    tagline: "Dopamine neurons · α-synuclein · mitochondria",
    synopsis:
      "Growing research workspace for α-synuclein, LRRK2, and mitochondrial quality-control hypotheses. Shared labs (structures, Ask) are available while disease-specific maps expand.",
    category: "Movement",
    accent: "#6a8f7a",
    status: "growing",
    focus: ["SNCA", "LRRK2", "Mitochondria"],
    proteins: [
      {
        symbol: "SNCA",
        name: "α-Synuclein",
        role: "Presynaptic protein; Lewy-body / aggregation focus",
      },
      {
        symbol: "LRRK2",
        name: "Leucine-rich repeat kinase 2",
        role: "Kinase signalling and trafficking hypotheses",
      },
      {
        symbol: "PRKN",
        name: "Parkin",
        role: "Mitophagy and quality-control pathways",
      },
    ],
    mechanisms: ["α-Synuclein aggregation", "Mitochondrial dysfunction", "Impaired autophagy"],
    researchNotes: [
      "Disease-specific map and mechanism prioritization are still expanding.",
      "Use structure search and Ask with Parkinson’s protein names today.",
      "Compare mechanism language with the ALS ready workspace without equating the diseases.",
    ],
    tools: [
      {
        title: "Structure lab — α-synuclein",
        summary: "Open PDB hits and inspect fold / construct limits.",
        href: "/proteins/explore?q=alpha-synuclein",
        status: "ready",
      },
      {
        title: "Ask a review",
        summary: "Structured Q&A — label claim vs evidence type.",
        href: "/ask",
        status: "ready",
      },
      {
        title: "ALS mechanisms (contrast)",
        summary: "See how RockGen prioritizes shared routes in a ready disease.",
        href: "/diseases/als/mechanisms",
        status: "ready",
      },
      {
        title: "Student primer",
        summary: "Concise learning track for Parkinson’s biology.",
        href: "/learn/parkinsons",
        status: "ready",
      },
      {
        title: "Disease map",
        summary: "Biology-axis map for Parkinson’s — coming as the graph grows.",
        href: "/diseases/parkinsons",
        status: "soon",
      },
    ],
    searchTerms: [
      "parkinson",
      "parkinsons",
      "snca",
      "synuclein",
      "lrrk2",
      "parkin",
      "dopamine",
      "lewy",
    ],
  },
  {
    slug: "alzheimers",
    name: "Alzheimer’s disease",
    shortName: "Alzheimer’s",
    tagline: "Memory circuits · amyloid · tau",
    synopsis:
      "Growing research framing for APP/Aβ, tau, and network failure. Mechanism-first tools expand here while shared structure and review labs stay available.",
    category: "Dementia",
    accent: "#5c7a8f",
    status: "growing",
    focus: ["APP / Aβ", "MAPT / tau", "Synapse loss"],
    proteins: [
      {
        symbol: "APP",
        name: "Amyloid precursor protein",
        role: "Source of amyloid-β peptides discussed in plaques",
      },
      {
        symbol: "MAPT",
        name: "Tau (microtubule-associated)",
        role: "Neurofibrillary tangle biology and axonal integrity",
      },
      {
        symbol: "APOE",
        name: "Apolipoprotein E",
        role: "Major genetic risk context for late-onset disease",
      },
    ],
    mechanisms: ["Amyloid cascade hypotheses", "Tau pathology", "Synapse and network failure"],
    researchNotes: [
      "Plaques and tangles are landmarks — causation is still debated in layers.",
      "Use shared evidence literacy and structure search while AD-specific maps grow.",
      "Do not treat research tiles as clinical guidance.",
    ],
    tools: [
      {
        title: "Structure lab — tau",
        summary: "Search deposited structures related to tau / microtubule context.",
        href: "/proteins/explore?q=tau",
        status: "ready",
      },
      {
        title: "Ask a review",
        summary: "Citation-aware scientific questions.",
        href: "/ask",
        status: "ready",
      },
      {
        title: "How it works",
        summary: "RockGen method before molecule design.",
        href: "/how-it-works",
        status: "ready",
      },
      {
        title: "Student primer",
        summary: "Amyloid, tau, and student-safe framing.",
        href: "/learn/alzheimers",
        status: "ready",
      },
      {
        title: "Pathway compare",
        summary: "AD-specific compare views — expanding with the catalog.",
        href: "/diseases/alzheimers",
        status: "soon",
      },
    ],
    searchTerms: [
      "alzheimer",
      "alzheimers",
      "amyloid",
      "tau",
      "app",
      "mapt",
      "apoe",
      "dementia",
    ],
  },
  {
    slug: "huntingtons",
    name: "Huntington’s disease",
    shortName: "Huntington’s",
    tagline: "HTT · polyglutamine · neuronal vulnerability",
    synopsis:
      "Clear genotype → protein → circuit case for research framing. PolyQ expansion length is a teaching and modelling axis while HD-specific graphs grow.",
    category: "Genetic ND",
    accent: "#7a6f5c",
    status: "growing",
    focus: ["HTT", "PolyQ", "Striatum"],
    proteins: [
      {
        symbol: "HTT",
        name: "Huntingtin",
        role: "Polyglutamine expansion length correlates with onset patterns",
      },
    ],
    mechanisms: [
      "Toxic gain-of-function protein species",
      "Transcriptional dysregulation",
      "Selective neuronal vulnerability",
    ],
    researchNotes: [
      "Genetics is unusually central compared with most ALS cases — still mechanism-first.",
      "Knowing HTT is not the same as having a therapy design.",
      "Shared labs (structure, Ask) are the active tools until HD maps land.",
    ],
    tools: [
      {
        title: "Structure lab — huntingtin",
        summary: "Find deposited constructs and note coverage limits.",
        href: "/proteins/explore?q=huntingtin",
        status: "ready",
      },
      {
        title: "Ask a review",
        summary: "Structured scientific Q&A with citations.",
        href: "/ask",
        status: "ready",
      },
      {
        title: "Student primer",
        summary: "CAG repeats, huntingtin, and key circuits.",
        href: "/learn/huntingtons",
        status: "ready",
      },
      {
        title: "Mechanism prioritization",
        summary: "HD-specific ranking — coming as the workspace deepens.",
        href: "/diseases/huntingtons",
        status: "soon",
      },
    ],
    searchTerms: ["huntington", "huntingtons", "htt", "polyq", "cag", "chorea"],
  },
  {
    slug: "ftd",
    name: "Frontotemporal dementia",
    shortName: "FTD",
    tagline: "Behaviour / language · TDP-43 · tau",
    synopsis:
      "Spectrum workspace for behaviour and language network biology — TDP-43, tau, and ALS–FTD genetics. Deep tools expand while shared labs stay open.",
    category: "Dementia",
    accent: "#6b7c8a",
    status: "growing",
    focus: ["TARDBP", "MAPT", "C9orf72"],
    proteins: [
      {
        symbol: "TARDBP",
        name: "TDP-43",
        role: "RNA-binding protein; overlap with ALS pathology themes",
      },
      {
        symbol: "MAPT",
        name: "Tau",
        role: "Tauopathic FTD subtypes",
      },
      {
        symbol: "C9orf72",
        name: "C9orf72",
        role: "Hexanucleotide expansion linking ALS–FTD spectrum",
      },
    ],
    mechanisms: ["TDP-43 proteinopathy", "Tau pathology", "ALS–FTD spectrum genetics"],
    researchNotes: [
      "FTD is not one disease — subtypes matter for mechanism stories.",
      "ALS and FTD can share genes and protein pathology without being identical.",
      "Use the ALS ready workspace as a contrast for spectrum thinking.",
    ],
    tools: [
      {
        title: "Structure lab — TDP-43",
        summary: "Practice PDB search with a spectrum protein.",
        href: "/proteins/explore?q=TDP-43",
        status: "ready",
      },
      {
        title: "Ask a review",
        summary: "Citation-aware questions across the spectrum.",
        href: "/ask",
        status: "ready",
      },
      {
        title: "ALS workspace (contrast)",
        summary: "Ready mechanism tools for comparison with FTD themes.",
        href: "/diseases/als",
        status: "ready",
      },
      {
        title: "Student primer",
        summary: "Spectrum, proteins, and ALS overlap.",
        href: "/learn/ftd",
        status: "ready",
      },
      {
        title: "Disease map",
        summary: "FTD biology-axis map — expanding with the catalog.",
        href: "/diseases/ftd",
        status: "soon",
      },
    ],
    searchTerms: ["ftd", "frontotemporal", "tdp43", "tardbp", "c9orf72", "pick"],
  },
];

export function getResearchDisease(slug: string): ResearchDisease | undefined {
  return RESEARCH_DISEASES.find((d) => d.slug === slug);
}

export function searchResearchDiseases(query: string): ResearchDisease[] {
  const q = query.trim().toLowerCase();
  if (!q) return RESEARCH_DISEASES;
  return RESEARCH_DISEASES.filter((d) => {
    const blob = [
      d.name,
      d.shortName,
      d.tagline,
      d.synopsis,
      d.category,
      ...d.focus,
      ...d.mechanisms,
      ...d.proteins.map((p) => `${p.symbol} ${p.name}`),
      ...d.searchTerms,
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(q) || q.split(/\s+/).every((tok) => blob.includes(tok));
  });
}
