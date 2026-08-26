"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { aaClass, chemistrySummary } from "@/lib/proteinChemistry";
import type { ProteinDetail } from "@/lib/api";

const SimpleStructureViewer = dynamic(
  () => import("@/components/SimpleStructureViewer").then((m) => m.SimpleStructureViewer),
  {
    ssr: false,
    loading: () => <div className="viewer-canvas viewer-skeleton">Loading 3D viewer…</div>,
  },
);

export type CatalogProtein = {
  uniprot_id: string;
  symbol: string;
  name: string;
};

type Level = "primary" | "secondary" | "tertiary" | "quaternary";

const LEVELS: Array<{ id: Level; n: number; label: string; blurb: string }> = [
  { id: "primary", n: 1, label: "Primary", blurb: "the sequence" },
  { id: "secondary", n: 2, label: "Secondary", blurb: "local fold" },
  { id: "tertiary", n: 3, label: "Tertiary", blurb: "3D fold" },
  { id: "quaternary", n: 4, label: "Quaternary", blurb: "assembly" },
];

type Props = {
  catalog: CatalogProtein[];
  /** Preloaded details keyed by UniProt id (at least the initial selection). */
  detailsById: Record<string, ProteinDetail>;
  initialId: string;
};

function structureOptions(protein: ProteinDetail) {
  const opts: Array<{ id: string; label: string; url: string; fallbackUrls?: string[] }> = [];
  const afId = `AF-${protein.uniprot_id}-F1`;
  opts.push({
    id: afId,
    label: "AlphaFold",
    url: `/api/structures/${afId}`,
    fallbackUrls: [
      `https://alphafold.ebi.ac.uk/files/${afId}-model_v6.pdb`,
      `https://alphafold.ebi.ac.uk/files/${afId}-model_v4.pdb`,
    ],
  });
  for (const s of protein.structures || []) {
    if (!s.id) continue;
    if (s.id.startsWith("AF-")) continue;
    const pdbId = s.id.toUpperCase();
    if (!/^[0-9][A-Z0-9]{3}$/.test(pdbId)) continue;
    opts.push({
      id: pdbId,
      label: `PDB ${pdbId}${s.method ? ` (${s.method})` : ""}`,
      url: `/api/structures/${pdbId}`,
      fallbackUrls: [`https://files.rcsb.org/download/${pdbId}.pdb`],
    });
  }
  // Bundled PFN1 extras
  if (protein.uniprot_id === "P07737") {
    opts.push({
      id: "2PAV",
      label: "PDB 2PAV (X-ray)",
      url: "/structures/2PAV.pdb",
      fallbackUrls: ["/api/structures/2PAV", "https://files.rcsb.org/download/2PAV.pdb"],
    });
  }
  // de-dupe by id
  const seen = new Set<string>();
  return opts.filter((o) => {
    if (seen.has(o.id)) return false;
    seen.add(o.id);
    return true;
  });
}

export function StructureExplorer({ catalog, detailsById, initialId }: Props) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialId);
  const [level, setLevel] = useState<Level>("primary");
  const [cache, setCache] = useState(detailsById);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (p) =>
        p.symbol.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.uniprot_id.toLowerCase().includes(q),
    );
  }, [catalog, query]);

  const protein = cache[selectedId] || null;

  async function selectProtein(id: string) {
    setSelectedId(id);
    setError(null);
    if (cache[id]) return;
    setLoading(true);
    try {
      const res = await fetch(`/backend/v1/proteins/${id}`);
      if (!res.ok) throw new Error(`Could not load protein (${res.status})`);
      const data = (await res.json()) as ProteinDetail;
      setCache((prev) => ({ ...prev, [id]: data }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  const chem = useMemo(
    () => (protein?.sequence ? chemistrySummary(protein.sequence) : null),
    [protein?.sequence],
  );

  const structs = protein ? structureOptions(protein) : [];
  const primaryStruct = protein?.structures?.[0];

  return (
    <div className="explorer">
      <div className="explorer-search">
        <label className="explorer-search-label" htmlFor="protein-search">
          Search proteins
        </label>
        <div className="explorer-search-row">
          <input
            id="protein-search"
            className="ask-input explorer-input"
            type="search"
            placeholder="Protein name, symbol, or UniProt…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (filtered[0]) void selectProtein(filtered[0].uniprot_id);
            }}
          >
            Search
          </button>
        </div>
        <div className="chip-row explorer-quick">
          {catalog.slice(0, 8).map((p) => (
            <button
              key={p.uniprot_id}
              type="button"
              className={`chip ${selectedId === p.uniprot_id ? "chip-active" : ""}`}
              onClick={() => void selectProtein(p.uniprot_id)}
            >
              {p.symbol}
            </button>
          ))}
        </div>
      </div>

      <div className="explorer-layout">
        <aside className="explorer-sidebar" aria-label="Matching structures">
          <p className="eyebrow">
            {filtered.length} protein{filtered.length === 1 ? "" : "s"} · ranked by name
          </p>
          <ul className="explorer-results">
            {filtered.map((p) => (
              <li key={p.uniprot_id}>
                <button
                  type="button"
                  className={`explorer-result ${selectedId === p.uniprot_id ? "active" : ""}`}
                  onClick={() => void selectProtein(p.uniprot_id)}
                >
                  <strong>{p.symbol}</strong>
                  <span>{p.name}</span>
                  <span className="hint">{p.uniprot_id}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="hint">No matches in the ALS panel.</li>}
          </ul>
        </aside>

        <div className="explorer-main">
          {loading && <p className="hint">Loading protein details…</p>}
          {error && <p className="error">{error}</p>}
          {!protein && !loading && <p className="hint">Select a protein to explore.</p>}

          {protein && (
            <>
              <header className="explorer-entry-header">
                <h2>
                  {protein.symbol}{" "}
                  <span className="hint">· {protein.uniprot_id}</span>
                </h2>
                <p className="lede">{protein.name}</p>
                <div className="badge-row">
                  {chem && <span className="badge">{chem.length} aa</span>}
                  {chem && <span className="badge">{chem.massKda.toFixed(1)} kDa</span>}
                  {primaryStruct?.method && <span className="badge">{primaryStruct.method}</span>}
                  {(protein.structures?.length || 0) > 0 && (
                    <span className="badge">{protein.structures.length} structure link(s)</span>
                  )}
                  <a
                    className="badge cell-link"
                    href={`https://www.uniprot.org/uniprotkb/${protein.uniprot_id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open at UniProt
                  </a>
                  {structs.find((s) => /^[0-9]/.test(s.id)) && (
                    <a
                      className="badge cell-link"
                      href={`https://www.rcsb.org/structure/${structs.find((s) => /^[0-9]/.test(s.id))!.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open at RCSB
                    </a>
                  )}
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
                          <strong>{chem.length}</strong>
                          <span>Length</span>
                        </div>
                        <div>
                          <strong>{chem.modelled}</strong>
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
                        Source · Homo sapiens ·{" "}
                        <Link href={`/proteins/${protein.uniprot_id}`}>{protein.uniprot_id}</Link>
                      </p>

                      <h3>Sequence</h3>
                      <div className="chem-seq">
                        {protein.sequence!.split("").map((aa, i) => (
                          <span key={i} className={`chem-aa chem-${aaClass(aa)}`} title={`${aa}${i + 1}`}>
                            {aa}
                          </span>
                        ))}
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
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ marginTop: "1rem" }}
                        onClick={() => {
                          void navigator.clipboard.writeText(
                            `>${protein.symbol}|${protein.uniprot_id}\n${protein.sequence}`,
                          );
                        }}
                      >
                        Copy FASTA
                      </button>
                    </section>
                  )}

                  {level === "secondary" && (
                    <section className="explorer-panel">
                      <h3>Secondary structure</h3>
                      <p className="article-body">
                        Secondary structure is the local fold — helices, strands, and loops. Full DSSP
                        assignment is not computed in-browser yet; use the tertiary view for the 3D
                        cartoon, which encodes secondary elements visually.
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
                              {(((chem.composition.G || 0) + (chem.composition.P || 0)) / Math.max(chem.length, 1)).toFixed(
                                2,
                              )}
                            </strong>
                            <span>Loop / turn cues (G+P)</span>
                          </div>
                        </div>
                      )}
                      <p className="hint" style={{ marginTop: "1rem" }}>
                        Educational sequence composition cues — not a DSSP prediction.
                      </p>
                    </section>
                  )}

                  {level === "tertiary" && (
                    <section className="explorer-panel explorer-panel-viewer">
                      <h3>Tertiary structure</h3>
                      <p className="hint">
                        Cartoon coloured N→C. AlphaFold models are predictions; experimental PDBs when
                        linked.
                      </p>
                      <SimpleStructureViewer structures={structs} />
                    </section>
                  )}

                  {level === "quaternary" && (
                    <section className="explorer-panel">
                      <h3>Quaternary / assembly</h3>
                      <p className="article-body">
                        Quaternary structure is how multiple chains assemble. AlphaFold single-chain
                        models show the asymmetric fold as deposited for that chain — not a full
                        biological assembly unless an experimental multimer is available.
                      </p>
                      <div className="chem-grid" style={{ marginTop: "1rem" }}>
                        <div>
                          <strong>1</strong>
                          <span>Chains in explorer model</span>
                        </div>
                        <div>
                          <strong>{protein.structures?.length || 0}</strong>
                          <span>Linked structure records</span>
                        </div>
                        <div>
                          <strong>{protein.interaction_partners?.length || 0}</strong>
                          <span>Interaction partners (graph)</span>
                        </div>
                      </div>
                      {protein.interaction_partners?.length > 0 && (
                        <ul className="list-plain" style={{ marginTop: "1rem" }}>
                          {protein.interaction_partners.slice(0, 8).map((p) => (
                            <li key={p.uniprot_id}>
                              <Link href={`/proteins/${p.uniprot_id}/structure`}>{p.symbol}</Link>
                              {p.name ? ` — ${p.name}` : ""}
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
