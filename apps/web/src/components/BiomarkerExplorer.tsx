"use client";

import { useState } from "react";
import type { BiomarkerContext, DiseaseBiomarker } from "@/lib/api";

const CONTEXTS: { id: BiomarkerContext; label: string; question: string }[] = [
  { id: "diagnostic", label: "Diagnostic", question: "Does the patient have ALS?" },
  { id: "prognostic", label: "Prognostic", question: "How fast will it progress?" },
  { id: "pharmacodynamic", label: "Pharmacodynamic", question: "Is a treatment hitting its target?" },
  { id: "stratification", label: "Stratification", question: "Which biology does this patient have?" },
];

const LEVEL_LABEL = { strong: "Strong", moderate: "Moderate", emerging: "Emerging" } as const;

export function BiomarkerExplorer({ biomarkers }: { biomarkers: DiseaseBiomarker[] }) {
  const [active, setActive] = useState<BiomarkerContext | "all">("all");
  const shown =
    active === "all" ? biomarkers : biomarkers.filter((b) => b.context_of_use.includes(active));

  return (
    <section className="section" id="biomarker-explorer">
      <div className="struct-tabs" role="group" aria-label="Filter by what the biomarker is used for">
        <button
          type="button"
          className={`struct-tab ${active === "all" ? "active" : ""}`}
          aria-pressed={active === "all"}
          onClick={() => setActive("all")}
        >
          <strong>All</strong>
          <span>{biomarkers.length} biomarkers</span>
        </button>
        {CONTEXTS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`struct-tab ${active === c.id ? "active" : ""}`}
            aria-pressed={active === c.id}
            onClick={() => setActive(c.id)}
          >
            <strong>{c.label}</strong>
            <span>{c.question}</span>
          </button>
        ))}
      </div>

      <div className="intel-grid" style={{ marginTop: "1rem" }}>
        {shown.map((b) => (
          <article key={b.id} className="intel-card biomarker-card">
            <p className="eyebrow">
              Evidence: {LEVEL_LABEL[b.evidence_level]} · {b.specimen.join(", ")}
            </p>
            <h3>{b.name}</h3>
            <p>
              <strong>Used for:</strong> {b.context_of_use.join(" · ")}
            </p>
            <p>{b.evidence_note}</p>
            <p className="hint">
              <strong>Limit:</strong> {b.limitation}
            </p>
            {b.data_sources.length > 0 && (
              <p className="hint">
                <strong>Candidate data:</strong>{" "}
                {b.data_sources.map((d, i) => (
                  <span key={d.id}>
                    {i > 0 && ", "}
                    <a href={d.url} target="_blank" rel="noreferrer">
                      {d.name}
                    </a>
                  </span>
                ))}{" "}
                ({b.data_sources[0].provider}, not yet connected)
              </p>
            )}
            {b.axes.length > 0 && (
              <p className="hint">
                <strong>Disease axis:</strong> {b.axes.join(", ")}
              </p>
            )}
          </article>
        ))}
        {shown.length === 0 && <p className="hint">No biomarkers for this use yet.</p>}
      </div>
    </section>
  );
}
