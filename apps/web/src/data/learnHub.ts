/** Student learning hub, multi-disease tiles and short informational tracks. */

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
    tagline: "Motor neurons · cytoskeleton · proteinopathy",
    summary:
      "ALS is a progressive neurodegenerative disease of upper and lower motor neurons that leads to muscle weakness and paralysis. In ProtScope, learn how disease-associated proteins (such as PFN1, TUBA4A, and SOD1), pathogenic variants, and shared pathways like aggregation and cytoskeletal stress fit together before any talk of drugs.",
    category: "Motor neuron",
    accent: "#c4b8a5",
    status: "ready",
    minutes: "~75 min",
    modules: 8,
    focus: ["PFN1", "TUBA4A", "Mechanisms first"],
    proteins: [
      {
        symbol: "PFN1",
        name: "Profilin-1",
        role: "Actin-binding protein that regulates filament assembly. ALS-linked missense variants (for example G118V) are associated with profilin dysfunction, cytoskeletal stress, and aggregation propensity in motor-neuron models.",
        href: "/proteins/P07737",
      },
      {
        symbol: "TUBA4A",
        name: "Tubulin alpha-4A",
        role: "α-Tubulin isoform that builds microtubules. Rare ALS-associated variants can disturb microtubule dynamics and axonal transport, stressing long motor axons.",
        href: "/proteins/P68366",
      },
      {
        symbol: "SOD1",
        name: "Cu/Zn superoxide dismutase",
        role: "Cytosolic antioxidant enzyme. Familial ALS mutations typically act through toxic gain-of-function misfolding and aggregation rather than simple loss of dismutase activity.",
      },
    ],
    mechanisms: [
      "Protein misfolding and aggregation",
      "Cytoskeletal and axonal transport stress",
      "Proteostasis and clearance failure",
    ],
    keyFacts: [
      "Different ALS genes can converge on overlapping pathological routes.",
      "Evidence strength differs: genetics, cells, animals, and computation are not interchangeable.",
      "Map mechanisms and vulnerable cell biology before designing molecules.",
    ],
    track: [
      {
        title: "Orient: ALS in five ideas",
        kind: "read",
        minutes: "5 min",
        href: "/learn/als/orient",
        blurb: "A short disease story using accurate terms without jargon overload.",
      },
      {
        title: "Full ALS curriculum",
        kind: "practice",
        minutes: "75 min",
        href: "/learn/als#curriculum",
        blurb: "Eight modules from protein failure to evidence and practice labs.",
      },
      {
        title: "Structure explorer",
        kind: "explore",
        minutes: "10 min",
        href: "/proteins/explore?q=PFN1-G118V",
        blurb: "Inspect the PFN1 G118V substitution on a deposited fold.",
      },
    ],
    searchTerms: ["als", "motor neuron", "pfn1", "tuba4a", "sod1", "aggregation", "mnd"],
  },
  {
    slug: "parkinsons",
    name: "Parkinson’s disease",
    shortName: "Parkinson’s",
    tagline: "Dopaminergic neurons · α-synuclein · mitochondria",
    summary:
      "Parkinson’s disease is a neurodegenerative movement disorder featuring progressive loss of nigrostriatal dopaminergic neurons and α-synuclein–rich Lewy pathology. Learn how SNCA, LRRK2, and mitophagy genes such as PRKN frame distinct but overlapping disease pathways.",
    category: "Movement",
    accent: "#6f8798",
    status: "growing",
    minutes: "~25 min",
    modules: 4,
    focus: ["SNCA", "LRRK2", "Mitochondria"],
    proteins: [
      {
        symbol: "SNCA",
        name: "α-Synuclein",
        role: "Presynaptic protein enriched at nerve terminals. Pathological α-synuclein aggregates form Lewy bodies and Lewy neurites; multiplication or missense variants increase Parkinson’s risk.",
      },
      {
        symbol: "LRRK2",
        name: "Leucine-rich repeat kinase 2",
        role: "Large multidomain kinase/GTPase. Pathogenic kinase-activating variants (for example G2019S) link vesicular trafficking and immune/autophagy pathways to familial Parkinson’s.",
      },
      {
        symbol: "PRKN",
        name: "Parkin",
        role: "E3 ubiquitin ligase that tags damaged mitochondria for mitophagy. Loss-of-function variants cause early-onset recessive Parkinson’s via mitochondrial quality-control failure.",
      },
    ],
    mechanisms: [
      "α-Synuclein aggregation (synucleinopathy)",
      "Mitochondrial dysfunction and mitophagy failure",
      "Impaired autophagy–lysosomal clearance",
    ],
    keyFacts: [
      "Motor signs often reflect dopamine pathway injury, but disease biology extends beyond tremor.",
      "Genetic forms (SNCA, LRRK2, PRKN) illustrate different entry points into shared cell-stress pathways.",
      "Protein aggregation and clearance failure recur across neurodegeneration without making diseases identical.",
    ],
    track: [
      {
        title: "Parkinson’s overview",
        kind: "read",
        minutes: "8 min",
        href: "/learn/parkinsons#overview",
        blurb: "Core cells, proteins, and open pathological questions.",
      },
      {
        title: "Compare to ALS mechanisms",
        kind: "explore",
        minutes: "10 min",
        href: "/learn/als",
        blurb: "Shared routes (aggregation, transport) versus disease-specific features.",
      },
      {
        title: "Search related structures",
        kind: "practice",
        minutes: "7 min",
        href: "/proteins/explore?q=alpha-synuclein",
        blurb: "Open PDB entries for α-synuclein and note construct limits.",
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
    tagline: "Memory circuits · amyloid-β · tau",
    summary:
      "Alzheimer’s disease is the most common dementia, with progressive cortical and hippocampal neurodegeneration. Landmark pathologies include extracellular amyloid-β plaques and intracellular tau neurofibrillary tangles; ProtScope focuses on the protein and pathway map, not personal risk prediction.",
    category: "Dementia",
    accent: "#8a7a64",
    status: "growing",
    minutes: "~25 min",
    modules: 4,
    focus: ["APP / Aβ", "MAPT / tau", "Synapse loss"],
    proteins: [
      {
        symbol: "APP",
        name: "Amyloid precursor protein",
        role: "Transmembrane precursor proteolytically processed to amyloid-β (Aβ) peptides. Familial APP mutations alter Aβ production or aggregation and inform amyloid cascade models.",
      },
      {
        symbol: "MAPT",
        name: "Tau (microtubule-associated protein tau)",
        role: "Stabilizes axonal microtubules. Hyperphosphorylated, misfolded tau forms neurofibrillary tangles and correlates closely with clinical progression.",
      },
      {
        symbol: "APOE",
        name: "Apolipoprotein E",
        role: "Lipid-transport protein; the APOE ε4 allele is the strongest common genetic risk factor for late-onset Alzheimer’s and modulates Aβ clearance and lipid biology.",
      },
    ],
    mechanisms: [
      "Amyloid-β accumulation and plaque pathology",
      "Tau hyperphosphorylation and tangle pathology",
      "Synaptic and network failure",
    ],
    keyFacts: [
      "Plaques and tangles are defining neuropathological landmarks; causal order remains actively studied.",
      "Genetic risk (including APOE) is population biology, not a personal diagnosis tool on this site.",
      "Compare misfolding themes with ALS and Parkinson’s without equating the diseases.",
    ],
    track: [
      {
        title: "Alzheimer’s overview",
        kind: "read",
        minutes: "8 min",
        href: "/learn/alzheimers#overview",
        blurb: "Amyloid, tau, and careful student-safe framing.",
      },
      {
        title: "Evidence literacy",
        kind: "read",
        minutes: "10 min",
        href: "/learn/guides/evidence",
        blurb: "Label claim type and confidence across diseases.",
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
    tagline: "HTT · polyglutamine · selective vulnerability",
    summary:
      "Huntington’s disease is an autosomal-dominant neurodegenerative disorder caused by CAG trinucleotide expansion in HTT, producing an elongated polyglutamine tract in huntingtin. It is a clear teaching case for genotype → toxic protein species → selective neuronal injury.",
    category: "Genetic ND",
    accent: "#c4b8a5",
    status: "growing",
    minutes: "~20 min",
    modules: 3,
    focus: ["HTT", "PolyQ", "Striatum"],
    proteins: [
      {
        symbol: "HTT",
        name: "Huntingtin",
        role: "Large scaffolding protein. Pathogenic CAG/polyglutamine expansion generates toxic gain-of-function species; longer expansions generally associate with earlier clinical onset.",
      },
    ],
    mechanisms: [
      "Toxic gain-of-function polyglutamine protein species",
      "Transcriptional and proteostasis dysregulation",
      "Selective striatal and cortical vulnerability",
    ],
    keyFacts: [
      "Inheritance and expansion length make genetics unusually central compared with most ALS cases.",
      "Expansion size is a teaching tool for genotype–phenotype relationships.",
      "Knowing HTT biology is not the same as having a therapy design.",
    ],
    track: [
      {
        title: "Huntington’s overview",
        kind: "read",
        minutes: "8 min",
        href: "/learn/huntingtons#overview",
        blurb: "CAG repeats, huntingtin toxicity, and key circuits.",
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
        blurb: "Find deposited structures and note construct coverage limits.",
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
      "Frontotemporal dementia is a clinical spectrum of neurodegeneration affecting frontal and temporal networks that support behaviour, personality, and language. Proteinopathies include TDP-43 and tau; genetics such as C9orf72 link parts of the FTD–ALS spectrum.",
    category: "Dementia",
    accent: "#9a958c",
    status: "growing",
    minutes: "~20 min",
    modules: 3,
    focus: ["TARDBP", "MAPT", "C9orf72"],
    proteins: [
      {
        symbol: "TARDBP",
        name: "TDP-43",
        role: "Nuclear RNA-binding protein. Pathological cytoplasmic TDP-43 aggregation and nuclear clearance define a major FTD/ALS proteinopathy.",
      },
      {
        symbol: "MAPT",
        name: "Tau",
        role: "Microtubule-associated protein; MAPT mutations and tau inclusions define tauopathic FTD subtypes (FTLD-tau).",
      },
      {
        symbol: "C9orf72",
        name: "C9orf72",
        role: "Hexanucleotide (GGGGCC) repeat expansion is a common genetic cause linking ALS and FTD through RNA foci, dipeptide-repeat proteins, and haploinsufficiency models.",
      },
    ],
    mechanisms: [
      "TDP-43 proteinopathy",
      "Tau pathology (FTLD-tau)",
      "ALS–FTD spectrum genetics (including C9orf72)",
    ],
    keyFacts: [
      "FTD is not one disease; clinical and molecular subtypes change the mechanism story.",
      "ALS and FTD can share genes and protein pathology without being clinically identical.",
      "Student goal: spectrum thinking, not memorizing every subtype name.",
    ],
    track: [
      {
        title: "FTD overview",
        kind: "read",
        minutes: "8 min",
        href: "/learn/ftd#overview",
        blurb: "Spectrum, proteinopathies, and ALS overlap.",
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
      ...d.proteins.map((p) => `${p.symbol} ${p.name} ${p.role}`),
      ...d.searchTerms,
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(q) || q.split(/\s+/).every((tok) => blob.includes(tok));
  });
}
