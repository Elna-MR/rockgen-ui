"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { aaClass, chemistrySummary } from "@/lib/proteinChemistry";
import {
  alsGeneFor,
  AA_NAME,
  oneLetter,
  ALS_MUTATION_CHIPS,
  ALS_UNIPROTS,
  assessMutationSite,
  parseMutationQuery,
  type ParsedMutation,
} from "@/lib/mutationContext";
import type { StructureAnalysis } from "@/components/PdbStructureViewer";
import { StructureWorkspaceNav } from "@/components/StructureWorkspaceNav";

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

type Tab = "overview" | "sequence" | "shape" | "mutation" | "details";

const TABS: Array<{ id: Tab; n: string; label: string; blurb: string }> = [
  { id: "overview", n: "1", label: "Overview", blurb: "In plain words" },
  { id: "sequence", n: "2", label: "Sequence", blurb: "The amino-acid chain" },
  { id: "shape", n: "3", label: "3D shape", blurb: "Local shapes and the fold" },
  { id: "mutation", n: "4", label: "Mutation", blurb: "Where a change sits" },
  { id: "details", n: "5", label: "Details", blurb: "Assembly and chemistry" },
];

const LEVEL_HELP: Record<Level, { what: string; tryIt: string }> = {
  primary: {
    what: "The order of amino acids in the chain, like letters in a word. A mutation changes one letter.",
    tryIt: "Click any letter in the sequence below. The same residue lights up in the 3D view.",
  },
  secondary: {
    what: "Short stretches of the chain fold into repeating shapes: helices (coils) and sheets (flat strands). The rest are loops.",
    tryIt: "Click a helix or sheet below to jump to where it starts.",
  },
  tertiary: {
    what: "How the whole chain folds into one 3D shape. The shape decides what the protein can do.",
    tryIt: "Drag the 3D view to rotate it. Press Whole fold, then Selected site.",
  },
  quaternary: {
    what: "Some proteins work as a team. This level counts the chains that assemble together.",
    tryIt: "Check the chain count. Other proteins in the entry are partners, not copies.",
  },
};

function LevelHelp({ level }: { level: Level }) {
  const h = LEVEL_HELP[level];
  return (
    <div className="level-help">
      <p>
        <strong>What this level is.</strong> {h.what}
      </p>
      <p>
        <strong>Try this.</strong> {h.tryIt}
      </p>
    </div>
  );
}

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
  resolution: number | null;
};

type UniprotAlignment = {
  accession: string;
  regions: { entity_beg: number; ref_beg: number; length: number }[];
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
    uniprot_alignment?: UniprotAlignment[];
  }>;
  primary: {
    entity_id: string;
    chain_ids: string[];
    sequence: string;
    uniprot_ids: string[];
    organism?: string;
    uniprot_alignment?: UniprotAlignment[];
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
  if (!iso) return ", ";
  return iso.slice(0, 10);
}

export function StructureExplorer({ catalog, initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery || "PFN1-G118V");
  const [mutationQuery, setMutation] = useState<ParsedMutation | null>(() =>
    parseMutationQuery(initialQuery || "PFN1-G118V"),
  );
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [entry, setEntry] = useState<EntryDetail | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [searching, setSearching] = useState(false);
  const [loadingEntry, setLoadingEntry] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeResi, setActiveResi] = useState<number | null>(null);
  const [lastSearched, setLastSearched] = useState<string | null>(null);
  /** Set when the search resolved to a known human ALS protein (exact UniProt match). */
  const [analysis, setAnalysis] = useState<StructureAnalysis | null>(null);
  const [matchedGene, setMatchedGene] = useState<{ uniprot: string; symbol: string } | null>(null);

  const liveParse = useMemo(() => parseMutationQuery(query), [query]);
  const resolvedTerm = liveParse?.pdbId || liveParse?.searchTerm || query.trim();

  const catalogChips = useMemo(() => {
    const used = new Set(
      [...ALS_MUTATION_CHIPS, ...QUICK].map((c) => c.label.toUpperCase()),
    );
    return catalog.filter((p) => !used.has(p.symbol.toUpperCase())).slice(0, 6);
  }, [catalog]);

  const runSearch = useCallback(async (q: string) => {
    const term = q.trim();
    if (!term) return;
    const parsed = parseMutationQuery(term);
    setMutation(parsed);
    setQuery(term);
    const pdbTerm = parsed?.pdbId || parsed?.searchTerm || term;
    setLastSearched(pdbTerm);
    setSearching(true);
    setError(null);
    const gene = parsed?.pdbId ? null : alsGeneFor(parsed?.target || term) ?? alsGeneFor(pdbTerm);
    setMatchedGene(gene);
    try {
      const url = gene
        ? `/api/pdb/search?uniprot=${gene.uniprot}&rows=24`
        : `/api/pdb/search?q=${encodeURIComponent(pdbTerm)}&rows=14`;
      const res = await fetch(url);
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
        if (!cancelled) {
          setEntry(data);
        }
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
  }, [selectedId, query]);

  // In a complex the first chain is often a partner (e.g. actin in a profilin-actin entry).
  // Prefer the chain that maps to the protein the user asked about.
  const targetUniprot = mutationQuery?.uniprot ?? matchedGene?.uniprot ?? null;
  useEffect(() => {
    setAnalysis(null);
  }, [selectedId]);

  const primary = useMemo(() => {
    if (!entry) return undefined;
    const match = targetUniprot
      ? entry.polymers.find((p) => p.uniprot_ids.includes(targetUniprot))
      : undefined;
    return match ?? entry.primary ?? undefined;
  }, [entry, targetUniprot]);
  const sequence = primary?.sequence || "";
  const chainLabel = primary?.chain_ids?.[0] || "A";
  // Positions are sequence indexes; PDB residue numbers can differ. Trust the 3D-derived views
  // only when the residues agree with the sequence.
  const numberingOk = useMemo(() => {
    if (!analysis || !sequence || analysis.residues.length === 0) return false;
    let same = 0;
    for (const r of analysis.residues) {
      if (oneLetter(r.resn) === sequence[r.resi - 1]) same += 1;
    }
    return same / analysis.residues.length >= 0.9;
  }, [analysis, sequence]);
  const ssByResi = useMemo(() => {
    const m = new Map<number, "h" | "s" | "c">();
    if (analysis && numberingOk) for (const r of analysis.residues) m.set(r.resi, r.ss);
    return m;
  }, [analysis, numberingOk]);
  // Mutation numbers are UniProt positions. Structures often start later (for example without the
  // first methionine), so map the position onto this entry's residue numbering before using it.
  const mutation = useMemo(() => {
    if (!mutationQuery) return null;
    const accession = mutationQuery.uniprot ?? primary?.uniprot_ids?.[0] ?? null;
    const regions = primary?.uniprot_alignment?.find((a) => a.accession === accession)?.regions;
    let pos = mutationQuery.pos;
    if (regions && regions.length > 0) {
      const r = regions.find(
        (x) => mutationQuery.pos >= x.ref_beg && mutationQuery.pos < x.ref_beg + x.length,
      );
      pos = r ? r.entity_beg + (mutationQuery.pos - r.ref_beg) : -1;
    }
    return { ...mutationQuery, pos, uniprotPos: mutationQuery.pos };
  }, [mutationQuery, primary]);
  const offsetNote =
    mutation && mutation.pos > 0 && mutation.pos !== mutation.uniprotPos
      ? ` In this structure that residue is number ${mutation.pos}.`
      : "";

  useEffect(() => {
    if (entry && mutation && mutation.pos > 0) setActiveResi(mutation.pos);
    // run when the entry or the mapped position changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.pdb_id, mutation?.pos]);

  const chem = useMemo(() => (sequence ? chemistrySummary(sequence) : null), [sequence]);
  const site = useMemo(
    () => (sequence && mutation ? assessMutationSite(sequence, mutation) : null),
    [sequence, mutation],
  );
  const focusWindow = useMemo(() => {
    if (!site?.patch.length) return null;
    return { start: site.patch[0].pos, end: site.patch[site.patch.length - 1].pos };
  }, [site]);
  const allChains = useMemo(() => {
    const ids = new Set<string>();
    for (const p of entry?.polymers || []) for (const c of p.chain_ids) ids.add(c);
    return Array.from(ids);
  }, [entry]);

  function onResidueClick(resi: number) {
    setActiveResi(resi);
  }

  function applyChip(q: string) {
    setQuery(q);
    void runSearch(q);
  }

  return (
    <div className="explorer">
      <StructureWorkspaceNav active="explore" query={query.trim() || undefined} />
      <div className="explorer-search">
        <label className="explorer-search-label" htmlFor="protein-search">
          Find a structure
        </label>
        <div className="explorer-search-row">
          <div className="explorer-input-wrap">
            <input
              id="protein-search"
              className="ask-input explorer-input"
              type="search"
              placeholder="Try PFN1-G118V, profilin-1, or 2PAV…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void runSearch(query);
              }}
              autoComplete="off"
              spellCheck={false}
              aria-describedby="protein-search-help"
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void runSearch(query)}
            disabled={searching || !query.trim()}
          >
            {searching ? "Searching…" : "Search"}
          </button>
        </div>
        <p id="protein-search-help" className="hint explorer-mut-hint">
          {liveParse ? (
            <>
              Mutation <strong>{liveParse.label}</strong>
              {liveParse.target ? ` on ${liveParse.target}` : ""} → searching PDB for{" "}
              <strong>{resolvedTerm}</strong>, then focusing the local site in 3D.
            </>
          ) : query.trim() ? (
            <>
              Searching PDB for <strong>{resolvedTerm || "…"}</strong>. Add a mutation like{" "}
              <code>G118V</code> to highlight a site.
            </>
          ) : (
            <>Type a protein name, PDB id, or ALS mutation, or pick a shortcut below.</>
          )}
        </p>

        <div className="explorer-chip-groups">
          <div className="explorer-chip-group">
            <span className="explorer-chip-label">ALS mutations</span>
            <div className="chip-row explorer-quick">
              {ALS_MUTATION_CHIPS.map((q) => (
                <button
                  key={q.q}
                  type="button"
                  className={`chip ${query === q.q ? "chip-active" : ""}`}
                  onClick={() => applyChip(q.q)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
          <div className="explorer-chip-group">
            <span className="explorer-chip-label">Example proteins</span>
            <div className="chip-row explorer-quick">
              {QUICK.map((q) => (
                <button
                  key={q.q}
                  type="button"
                  className={`chip ${query === q.q ? "chip-active" : ""}`}
                  onClick={() => applyChip(q.q)}
                >
                  {q.label}
                </button>
              ))}
              {catalogChips.map((p) => (
                <button
                  key={p.uniprot_id}
                  type="button"
                  className={`chip ${query === (p.name || p.symbol) ? "chip-active" : ""}`}
                  onClick={() => applyChip(p.name || p.symbol)}
                  title={p.name}
                >
                  {p.symbol}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="explorer-layout">
        <aside className="explorer-sidebar" aria-label="Matching structures">
          <p className="eyebrow">
            {searching
              ? "Searching PDB…"
              : `${hits.length} structure${hits.length === 1 ? "" : "s"}${
                  total > hits.length ? ` of ${total.toLocaleString()}` : ""
                }${matchedGene ? ` of human ${matchedGene.symbol}` : lastSearched ? ` for “${lastSearched}”` : ""}`}
          </p>
          <p className="hint explorer-match-note">
            {matchedGene
              ? `Exact match on UniProt ${matchedGene.uniprot}, best resolution first. NMR models have no resolution and come last.`
              : "Free-text search. Results can include other species and unrelated proteins."}
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
                      {shortMethod(h.method)}
                      {h.resolution != null ? ` · ${h.resolution.toFixed(2)} Å` : ""} · {h.chains} chain
                      {h.chains === 1 ? "" : "s"} · {h.year}
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {searching && hits.length === 0 && <li className="hint">Looking up structures…</li>}
            {!searching && hits.length === 0 && (
              <li className="hint">No PDB structures for this query. Try a protein name or PDB id.</li>
            )}
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
                  {primary?.organism && <span className="badge">Source: {primary.organism}</span>}
                  <a className="badge cell-link" href={entry.rcsb_url} target="_blank" rel="noreferrer">
                    Open at RCSB
                  </a>
                  {primary?.uniprot_ids?.[0] && ALS_UNIPROTS.has(primary.uniprot_ids[0]) && (
                    <Link className="badge cell-link" href={`/proteins/${primary.uniprot_ids[0]}`}>
                      ProtScope dossier
                    </Link>
                  )}
                </div>
              </header>

              {mutation?.uniprot && primary && !primary.uniprot_ids.includes(mutation.uniprot) && (
                <p className="mut-warning" role="alert">
                  <strong>Check the match.</strong> {mutation.label} is numbered on human{" "}
                  {mutation.target.toUpperCase()} (UniProt {mutation.uniprot}), but this entry&rsquo;s
                  main chain maps to {primary.uniprot_ids.join(", ") || "no UniProt record"}
                  {primary.organism ? ` (${primary.organism})` : ""}. The position below may not be
                  the same residue.
                </p>
              )}

              <div className="explorer-body">
                <nav className="level-tabs level-tabs-5" aria-label="Sections">
                  {TABS.map((T) => (
                    <button
                      key={T.id}
                      type="button"
                      className={`level-tab ${tab === T.id ? "active" : ""}`}
                      aria-pressed={tab === T.id}
                      onClick={() => setTab(T.id)}
                    >
                      <span className="level-tab-n">{T.n}</span>
                      <span>
                        <strong>{T.label}</strong>
                        <em>{T.blurb}</em>
                      </span>
                    </button>
                  ))}
                </nav>

                <div className="explorer-panels">
                  {tab === "overview" && (
                    <section className="explorer-panel">
              <section className="plain-words" aria-label="In plain words">
                <p className="eyebrow">In plain words</p>
                <p>
                  {matchedGene ? matchedGene.symbol : "This protein"} is a chain of{" "}
                  {sequence.length || "…"} amino acids
                  {primary?.organism ? ` from ${primary.organism}` : ""}. This structure ({entry.pdb_id}) was
                  solved by {shortMethod(entry.method)}.
                  {analysis
                    ? ` About ${Math.round(analysis.composition.h * 100)}% of the chain forms helices, ${Math.round(analysis.composition.s * 100)}% forms sheets and ${Math.round(analysis.composition.c * 100)}% is loops.`
                    : ""}
                </p>
                {mutation && site && (
                  <p>
                    The change <strong>{mutation.label}</strong> swaps {AA_NAME[mutation.wt] ?? mutation.wt} for{" "}
                    {AA_NAME[mutation.mt] ?? mutation.mt} at position {mutation.uniprotPos}.{offsetNote}{" "}
                    {site.observedWt === mutation.mt
                      ? `This entry already contains ${AA_NAME[mutation.mt] ?? mutation.mt}, so it shows the changed protein.`
                      : site.observedWt === mutation.wt
                        ? `This entry shows the normal ${AA_NAME[mutation.wt] ?? mutation.wt}.`
                        : "This entry has a different amino acid there, so its numbering may differ."}
                    {analysis?.selected && numberingOk
                      ? ` In 3D that spot sits in ${analysis.selected.ss === "h" ? "a helix" : analysis.selected.ss === "s" ? "a sheet" : "a loop"}, with ${analysis.selected.neighbours10} other residues close by.`
                      : ""}
                  </p>
                )}
                <p className="hint">
                  This describes shape only. It does not say whether a change causes disease.
                </p>
              </section>
                      {analysis && (
                        <section className="struct-facts" aria-label="Measured from the 3D structure">
                          <h3>Measured from the 3D structure</h3>
                          <div
                            className="ss-bar"
                            role="img"
                            aria-label={`Helix ${Math.round(analysis.composition.h * 100)} percent, sheet ${Math.round(analysis.composition.s * 100)} percent, loop ${Math.round(analysis.composition.c * 100)} percent`}
                          >
                            <span className="ss-h" style={{ width: `${analysis.composition.h * 100}%` }} />
                            <span className="ss-s" style={{ width: `${analysis.composition.s * 100}%` }} />
                            <span className="ss-c" style={{ width: `${analysis.composition.c * 100}%` }} />
                          </div>
                          <p className="ss-bar-labels">
                            <span>Helix {Math.round(analysis.composition.h * 100)}%</span>
                            <span>Sheet {Math.round(analysis.composition.s * 100)}%</span>
                            <span>Loop {Math.round(analysis.composition.c * 100)}%</span>
                          </p>
                          <p className="hint">
                            Chain {analysis.chain}: residues {analysis.firstResi} to {analysis.lastResi}
                            {analysis.missingInRange > 0
                              ? `, with ${analysis.missingInRange} not modelled inside that range`
                              : ", no gaps"}
                            . Secondary structure is as assigned in the PDB entry.
                          </p>

                          {analysis.selected && (
                            <div className="residue-card">
                              <p className="eyebrow">Selected residue</p>
                              <h4>
                                {analysis.selected.resn} {analysis.selected.resi}
                                <span className={`ss-pill ss-pill-${analysis.selected.ss}`}>
                                  {analysis.selected.ss === "h"
                                    ? "in a helix"
                                    : analysis.selected.ss === "s"
                                      ? "in a sheet"
                                      : "in a loop"}
                                </span>
                              </h4>
                              <p>
                                {analysis.selected.neighbours10} other residues have their C-alpha
                                within 10 Å
                                {analysis.selected.percentile != null
                                  ? `, more than ${analysis.selected.percentile}% of the chain: ${
                                      analysis.selected.percentile >= 70
                                        ? "leaning buried"
                                        : analysis.selected.percentile <= 30
                                          ? "leaning surface-exposed"
                                          : "in between"
                                    }`
                                  : ""}
                                . This is a rough burial proxy, not measured solvent exposure.
                              </p>
                              {analysis.selected.contacts.length > 0 && (
                                <p>
                                  <strong>Within 5 Å:</strong>{" "}
                                  {analysis.selected.contacts
                                    .map((c) => `${c.resn} ${c.resi}${c.chain !== analysis.chain ? ` (chain ${c.chain})` : ""}`)
                                    .join(", ")}
                                </p>
                              )}
                              {sequence[analysis.selected.resi - 1] &&
                                oneLetter(analysis.selected.resn) !== sequence[analysis.selected.resi - 1] && (
                                  <p className="mut-warning" role="alert">
                                    <strong>Numbering differs.</strong> The structure has{" "}
                                    {analysis.selected.resn} at residue {analysis.selected.resi}, but the
                                    sequence position {analysis.selected.resi} is{" "}
                                    {sequence[analysis.selected.resi - 1]}. The highlighted residue may
                                    not be the one you asked for.
                                  </p>
                                )}
                            </div>
                          )}
                        </section>
                      )}
                      <p className="hint">Use the tabs above to go deeper: the sequence, the 3D shape, where the mutation sits, and the details.</p>
                    </section>
                  )}

                  {tab === "sequence" && (
                    <section className="explorer-panel">
                      <LevelHelp level="primary" />
                      <h3>
                        Sequence, chain {chainLabel}, click any residue to find it in 3D
                      </h3>
                      <div className="chem-seq">
                        {Array.from({ length: Math.ceil(sequence.length / 10) }, (_, b) => {
                          const start = b * 10;
                          return (
                            <span key={start} className="seq-block">
                              <span className="seq-block-num">{start + 1}</span>
                              <span className="seq-block-aa">
                                {sequence
                                  .slice(start, start + 10)
                                  .split("")
                                  .map((aa, k) => {
                                    const resi = start + k + 1;
                                    const inPatch = focusWindow
                                      ? resi >= focusWindow.start && resi <= focusWindow.end
                                      : false;
                                    const isMut = mutation?.pos === resi;
                                    const ss = ssByResi.get(resi);
                                    return (
                                      <button
                                        key={resi}
                                        type="button"
                                        className={`chem-aa chem-${aaClass(aa)} ${activeResi === resi ? "chem-aa-active" : ""} ${inPatch ? "chem-aa-patch" : ""} ${isMut ? "chem-aa-mut" : ""} ${ss ? `seq-ss-${ss}` : ""}`}
                                        title={`${aa}${resi}${isMut && mutation ? ` → ${mutation.mt}` : ""}${ss ? (ss === "h" ? ", helix" : ss === "s" ? ", sheet" : ", loop") : ""}`}
                                        onClick={() => onResidueClick(resi)}
                                      >
                                        {aa}
                                      </button>
                                    );
                                  })}
                              </span>
                            </span>
                          );
                        })}
                      </div>
                      {ssByResi.size > 0 && (
                        <p className="hint">
                          The coloured bar under each letter marks helix (copper), sheet (blue) or
                          loop (grey) from the structure.
                        </p>
                      )}
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
                    </section>
                  )}

                  {tab === "shape" && (
                    <section className="explorer-panel">
                      <LevelHelp level="secondary" />
                      <h3>Secondary structure</h3>
                      {analysis ? (
                        <>
                          <p className="article-body">
                            Assigned in the PDB entry for chain {analysis.chain}. Residue numbers are
                            the structure&rsquo;s own numbers.
                          </p>
                          <div className="ss-bar" role="img" aria-label="Secondary structure composition">
                            <span className="ss-h" style={{ width: `${analysis.composition.h * 100}%` }} />
                            <span className="ss-s" style={{ width: `${analysis.composition.s * 100}%` }} />
                            <span className="ss-c" style={{ width: `${analysis.composition.c * 100}%` }} />
                          </div>
                          <p className="ss-bar-labels">
                            <span>Helix {Math.round(analysis.composition.h * 100)}%</span>
                            <span>Sheet {Math.round(analysis.composition.s * 100)}%</span>
                            <span>Loop {Math.round(analysis.composition.c * 100)}%</span>
                          </p>
                          <h4>
                            {analysis.segments.length} segments
                          </h4>
                          <ul className="ss-segments">
                            {analysis.segments.map((s) => (
                              <li key={`${s.type}-${s.start}`}>
                                <button
                                  type="button"
                                  className={`ss-pill ss-pill-${s.type}`}
                                  onClick={() => onResidueClick(s.start)}
                                >
                                  {s.type === "h" ? "Helix" : "Sheet"} {s.start} to {s.end}
                                </button>
                                <span className="hint">{s.end - s.start + 1} residues</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p className="hint">Loading the structure to read its secondary structure…</p>
                      )}
                      <LevelHelp level="tertiary" />
                      <h3>Tertiary structure</h3>
                      <p className="article-body">
                        The 3D fold for <strong>{entry.pdb_id}</strong> is shown on the right. Use Style /
                        Colour / Chain / Spin / Whole fold / Selected site under the viewer. Click a residue in Primary or the
                        mutation patch to zoom that site
                        {mutation ? ` (${mutation.label} highlighted when mapped)` : ""}.
                      </p>
                      <p className="hint">
                        Method: {entry.method}
                        {entry.resolution != null ? ` · ${Number(entry.resolution).toFixed(2)} Å` : ""}
                        {focusWindow
                          ? ` · Local patch ${focusWindow.start}-${focusWindow.end}`
                          : ""}
                      </p>
                    </section>
                  )}

                  {tab === "mutation" && (
                    <section className="explorer-panel">
                      <p className="hint">
                        This tab shows where the change sits and whether the entry matches. For
                        burial, packing neighbours and clash checks, open the mutation inspector.
                      </p>
                      {!(mutation && site) && (
                        <p className="hint">
                          No mutation is selected. Type one such as PFN1-G118V in the search box, then press Search.
                        </p>
                      )}
              {mutation && site && (
                <section className={`mut-gate mut-gate-${site.verdict}`} aria-label="Mutation site gate">
                  <div className="mut-gate-head">
                    <span className="mut-gate-badge">{site.observedWt === mutation.mt ? "Mutant structure" : site.verdict === "yes" ? "Polar window" : site.verdict === "no" ? "Out of range" : "Check in 3D"}</span>
                    <strong>{mutation.label}</strong>
                    {mutation.target ? <span className="hint">{mutation.target}</span> : null}
                  </div>
                  <p className="mut-gate-headline">{site.headline}</p>
                  <p className="hint">{site.detail}</p>
                  <div className="chem-grid mut-gate-stats">
                    <div>
                      <strong>
                        {site.observedWt ?? "—"}
                        {mutation.pos}
                      </strong>
                      <span>Observed WT</span>
                    </div>
                    <div>
                      <strong>{site.windowGravy.toFixed(2)}</strong>
                      <span>Local GRAVY ±8</span>
                    </div>
                    <div>
                      <strong>{site.chargedNeighbors + site.polarNeighbors}</strong>
                      <span>Polar / charged nbrs</span>
                    </div>
                    <div>
                      <strong>{site.hydrophobicNeighbors}</strong>
                      <span>Hydrophobic nbrs</span>
                    </div>
                  </div>
                  <h3 className="mut-patch-title">Local sequence patch</h3>
                  <div className="mut-patch" role="list">
                    {site.patch.map((r) => (
                      <button
                        key={r.pos}
                        type="button"
                        role="listitem"
                        className={`mut-patch-aa chem-${r.chem} ${r.isMutation ? "mut-patch-hit" : ""} ${activeResi === r.pos ? "chem-aa-active" : ""}`}
                        title={`${r.aa}${r.pos}${r.isMutation ? ` → ${mutation.mt}` : ""}`}
                        onClick={() => onResidueClick(r.pos)}
                      >
                        <span>{r.aa}</span>
                        <em>{r.pos}</em>
                      </button>
                    ))}
                  </div>
                  <div className="mut-gate-actions cta-row">
                    <Link
                      className="btn btn-primary"
                      href={`/proteins/inspect?q=${encodeURIComponent(query.trim() || mutation.label)}`}
                    >
                      Open mutation inspector
                    </Link>
                    <Link
                      className="btn btn-ghost"
                      href={`/proteins/design?q=${encodeURIComponent(query.trim() || mutation.label)}`}
                    >
                      Design peptide at site
                    </Link>
                  </div>
                </section>
              )}
                    </section>
                  )}

                  {tab === "details" && chem && (
                    <section className="explorer-panel">
                      <LevelHelp level="quaternary" />
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
                              : ", "}
                          </strong>
                          <span>Assembly mass</span>
                        </div>
                      </div>
                      {allChains.length > 0 && (
                        <p className="hint" style={{ marginTop: "0.85rem" }}>
                          Auth chains: {allChains.join(", ")}
                        </p>
                      )}
                      <h3>Chemistry of the chain</h3>
                      <div className="chem-grid">
                        <div>
                          <strong>{chem.length} aa</strong>
                          <span>Length</span>
                        </div>
                        <div>
                          <strong>{analysis ? `${analysis.modelled} aa` : "…"}</strong>
                          <span>With coordinates</span>
                        </div>
                        <div>
                          <strong>{chem.massKda.toFixed(1)} kDa</strong>
                          <span title="Mass from the sequence, no modifications">Mass</span>
                        </div>
                        <div>
                          <strong>{chem.pi.toFixed(2)}</strong>
                          <span title="pH at which the chain carries no net charge, calculated from the sequence">Theoretical pI</span>
                        </div>
                        <div>
                          <strong>{chem.gravy.toFixed(2)}</strong>
                          <span title="Mean hydropathy of the sequence. Negative is more water-loving, positive more oily">GRAVY</span>
                        </div>
                        <div>
                          <strong>{chem.extinction.toLocaleString()}</strong>
                          <span title="Light absorbance at 280 nm, calculated from Trp, Tyr and Cys counts">ε (280 nm)</span>
                        </div>
                      </div>
                      <p className="hint meta-line">
                        {primary?.organism || "Source unknown"}
                        {primary?.uniprot_ids?.[0] ? ` · UniProt ${primary.uniprot_ids[0]}` : ""}
                      </p>
                      <p className="hint chem-defs">
                        Mass, pI, GRAVY and ε are calculated from the sequence alone. Hover a label
                        for its meaning. &ldquo;With coordinates&rdquo; counts residues that were
                        actually modelled in the structure.
                      </p>

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
                </div>

                <aside className="explorer-viewer" aria-label="3D structure">
                  {selectedId && (
                    <PdbStructureViewer
                      key={selectedId}
                      pdbId={selectedId}
                      chainIds={allChains.length ? allChains : [chainLabel]}
                      highlightResi={activeResi}
                      highlightChain={chainLabel}
                      focusWindow={focusWindow}
                      onAnalysis={setAnalysis}
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
