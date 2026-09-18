import type { KnowledgeChunk } from "@/data/siteKnowledge";
import { getSiteKnowledge } from "@/data/siteKnowledge";

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "for",
  "is",
  "are",
  "was",
  "were",
  "be",
  "what",
  "where",
  "how",
  "why",
  "when",
  "who",
  "does",
  "do",
  "can",
  "i",
  "me",
  "my",
  "you",
  "your",
  "this",
  "that",
  "with",
  "from",
  "about",
  "into",
  "it",
  "its",
]);

export type ScoredChunk = KnowledgeChunk & { score: number };

export function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9α-ω+\-./%]+/gi, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function searchSiteKnowledge(question: string, limit = 6): ScoredChunk[] {
  const tokens = tokenize(question);
  if (!tokens.length) return [];

  const corpus = getSiteKnowledge();
  const scored: ScoredChunk[] = [];

  for (const c of corpus) {
    const hay = `${c.title} ${c.section} ${c.text} ${c.keywords.join(" ")}`.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (c.keywords.some((k) => k === t || k.includes(t) || t.includes(k))) score += 4;
      if (c.title.toLowerCase().includes(t)) score += 3;
      if (c.href.toLowerCase().includes(t)) score += 2;
      if (hay.includes(t)) score += 1;
      // multi-word gene / page boosts
      if (t.length >= 4 && new RegExp(`\\b${escapeRe(t)}`, "i").test(c.title)) score += 2;
    }
    // phrase bonus
    const qLower = question.toLowerCase();
    if (qLower.length > 8 && c.text.toLowerCase().includes(qLower.slice(0, 40))) score += 5;
    if (score > 0) scored.push({ ...c, score });
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return scored.slice(0, limit);
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Deterministic answer from retrieved chunks (no LLM required). */
export function answerFromChunks(question: string, chunks: ScoredChunk[]): string {
  if (!chunks.length) {
    return (
      "I couldn’t find matching pages in RockGen’s indexed material for that. " +
      "Try asking about ALS Learn tracks, the gene network, Structure explorer, Biology, or a gene like SOD1 or PFN1. " +
      "This helper only searches site content — it is not medical advice."
    );
  }

  const top = chunks[0];
  const extras = chunks.slice(1, 4);
  const excerpt = top.text.length > 420 ? `${top.text.slice(0, 420).trim()}…` : top.text;

  const lines = [
    `From **${top.title}** (${top.section}):`,
    excerpt,
  ];

  if (extras.length) {
    lines.push("");
    lines.push("Related pages on this site:");
    for (const e of extras) {
      lines.push(`• ${e.title} — ${e.href}`);
    }
  }

  lines.push("");
  lines.push(
    "Educational only — not a diagnosis or treatment recommendation. Open the linked pages for the full text.",
  );

  // light question-type framing
  const q = question.toLowerCase();
  if (q.includes("where") || q.includes("find") || q.includes("open")) {
    lines.unshift(`Start here: ${top.href}`);
    lines.unshift("");
  }

  return lines.join("\n");
}
