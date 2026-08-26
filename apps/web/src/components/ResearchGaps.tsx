"use client";

import { useEffect, useState } from "react";
import { PFN1_EXPERIMENTS, PFN1_GAPS } from "@/data/pfn1Dossier";
import { apiBase } from "@/lib/apiBase";

export function ResearchGaps() {
  const [apiGaps, setApiGaps] = useState<string[]>([]);

  useEffect(() => {
    void fetch(`${apiBase()}/v1/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "What remains unproven?" }),
    })
      .then((r) => r.json())
      .then((d) => {
        const gaps = (d.gaps || []).map((g: { text: string }) => g.text);
        setApiGaps(gaps);
      })
      .catch(() => undefined);
  }, []);

  const unique = Array.from(new Set([...PFN1_GAPS, ...apiGaps]));

  return (
    <section className="section">
      <h2>What remains unknown</h2>
      <p className="hint">
        Explicit open questions — one of the strongest features of a scientific operating system.
      </p>
      <ul className="gap-list">
        {unique.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
    </section>
  );
}

export function ExperimentCards() {
  return (
    <section className="section">
      <h2>Suggested experiments</h2>
      <p className="hint">Graph- and gap-grounded suggestions — not unconstrained LLM inventiveness.</p>
      <div className="grid exp-grid">
        {PFN1_EXPERIMENTS.map((exp) => (
          <article key={exp.title} className="exp-card">
            <p className="eyebrow">Priority · {exp.priority}</p>
            <h3>{exp.title}</h3>
            <p>
              <strong>Why:</strong> {exp.why}
            </p>
            <p>
              <strong>Expected output:</strong> {exp.expected}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
