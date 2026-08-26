const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export type DiseaseSummary = {
  slug: string;
  name: string;
  synopsis?: string;
  protein_count?: number;
};

export type DiseaseDetail = DiseaseSummary & {
  proteins: Array<{ uniprot_id: string; symbol: string; name: string }>;
  mutations: Array<{ key: string; hgvs_p: string; significance?: string }>;
  biomarkers: Array<{ id: string; name: string; description?: string }>;
  clinical_trials: Array<{ nct_id: string; title: string; status?: string; url?: string }>;
  publications: Array<{ id: string; title: string; year?: number; url?: string }>;
  drugs: Array<{ id: string; name: string; mechanism?: string }>;
  drug_programs: Array<{ id: string; name: string; stage?: string }>;
  experiments: unknown[];
};

export type ProteinDetail = {
  uniprot_id: string;
  symbol: string;
  name: string;
  sequence?: string;
  length?: number;
  function?: string;
  gene?: { symbol: string; name?: string } | null;
  mutations: Array<{
    key: string;
    hgvs_p: string;
    significance?: string;
    description?: string;
    position?: number;
    from_aa?: string;
    to_aa?: string;
  }>;
  structures: Array<{
    id: string;
    source?: string;
    url?: string;
    method?: string;
    resolution?: number;
  }>;
  pathways: Array<{ id: string; name: string }>;
  interaction_partners: Array<{ uniprot_id: string; symbol: string; name?: string }>;
  publications: Array<{ id: string; title: string; year?: number; url?: string }>;
  drug_programs: Array<{ id: string; name: string; stage?: string }>;
};

export type MutationPath = {
  mutation: { key: string; hgvs_p?: string; significance?: string };
  protein?: { uniprot_id: string; symbol: string } | null;
  causal_chain: Array<{ label: string; id: string; name: string }>;
  clinvar_assertions?: Array<{
    id: string;
    protein_change?: string;
    clinical_significance?: string;
    url?: string;
  }>;
};

export type EvidenceBundle = {
  protein: ProteinDetail & { function?: string };
  mutations: ProteinDetail["mutations"];
  structures: ProteinDetail["structures"];
  clinvar_assertions: Array<{
    id: string;
    protein_change?: string;
    clinical_significance?: string;
    url?: string;
  }>;
  papers: Array<{ id: string; title?: string; year?: number; url?: string; abstract?: string }>;
  evidence: Array<{
    evidence_id: string;
    claim_id: string;
    claim_text?: string;
    claim_topic?: string;
    evidence_type?: string;
    confidence?: string;
    publication_date?: string;
    citation?: string;
    source_url?: string;
  }>;
  timeline: Array<{
    evidence_id: string;
    claim_text?: string;
    evidence_type?: string;
    publication_date?: string;
    citation?: string;
    source_url?: string;
  }>;
  claim_matrix: Array<{
    claim_id: string;
    claim: string;
    topic?: string;
    evidence_types: string[];
    evidence_summary: string;
    confidence?: string;
    validated: boolean;
    sources: Array<{
      evidence_id: string;
      citation?: string;
      paper_id?: string;
      url?: string;
    }>;
  }>;
};

export function listDiseases() {
  return apiGet<DiseaseSummary[]>("/v1/diseases");
}

export function getDisease(slug: string) {
  return apiGet<DiseaseDetail>(`/v1/diseases/${slug}`);
}

export function getProtein(uniprotId: string) {
  return apiGet<ProteinDetail>(`/v1/proteins/${uniprotId}`);
}

export function getProteinEvidence(uniprotId: string) {
  return apiGet<EvidenceBundle>(`/v1/proteins/${uniprotId}/evidence`);
}

export function getMutationPath(key: string) {
  return apiGet<MutationPath>(`/v1/mutations/${encodeURIComponent(key)}/path`);
}

export type ProteinStateScore = {
  dimensions: {
    structural_disruption: number;
    misfolding_risk: number;
    aggregation_risk: number;
    functional_disruption: number;
    evidence_strength: number;
    human_relevance: number;
  };
  breakdown: Record<string, string[]>;
  priority_index: number;
  disclaimer: string;
};

export type MutationComparison = {
  uniprot_id: string;
  symbol: string;
  variant_label?: string;
  question: string;
  mutations: Array<{
    key: string;
    variant: string;
    hgvs_p: string;
    position: number;
    clinvar_status: string;
    structural_location: string;
    binding_region: string;
    known_functional_effects: string[];
    evidence_mix: Record<string, boolean>;
    overall_confidence_label: string;
    ranking_note: string;
    protein_state_score: ProteinStateScore;
  }>;
  ranked_keys: string[];
  most_disruptive: {
    key: string;
    variant: string;
    priority_index: number;
    why: string;
    top_dimensions: Array<[string, number]>;
  };
  comparison_table: Array<{
    id: string;
    property: string;
    cells: Record<
      string,
      {
        value: string;
        claim_id?: string | null;
        evidence_ids: string[];
        note?: string;
        evidence_href: string;
      }
    >;
  }>;
  scoring_method: {
    type: string;
    dimensions: string[];
    disclaimer: string;
  };
};

export type ProteinHealthReport = {
  uniprot_id: string;
  title: string;
  comparison: MutationComparison;
  structural_interpretation: string;
  research_gaps: string[];
  contradictions: Array<{ topic: string; summary: string; evidence_ids: string[] }>;
  recommended_next_experiments: string[];
  markdown: string;
};

export function getMutationComparison(uniprotId: string) {
  return apiGet<MutationComparison>(`/v1/proteins/${uniprotId}/compare`);
}

export function getProteinHealthReport(uniprotId: string) {
  return apiGet<ProteinHealthReport>(`/v1/proteins/${uniprotId}/health-report`);
}

export function healthReportMarkdownUrl(uniprotId: string) {
  return `${API_URL}/v1/proteins/${uniprotId}/health-report?format=markdown`;
}

export type DiseaseAxis = {
  id: string;
  name: string;
  mechanism_ids: string[];
  proteins: Array<{
    uniprot_id: string;
    symbol: string;
    name: string;
    max_level: string;
    href: string;
  }>;
};

export type DiseaseMechanismMap = {
  disease_slug: string;
  title: string;
  axes: DiseaseAxis[];
  panel_note: string;
};

export type ProteinCompare = {
  proteins: Array<{
    uniprot_id: string;
    symbol: string;
    name: string;
    levels: Record<string, string>;
    pathway_chain: string[];
    display: Array<{ mechanism_id: string; label: string; level: string }>;
  }>;
  similarity: {
    similarity: number;
    shared_medium_or_high: string[];
    divergences: Array<{ mechanism_id: string; label: string; a: string; b: string }>;
    explanation: string;
  };
  shared_mechanisms: string[];
  unique_to_a: string[];
  unique_to_b: string[];
  shared_biomarkers: Array<{ id: string; name: string; note: string }>;
  research_gaps: string[];
  pathway_chains: Record<string, string[]>;
  shared_pathways_note: string;
};

export type TherapeuticOpportunities = {
  disease_slug: string;
  title: string;
  disclaimer: string;
  opportunities: Array<{
    mechanism_id: string;
    mechanism: string;
    supporting_proteins: Array<{ uniprot_id: string; symbol: string; level: string }>;
    evidence: string;
    priority: string;
    priority_score: number;
    rationale: string;
  }>;
};

export type MechanismMatrix = {
  mechanisms: Array<{ id: string; label: string }>;
  proteins: Array<{
    uniprot_id: string;
    symbol: string;
    levels: Record<string, string>;
  }>;
  disclaimer: string;
};

export function getDiseaseMechanismMap(slug: string) {
  return apiGet<DiseaseMechanismMap>(`/v1/diseases/${slug}/mechanism-map`);
}

export function getDiseaseMechanismMatrix(slug: string) {
  return apiGet<MechanismMatrix>(`/v1/diseases/${slug}/mechanism-matrix`);
}

export function getDiseaseProteinCompare(slug: string, ids = "P07737,P68366") {
  return apiGet<ProteinCompare>(
    `/v1/diseases/${slug}/proteins/compare?ids=${encodeURIComponent(ids)}`
  );
}

export function getTherapeuticOpportunities(slug: string) {
  return apiGet<TherapeuticOpportunities>(`/v1/diseases/${slug}/therapeutic-opportunities`);
}

export function getMechanismPrioritization(slug: string) {
  return apiGet<Record<string, unknown>>(`/v1/diseases/${slug}/mechanism-prioritization`);
}

export function mechanismReportMarkdownUrl(
  slug: string,
  a = "P07737",
  b = "P68366"
) {
  return `${API_URL}/v1/diseases/${slug}/mechanism-report?a=${a}&b=${b}&format=markdown`;
}

/** Disease Intelligence Engine — graph-backed scientific dossiers */

export type MutationIntelCard = {
  key: string;
  variant?: string | null;
  hgvs_p?: string | null;
  significance?: string | null;
  gene?: string | null;
  protein_symbol?: string | null;
  protein_name?: string | null;
  uniprot_id?: string | null;
  disease_association?: string | null;
  mechanism_path: string[];
  clinvar?: Array<{ id?: string; clinical_significance?: string }>;
  statements?: Array<{ claim_id: string; statement: string; confidence_score?: number }>;
  evidence_mix: Record<string, boolean>;
  paper_count: number;
  confidence_score?: number | null;
  confidence_label?: string | null;
  primary_statement?: string | null;
  review_question?: string | null;
  dossier_href?: string | null;
};

export type ProteinIntelligence = {
  engine: string;
  uniprot_id: string;
  symbol?: string;
  name?: string;
  gene?: string;
  mutations: MutationIntelCard[];
  mechanisms: Array<{
    id: string;
    name?: string;
    level?: string;
    axis_id?: string;
    evidence_note?: string;
  }>;
  biomarkers: Array<{ id: string; name?: string; description?: string; role?: string }>;
  gaps: string[];
  source: string;
};

export type DiseaseIntelligence = {
  engine: string;
  slug: string;
  name?: string;
  synopsis?: string;
  focus_proteins: ProteinIntelligence[];
  biomarkers: Array<{ id: string; name?: string; description?: string; role?: string; specificity_note?: string }>;
  drugs: Array<{ id?: string; name?: string; mechanism?: string }>;
  gaps: string[];
  source: string;
};

export function getProteinIntelligence(uniprotId: string) {
  return apiGet<ProteinIntelligence>(`/v1/intelligence/proteins/${uniprotId}`);
}

export function getDiseaseIntelligence(slug: string) {
  return apiGet<DiseaseIntelligence>(`/v1/intelligence/diseases/${slug}`);
}
