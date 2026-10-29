/** ALS program intelligence: the mutation-to-biomarker map and biomarker gaps. The biomarker catalog lives in the graph.
 * Mutation cards are served by Disease Intelligence Engine
 * (`GET /v1/intelligence/...`), do not reintroduce static mutation twins here.
 */

export type EdgeSupport = "supported" | "broadly_supported" | "not_directly_validated" | "hypothetical";

export const ALS_MECHANISM = [
  { id: "pfn1", label: "PFN1", href: "/proteins/P07737" },
  { id: "g118v", label: "G118V", href: "/proteins/P07737" },
  { id: "misfold", label: "Misfolding" },
  { id: "agg", label: "Aggregation" },
  { id: "injury", label: "Neuronal injury" },
];

export const MUTATION_BIOMARKER_MAP = [
  {
    from: "PFN1 G118V",
    to: "PFN1 misfolding",
    support: "supported" as EdgeSupport,
    note: "Computational + in vitro evidence on the graph",
  },
  {
    from: "PFN1 misfolding",
    to: "Protein aggregation",
    support: "supported" as EdgeSupport,
    note: "In vitro + animal-linked aggregation evidence",
  },
  {
    from: "Protein aggregation",
    to: "Motor-neuron injury",
    support: "broadly_supported" as EdgeSupport,
    note: "Broad neurodegeneration biology; not unique to PFN1",
  },
  {
    from: "Motor-neuron injury",
    to: "NfL release into blood/CSF",
    support: "broadly_supported" as EdgeSupport,
    note: "NfL tracks neuronal injury generally",
  },
  {
    from: "PFN1 G118V",
    to: "Increased NfL",
    support: "not_directly_validated" as EdgeSupport,
    note: "No indexed evidence that G118V specifically elevates NfL vs other ALS drivers",
  },
];

export const ALS_BIOMARKER_GAPS = [
  "No validated PFN1-specific biomarker currently exists in the indexed evidence",
  "No validated target-engagement biomarker for PFN1 stabilization",
  "Limited human evidence linking G118V to a PFN1 conformational signature",
  "Need: PFN1 oligomer / aggregate assay",
  "Need: conformational-state biomarker",
  "Need: PFN1 interaction biomarker",
  "Need: mutation-specific blood or CSF signature",
];
