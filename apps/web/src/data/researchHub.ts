/** Research hub, multi-disease workspaces (deep tools for ALS; growing primers elsewhere). */

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
      "Deepest mechanism-first workspace for ALS: prioritize shared pathological routes across PFN1 and TUBA4A, map biology axes, compare pathways, and review mutation and biomarker evidence before therapeutic ideation.",
    category: "Motor neuron",
    accent: "#c4b8a5",
    status: "ready",
    focus: ["PFN1", "TUBA4A", "Mechanism prioritization"],
    proteins: [
      {
        symbol: "PFN1",
        name: "Profilin-1",
        role: "Actin-binding regulator; ALS-linked missense variants (e.g. G118V) associate with cytoskeletal stress and aggregation propensity.",
        href: "/proteins/P07737",
      },
      {
        symbol: "TUBA4A",
        name: "Tubulin alpha-4A",
        role: "α-Tubulin isoform; rare ALS variants can impair microtubule dynamics and axonal transport.",
        href: "/proteins/P68366",
      },
      {
        symbol: "SOD1",
        name: "Cu/Zn superoxide dismutase",
        role: "Classic familial ALS proteinopathy case: toxic gain-of-function misfolding and aggregation.",
      },
    ],
    mechanisms: [
      "Protein misfolding and aggregation",
      "Cytoskeletal and axonal transport stress",
      "Proteostasis and clearance failure",
    ],
    researchNotes: [
      "Ready tools today: mechanisms, disease map, gene network, pathway compare, and evidence.",
      "Primary program proteins are PFN1 and TUBA4A; other panel proteins remain secondary context.",
      "Structure explorer and Ask are available across the catalog from this workspace.",
    ],
    tools: [
      {
        title: "Mechanisms",
        summary: "What is shared between PFN1 and TUBA4A, and what to investigate first.",
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
        title: "Gene network",
        summary: "Familial ALS STRING interactions by functional module.",
        href: "/diseases/als/network",
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
        summary: "Search a protein, primary chemistry through 3D and assembly.",
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
      "Growing research workspace for synucleinopathy, LRRK2 signalling, and mitochondrial quality-control pathways. Shared structure and review labs are available while Parkinson-specific maps expand.",
    category: "Movement",
    accent: "#6f8798",
    status: "growing",
    focus: ["SNCA", "LRRK2", "Mitochondria"],
    proteins: [
      {
        symbol: "SNCA",
        name: "α-Synuclein",
        role: "Presynaptic protein; pathological aggregates form Lewy bodies/neurites; gene dosage and missense variants raise risk.",
      },
      {
        symbol: "LRRK2",
        name: "Leucine-rich repeat kinase 2",
        role: "Kinase/GTPase; pathogenic activating variants link trafficking and autophagy pathways to familial Parkinson’s.",
      },
      {
        symbol: "PRKN",
        name: "Parkin",
        role: "E3 ligase for mitophagy; loss-of-function variants cause early-onset recessive Parkinson’s.",
      },
    ],
    mechanisms: [
      "α-Synuclein aggregation (synucleinopathy)",
      "Mitochondrial dysfunction and mitophagy failure",
      "Impaired autophagy–lysosomal clearance",
    ],
    researchNotes: [
      "Disease-specific map and mechanism prioritization are still expanding.",
      "Use structure search and Ask with Parkinson’s protein names today.",
      "Compare pathway language with the ALS workspace without equating the diseases.",
    ],
    tools: [
      {
        title: "Structure lab: α-synuclein",
        summary: "Open PDB hits and inspect fold / construct limits.",
        href: "/proteins/explore?q=alpha-synuclein",
        status: "ready",
      },
      {
        title: "Ask a review",
        summary: "Structured Q&A, label claim vs evidence type.",
        href: "/ask",
        status: "ready",
      },
      {
        title: "ALS mechanisms (contrast)",
        summary: "See how ProtScope prioritizes shared routes in a ready disease.",
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
        summary: "Biology-axis map for Parkinson’s, coming as the graph grows.",
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
      "Growing research framing for amyloid-β, tau tangle pathology, and synaptic/network failure. Shared structure and evidence labs stay available while Alzheimer-specific maps expand.",
    category: "Dementia",
    accent: "#8a7a64",
    status: "growing",
    focus: ["APP / Aβ", "MAPT / tau", "Synapse loss"],
    proteins: [
      {
        symbol: "APP",
        name: "Amyloid precursor protein",
        role: "Processed to amyloid-β peptides; familial mutations inform amyloid cascade models and plaque pathology.",
      },
      {
        symbol: "MAPT",
        name: "Tau (microtubule-associated protein tau)",
        role: "Hyperphosphorylated misfolded tau forms neurofibrillary tangles and tracks clinical progression.",
      },
      {
        symbol: "APOE",
        name: "Apolipoprotein E",
        role: "APOE ε4 is the strongest common genetic risk factor for late-onset disease; modulates Aβ clearance and lipid biology.",
      },
    ],
    mechanisms: [
      "Amyloid-β accumulation and plaque pathology",
      "Tau hyperphosphorylation and tangle pathology",
      "Synaptic and network failure",
    ],
    researchNotes: [
      "Plaques and tangles are neuropathological landmarks; causal order remains actively studied.",
      "Use shared evidence literacy and structure search while AD-specific maps grow.",
      "Research tiles are not clinical guidance or personal risk tools.",
    ],
    tools: [
      {
        title: "Structure lab: tau",
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
        title: "Biology",
        summary: "See the disease map before designing molecules.",
        href: "/biology-first",
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
        summary: "AD-specific compare views, expanding with the catalog.",
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
      "Clear genotype → toxic protein → selective vulnerability case. Pathogenic CAG/polyglutamine expansion in HTT is the modelling axis while Huntington-specific graphs grow.",
    category: "Genetic ND",
    accent: "#c4b8a5",
    status: "growing",
    focus: ["HTT", "PolyQ", "Striatum"],
    proteins: [
      {
        symbol: "HTT",
        name: "Huntingtin",
        role: "Pathogenic polyglutamine expansion generates toxic gain-of-function species; longer expansions generally associate with earlier onset.",
      },
    ],
    mechanisms: [
      "Toxic gain-of-function polyglutamine protein species",
      "Transcriptional and proteostasis dysregulation",
      "Selective striatal and cortical vulnerability",
    ],
    researchNotes: [
      "Genetics is unusually central compared with most ALS cases; still mechanism-first.",
      "Knowing HTT biology is not the same as having a therapy design.",
      "Shared labs (structure, Ask) are the active tools until HD maps land.",
    ],
    tools: [
      {
        title: "Structure lab: huntingtin",
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
        summary: "HD-specific ranking, coming as the workspace deepens.",
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
      "Spectrum workspace for frontotemporal neurodegeneration: TDP-43 and tau proteinopathies, plus ALS–FTD genetics such as C9orf72. Deep tools expand while shared labs stay open.",
    category: "Dementia",
    accent: "#9a958c",
    status: "growing",
    focus: ["TARDBP", "MAPT", "C9orf72"],
    proteins: [
      {
        symbol: "TARDBP",
        name: "TDP-43",
        role: "Nuclear RNA-binding protein; cytoplasmic aggregation and nuclear clearance define a major FTD/ALS proteinopathy.",
      },
      {
        symbol: "MAPT",
        name: "Tau",
        role: "Defines tauopathic FTD subtypes (FTLD-tau) via mutations and tau inclusions.",
      },
      {
        symbol: "C9orf72",
        name: "C9orf72",
        role: "GGGGCC repeat expansion commonly links ALS and FTD through RNA, DPR protein, and haploinsufficiency models.",
      },
    ],
    mechanisms: [
      "TDP-43 proteinopathy",
      "Tau pathology (FTLD-tau)",
      "ALS–FTD spectrum genetics (including C9orf72)",
    ],
    researchNotes: [
      "FTD is not one disease; clinical and molecular subtypes change the mechanism story.",
      "ALS and FTD can share genes and protein pathology without being clinically identical.",
      "Use the ALS ready workspace as a contrast for spectrum thinking.",
    ],
    tools: [
      {
        title: "Structure lab: TDP-43",
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
        summary: "FTD biology-axis map, expanding with the catalog.",
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
