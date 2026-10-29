"use client";

import { useEffect, useRef, useState } from "react";

type Atom = {
  x: number;
  y: number;
  z: number;
  resi: number;
  resn: string;
  chain: string;
  atom: string;
  ss?: string;
};

type Viewer = {
  clear: () => void;
  addModel: (data: string, format: string) => void;
  setStyle: (sel: object, style: object) => void;
  addStyle: (sel: object, style: object) => void;
  zoomTo: (sel?: object) => void;
  render: () => void;
  rotate?: (angle: number, axis: string) => void;
  selectedAtoms: (sel: object) => Atom[];
  addResLabels: (sel: object, style?: object) => void;
  removeAllLabels: () => void;
  setBackgroundColor: (color: string, alpha?: number) => void;
};

export type SsKind = "h" | "s" | "c";

/** Facts measured from the deposited coordinates of the chain on screen. */
export type StructureAnalysis = {
  chain: string;
  /** Residues that have a C-alpha atom, in order. */
  residues: { resi: number; resn: string; ss: SsKind }[];
  modelled: number;
  firstResi: number;
  lastResi: number;
  /** Residues inside the first-to-last range that have no coordinates. */
  missingInRange: number;
  composition: { h: number; s: number; c: number };
  segments: { type: "h" | "s"; start: number; end: number }[];
  selected: null | {
    resi: number;
    resn: string;
    ss: SsKind;
    neighbours10: number;
    /** Share of residues in the chain with fewer C-alpha neighbours within 10 Å, 0 to 100. */
    percentile: number | null;
    contacts: { chain: string; resi: number; resn: string }[];
  };
};

const SS_COLOR: Record<SsKind, string> = { h: "#c9973f", s: "#5b7fa6", c: "#a9b7bf" };

async function load3Dmol(): Promise<{ createViewer: (el: HTMLElement, cfg: object) => Viewer }> {
  const lib = (await import("3dmol")) as unknown as {
    createViewer?: (el: HTMLElement, cfg: object) => Viewer;
    default?: { createViewer: (el: HTMLElement, cfg: object) => Viewer };
  };
  const createViewer = lib.createViewer ?? lib.default?.createViewer;
  if (!createViewer) throw new Error("3Dmol failed to load");
  return { createViewer };
}

function analyse(viewer: Viewer, chain: string, resi: number | null): StructureAnalysis {
  const cas = viewer
    .selectedAtoms({ chain, atom: "CA" })
    .slice()
    .sort((a, b) => a.resi - b.resi);
  const kindOf = (a: Atom): SsKind => (a.ss === "h" || a.ss === "s" ? a.ss : "c");
  const residues = cas.map((a) => ({ resi: a.resi, resn: a.resn, ss: kindOf(a) }));

  const counts = { h: 0, s: 0, c: 0 };
  for (const r of residues) counts[r.ss] += 1;
  const n = Math.max(residues.length, 1);

  const segments: StructureAnalysis["segments"] = [];
  for (const r of residues) {
    if (r.ss === "c") continue;
    const last = segments[segments.length - 1];
    if (last && last.type === r.ss && r.resi === last.end + 1) last.end = r.resi;
    else segments.push({ type: r.ss, start: r.resi, end: r.resi });
  }

  const first = residues[0]?.resi ?? 0;
  const lastResi = residues[residues.length - 1]?.resi ?? 0;

  let selected: StructureAnalysis["selected"] = null;
  const target = resi != null ? cas.find((a) => a.resi === resi) : undefined;
  if (target) {
    const within = (a: Atom, b: Atom) =>
      (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 <= 100;
    const neighbours10 = cas.filter((a) => a !== target && within(a, target)).length;
    let percentile: number | null = null;
    if (cas.length <= 2500) {
      let fewer = 0;
      for (const a of cas) {
        let c = 0;
        for (const b of cas) if (a !== b && within(a, b)) c += 1;
        if (c < neighbours10) fewer += 1;
      }
      percentile = Math.round((fewer / cas.length) * 100);
    }
    const seen = new Set<string>();
    const contacts: { chain: string; resi: number; resn: string }[] = [];
    for (const a of viewer.selectedAtoms({ within: { distance: 5, sel: { chain, resi } } })) {
      if (a.resn === "HOH") continue;
      if (a.chain === chain && Math.abs(a.resi - target.resi) <= 1) continue;
      const key = `${a.chain}:${a.resi}:${a.resn}`;
      if (seen.has(key)) continue;
      seen.add(key);
      contacts.push({ chain: a.chain, resi: a.resi, resn: a.resn });
    }
    contacts.sort((a, b) => (a.chain === b.chain ? a.resi - b.resi : a.chain.localeCompare(b.chain)));
    selected = {
      resi: target.resi,
      resn: target.resn,
      ss: kindOf(target),
      neighbours10,
      percentile,
      contacts: contacts.slice(0, 14),
    };
  }

  return {
    chain,
    residues,
    modelled: residues.length,
    firstResi: first,
    lastResi,
    missingInRange: Math.max(0, lastResi - first + 1 - residues.length),
    composition: { h: counts.h / n, s: counts.s / n, c: counts.c / n },
    segments,
    selected,
  };
}

type Props = {
  pdbId: string;
  chainIds: string[];
  highlightResi?: number | null;
  highlightChain?: string;
  /** Inclusive residue window to emphasize around a mutation. */
  focusWindow?: { start: number; end: number } | null;
  /** Called with measurements from the coordinates once the structure has loaded. */
  onAnalysis?: (analysis: StructureAnalysis | null) => void;
};

export function PdbStructureViewer({
  pdbId,
  chainIds,
  highlightResi,
  highlightChain,
  focusWindow,
  onAnalysis,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const spinRef = useRef<number | null>(null);
  const onAnalysisRef = useRef(onAnalysis);
  onAnalysisRef.current = onAnalysis;
  const [status, setStatus] = useState("Loading structure…");
  const [spin, setSpin] = useState(false);
  const [chain, setChain] = useState(
    highlightChain && chainIds.includes(highlightChain) ? highlightChain : chainIds[0] || "A",
  );
  const [styleMode, setStyleMode] = useState<"cartoon" | "stick" | "sphere">("cartoon");
  const [colorMode, setColorMode] = useState<"ss" | "spectrum">("ss");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (chainIds.length && !chainIds.includes(chain)) setChain(chainIds[0]);
  }, [chainIds, chain]);

  // Follow the chain the explorer is describing, so the dropdown matches what is shown.
  useEffect(() => {
    if (highlightChain && chainIds.includes(highlightChain)) setChain(highlightChain);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightChain, pdbId]);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    async function run() {
      if (!hostRef.current || !pdbId) return;
      setStatus("Loading viewer…");
      try {
        const lib = await load3Dmol();
        if (cancelled || !hostRef.current) return;
        setStatus("Fetching coordinates…");
        const res = await fetch(`/api/structures/${pdbId}`);
        if (!res.ok) throw new Error(`Failed to load ${pdbId} (${res.status})`);
        const pdb = await res.text();
        if (!pdb.includes("ATOM") && !pdb.includes("HETATM")) {
          throw new Error(`Invalid PDB for ${pdbId}`);
        }
        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = "";
        const viewer = lib.createViewer(hostRef.current, { backgroundColor: "#f4f8fa" });
        viewerRef.current = viewer;
        viewer.clear();
        viewer.addModel(pdb, "pdb");
        applyStyle(viewer, styleMode, colorMode, chain);
        viewer.zoomTo(chain ? { chain } : undefined);
        viewer.render();
        setReady(true);
      } catch (e) {
        if (!cancelled) setStatus(e instanceof Error ? e.message : "Failed to load");
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
    // reload coordinates when pdb changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdbId]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !ready) return;
    const c = chain;
    // The residue position belongs to the explorer's chain; do not apply it to another chain.
    const hl = !highlightChain || highlightChain === chain ? (highlightResi ?? null) : null;
    applyStyle(viewer, styleMode, colorMode, c);
    viewer.removeAllLabels();
    if (focusWindow) {
      viewer.addStyle(
        { chain: c, resi: `${focusWindow.start}-${focusWindow.end}` },
        { stick: { radius: 0.12, colorscheme: "whiteCarbon" } },
      );
    }
    if (hl != null) {
      // Residues within 5 Å are drawn as thin sticks so the local packing is visible.
      viewer.addStyle(
        {
          within: { distance: 5, sel: { chain: c, resi: hl } },
          byres: true,
          not: { resn: ["HOH"] },
        },
        { stick: { radius: 0.1, colorscheme: "whiteCarbon" } },
      );
      viewer.addStyle(
        { chain: c, resi: hl },
        { cartoon: { color: "#f59e0b" }, stick: { color: "#f59e0b", radius: 0.26 } },
      );
      viewer.addResLabels(
        { chain: c, resi: hl },
        {
          fontSize: 13,
          showBackground: true,
          backgroundColor: "#1a2b34",
          backgroundOpacity: 0.88,
          fontColor: "white",
          alignment: "bottomCenter",
        },
      );
      viewer.zoomTo({ within: { distance: 9, sel: { chain: c, resi: hl } } });
      setStatus(`Residue ${c}${hl} highlighted, with residues within 5 Å. Drag to rotate, scroll to zoom.`);
    } else if (focusWindow) {
      viewer.zoomTo({ chain: c, resi: `${focusWindow.start}-${focusWindow.end}` });
      setStatus(`Showing local patch ${focusWindow.start}-${focusWindow.end} on chain ${c}.`);
    } else {
      viewer.zoomTo({ chain: c });
      setStatus(`Showing chain ${c}, asymmetric unit as deposited. Drag to rotate, scroll to zoom.`);
    }
    viewer.render();
    onAnalysisRef.current?.(analyse(viewer, c, hl));
  }, [highlightResi, highlightChain, focusWindow, ready, styleMode, colorMode, chain]);

  useEffect(() => {
    if (spinRef.current) {
      cancelAnimationFrame(spinRef.current);
      spinRef.current = null;
    }
    if (!spin || !viewerRef.current) return;
    const viewer = viewerRef.current;
    const tick = () => {
      viewer.rotate?.(1, "y");
      viewer.render();
      spinRef.current = requestAnimationFrame(tick);
    };
    spinRef.current = requestAnimationFrame(tick);
    return () => {
      if (spinRef.current) cancelAnimationFrame(spinRef.current);
    };
  }, [spin, pdbId]);

  const c = chain;
  const siteResi = !highlightChain || highlightChain === chain ? (highlightResi ?? null) : null;

  return (
    <div className="pdb-viewer">
      <div ref={hostRef} className="pdb-viewer-canvas" />
      {colorMode === "ss" && styleMode === "cartoon" && (
        <p className="pdb-viewer-legend">
          <span>
            <i style={{ background: SS_COLOR.h }} /> Helix
          </span>
          <span>
            <i style={{ background: SS_COLOR.s }} /> Sheet
          </span>
          <span>
            <i style={{ background: SS_COLOR.c }} /> Loop
          </span>
          <span>
            <i style={{ background: "#f59e0b" }} /> Selected residue
          </span>
        </p>
      )}
      <div className="pdb-viewer-controls">
        <label>
          Style
          <select
            value={styleMode}
            onChange={(e) => setStyleMode(e.target.value as typeof styleMode)}
          >
            <option value="cartoon">Cartoon</option>
            <option value="stick">Stick</option>
            <option value="sphere">Sphere</option>
          </select>
        </label>
        <label>
          Colour
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as typeof colorMode)}
          >
            <option value="ss">Secondary structure</option>
            <option value="spectrum">N → C terminus</option>
          </select>
        </label>
        <label>
          Chain
          <select value={chain} onChange={(e) => setChain(e.target.value)}>
            {(chainIds.length ? chainIds : ["A"]).map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={`chip ${spin ? "chip-active" : ""}`}
          onClick={() => setSpin((v) => !v)}
        >
          Spin
        </button>
        <button
          type="button"
          className="chip"
          onClick={() => {
            viewerRef.current?.zoomTo({ chain: c });
            viewerRef.current?.render();
          }}
        >
          Whole fold
        </button>
        <button
          type="button"
          className="chip"
          disabled={siteResi == null}
          onClick={() => {
            if (siteResi == null) return;
            viewerRef.current?.zoomTo({
              within: { distance: 9, sel: { chain: c, resi: siteResi } },
            });
            viewerRef.current?.render();
          }}
        >
          Selected site
        </button>
      </div>
      <p className="pdb-viewer-status">{status}</p>
    </div>
  );
}

function applyStyle(
  viewer: Viewer,
  mode: "cartoon" | "stick" | "sphere",
  colorMode: "ss" | "spectrum",
  chain: string,
) {
  viewer.setStyle({}, {});
  const sel = chain ? { chain } : {};
  const ssColor = (a: Atom) => SS_COLOR[a.ss === "h" || a.ss === "s" ? a.ss : "c"];
  if (mode === "cartoon") {
    viewer.setStyle(
      sel,
      { cartoon: colorMode === "ss" ? { colorfunc: ssColor } : { color: "spectrum" } },
    );
  } else if (mode === "stick") {
    viewer.setStyle(
      sel,
      { stick: colorMode === "ss" ? { colorfunc: ssColor } : { colorscheme: "spectrum" } },
    );
  } else {
    viewer.setStyle(
      sel,
      {
        sphere:
          colorMode === "ss" ? { colorfunc: ssColor, scale: 0.3 } : { colorscheme: "spectrum", scale: 0.3 },
      },
    );
  }
}
