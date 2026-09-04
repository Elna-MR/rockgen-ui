"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProteinField } from "@/components/ProteinField";
import {
  RESEARCH_DISEASES,
  searchResearchDiseases,
  type ResearchDisease,
} from "@/data/researchHub";

function DiseaseTile({ d }: { d: ResearchDisease }) {
  return (
    <Link
      href={`/diseases/${d.slug}`}
      className="learn-tile"
      style={{ ["--tile-accent" as string]: d.accent }}
    >
      <div className="learn-tile-visual" aria-hidden="true">
        <ProteinField variant="panel" />
      </div>
      <div className="learn-tile-body">
        <div className="learn-tile-top">
          <span className="learn-tile-cat">{d.category}</span>
          <span className={`learn-tile-status learn-tile-status-${d.status}`}>
            {d.status === "ready" ? "Full workspace" : "Growing"}
          </span>
        </div>
        <h2>{d.shortName}</h2>
        <p className="learn-tile-tag">{d.tagline}</p>
        <p className="learn-tile-summary">{d.synopsis}</p>
        <ul className="learn-tile-proteins">
          {d.proteins.slice(0, 3).map((p) => (
            <li key={p.symbol}>{p.symbol}</li>
          ))}
        </ul>
        <div className="learn-tile-meta">
          <span>{d.tools.filter((t) => t.status === "ready").length} tools ready</span>
          <span>{d.focus[0]}</span>
        </div>
      </div>
    </Link>
  );
}

export function ResearchHubClient() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchResearchDiseases(query), [query]);

  return (
    <div className="learn-hub">
      <div className="learn-search">
        <label className="explorer-search-label" htmlFor="research-search">
          Search research workspaces
        </label>
        <div className="explorer-search-row">
          <div className="explorer-input-wrap">
            <input
              id="research-search"
              className="ask-input explorer-input"
              type="search"
              placeholder="Try ALS, Parkinson’s, tau, α-synuclein, HTT, TDP-43…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                type="button"
                className="explorer-clear"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                ×
              </button>
            )}
          </div>
        </div>
        <p className="hint explorer-mut-hint">
          {results.length} disease{results.length === 1 ? "" : "s"} · filter by name, protein, or
          mechanism
        </p>
        <div className="chip-row learn-quick">
          {["ALS", "Parkinson’s", "Alzheimer’s", "tau", "synuclein", "PFN1"].map((chip) => (
            <button
              key={chip}
              type="button"
              className={`chip ${query === chip ? "chip-active" : ""}`}
              onClick={() => setQuery(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="learn-tile-grid">
        {results.map((d) => (
          <DiseaseTile key={d.slug} d={d} />
        ))}
        {results.length === 0 && (
          <p className="hint">No matches. Try a disease name or protein symbol.</p>
        )}
      </div>

      <p className="hint learn-hub-note">
        Showing {RESEARCH_DISEASES.length} neurodegeneration workspaces. ALS has the deepest tool
        set today; other diseases open growing primers plus shared labs (structures, Ask).
      </p>
    </div>
  );
}
