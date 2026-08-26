"use client";

import { useState } from "react";
import { apiBase } from "@/lib/apiBase";

const STARTERS = [
  "Does G118V change PFN1 structure?",
  "Does G118V increase misfolding?",
  "Does G118V increase aggregation?",
  "Is there animal evidence?",
  "Is there human or clinical evidence?",
  "What remains unproven?",
  "What experiment should be done next?",
];

type EvidenceItem = {
  evidence_id: string;
  title?: string;
  year?: string | number;
  evidence_type?: string;
  supported_claim?: string;
  stance?: string;
  directness?: string;
  quality?: string;
  citation_url?: string;
};

type Review = {
  question: string;
  conclusion: string;
  confidence: number;
  confidence_label: string;
  confidence_breakdown: Array<{ label: string; points: number }>;
  confidence_note: string;
  summary: string;
  supporting_evidence: EvidenceItem[];
  conflicting_evidence: EvidenceItem[];
  conflicting_searched: boolean;
  conflicting_none_message?: string | null;
  evidence_mix: Record<string, number>;
  gaps: Array<{ id: string; text: string; rule: string }>;
  suggested_next_steps: Array<{
    hypothesis: string;
    rationale: string;
    evidence_ids: string[];
    proposed_experiment: string;
  }>;
  citations: Array<{ id: string; title?: string; year?: string | number; url?: string }>;
};

function MixBar({ mix }: { mix: Record<string, number> }) {
  const rows = [
    ["computational", "Computational"],
    ["in_vitro", "In vitro"],
    ["animal", "Animal"],
    ["human_genetic", "Human genetic"],
    ["clinical", "Clinical"],
  ] as const;
  return (
    <ul className="mix-list">
      {rows.map(([key, label]) => {
        const n = mix?.[key] ?? 0;
        return (
          <li key={key}>
            <span>{label}</span>
            <span className="mix-marks">{n > 0 ? "✓".repeat(Math.min(n, 3)) : "—"}</span>
            <span className="hint">{n}</span>
          </li>
        );
      })}
    </ul>
  );
}

function EvidenceList({ items, empty }: { items: EvidenceItem[]; empty?: string }) {
  if (!items?.length) return <p className="empty">{empty}</p>;
  return (
    <ul className="list-plain evidence-cards">
      {items.map((e) => (
        <li key={e.evidence_id} className="evidence-card">
          <strong>
            {e.citation_url ? (
              <a href={e.citation_url} target="_blank" rel="noreferrer">
                {e.title || e.evidence_id}
              </a>
            ) : (
              e.title || e.evidence_id
            )}
          </strong>
          <p>
            {[e.year, e.evidence_type, e.directness, e.quality && `quality:${e.quality}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {e.supported_claim && <p className="hint">Claim: {e.supported_claim}</p>}
        </li>
      ))}
    </ul>
  );
}

export function AskPanel() {
  const [question, setQuestion] = useState(STARTERS[2]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCalc, setShowCalc] = useState(false);

  async function submit(q: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase()}/v1/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) throw new Error(`Review failed (${res.status})`);
      setResult(await res.json());
      setShowCalc(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Review failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section ask-panel review-panel">
      <h2>Scientific review</h2>
      <p className="hint">
        Evidence-weighted reviewer for PFN1/G118V. Confidence is calculated in code from the
        graph—not invented by a model.
      </p>
      <div className="chip-row">
        {STARTERS.map((s) => (
          <button
            key={s}
            type="button"
            className="chip"
            onClick={() => {
              setQuestion(s);
              void submit(s);
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <textarea
        className="ask-input"
        rows={2}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        type="button"
        className="btn btn-primary"
        disabled={loading || !question.trim()}
        onClick={() => submit(question)}
      >
        {loading ? "Reviewing…" : "Run scientific review"}
      </button>
      {error && <p className="error">{error}</p>}

      {result && (
        <div className="ask-result review-result">
          <div className="review-hero">
            <p className="eyebrow">Conclusion</p>
            <h3>{result.conclusion}</h3>
            <p className="lede">{result.summary}</p>
          </div>

          <div className="review-grid">
            <div>
              <h3>Confidence</h3>
              <p className="confidence-score">
                {result.confidence} / 100 — {result.confidence_label}
              </p>
              <button type="button" className="chip" onClick={() => setShowCalc((v) => !v)}>
                {showCalc ? "Hide calculation" : "How this was calculated"}
              </button>
              {showCalc && (
                <ul className="list-plain calc-list">
                  {(result.confidence_breakdown || []).map((b, i) => (
                    <li key={i}>
                      {b.label}: {b.points > 0 ? `+${b.points}` : b.points}
                    </li>
                  ))}
                  <li className="hint">{result.confidence_note}</li>
                </ul>
              )}
            </div>
            <div>
              <h3>Evidence mix</h3>
              <MixBar mix={result.evidence_mix || {}} />
            </div>
          </div>

          <h3>Supporting evidence</h3>
          <EvidenceList items={result.supporting_evidence} empty="No supporting evidence indexed." />

          <h3>Conflicting evidence</h3>
          {result.conflicting_evidence?.length ? (
            <EvidenceList items={result.conflicting_evidence} />
          ) : (
            <p className="empty">
              {result.conflicting_searched
                ? result.conflicting_none_message ||
                  "No directly conflicting evidence was found in the currently indexed dataset."
                : "Contradiction search did not run."}
            </p>
          )}

          <h3>Research gaps</h3>
          <ul className="list-plain">
            {(result.gaps || []).map((g) => (
              <li key={g.id}>
                <strong>{g.text}</strong>
                <p className="hint">Rule: {g.rule}</p>
              </li>
            ))}
          </ul>

          <h3>Suggested next experiments</h3>
          <div className="chip-row">
            {(result.suggested_next_steps || []).map((s, i) => (
              <button
                key={i}
                type="button"
                className="chip hyp-chip"
                title={s.rationale}
                onClick={() => setQuestion(s.proposed_experiment)}
              >
                {s.proposed_experiment}
              </button>
            ))}
          </div>
          <ul className="list-plain">
            {(result.suggested_next_steps || []).map((s, i) => (
              <li key={i}>
                <strong>{s.hypothesis}</strong>
                <p className="hint">{s.rationale}</p>
              </li>
            ))}
          </ul>

          <h3>Citations</h3>
          <ul className="list-plain">
            {(result.citations || []).map((c) => (
              <li key={c.id}>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noreferrer">
                    {c.title || c.id}
                  </a>
                ) : (
                  c.title || c.id
                )}
                {c.year ? ` (${c.year})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
