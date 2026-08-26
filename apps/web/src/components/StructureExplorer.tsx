"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { aaClass, chemistrySummary } from "@/lib/proteinChemistry";

const PdbStructureViewer = dynamic(
  () => import("@/components/PdbStructureViewer").then((m) => m.PdbStructureViewer),
  {
    ssr: false,
    loading: () => <div className="pdb-viewer-canvas pdb-viewer-skeleton">Loading 3D…</div>,
  },
);

export type CatalogProtein = {
  uniprot_id: string;
  symbol: string;
  name: string;
};

type Level = "primary" | "secondary" | "tertiary" | "quaternary";

const LEVELS: Array<{ id: Level; n: string; label: string; blurb: string }> = [
  { id: "primary", n: "1º", label: "Primary", blurb: "the sequence" },
  { id: "secondary", n: "2º", label: "Secondary", blurb: "local fold" },
  { id: "tertiary", n: "3º", label: "Tertiary", blurb: "3D fold" },
  { id: "quaternary", n: "4º", label: "Quaternary", blurb: "assembly" },
];

const QUICK = [
  { label: "Profilin-1", q: "profilin-1" },
  { label: "Hemoglobin", q: "hemoglobin" },
  { label: "Insulin", q: "insulin" },
  { label: "Lysozyme", q: "lysozyme" },
  { label: "Myoglobin", q: "myoglobin" },
  { label: "GFP", q: "green fluorescent protein" },
];

type SearchHit = {
  pdb_id: string;
  title: string;
  method: string;
  chains: number;
  year: string;
  score: number;
  thumbnail: string;
};

type EntryDetail = {
  pdb_id: string;
  title: string;
  method: string;
  released: string | null;
  deposited_chains: number | null;
  distinct_proteins: number | null;
  assembly_mass_kda: number | null;
  resolution: number | null;
  polymers: Array<{
    entity_id: string;
    chain_ids: string[];
    sequence: string;
    uniprot_ids: string[];
    organism?: string;
    type?: string;
  }>;
  primary: {
    entity_id: string;
    chain_ids: string[];
    sequence: string;
    uniprot_ids: string[];
    organism?: string;
  } | null;
  rcsb_url: string;
};

type Props = {
  catalog: CatalogProtein[];
  /** Ignored for PDB mode; kept for page compatibility */
  detailsById?: Record<string, unknown>;
  initialId?: string;
  initialQuery?: string;
};

function shortMethod(m: string) {
  const u = m.toUpperCase();
  if (u.includes("NMR")) return "NMR";
  if (u.includes("X-RAY") || u.includes("DIFFRACTION")) return "X-ray";
  if (u.includes("ELECTRON")) return "EM";
  return m.split(/[_\s]/)[0] || m;
}

function formatReleased(iso: string | null) {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

export function StructureExplorer({ catalog, initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery || "profilin-1");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [entry, setEntry] = useState<EntryDetail | null>(null);
  const [level, setLevel] = useState<Level>("primary");
  const [searching, setSearching] = useState(false);
  const [loadingEntry, setLoadingEntry] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeResi, setActiveResi] = useState<number | null>(null);

  const runSearch = useCallback(async (q: string) => {
    const term = q.trim();
    if (!term) return;
    setSearching(true);
    setError(null);
    try {
      const res = await fetch(`/api/pdb/search?q=${encodeURIComponent(term)}&rows=14`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Search failed (${res.status})`);
      setHits(data.results || []);
      setTotal(data.total || 0);
      const first = data.results?.[0]?.pdb_id as string | undefined;
      if (first) setSelectedId(first);
      else {
        setSelectedId(null);
        setEntry(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
      setHits([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    void runSearch(query);
    // initial search only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    async function load() {
      setLoadingEntry(true);
      setError(null);
      setActiveResi(null);
      try {
        const res = await fetch(`/api/pdb/entry/${selectedId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Entry failed (${res.status})`);
        if (!cancelled) setEntry(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load entry");
      } finally {
        if (!cancelled) setLoadingEntry(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const primary = entry?.primary;
  const sequence = primary?.sequence || "";
  const chainLabel = primary?.chain_ids?.[0] || "A";
  const chem = useMemo(() => (sequence ? chemistrySummary(sequence) : null), [sequence]);
  const allChains = useMemo(() => {
    const ids = new Set<string>();
    for (const p of entry?.polymers || []) for (const c of p.chain_ids) ids.add(c);
    return Array.from(ids);
  }, [entry]);

  function onResidueClick(resi: number) {
    setActiveResi(resi);
  }

  return (
    <div className="explorer">
      <div className="explorer-search">
        <div className="explorer-search-row">
          <input
            id="protein-search"
            className="ask-input explorer-input"
            type="search"
            placeholder="Protein name or PDB id…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void runSearch(query);
            }}
            autoComplete="off"
          />
          <button type="button" className="btn btn-primary" onClick={() => void runSearch(query)} disabled={searching}>
            {searching ? "Searching…" : "Search"}
          </button>
        </div>
        <div className="chip-row explorer-quick">
          {QUICK.map((q) => (
            <button
              key={q.q}
              type="button"
              className="chip"
              onClick={() => {
                setQuery(q.q);
                void runSearch(q.q);
              }}
            >
              {q.label}
            </button>
          ))}
          {catalog.slice(0, 4).map((p) => (
            <button
              key={p.uniprot_id}
              type="button"
              className="chip"
              onClick={() => {
                const q = p.name || p.symbol;
                setQuery(q);
                void runSearch(q);
              }}
            >
              {p.symbol}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="explorer-layout">
        <aside className="explorer-sidebar" aria-label="Matching structures">
          <p className="eyebrow">
            {hits.length} structure{hits.length === 1 ? "" : "s"}
            {total > hits.length ? ` of ${total.toLocaleString()}` : ""} — ranked by relevance
          </p>
          <ul className="explorer-results">
            {hits.map((h) => (
              <li key={h.pdb_id}>
                <button
                  type="button"
                  className={`explorer-result explorer-result-pdb ${selectedId === h.pdb_id ? "active" : ""}`}
                  onClick={() => setSelectedId(h.pdb_id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={h.thumbnail} alt="" className="explorer-thumb" loading="lazy" />
                  <span className="explorer-result-body">
                    <strong>{h.pdb_id}</strong>
                    <span className="explorer-result-title">{h.title}</span>
                    <span className="hint">
                      {shortMethod(h.method)} · {h.chains} chain{h.chains === 1 ? "" : "s"} · {h.year}
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {!searching && hits.length === 0 && <li className="hint">No PDB structures for this query.</li>}
          </ul>
        </aside>

        <div className="explorer-main">
          {loadingEntry && <p className="hint">Loading entry…</p>}
          {entry && (
            <>
              <header className="explorer-entry-header">
                <h2>{entry.pdb_id}</h2>
                <p className="lede">{entry.title}</p>
                <div className="badge-row">
                  <span className="badge">Method: {shortMethod(entry.method)}</span>
                  <span className="badge">
                    Deposited chains: {entry.deposited_chains ?? allChains.length}
                  </span>
                  <span className="badge">Distinct proteins: {entry.distinct_proteins ?? "—"}</span>
                  <span className="badge">Released: {formatReleased(entry.released)}</span>
                  {entry.assembly_mass_kda != null && (
                    <span className="badge">Assembly mass: {Number(entry.assembly_mass_kda).toFixed(1)} kDa</span>
                  )}
                  {entry.resolution != null && (
                    <span className="badge">Resolution: {Number(entry.resolution).toFixed(2)} Å</span>
                  )}
                  <a className="badge cell-link" href={entry.rcsb_url} target="_blank" rel="noreferrer">
                    Open at RCSB
                  </a>
                </div>
              </header>

              <div className="explorer-body">
                <nav className="level-tabs" aria-label="Structural levels">
                  {LEVELS.map((L) => (
                    <button
                      key={L.id}
                      type="button"
                      className={`level-tab ${level === L.id ? "active" : ""}`}
                      onClick={() => setLevel(L.id)}
                    >
                      <span className="level-tab-n">{L.n}</span>
                      <span>
                        <strong>{L.label}</strong>
                        <em>{L.blurb}</em>
                      </span>
                    </button>
                  ))}
                </nav>

                <div className="explorer-panels">
                  {level === "primary" && chem && (
                    <section className="explorer-panel">
                      <h3>Chemistry of the chain</h3>
                      <div className="chem-grid">
                        <div>
                          <strong>{chem.length} aa</strong>
                          <span>Length</span>
                        </div>
                        <div>
                          <strong>{chem.modelled} aa</strong>
                          <span>Modelled</span>
                        </div>
                        <div>
                          <strong>{chem.massKda.toFixed(1)} kDa</strong>
                          <span>Mass</span>
                        </div>
                        <div>
                          <strong>{chem.pi.toFixed(2)}</strong>
                          <span>Theoretical pI</span>
                        </div>
                        <div>
                          <strong>{chem.gravy.toFixed(2)}</strong>
                          <span>GRAVY</span>
                        </div>
                        <div>
                          <strong>{chem.extinction.toLocaleString()}</strong>
                          <span>ε (280 nm)</span>
                        </div>
                      </div>
                      <p className="hint meta-line">
                        {primary?.organism || "Source unknown"}
                        {primary?.uniprot_ids?.[0] ? ` · UniProt ${primary.uniprot_ids[0]}` : ""}
                      </p>

                      <h3>
                        Sequence — chain {chainLabel} — click any residue to find it in 3D
                      </h3>
                      <div className="chem-seq">
                        {sequence.split("").map((aa, i) => {
                          const resi = i + 1;
                          return (
                            <button
                              key={resi}
                              type="button"
                              className={`chem-aa chem-${aaClass(aa)} ${activeResi === resi ? "chem-aa-active" : ""}`}
                              title={`${aa}${resi}`}
                              onClick={() => onResidueClick(resi)}
                            >
                              {aa}
                            </button>
                          );
                        })}
                      </div>
                      <div className="viewer-legend" style={{ marginTop: "0.75rem" }}>
                        <span>
                          <i className="chem-swatch chem-hydrophobic" /> Hydrophobic
                        </span>
                        <span>
                          <i className="chem-swatch chem-polar" /> Polar
                        </span>
                        <span>
                          <i className="chem-swatch chem-acidic" /> Acidic
                        </span>
                        <span>
                          <i className="chem-swatch chem-basic" /> Basic
                        </span>
                        <span>
                          <i className="chem-swatch chem-special" /> Special
                        </span>
                      </div>

                      <div className="cta-row" style={{ marginTop: "0.85rem" }}>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => {
                            void navigator.clipboard.writeText(
                              `>${entry.pdb_id}|${chainLabel}\n${sequence}`,
                            );
                          }}
                        >
                          Copy FASTA
                        </button>
                      </div>

                      <h3>Amino acid composition</h3>
                      <div className="aa-comp">
                        {Object.entries(chem.composition)
                          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
                          .map(([aa, n]) => (
                            <span key={aa} className="aa-comp-cell">
                              <strong>{aa}</strong> {n}
                            </span>
                          ))}
                      </div>
                    </section>
                  )}

                  {level === "secondary" && (
                    <section className="explorer-panel">
                      <h3>Secondary structure</h3>
                      <p className="article-body">
                        Helices, strands, and loops appear in the cartoon on the right (colour runs N→C).
                        Residue-level DSSP assignment is not computed here yet — use the 3D view to read
                        secondary elements visually.
                      </p>
                      {chem && (
                        <div className="chem-grid" style={{ marginTop: "1rem" }}>
                          <div>
                            <strong>
                              {(
                                ((chem.composition.A || 0) +
                                  (chem.composition.E || 0) +
                                  (chem.composition.L || 0) +
                                  (chem.composition.M || 0)) /
                                Math.max(chem.length, 1)
                              ).toFixed(2)}
                            </strong>
                            <span>Helix-favoring fraction</span>
                          </div>
                          <div>
                            <strong>
                              {(
                                ((chem.composition.V || 0) +
                                  (chem.composition.I || 0) +
                                  (chem.composition.Y || 0) +
                                  (chem.composition.F || 0)) /
                                Math.max(chem.length, 1)
                              ).toFixed(2)}
                            </strong>
                            <span>Sheet-favoring fraction</span>
                          </div>
                          <div>
                            <strong>
                              {(
                                ((chem.composition.G || 0) + (chem.composition.P || 0)) /
                                Math.max(chem.length, 1)
                              ).toFixed(2)}
                            </strong>
                            <span>Loop / turn cues (G+P)</span>
                          </div>
                        </div>
                      )}
                    </section>
                  )}

                  {level === "tertiary" && (
                    <section className="explorer-panel">
                      <h3>Tertiary structure</h3>
                      <p className="article-body">
                        The 3D fold for <strong>{entry.pdb_id}</strong> is shown on the right. Use Style /
                        Chain / Spin / Recentre under the viewer. Click a residue in Primary to zoom that
                        site.
                      </p>
                      <p className="hint">
                        Method: {entry.method}
                        {entry.resolution != null ? ` · ${Number(entry.resolution).toFixed(2)} Å` : ""}
                      </p>
                    </section>
                  )}

                  {level === "quaternary" && (
                    <section className="explorer-panel">
                      <h3>Quaternary / assembly</h3>
                      <p className="article-body">
                        Quaternary structure is how chains assemble in the biological unit. Counts below
                        come from the PDB entry; the viewer shows deposited coordinates (asymmetric unit
                        unless you select another representation later).
                      </p>
                      <div className="chem-grid" style={{ marginTop: "1rem" }}>
                        <div>
                          <strong>{entry.deposited_chains ?? allChains.length}</strong>
                          <span>Deposited chains</span>
                        </div>
                        <div>
                          <strong>{entry.distinct_proteins ?? "—"}</strong>
                          <span>Distinct polymer entities</span>
                        </div>
                        <div>
                          <strong>
                            {entry.assembly_mass_kda != null
                              ? `${Number(entry.assembly_mass_kda).toFixed(1)} kDa`
                              : "—"}
                          </strong>
                          <span>Assembly mass</span>
                        </div>
                      </div>
                      {allChains.length > 0 && (
                        <p className="hint" style={{ marginTop: "0.85rem" }}>
                          Auth chains: {allChains.join(", ")}
                        </p>
                      )}
                    </section>
                  )}
                </div>

                <aside className="explorer-viewer" aria-label="3D structure">
                  {selectedId && (
                    <PdbStructureViewer
                      key={selectedId}
                      pdbId={selectedId}
                      chainIds={allChains.length ? allChains : [chainLabel]}
                      highlightResi={activeResi}
                      highlightChain={chainLabel}
                    />
                  )}
                </aside>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
