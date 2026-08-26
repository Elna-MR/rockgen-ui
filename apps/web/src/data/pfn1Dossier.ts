/** Curated PFN1 dossier annotations for the scientific workspace (visual + education). */

export const PFN1_ANNOTATIONS = {
  uniprotId: "P07737",
  symbol: "PFN1",
  length: 140,
  mutationResidue: 118,
  mutationFrom: "G",
  mutationTo: "V",
  regions: [
    {
      id: "plp",
      name: "PLP-binding region",
      ranges: [
        [1, 12],
        [130, 140],
      ] as [number, number][],
      color: "#5b8def",
    },
    {
      id: "actin",
      name: "Actin-binding face",
      ranges: [
        [59, 74],
        [119, 125],
      ] as [number, number][],
      color: "#0d9f8f",
    },
    {
      id: "pocket",
      name: "Predicted local pocket (near G118)",
      ranges: [[112, 120]] as [number, number][],
      color: "#f0b429",
    },
  ],
  knownMutations: [
    {
      position: 71,
      label: "C71G",
      key: "PFN1:C71G",
      evidenceStrength: "high",
      bindingRegion: "actin" as const,
    },
    {
      position: 109,
      label: "T109M",
      key: "PFN1:T109M",
      evidenceStrength: "moderate",
      bindingRegion: "plp" as const,
    },
    {
      position: 114,
      label: "M114T",
      key: "PFN1:M114T",
      evidenceStrength: "low",
      bindingRegion: "pocket" as const,
    },
    {
      position: 117,
      label: "E117G",
      key: "PFN1:E117G",
      evidenceStrength: "low",
      bindingRegion: "pocket" as const,
    },
    {
      position: 118,
      label: "G118V",
      key: "PFN1:G118V",
      evidenceStrength: "high",
      bindingRegion: "pocket" as const,
    },
  ],
  structures: [
    {
      id: "AF-P07737-F1",
      label: "AlphaFold",
      kind: "alphafold" as const,
      // Bundled locally — AlphaFold CDN path changed (v6) and blocked in-browser CORS
      url: "/structures/AF-P07737-F1.pdb",
      fallbackUrls: [
        "/api/structures/AF-P07737-F1",
        "https://alphafold.ebi.ac.uk/files/AF-P07737-F1-model_v6.pdb",
      ],
    },
    {
      id: "2PAV",
      label: "PDB 2PAV (X-ray)",
      kind: "pdb" as const,
      url: "/structures/2PAV.pdb",
      fallbackUrls: [
        "/api/structures/2PAV",
        "https://files.rcsb.org/download/2PAV.pdb",
      ],
    },
  ],
};

export type ComparisonRow = {
  property: string;
  wildType: string;
  mutant: string;
  evidenceLabel:
    | "measured experimentally"
    | "predicted computationally"
    | "observed in animals"
    | "not yet validated"
    | "mixed evidence";
  confidence?: string;
};

export const PFN1_COMPARISON: ComparisonRow[] = [
  {
    property: "Stability",
    wildType: "Native fold retained",
    mutant: "Reduced / destabilized local fold",
    evidenceLabel: "mixed evidence",
    confidence: "Moderate",
  },
  {
    property: "Flexibility",
    wildType: "Normal dynamics",
    mutant: "Altered flexibility near G118",
    evidenceLabel: "predicted computationally",
    confidence: "Moderate",
  },
  {
    property: "Hydrophobic exposure",
    wildType: "Lower",
    mutant: "Higher (aggregation-prone surface)",
    evidenceLabel: "predicted computationally",
    confidence: "Moderate",
  },
  {
    property: "Aggregation risk",
    wildType: "Low",
    mutant: "Elevated",
    evidenceLabel: "mixed evidence",
    confidence: "High",
  },
  {
    property: "Actin interaction",
    wildType: "Normal profilin–actin function",
    mutant: "Potentially disrupted / context-dependent",
    evidenceLabel: "not yet validated",
    confidence: "Low",
  },
  {
    property: "Evidence confidence (aggregation)",
    wildType: "—",
    mutant: "High / Moderate from review engine",
    evidenceLabel: "mixed evidence",
    confidence: "High",
  },
];

export type PathwayStep = {
  id: string;
  label: string;
  claimTopic?: string;
  support: "experimental" | "computational" | "hypothesis";
  description: string;
};

export const PFN1_PATHWAY: PathwayStep[] = [
  {
    id: "mutation",
    label: "G118V mutation",
    claimTopic: "structural_change",
    support: "experimental",
    description: "ALS-linked amino-acid substitution in PFN1.",
  },
  {
    id: "flexibility",
    label: "Reduced local flexibility",
    claimTopic: "structural_change",
    support: "computational",
    description: "Molecular dynamics / biophysical inference near the substitution.",
  },
  {
    id: "instability",
    label: "Structural instability",
    claimTopic: "structural_change",
    support: "computational",
    description: "Local instability inferred from computational and biophysical work.",
  },
  {
    id: "misfolding",
    label: "Misfolding",
    claimTopic: "misfolding",
    support: "experimental",
    description: "Conformational / solubility changes reported in cellular studies.",
  },
  {
    id: "oligomerization",
    label: "Oligomerization",
    claimTopic: "aggregation",
    support: "hypothesis",
    description: "Likely intermediate toward aggregates — sparsely indexed as a discrete claim.",
  },
  {
    id: "aggregation",
    label: "Aggregation",
    claimTopic: "aggregation",
    support: "experimental",
    description: "Elevated aggregation propensity with multi-modality support.",
  },
  {
    id: "mn-stress",
    label: "Motor-neuron stress",
    claimTopic: "aggregation",
    support: "hypothesis",
    description: "Cellular / organism context between aggregates and motor-neuron injury.",
  },
  {
    id: "als",
    label: "ALS pathology",
    claimTopic: "aggregation",
    support: "experimental",
    description: "Human genetic association of PFN1 variants with familial ALS (ClinVar / literature).",
  },
];

export const PFN1_TIMELINE = [
  {
    year: "2012",
    title: "PFN1 mutations linked to familial ALS",
    evidence_type: "human_genetic",
    paper_id: "pmid:23334667",
    url: "https://pubmed.ncbi.nlm.nih.gov/23334667/",
  },
  {
    year: "2014",
    title: "ALS-linked mutations enlarge aggregation propensity of PFN1",
    evidence_type: "in_vitro",
    paper_id: "pmid:25447202",
    url: "https://pubmed.ncbi.nlm.nih.gov/25447202/",
  },
  {
    year: "2018",
    title: "Molecular dynamics / biophysics predict structural effects",
    evidence_type: "computational_prediction",
    paper_id: "pmid:25447202",
    url: "https://pubmed.ncbi.nlm.nih.gov/25447202/",
  },
  {
    year: "2018",
    title: "Laboratory studies support aggregation tendency",
    evidence_type: "in_vitro",
    paper_id: "pmid:25447202",
    url: "https://pubmed.ncbi.nlm.nih.gov/25447202/",
  },
  {
    year: "2021",
    title: "Mouse models link mutant PFN1 aggregation to toxicity",
    evidence_type: "animal",
    paper_id: null,
    url: null,
  },
  {
    year: "2021",
    title: "Interaction partners (e.g. actin / MBP context) under investigation",
    evidence_type: "animal",
    paper_id: null,
    url: null,
  },
];

export const PFN1_GAPS = [
  "No clinical evidence directly validating PFN1 G118V aggregation in patients",
  "No validated PFN1-stabilizing drug",
  "Unclear whether MBP co-aggregation is causal or secondary",
  "Limited comparison across all PFN1 mutations",
  "No confirmed disease-state-specific druggable pocket",
];

export const PFN1_EXPERIMENTS = [
  {
    title: "Test whether stabilization of the G118V region reduces aggregation",
    why: "Supported by computational, in vitro, and animal evidence linking structure to aggregation",
    expected: "Aggregation rate, soluble PFN1 level, cell viability",
    priority: "High" as const,
    evidenceTopics: ["structural_change", "aggregation"],
  },
  {
    title: "Compare G118V with wild-type PFN1 in a standardized aggregation assay",
    why: "Quantifies effect size independent of model organisms",
    expected: "Relative aggregation curves WT vs G118V",
    priority: "High" as const,
    evidenceTopics: ["aggregation"],
  },
  {
    title: "Investigate PFN1–ACTB interaction under G118V",
    why: "Graph records INTERACTS_WITH ACTB; functional impact remains under-validated",
    expected: "Binding / co-localization readouts",
    priority: "Medium" as const,
    evidenceTopics: ["structural_change"],
  },
];
