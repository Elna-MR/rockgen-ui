/**
 * Searchable corpus built from ProtScope website material (Learn, Research, guides, genes).
 * Used by the site chatbot, answers stay grounded in these chunks + page links.
 */

import {
  LEARN_GUIDES,
  LEARN_MODULES,
  PRACTICE,
  UNDERSTAND_PAGES,
} from "@/data/alsGuide";
import { curatedGeneIds, getGeneDetail, STATUS_LABEL } from "@/data/falsGeneMeta";
import { LEARN_DISEASES } from "@/data/learnHub";
import { RESEARCH_DISEASES } from "@/data/researchHub";

export type KnowledgeChunk = {
  id: string;
  title: string;
  href: string;
  section: string;
  text: string;
  keywords: string[];
};

function chunk(
  id: string,
  title: string,
  href: string,
  section: string,
  text: string,
  keywords: string[] = [],
): KnowledgeChunk {
  return {
    id,
    title,
    href,
    section,
    text: text.replace(/\s+/g, " ").trim(),
    keywords: keywords.map((k) => k.toLowerCase()),
  };
}

function buildCorpus(): KnowledgeChunk[] {
  const out: KnowledgeChunk[] = [];

  out.push(
    chunk(
      "site-home",
      "ProtScope home",
      "/",
      "Site",
      "ProtScope™ is an AI-powered platform that analyzes proteins from 1-D amino acid sequence to 3-D and quaternary structures. Theme: protein folding in health, protein misfolding in disease. Learninghub™ explores proteins, genetic variants, and shared biological pathways to understand proteotoxicities in ALS, Parkinson’s, Alzheimer’s, and related conditions. Learn and Research paths; Lumen agents. Educational only, not medical advice.",
      ["protscope", "rockgen", "home", "about", "what is", "platform", "value"],
    ),
    chunk(
      "site-biology-first",
      "Biology",
      "/biology-first",
      "Site",
      "Biology on ProtScope characterizes disease by investigating proteins, proteotoxicity, pathogenic variants, and shared cellular pathways involved in disease progression. ProtScope™ is a platform where neurodegenerative diseases can be studied by analyzing proteins and pathological processes. A disease mechanism is a pathological process that can impact an organ, such as the central nervous system, and injure vulnerable neurons — for example proteotoxicity including protein misfolding and aggregation, endoplasmic reticulum stress, cytoskeletal stress, mitochondrial dysfunction, or impaired axonal transport. Genes and proteins can converge on overlapping routes. Neurons (motor, dopaminergic, cortical, striatal) keep organelles under quality control for neurotransmission, cargo transport, and cytoskeletal integrity; injury produces neurological symptoms. ProtScope lets you start from genes and proteins and run AI-powered protein chemistry experiments to discover mechanisms and identify targets. The Biology page cycles central nervous system folds: PFN1 (profilin-1), SOD1, α-synuclein, tau, huntingtin, and TDP-43. Each fold assembles, holds, then changes to the next protein.",
      ["biology", "biology first", "approach", "mechanism", "molecule", "pathology"],
    ),
    chunk(
      "site-structures",
      "Structure explorer",
      "/proteins/explore",
      "Structures",
      "Search by protein, PDB id, or ALS mutation. Inspect substitutions in 3D chemistry or jump to peptide binder design. Related tools: mutation inspector (/proteins/inspect) and peptide design (/proteins/design). After you understand the fold, Inverse FoldDir is a research idea for proposing sequences given a backbone, preprint and code linked on Structure pages; live generation is not wired in yet.",
      ["structure", "pdb", "fold", "3d", "inverse fold", "inversefolddir", "mutation"],
    ),
    chunk(
      "site-ask",
      "Ask scientific review",
      "/ask",
      "Research",
      "Ask runs an evidence-weighted scientific review for PFN1/G118V. Confidence is calculated in code from the graph, not invented by a model. Use starter questions about structure, misfolding, aggregation, animal or clinical evidence, gaps, and next experiments.",
      ["ask", "review", "evidence", "pfn1", "g118v", "confidence"],
    ),
    chunk(
      "site-agentics",
      "Lumen — ProtScope agents",
      "/agentics",
      "Site",
      "Lumen is ProtScope’s fancy name for its agent layer: ProtScope agents you communicate with for evidence-grounded neurodegeneration research. Live today: Scientific Review (Ask), site guide chatbot, structure explorer, mutation inspector and peptide design UI embeds, and narrow ALS demos. Named Lumen agents in Beta: Meridian (disease and evidence), Helix (protein structure), Allele (variants), and Pulse (biomarkers). Chat not open yet. Paid unlocks may come later; no payment now. Educational only.",
      ["lumen", "agentics", "agents", "meridian", "helix", "allele", "pulse", "beta", "chat", "protoscope", "waitlist"],
    ),
    chunk(
      "site-beta",
      "Protoscope Beta",
      "/beta",
      "Site",
      "Protoscope Beta waitlist (linked from Agentics): core ProtScope Learn, Research browse, Structures, and fair-use Ask are free. Agentics is Beta. ProtScope companions (Meridian, Helix, Allele, Pulse) are for future communication. Paid unlocks may come later; no payment collected yet. Educational only; not medical advice.",
      ["beta", "waitlist", "subscription", "protoscope", "pro", "free", "payment", "agentics"],
    ),
    chunk(
      "site-network",
      "Familial ALS gene network",
      "/diseases/als/network",
      "ALS research",
      "Curated familial ALS gene interactions with therapeutic programme notes. Node size is approximate share of familial ALS cases; colour is functional module; edge thickness is curated interaction confidence. Filter by min confidence, familial %, modules, and programmes only. Click a gene for notes and neighborhood map. Educational research aid only.",
      ["network", "string", "fals", "gene network", "programmes", "tofersen"],
    ),
  );

  for (const d of LEARN_DISEASES) {
    out.push(
      chunk(
        `learn-${d.slug}`,
        `Learn · ${d.shortName}`,
        `/learn/${d.slug}`,
        "Learn",
        `${d.name}. ${d.tagline}. ${d.summary} Focus: ${d.focus.join(", ")}. Mechanisms: ${d.mechanisms.join("; ")}. Key facts: ${d.keyFacts.join(" ")} Status: ${d.status}.`,
        [d.slug, d.shortName, d.name, ...d.searchTerms, ...d.focus],
      ),
    );
    for (const p of d.proteins) {
      out.push(
        chunk(
          `learn-protein-${d.slug}-${p.symbol}`,
          `${p.symbol} · ${p.name}`,
          p.href || `/learn/${d.slug}`,
          "Learn proteins",
          `${p.symbol} (${p.name}) in ${d.shortName}: ${p.role}`,
          [p.symbol, p.name, d.slug],
        ),
      );
    }
  }

  for (const d of RESEARCH_DISEASES) {
    out.push(
      chunk(
        `research-${d.slug}`,
        `Research · ${d.shortName}`,
        `/diseases/${d.slug}`,
        "Research",
        `${d.name}. ${d.synopsis} Mechanisms: ${d.mechanisms.join("; ")}. Notes: ${d.researchNotes.join(" ")}`,
        [d.slug, d.shortName, ...d.searchTerms, ...d.focus],
      ),
    );
    for (const t of d.tools) {
      out.push(
        chunk(
          `tool-${d.slug}-${t.href}`,
          `${d.shortName} · ${t.title}`,
          t.href,
          "Research tools",
          `${t.title} (${t.status}): ${t.summary}`,
          [t.title, d.slug, d.shortName],
        ),
      );
    }
  }

  for (const a of UNDERSTAND_PAGES) {
    out.push(
      chunk(
        `plain-${a.slug}`,
        a.title,
        `/learn/als/plain/${a.slug}`,
        "Plain language",
        `${a.summary} ${a.paragraphs.join(" ")}`,
        [a.title, a.slug, "patient", "family", "als"],
      ),
    );
  }

  for (const a of LEARN_GUIDES) {
    out.push(
      chunk(
        `guide-${a.slug}`,
        a.title,
        `/learn/guides/${a.slug}`,
        "Student guides",
        `${a.summary} ${a.paragraphs.join(" ")}`,
        [a.title, a.slug, "student", "evidence"],
      ),
    );
  }

  for (const m of LEARN_MODULES) {
    out.push(
      chunk(
        `module-${m.id}`,
        `Curriculum · ${m.title}`,
        m.href,
        "ALS curriculum",
        `Module ${m.number}: ${m.title}. Outcome: ${m.outcome}. About ${m.minutes}.`,
        [m.title, "curriculum", "learn", "als"],
      ),
    );
  }

  for (const p of PRACTICE) {
    out.push(
      chunk(
        `practice-${p.slug}`,
        `Practice · ${p.title}`,
        `/learn/practice/${p.slug}`,
        "Practice",
        `${p.title}. Goal: ${p.goal}. Steps: ${p.steps.join(" ")} Reflect: ${p.reflect.join(" ")}`,
        [p.title, p.slug, "practice"],
      ),
    );
  }

  for (const id of curatedGeneIds()) {
    const g = getGeneDetail(id);
    const progBits =
      g.programmes
        ?.map((p) => `${p.name} (${STATUS_LABEL[p.status]}${p.note ? `: ${p.note}` : ""})`)
        .join("; ") || "";
    out.push(
      chunk(
        `gene-${id}`,
        `${id} · ${g.fullName}`,
        "/diseases/als/network",
        "fALS genes",
        `${id} (${g.fullName})${g.locus ? ` locus ${g.locus}` : ""}. ${g.summary}${g.hoverNote ? ` Programme note: ${g.hoverNote}` : ""}${progBits ? ` Programmes: ${progBits}` : ""}`,
        [id, g.fullName, "fals", "gene", "programme", "als"],
      ),
    );
  }

  out.push(
    chunk(
      "disclaimer",
      "Educational, not medical advice",
      "/learn/als/plain/questions",
      "Site",
      "ProtScope is educational research material only. It does not diagnose, prognose, or prescribe treatment. Care decisions belong with your clinical team and trusted ALS clinics.",
      ["disclaimer", "medical", "advice", "treatment", "diagnosis"],
    ),
  );

  return out;
}

let cached: KnowledgeChunk[] | null = null;

export function getSiteKnowledge(): KnowledgeChunk[] {
  if (!cached) cached = buildCorpus();
  return cached;
}
