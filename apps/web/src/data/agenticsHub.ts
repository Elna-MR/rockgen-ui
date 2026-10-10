/** Agentics capability catalog: Live vs Coming soon (honest product surface). */

export type AgenticsStatus = "live" | "coming_soon";
export type AgenticsTier = "free" | "pro";

export type AgenticsCapability = {
  id: string;
  title: string;
  blurb: string;
  status: AgenticsStatus;
  tier: AgenticsTier;
  href: string | null;
  ctaLabel?: string;
};

export const AGENTICS_LIVE: AgenticsCapability[] = [
  {
    id: "ask",
    title: "Scientific Review (Ask)",
    blurb:
      "Evidence-weighted review grounded in the graph for PFN1/G118V science questions. Confidence is scored in code, not invented by a model.",
    status: "live",
    tier: "free",
    href: "/ask",
    ctaLabel: "Try Ask",
  },
  {
    id: "chat",
    title: "Site guide chatbot",
    blurb:
      "Ask how to navigate Learn, Research, Structures, and disease tracks. Retrieval over site knowledge, with optional language polish.",
    status: "live",
    tier: "free",
    href: "/",
    ctaLabel: "Open site",
  },
  {
    id: "structures",
    title: "Structure explorer",
    blurb: "Search proteins and PDB entries, then open folds in 3D context.",
    status: "live",
    tier: "free",
    href: "/proteins/explore",
    ctaLabel: "Explore structures",
  },
  {
    id: "mutation-inspector",
    title: "Mutation inspector",
    blurb:
      "Client-side tool to inspect substitutions in 3D chemistry. Educational workspace, not a clinical variant classifier.",
    status: "live",
    tier: "free",
    href: "/proteins/inspect",
    ctaLabel: "Open inspector",
  },
  {
    id: "peptide-ui",
    title: "Peptide design UI",
    blurb:
      "Interactive peptide binder exploration embed. Explore ideas; server-side generative design is not live yet.",
    status: "live",
    tier: "free",
    href: "/proteins/design",
    ctaLabel: "Open design UI",
  },
  {
    id: "als-mutation-intel",
    title: "ALS mutation path & compare",
    blurb:
      "Narrow live demos for PFN1/TUBA4A mutation paths, compare views, and dynamics PoC inside the ALS research workspace.",
    status: "live",
    tier: "free",
    href: "/diseases/als/evidence",
    ctaLabel: "ALS evidence tools",
  },
];

export const AGENTICS_COMING: AgenticsCapability[] = [
  {
    id: "multi-agent",
    title: "Coordinated companion analysis",
    blurb:
      "Meridian, Helix, Allele, Pulse and related ProtScope companions composing graph-grounded reviews together. Planned for Beta; chat not open yet.",
    status: "coming_soon",
    tier: "pro",
    href: null,
    ctaLabel: "Join Protoscope™ waitlist",
  },
  {
    id: "broad-mutations",
    title: "Broader protein mutation analysis",
    blurb:
      "Expand beyond the ALS PFN1/TUBA4A demo set to disease genes across the neurodegeneration catalog, with the same evidence discipline.",
    status: "coming_soon",
    tier: "pro",
    href: null,
    ctaLabel: "Join Protoscope™ waitlist",
  },
  {
    id: "peptide-ligand",
    title: "Peptide ligand design pipelines",
    blurb:
      "Server-backed ligand and binder design workflows with saved runs and audit trails. Distinct from the free exploration UI.",
    status: "coming_soon",
    tier: "pro",
    href: null,
    ctaLabel: "Join Protoscope™ waitlist",
  },
  {
    id: "inverse-fold",
    title: "Inverse fold / sequence generation",
    blurb:
      "Propose sequences for a given backbone (Inverse FoldDir and related research ideas). Live generation is not wired in ProtScope yet.",
    status: "coming_soon",
    tier: "pro",
    href: null,
    ctaLabel: "Join Protoscope™ waitlist",
  },
];

/**
 * ProtScope companions you will communicate with (Agentics Beta — chat not live yet).
 * To add one: append here. Page: /agents/[slug]
 * Optional top-nav: <Link href="/agents/your-slug">Name</Link> in layout.tsx
 * Payments / Pro unlocks come later; this catalog is Beta framing only.
 */
export type ProtScopeCompanion = {
  slug: string;
  /** Character name users talk to */
  name: string;
  /** Short specialty label (not “agent”) */
  focus: string;
  blurb: string;
  status: "beta";
};

export const PROTOSCOPE_COMPANIONS: ProtScopeCompanion[] = [
  {
    slug: "meridian",
    name: "Meridian",
    focus: "Disease & evidence",
    blurb:
      "Talk through disease questions, evidence maps, and mechanism framing before molecule design.",
    status: "beta",
  },
  {
    slug: "helix",
    name: "Helix",
    focus: "Protein structure",
    blurb:
      "Chat about fold, domains, and structural context for disease-associated proteins.",
    status: "beta",
  },
  {
    slug: "allele",
    name: "Allele",
    focus: "Variants",
    blurb:
      "Discuss pathogenic variants, structural impact hypotheses, and evidence grades.",
    status: "beta",
  },
  {
    slug: "pulse",
    name: "Pulse",
    focus: "Biomarkers",
    blurb:
      "Explore molecular readouts and pathway stress signals tied to research questions.",
    status: "beta",
  },
];

/** @deprecated use PROTOSCOPE_COMPANIONS */
export const AGENT_CHARACTERS = PROTOSCOPE_COMPANIONS;

export function getProtScopeCompanion(slug: string): ProtScopeCompanion | undefined {
  return PROTOSCOPE_COMPANIONS.find((a) => a.slug === slug);
}

export function getAgentCharacter(slug: string): ProtScopeCompanion | undefined {
  return getProtScopeCompanion(slug);
}

export const BETA_COMPARISON: {
  feature: string;
  free: string;
  pro: string;
}[] = [
  {
    feature: "Learn hubs & disease primers",
    free: "Included",
    pro: "Included",
  },
  {
    feature: "Research browse & biology explainer",
    free: "Included",
    pro: "Included",
  },
  {
    feature: "Structure explorer (PDB)",
    free: "Included",
    pro: "Included",
  },
  {
    feature: "Scientific Review (Ask)",
    free: "Fair-use beta",
    pro: "Higher quotas (coming)",
  },
  {
    feature: "Mutation inspector & peptide UI embeds",
    free: "Explore",
    pro: "Saved runs (coming)",
  },
  {
    feature: "Multi-agent Agentics workflows",
    free: "—",
    pro: "Coming soon",
  },
  {
    feature: "Expanded mutation analysis catalog",
    free: "ALS demos only",
    pro: "Coming soon",
  },
  {
    feature: "Peptide ligand design pipelines",
    free: "—",
    pro: "Coming soon",
  },
];
