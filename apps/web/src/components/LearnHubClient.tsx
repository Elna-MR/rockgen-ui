"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProteinField } from "@/components/ProteinField";
import { LEARN_DISEASES, searchLearnDiseases, type LearnDisease } from "@/data/learnHub";

function DiseaseTile({ d }: { d: LearnDisease }) {
  return (
    <Link
      href={`/learn/${d.slug}`}
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
            {d.status === "ready" ? "Full track" : "Growing"}
          </span>
        </div>
        <h2>{d.shortName}</h2>
        <p className="learn-tile-tag">{d.tagline}</p>
        <p className="learn-tile-summary">{d.summary}</p>
        <ul className="learn-tile-proteins">
          {d.proteins.slice(0, 3).map((p) => (
            <li key={p.symbol}>{p.symbol}</li>
          ))}
        </ul>
        <div className="learn-tile-meta">
          <span>{d.modules} modules</span>
          <span>{d.minutes}</span>
        </div>
      </div>
    </Link>
  );
}

export function LearnHubClient() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchLearnDiseases(query), [query]);

  return (
    <div className="learn-hub">
      <div className="learn-search">
        <label className="explorer-search-label" htmlFor="learn-search">
          Search the learning hub
        </label>
        <div className="explorer-search-row">
          <div className="explorer-input-wrap">
            <input
              id="learn-search"
              className="ask-input explorer-input"
              type="search"
              placeholder="Try ALS, tau, α-synuclein, HTT, motor neuron…"
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
        Showing {LEARN_DISEASES.length} neurodegeneration tracks. ALS is the deepest RockGen path
        today; others are concise student primers that link into shared tools.
      </p>
    </div>
  );
}
