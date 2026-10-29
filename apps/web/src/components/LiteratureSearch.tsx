"use client";

import { useCallback, useEffect, useState } from "react";

type Paper = {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  date: string;
  types: string[];
  url: string;
};

type Result = { count: number; page: number; pageSize: number; results: Paper[] };

const QUICK = [
  "PFN1 G118V",
  "TDP-43 aggregation",
  "NfL serum biomarker",
  "SOD1 tofersen",
  "C9orf72 repeat expansion",
  "TUBA4A",
];

function authorLine(a: string[]) {
  if (a.length <= 3) return a.join(", ");
  return `${a.slice(0, 3).join(", ")} et al.`;
}

export function LiteratureSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [scope, setScope] = useState<"als" | "all">("als");
  const [sort, setSort] = useState<"relevance" | "date">("relevance");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (q: string, p: number) => {
      if (q.trim().length < 2) return;
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ q, scope, sort, page: String(p) });
        const res = await fetch(`/api/literature?${params}`);
        const data = (await res.json()) as Result & { error?: string };
        if (!res.ok) throw new Error(data.error || "Search failed");
        setCount(data.count);
        setPage(p);
        setPapers((prev) => (p === 0 ? data.results : [...prev, ...data.results]));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Search failed");
      } finally {
        setLoading(false);
      }
    },
    [scope, sort],
  );

  useEffect(() => {
    if (query) void run(query, 0);
  }, [query, run]);

  const submit = (q: string) => {
    const t = q.trim();
    setInput(t);
    setPapers([]);
    if (t === query) void run(t, 0);
    else setQuery(t);
  };

  return (
    <div className="lit-search">
      <form
        className="explorer-search-row"
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
      >
        <div className="explorer-input-wrap">
          <input
            className="ask-input explorer-input"
            type="search"
            aria-label="Search the literature"
            placeholder="Try PFN1 G118V, TDP-43, NfL, tofersen…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || input.trim().length < 2}>
          Search
        </button>
      </form>

      <div className="lit-controls">
        <div className="chip-row" aria-label="Example searches">
          {QUICK.map((q) => (
            <button key={q} type="button" className="chip" onClick={() => submit(q)}>
              {q}
            </button>
          ))}
        </div>
        <div className="lit-toggles">
          <label>
            <input type="checkbox" checked={scope === "als"} onChange={(e) => setScope(e.target.checked ? "als" : "all")} />{" "}
            ALS papers only
          </label>
          <label>
            Sort{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value as "relevance" | "date")}>
              <option value="relevance">Best match</option>
              <option value="date">Newest</option>
            </select>
          </label>
        </div>
      </div>

      {error && <p className="hint">Could not reach PubMed: {error}</p>}
      {query && !error && !loading && papers.length === 0 && (
        <p className="hint">No papers found. Try fewer or simpler words.</p>
      )}
      {papers.length > 0 && (
        <p className="hint">
          {count.toLocaleString()} papers on PubMed. Showing {papers.length}.
        </p>
      )}

      <ul className="research-cite-list lit-results">
        {papers.map((p) => (
          <li key={p.pmid}>
            <strong>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                {p.title}
              </a>
            </strong>
            <span className="research-cite-meta">
              {authorLine(p.authors)} · {p.journal} · {p.date}
              {p.types.length > 0 && ` · ${p.types.join(", ")}`} · PMID {p.pmid}
            </span>
          </li>
        ))}
      </ul>

      {loading && <p className="hint">Searching PubMed…</p>}
      {!loading && papers.length > 0 && papers.length < count && page < 19 && (
        <button type="button" className="btn btn-ghost" onClick={() => void run(query, page + 1)}>
          Show more
        </button>
      )}
    </div>
  );
}
