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
    id: "als-biomarkers",
    title: "ALS biomarker explorer",
    blurb:
      "Filter graph-backed ALS biomarkers by what they are used for, with evidence level, limits and candidate data sources.",
    status: "live",
    tier: "free",
    href: "/diseases/als/biomarkers",
    ctaLabel: "Open biomarkers",
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

/** Microsoft Research BioEmu2 — structure + dynamics engine (not a chat agent). */
export const BIOEMU2 = {
  name: "BioEmu2",
  href: "https://github.com/microsoft/bioemu2",
  article:
    "https://www.linkedin.com/pulse/introducing-bioemu2-jos%C3%A9-jim%C3%A9nez-luna-zblke/",
  blurb:
    "Open structure and dynamics model from Microsoft Research (MIT license). ProtScope will use it under Structures to sample folds and motion. Helix explains those ensembles. An emulated pose stays a hypothesis until evidence supports it.",
} as const;

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
  /** "open" once chat works for this agent; the rest stay "beta". */
  chat: "open" | "beta";
  /** Live tools that cover this specialty today, while chat is not open. */
  liveTools: { label: string; href: string }[];
  /** Questions the agent is built for; shown as examples, not as working chat. */
  sampleQuestions: string[];
};

export const PROTOSCOPE_COMPANIONS: ProtScopeCompanion[] = [
  {
    slug: "meridian",
    name: "Meridian",
    focus: "Disease & evidence",
    blurb:
      "Talk through disease questions, evidence maps, and mechanism framing before molecule design.",
    status: "beta",
    chat: "beta",
    liveTools: [
      { label: "Scientific Review (Ask)", href: "/ask" },
      { label: "ALS evidence", href: "/diseases/als/evidence" },
      { label: "ALS mechanisms", href: "/diseases/als/mechanisms" },
    ],
    sampleQuestions: [
      "Which ALS mechanisms do PFN1 and TUBA4A share?",
      "How strong is the evidence that PFN1 G118V drives misfolding?",
    ],
  },
  {
    slug: "helix",
    name: "Helix",
    focus: "Protein structure",
    blurb:
      "Chat about fold, domains, and motion. Helix will explain BioEmu2 ensembles when that engine is connected.",
    status: "beta",
    chat: "beta",
    liveTools: [
      { label: "Structure explorer", href: "/proteins/explore" },
      { label: "Mutation inspector", href: "/proteins/inspect" },
    ],
    sampleQuestions: [
      "Where in the fold does a substitution sit?",
      "Which domains of PFN1 interact with actin?",
    ],
  },
  {
    slug: "allele",
    name: "Allele",
    focus: "Variants",
    blurb:
      "Discuss pathogenic variants, structural impact hypotheses, and evidence grades.",
    status: "beta",
    chat: "beta",
    liveTools: [
      { label: "Mutation inspector", href: "/proteins/inspect" },
      { label: "ALS evidence", href: "/diseases/als/evidence" },
    ],
    sampleQuestions: [
      "What is known about PFN1 G118V and how well is it supported?",
      "How do TUBA4A variants compare with PFN1 variants?",
    ],
  },
  {
    slug: "pulse",
    name: "Pulse",
    focus: "Biomarkers",
    blurb:
      "Explore molecular readouts and pathway stress signals tied to research questions.",
    status: "beta",
    chat: "open",
    liveTools: [
      { label: "ALS biomarker explorer", href: "/diseases/als/biomarkers" },
    ],
    sampleQuestions: [
      "Which biomarkers can show whether a treatment is hitting its target?",
      "What does NfL tell us, and what can it not tell us?",
    ],
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
