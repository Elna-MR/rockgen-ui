/**
 * Searchable corpus built from RockGen website material (Learn, Research, guides, genes).
 * Used by the site chatbot — answers stay grounded in these chunks + page links.
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
      "RockGen home",
      "/",
      "Site",
      "RockGen is an educational and research workspace for neurodegeneration. Map disease proteins and shared mechanisms across ALS, Parkinson’s, Alzheimer’s, Huntington’s, FTD and related biology before designing drugs. Learn tracks and evidence workspaces. Not medical advice.",
      ["rockgen", "home", "about", "what is"],
    ),
    chunk(
      "site-biology-first",
      "Biology first",
      "/biology-first",
      "Site",
      "Biology first means see how disease proteins fail and which shared routes matter before designing molecules. A mechanism is a shared biological failure route such as protein aggregation, cytoskeleton stress, mitochondrial dysfunction, or axonal transport. Molecule-first jumps to compounds; biology-first ranks the disease map first. Working chain: gene & protein → alleles & structure → mechanisms → evidence → design later.",
      ["biology first", "approach", "mechanism", "molecule"],
    ),
    chunk(
      "site-structures",
      "Structure explorer",
      "/proteins/explore",
      "Structures",
      "Search by protein, PDB id, or ALS mutation. Inspect substitutions in 3D chemistry or jump to peptide binder design. Related tools: mutation inspector (/proteins/inspect) and peptide design (/proteins/design). After you understand the fold, Inverse FoldDir is a research idea for proposing sequences given a backbone — preprint and code linked on Structure pages; live generation is not wired in yet.",
      ["structure", "pdb", "fold", "3d", "inverse fold", "inversefolddir", "mutation"],
    ),
    chunk(
      "site-ask",
      "Ask scientific review",
      "/ask",
      "Research",
      "Ask runs an evidence-weighted scientific review for PFN1/G118V. Confidence is calculated in code from the graph—not invented by a model. Use starter questions about structure, misfolding, aggregation, animal or clinical evidence, gaps, and next experiments.",
      ["ask", "review", "evidence", "pfn1", "g118v", "confidence"],
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
      "Educational — not medical advice",
      "/learn/als/plain/questions",
      "Site",
      "RockGen is educational research material only. It does not diagnose, prognose, or prescribe treatment. Care decisions belong with your clinical team and trusted ALS clinics.",
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
