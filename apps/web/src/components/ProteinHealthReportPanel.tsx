"use client";

import { useEffect, useState } from "react";
import { absoluteApiBase, apiBase } from "@/lib/apiBase";

type Props = { uniprotId: string };

type ReportPayload = {
  structural_interpretation: string;
  research_gaps: string[];
  contradictions: Array<{ topic: string; summary: string }>;
  recommended_next_experiments: string[];
};

export function ProteinHealthReportPanel({ uniprotId }: Props) {
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mdUrl = `${absoluteApiBase()}/v1/proteins/${uniprotId}/health-report?format=markdown`;

  useEffect(() => {
    void fetch(`${apiBase()}/v1/proteins/${uniprotId}/health-report`)
      .then((r) => {
        if (!r.ok) throw new Error(`Report failed (${r.status})`);
        return r.json();
      })
      .then(setReport)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load report"));
  }, [uniprotId]);

  return (
    <section className="section" id="health-report">
      <h2>Protein Health Report</h2>
      <p className="hint">
        First reusable scientific deliverable: comparison, structure interpretation, gaps, and next
        experiments.
      </p>
      {error && <p className="error">{error}</p>}
      {!report && !error && <p className="hint">Loading report…</p>}
      {report && (
        <>
          <p>{report.structural_interpretation}</p>
          <h3>Research gaps</h3>
          <ul className="gap-list">
            {report.research_gaps.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <h3>Contradictions</h3>
          <ul className="gap-list">
            {report.contradictions.map((c) => (
              <li key={c.topic}>
                <strong>{c.topic}:</strong> {c.summary}
              </li>
            ))}
          </ul>
          <h3>Recommended next experiments</h3>
          <ul className="gap-list">
            {report.recommended_next_experiments.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <div className="cta-row" style={{ marginTop: "1rem" }}>
            <a className="btn btn-primary" href={mdUrl}>
              Download Markdown report
            </a>
          </div>
        </>
      )}
    </section>
  );
}
