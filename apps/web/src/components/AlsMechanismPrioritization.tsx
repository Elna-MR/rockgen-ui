"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Prioritization = {
  comparison: {
    title: string;
    question: string;
    rows: Array<{
      id: string;
      mechanism: string;
      pfn1_label: string;
      tuba4a_label: string;
      evidence_strength_label: string;
      priority_label: string;
      note?: string;
      claim_ids: string[];
      paper_ids: string[];
      cells: Record<
        string,
        { value: string; href: string; claim_ids?: string[]; paper_ids?: string[] }
      >;
    }>;
    strongest_combined: { mechanism: string; why: string };
    first_intervention: { title: string; why: string };
  };
  shared_graph: {
    title: string;
    trees: Record<string, Array<{ id: string; label: string }>>;
    overlap: string[];
    overlap_title: string;
    note: string;
  };
  opportunities: {
    title: string;
    disclaimer: string;
    investigate_first: { title: string; summary: string };
    opportunities: Array<{
      id: string;
      title: string;
      summary: string;
      priority: string;
      confidence: number;
      supporting_proteins: Array<{ symbol: string; level: string }>;
      supporting_mutations: string[];
      evidence_types: string[];
      unresolved_questions: string[];
      recommended_next_experiment: string;
      pfn1_note: string;
      tuba4a_note: string;
    }>;
  };
  definition_of_done: {
    shared: string[];
    unique_pfn1: string[];
    unique_tuba4a: string[];
    strongest_combined: { mechanism: string; why: string };
    investigate_first: { title: string; why: string };
    missing_evidence: string[];
  };
};

type Review = {
  conclusion?: string;
  summary?: string;
  confidence?: number;
  confidence_label?: string;
  shared_mechanisms?: string[];
  unique_mechanisms?: { PFN1: string[]; TUBA4A: string[] };
  contradictions?: Array<{ topic: string; summary: string }>;
  gaps?: Array<{ text: string }>;
  therapeutic_implications?: Array<{ title: string; priority: string; summary: string }>;
  citations?: Array<{ id: string; url?: string }>;
};

type Props = {
  markdownUrl: string;
};

export function AlsMechanismPrioritization({ markdownUrl }: Props) {
  const [data, setData] = useState<Prioritization | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`${API_URL}/v1/diseases/als/mechanism-prioritization`)
      .then((r) => {
        if (!r.ok) throw new Error(`Prioritization failed (${r.status})`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));

    void fetch(`${API_URL}/v1/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: "What disease mechanisms are shared by PFN1 and TUBA4A?",
      }),
    })
      .then((r) => r.json())
      .then(setReview)
      .catch(() => undefined);
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="hint">Loading mechanism prioritization…</p>;

  const { comparison, shared_graph, opportunities, definition_of_done } = data;

  return (
    <>
      <section className="section" id="mechanism-prioritization">
        <h2>ALS mechanism comparison</h2>
        <p className="lede">{comparison.question}</p>
        <p className="hint">Each cell links to claims, papers, or protein dossiers.</p>
        <div className="table-scroll">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Mechanism</th>
                <th>PFN1</th>
                <th>TUBA4A</th>
                <th>Evidence strength</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">
                    {row.mechanism}
                    {row.note ? <div className="hint cell-note">{row.note}</div> : null}
                  </th>
                  {(["PFN1", "TUBA4A", "Evidence", "Priority"] as const).map((col) => {
                    const cell = row.cells[col];
                    return (
                      <td key={col}>
                        <Link href={cell.href} className="cell-link">
                          <span
                            className={`level-pill level-${cell.value.toLowerCase().replace("moderate", "medium")}`}
                          >
                            {cell.value}
                          </span>
                        </Link>
                        {cell.paper_ids && cell.paper_ids.length > 0 ? (
                          <div className="hint cell-note">
                            {cell.paper_ids.map((pid) => (
                              <a
                                key={pid}
                                href={`https://pubmed.ncbi.nlm.nih.gov/${pid.replace("pmid:", "")}/`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ marginRight: "0.5rem" }}
                              >
                                {pid}
                              </a>
                            ))}
                          </div>
                        ) : null}
                        {cell.claim_ids && cell.claim_ids.length > 0 && col !== "Evidence" ? (
                          <div className="hint cell-note">{cell.claim_ids.join(", ")}</div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="confidence-score" style={{ marginTop: "1rem" }}>
          Strongest combined evidence: <strong>{comparison.strongest_combined.mechanism}</strong> —{" "}
          {comparison.strongest_combined.why}
        </p>
        <p>
          Investigate first: <strong>{comparison.first_intervention.title}</strong> —{" "}
          {comparison.first_intervention.why}
        </p>
      </section>

      <section className="section" id="shared-mechanism-graph">
        <h2>{shared_graph.title}</h2>
        <div className="compare-pathways">
          {Object.entries(shared_graph.trees).map(([protein, nodes]) => (
            <article key={protein} className="intel-card">
              <h3>{protein}</h3>
              <ul className="mech-tree">
                {nodes.map((n) => (
                  <li key={n.id}>
                    <span className="tree-branch">├─</span> {n.label}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="overlap-panel">
          <h3>{shared_graph.overlap_title}</h3>
          <ul className="gap-list">
            {shared_graph.overlap.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="hint">{shared_graph.note}</p>
        </div>
      </section>

      <section className="section" id="therapeutic-opportunities">
        <h2>{opportunities.title}</h2>
        <p className="hint">{opportunities.disclaimer}</p>
        <div className="intel-grid">
          {opportunities.opportunities.map((opp) => (
            <article key={opp.id} className="intel-card" id={`opportunity-${opp.id}`}>
              <p className="eyebrow">
                {opp.priority} priority · confidence {opp.confidence}
              </p>
              <h3>{opp.title}</h3>
              <p className="lede">{opp.summary}</p>
              <p>
                <strong>Supporting proteins:</strong>{" "}
                {opp.supporting_proteins.map((p) => `${p.symbol} (${p.level})`).join(", ")}
              </p>
              <p>
                <strong>Supporting mutations:</strong> {opp.supporting_mutations.join(", ")}
              </p>
              <p>
                <strong>Evidence types:</strong> {opp.evidence_types.join(", ")}
              </p>
              <p className="hint">
                PFN1: {opp.pfn1_note} · TUBA4A: {opp.tuba4a_note}
              </p>
              <h4>Unresolved questions</h4>
              <ul className="gap-list">
                {opp.unresolved_questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <h4>Recommended next experiment</h4>
              <p>{opp.recommended_next_experiment}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="cross-protein-review">
        <h2>Cross-protein scientific review</h2>
        <p className="hint">
          Question: <em>What disease mechanisms are shared by PFN1 and TUBA4A?</em>
        </p>
        {!review && <p className="hint">Running review…</p>}
        {review && (
          <>
            <p className="confidence-score">
              Confidence: {review.confidence} — {review.confidence_label}
            </p>
            <p>
              <strong>Conclusion:</strong> {review.conclusion}
            </p>
            <p>{review.summary}</p>
            {review.shared_mechanisms && (
              <>
                <h3>Shared</h3>
                <ul className="gap-list">
                  {review.shared_mechanisms.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </>
            )}
            {review.unique_mechanisms && (
              <>
                <h3>Unique</h3>
                <p>
                  <strong>PFN1:</strong> {review.unique_mechanisms.PFN1.join("; ")}
                </p>
                <p>
                  <strong>TUBA4A:</strong> {review.unique_mechanisms.TUBA4A.join("; ")}
                </p>
              </>
            )}
            {review.contradictions && review.contradictions.length > 0 && (
              <>
                <h3>Contradictions / tensions</h3>
                <ul className="gap-list">
                  {review.contradictions.map((c) => (
                    <li key={c.topic}>
                      <strong>{c.topic}:</strong> {c.summary}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {review.gaps && (
              <>
                <h3>Gaps</h3>
                <ul className="gap-list">
                  {review.gaps.map((g) => (
                    <li key={g.text}>{g.text}</li>
                  ))}
                </ul>
              </>
            )}
            {review.therapeutic_implications && (
              <>
                <h3>Therapeutic implications</h3>
                <ul className="gap-list">
                  {review.therapeutic_implications.map((t) => (
                    <li key={t.title}>
                      <strong>{t.title}</strong> ({t.priority}) — {t.summary}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {review.citations && review.citations.length > 0 && (
              <>
                <h3>Citations</h3>
                <ul className="list-plain">
                  {review.citations.map((c) => (
                    <li key={c.id}>
                      <a href={c.url} target="_blank" rel="noreferrer">
                        {c.id}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </section>

      <section className="section" id="definition-of-done">
        <h2>Prioritization answers</h2>
        <ul className="gap-list">
          <li>
            <strong>Shared by PFN1 and TUBA4A:</strong> {definition_of_done.shared.join("; ")}
          </li>
          <li>
            <strong>Unique to PFN1:</strong> {definition_of_done.unique_pfn1.join("; ")}
          </li>
          <li>
            <strong>Unique to TUBA4A:</strong> {definition_of_done.unique_tuba4a.join("; ")}
          </li>
          <li>
            <strong>Strongest combined evidence:</strong>{" "}
            {definition_of_done.strongest_combined.mechanism}
          </li>
          <li>
            <strong>Investigate first:</strong> {definition_of_done.investigate_first.title}
          </li>
          <li>
            <strong>Still missing:</strong> {definition_of_done.missing_evidence.join("; ")}
          </li>
        </ul>
        <div className="cta-row" style={{ marginTop: "1rem" }}>
          <a className="btn btn-primary" href={markdownUrl}>
            Download Disease Mechanism Report
          </a>
          <Link className="btn btn-ghost" href="/ask">
            Ask another review
          </Link>
        </div>
      </section>
    </>
  );
}
