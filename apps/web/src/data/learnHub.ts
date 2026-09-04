/** Student learning hub — multi-disease tiles and short informational tracks. */

export type LearnProtein = {
  symbol: string;
  name: string;
  role: string;
  href?: string;
};

export type LearnTrackStep = {
  title: string;
  kind: "read" | "explore" | "practice";
  minutes: string;
  href: string;
  blurb: string;
};

export type LearnDisease = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  category: string;
  accent: string;
  status: "ready" | "growing";
  minutes: string;
  modules: number;
  focus: string[];
  proteins: LearnProtein[];
  mechanisms: string[];
  keyFacts: string[];
  track: LearnTrackStep[];
  searchTerms: string[];
};

export const LEARN_DISEASES: LearnDisease[] = [
  {
    slug: "als",
    name: "Amyotrophic lateral sclerosis",
    shortName: "ALS",
    tagline: "Motor neurons · cytoskeleton · aggregation",
    summary:
      "A progressive motor-neuron disease. Learn how genes, protein shape, and shared mechanisms connect — then practice in RockGen tools.",
    category: "Motor neuron",
    accent: "#4a8b86",
    status: "ready",
    minutes: "~75 min",
    modules: 8,
    focus: ["PFN1", "TUBA4A", "Mechanisms first"],
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
    keyFacts: [
      "Different genes can land on overlapping failure routes.",
      "Evidence types are not equal — label computation vs cells vs genetics.",
      "Prioritize mechanisms before designing molecules.",
    ],
    track: [
      {
        title: "Orient — ALS in five ideas",
        kind: "read",
        minutes: "5 min",
        href: "/learn/als/orient",
        blurb: "Tell the disease story without jargon.",
      },
      {
        title: "Full ALS curriculum",
        kind: "practice",
        minutes: "75 min",
        href: "/learn/als#curriculum",
        blurb: "Eight progressive modules with practice labs.",
      },
      {
        title: "Structure explorer",
        kind: "explore",
        minutes: "10 min",
        href: "/proteins/explore?q=PFN1-G118V",
        blurb: "Inspect PFN1 G118V on a real fold.",
      },
    ],
    searchTerms: ["als", "motor neuron", "pfn1", "tuba4a", "sod1", "aggregation", "mnd"],
  },
  {
    slug: "parkinsons",
    name: "Parkinson’s disease",
    shortName: "Parkinson’s",
    tagline: "Dopamine neurons · α-synuclein · mitochondria",
    summary:
      "A movement disorder linked to dopaminergic neuron loss. Explore how α-synuclein, LRRK2, and mitochondrial stress shape student-level models of disease.",
    category: "Movement",
    accent: "#6a8f7a",
    status: "growing",
    minutes: "~25 min",
    modules: 4,
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
    keyFacts: [
      "Motor symptoms often reflect dopamine pathway injury — biology is broader than tremor.",
      "Genetic forms (e.g. SNCA, LRRK2, PRKN) teach mechanism diversity.",
      "Protein clumping and clearance failure are recurring themes across neurodegeneration.",
    ],
    track: [
      {
        title: "Parkinson’s overview",
        kind: "read",
        minutes: "8 min",
        href: "/learn/parkinsons#overview",
        blurb: "Core cells, proteins, and open questions.",
      },
      {
        title: "Compare to ALS mechanisms",
        kind: "explore",
        minutes: "10 min",
        href: "/learn/als",
        blurb: "See which failure routes look shared vs unique.",
      },
      {
        title: "Search related structures",
        kind: "practice",
        minutes: "7 min",
        href: "/proteins/explore?q=alpha-synuclein",
        blurb: "Open PDB hits for α-synuclein and inspect fold cues.",
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
    summary:
      "The most common dementia. Learn the student map of APP/Aβ, tau tangles, and why mechanism-first thinking still matters when headlines jump to drugs.",
    category: "Dementia",
    accent: "#5c7a8f",
    status: "growing",
    minutes: "~25 min",
    modules: 4,
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
    keyFacts: [
      "Plaques and tangles are landmarks — causation is still debated in layers.",
      "Genetic risk (including APOE) is not destiny and is not a personal diagnosis tool here.",
      "Compare how protein misfolding themes echo ALS and Parkinson’s without equating the diseases.",
    ],
    track: [
      {
        title: "Alzheimer’s overview",
        kind: "read",
        minutes: "8 min",
        href: "/learn/alzheimers#overview",
        blurb: "Amyloid, tau, and student-safe framing.",
      },
      {
        title: "Evidence literacy",
        kind: "read",
        minutes: "10 min",
        href: "/learn/guides/evidence",
        blurb: "Reuse the shared evidence guide across diseases.",
      },
      {
        title: "Explore tau / tubulin context",
        kind: "explore",
        minutes: "7 min",
        href: "/proteins/explore?q=tau",
        blurb: "Structure search as a learning lab, not a diagnosis.",
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
    summary:
      "A genetic neurodegenerative disease caused by CAG expansion in HTT. A clear student case for genotype → protein → circuit failure.",
    category: "Genetic ND",
    accent: "#7a6f5c",
    status: "growing",
    minutes: "~20 min",
    modules: 3,
    focus: ["HTT", "PolyQ", "Striatum"],
    proteins: [
      {
        symbol: "HTT",
        name: "Huntingtin",
        role: "Polyglutamine expansion length correlates with onset patterns",
      },
    ],
    mechanisms: ["Toxic gain-of-function protein species", "Transcriptional dysregulation", "Selective neuronal vulnerability"],
    keyFacts: [
      "Inheritance pattern makes genetics unusually central compared with most ALS cases.",
      "Expansion size is a teaching tool for genotype–phenotype thinking.",
      "Still mechanism-first: knowing HTT is not the same as having a therapy design.",
    ],
    track: [
      {
        title: "Huntington’s overview",
        kind: "read",
        minutes: "8 min",
        href: "/learn/huntingtons#overview",
        blurb: "CAG repeats, huntingtin, and key circuits.",
      },
      {
        title: "Mental model refresher",
        kind: "read",
        minutes: "10 min",
        href: "/learn/guides/mental-model",
        blurb: "Gene → protein → mechanism → disease.",
      },
      {
        title: "Structure search lab",
        kind: "explore",
        minutes: "5 min",
        href: "/proteins/explore?q=huntingtin",
        blurb: "Find deposited structures and note construct limits.",
      },
    ],
    searchTerms: ["huntington", "huntingtons", "htt", "polyq", "cag", "chorea"],
  },
  {
    slug: "ftd",
    name: "Frontotemporal dementia",
    shortName: "FTD",
    tagline: "Behaviour / language · TDP-43 · tau",
    summary:
      "A spectrum of dementias affecting behaviour and language networks. Useful for comparing TDP-43 and tau biology with ALS.",
    category: "Dementia",
    accent: "#6b7c8a",
    status: "growing",
    minutes: "~20 min",
    modules: 3,
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
    keyFacts: [
      "FTD is not one disease — subtypes matter for mechanism stories.",
      "ALS and FTD can share genes and protein pathology without being identical.",
      "Student goal: map spectrum thinking, not memorise every subtype.",
    ],
    track: [
      {
        title: "FTD overview",
        kind: "read",
        minutes: "8 min",
        href: "/learn/ftd#overview",
        blurb: "Spectrum, proteins, and ALS overlap.",
      },
      {
        title: "ALS track for contrast",
        kind: "explore",
        minutes: "10 min",
        href: "/learn/als",
        blurb: "Compare mechanism language across the spectrum.",
      },
      {
        title: "TDP-43 structure search",
        kind: "practice",
        minutes: "5 min",
        href: "/proteins/explore?q=TDP-43",
        blurb: "Practice PDB search with a spectrum protein.",
      },
    ],
    searchTerms: ["ftd", "frontotemporal", "tdp43", "tardbp", "c9orf72", "pick"],
  },
];

export function getLearnDisease(slug: string): LearnDisease | undefined {
  return LEARN_DISEASES.find((d) => d.slug === slug);
}

export function searchLearnDiseases(query: string): LearnDisease[] {
  const q = query.trim().toLowerCase();
  if (!q) return LEARN_DISEASES;
  return LEARN_DISEASES.filter((d) => {
    const blob = [
      d.name,
      d.shortName,
      d.tagline,
      d.summary,
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
