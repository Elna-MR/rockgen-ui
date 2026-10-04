import type {
  DiseaseMechanismMap,
  MechanismMatrix,
  ProteinCompare,
} from "@/lib/api";

/** Offline ALS map / matrix / compare when the API is not configured (e.g. Amplify-only). */

const MECHANISMS = [
  { id: "aggregation", label: "Aggregation" },
  { id: "cytoskeleton_disruption", label: "Cytoskeleton" },
  { id: "microtubule_instability", label: "Microtubule" },
  { id: "rna_metabolism", label: "RNA metabolism" },
  { id: "axonal_transport", label: "Axonal transport" },
  { id: "stress_granules", label: "Stress granules" },
  { id: "autophagy_lysosome", label: "Autophagy / clearance" },
  { id: "neuroinflammation", label: "Neuroinflammation" },
  { id: "mitochondrial_dysfunction", label: "Mitochondria" },
] as const;

const LEVELS: Record<string, Record<string, string>> = {
  P07737: {
    aggregation: "high",
    cytoskeleton_disruption: "high",
    microtubule_instability: "low",
    rna_metabolism: "low",
    axonal_transport: "medium",
    stress_granules: "low",
    autophagy_lysosome: "low",
    neuroinflammation: "low",
    mitochondrial_dysfunction: "low",
  },
  P68366: {
    aggregation: "medium",
    cytoskeleton_disruption: "high",
    microtubule_instability: "high",
    rna_metabolism: "low",
    axonal_transport: "high",
    stress_granules: "low",
    autophagy_lysosome: "low",
    neuroinflammation: "low",
    mitochondrial_dysfunction: "low",
  },
  P00441: {
    aggregation: "high",
    cytoskeleton_disruption: "low",
    microtubule_instability: "low",
    rna_metabolism: "low",
    axonal_transport: "medium",
    stress_granules: "low",
    autophagy_lysosome: "medium",
    neuroinflammation: "low",
    mitochondrial_dysfunction: "medium",
  },
  P35637: {
    aggregation: "high",
    cytoskeleton_disruption: "low",
    microtubule_instability: "low",
    rna_metabolism: "high",
    axonal_transport: "medium",
    stress_granules: "high",
    autophagy_lysosome: "low",
    neuroinflammation: "low",
    mitochondrial_dysfunction: "low",
  },
  Q13148: {
    aggregation: "high",
    cytoskeleton_disruption: "low",
    microtubule_instability: "low",
    rna_metabolism: "high",
    axonal_transport: "medium",
    stress_granules: "high",
    autophagy_lysosome: "low",
    neuroinflammation: "low",
    mitochondrial_dysfunction: "low",
  },
};

const META: Record<string, { symbol: string; name: string }> = {
  P07737: { symbol: "PFN1", name: "Profilin-1" },
  P68366: { symbol: "TUBA4A", name: "Tubulin alpha-4A" },
  P00441: { symbol: "SOD1", name: "Superoxide dismutase [Cu-Zn]" },
  P35637: { symbol: "FUS", name: "RNA-binding protein FUS" },
  Q13148: { symbol: "TARDBP", name: "TAR DNA-binding protein 43" },
};

const SCORE: Record<string, number> = { high: 3, medium: 2, low: 1, none: 0 };

const AXIS_DEFS = [
  {
    id: "proteostasis",
    name: "Proteostasis & aggregation",
    mechanism_ids: ["aggregation", "autophagy_lysosome"],
  },
  {
    id: "cytoskeleton",
    name: "Cytoskeleton & transport",
    mechanism_ids: ["cytoskeleton_disruption", "microtubule_instability", "axonal_transport"],
  },
  {
    id: "rna",
    name: "RNA metabolism",
    mechanism_ids: ["rna_metabolism", "stress_granules"],
  },
  {
    id: "inflammation",
    name: "Neuroinflammation & mitochondria",
    mechanism_ids: ["neuroinflammation", "mitochondrial_dysfunction"],
  },
];

export const ALS_MECHANISM_MATRIX_FALLBACK: MechanismMatrix = {
  mechanisms: MECHANISMS.map((m) => ({ id: m.id, label: m.label })),
  proteins: Object.entries(LEVELS).map(([uniprot_id, levels]) => ({
    uniprot_id,
    symbol: META[uniprot_id].symbol,
    levels: { ...levels },
  })),
  disclaimer: "Curated offline panel. Connect the API for live graph-backed levels.",
};

export const ALS_MECHANISM_MAP_FALLBACK: DiseaseMechanismMap = {
  disease_slug: "als",
  title: "ALS disease map",
  panel_note:
    "PFN1 and TUBA4A are program focus proteins. Other genes shown from the curated panel.",
  axes: AXIS_DEFS.map((ax) => {
    const proteins = Object.entries(LEVELS)
      .map(([uniprot_id, levels]) => {
        const best = Math.max(
          ...ax.mechanism_ids.map((mid) => SCORE[levels[mid] || "none"] ?? 0),
        );
        if (best < 2) return null;
        const meta = META[uniprot_id];
        return {
          uniprot_id,
          symbol: meta.symbol,
          name: meta.name,
          max_level: best >= 3 ? "high" : "medium",
          href: `/proteins/${uniprot_id}`,
        };
      })
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 } as Record<string, number>;
        return (order[a.max_level] ?? 9) - (order[b.max_level] ?? 9) || a.symbol.localeCompare(b.symbol);
      });
    return { ...ax, proteins };
  }),
};

export const ALS_COMPARE_FALLBACK: ProteinCompare = {
  proteins: [
    {
      uniprot_id: "P07737",
      symbol: "PFN1",
      name: "Profilin-1",
      levels: LEVELS.P07737,
      pathway_chain: ["PFN1", "Misfolding", "Aggregation", "Cytoskeleton stress", "Motor neuron injury"],
      display: MECHANISMS.map((m) => ({
        mechanism_id: m.id,
        label: m.label,
        level: LEVELS.P07737[m.id] || "none",
      })),
    },
    {
      uniprot_id: "P68366",
      symbol: "TUBA4A",
      name: "Tubulin alpha-4A",
      levels: LEVELS.P68366,
      pathway_chain: [
        "TUBA4A",
        "Microtubule instability",
        "Axonal transport",
        "Cytoskeleton stress",
        "Motor neuron injury",
      ],
      display: MECHANISMS.map((m) => ({
        mechanism_id: m.id,
        label: m.label,
        level: LEVELS.P68366[m.id] || "none",
      })),
    },
  ],
  similarity: {
    similarity: 0.72,
    shared_medium_or_high: ["cytoskeleton_disruption", "axonal_transport", "aggregation"],
    divergences: [
      {
        mechanism_id: "microtubule_instability",
        label: "Microtubule",
        a: "low",
        b: "high",
      },
    ],
    explanation:
      "PFN1 and TUBA4A share cytoskeleton and transport stress; microtubule instability is stronger for TUBA4A.",
  },
  shared_mechanisms: ["cytoskeleton_disruption", "axonal_transport", "aggregation"],
  unique_to_a: ["misfolding emphasis"],
  unique_to_b: ["microtubule_instability"],
  shared_biomarkers: [
    {
      id: "nfl",
      name: "NfL",
      note: "Injury marker, not mechanism-specific.",
    },
  ],
  research_gaps: [
    "Direct head-to-head human evidence for shared intervention points remains limited.",
  ],
  pathway_chains: {
    P07737: ["PFN1", "Misfolding", "Aggregation", "Cytoskeleton stress", "Motor neuron injury"],
    P68366: [
      "TUBA4A",
      "Microtubule instability",
      "Axonal transport",
      "Cytoskeleton stress",
      "Motor neuron injury",
    ],
  },
  shared_pathways_note: "Both routes converge on cytoskeleton stress and motor neuron injury.",
};
