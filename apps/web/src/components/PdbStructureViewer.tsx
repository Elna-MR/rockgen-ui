"use client";

import { useEffect, useRef, useState } from "react";

type Viewer = {
  clear: () => void;
  addModel: (data: string, format: string) => void;
  setStyle: (sel: object, style: object) => void;
  addStyle: (sel: object, style: object) => void;
  zoomTo: (sel?: object) => void;
  render: () => void;
  rotate?: (angle: number, axis: string) => void;
};

function ensure3Dmol(): Promise<{ createViewer: (el: HTMLElement, cfg: object) => Viewer }> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as {
      $3Dmol?: { createViewer: (el: HTMLElement, cfg: object) => Viewer };
    };
    if (w.$3Dmol) {
      resolve(w.$3Dmol);
      return;
    }
    const existing = document.querySelector("script[data-3dmol]");
    if (existing) {
      existing.addEventListener("load", () => {
        if (w.$3Dmol) resolve(w.$3Dmol);
        else reject(new Error("3Dmol failed to load"));
      });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://3Dmol.org/build/3Dmol-min.js";
    script.async = true;
    script.setAttribute("data-3dmol", "1");
    script.onload = () => {
      if (w.$3Dmol) resolve(w.$3Dmol);
      else reject(new Error("3Dmol global missing"));
    };
    script.onerror = () => reject(new Error("Failed to load 3Dmol script"));
    document.body.appendChild(script);
  });
}

type Props = {
  pdbId: string;
  chainIds: string[];
  highlightResi?: number | null;
  highlightChain?: string;
  /** Inclusive residue window to emphasize around a mutation (Complement-style patch). */
  focusWindow?: { start: number; end: number } | null;
};

export function PdbStructureViewer({
  pdbId,
  chainIds,
  highlightResi,
  highlightChain,
  focusWindow,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const spinRef = useRef<number | null>(null);
  const [status, setStatus] = useState("Loading structure…");
  const [spin, setSpin] = useState(false);
  const [chain, setChain] = useState(chainIds[0] || "A");
  const [styleMode, setStyleMode] = useState<"cartoon" | "stick" | "sphere">("cartoon");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (chainIds.length && !chainIds.includes(chain)) setChain(chainIds[0]);
  }, [chainIds, chain]);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    async function run() {
      if (!hostRef.current || !pdbId) return;
      setStatus("Loading viewer…");
      try {
        const $3Dmol = await ensure3Dmol();
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
        const viewer = $3Dmol.createViewer(hostRef.current, {
          backgroundColor: "#0f1419",
        });
        viewerRef.current = viewer;
        viewer.clear();
        viewer.addModel(pdb, "pdb");
        applyStyle(viewer, styleMode, chain);
        viewer.zoomTo(chain ? { chain } : undefined);
        viewer.render();
        setReady(true);
        setStatus(
          `Showing chain ${chain} — asymmetric unit as deposited. Drag to rotate, scroll to zoom.`,
        );
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
    const c = highlightChain || chain;
    applyStyle(viewer, styleMode, c);
    if (focusWindow) {
      viewer.addStyle(
        { chain: c, resi: `${focusWindow.start}-${focusWindow.end}` },
        { stick: { colorscheme: "cyanCarbon", radius: 0.15 } },
      );
    }
    if (highlightResi != null) {
      viewer.addStyle(
        { chain: c, resi: highlightResi },
        { cartoon: { color: "#f59e0b" }, stick: { color: "#fbbf24", radius: 0.28 } },
      );
      viewer.zoomTo({ chain: c, resi: highlightResi });
      setStatus(`Focused on ${c}${highlightResi} — mutation / selected site.`);
    } else if (focusWindow) {
      viewer.zoomTo({ chain: c, resi: `${focusWindow.start}-${focusWindow.end}` });
      setStatus(`Showing local patch ${focusWindow.start}–${focusWindow.end} on chain ${c}.`);
    } else {
      setStatus(
        `Showing chain ${chain} — asymmetric unit as deposited. Drag to rotate, scroll to zoom.`,
      );
    }
    viewer.render();
  }, [highlightResi, highlightChain, focusWindow, ready, styleMode, chain]);

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

  return (
    <div className="pdb-viewer">
      <div ref={hostRef} className="pdb-viewer-canvas" />
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
          <select defaultValue="spectrum" disabled>
            <option value="spectrum">N → C</option>
          </select>
        </label>
        <label>
          Chain
          <select value={chain} onChange={(e) => setChain(e.target.value)}>
            {(chainIds.length ? chainIds : ["A"]).map((c) => (
              <option key={c} value={c}>
                {c}
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
            viewerRef.current?.zoomTo(chain ? { chain } : undefined);
            viewerRef.current?.render();
          }}
        >
          Recentre
        </button>
      </div>
      <p className="pdb-viewer-status">{status}</p>
    </div>
  );
}

function applyStyle(viewer: Viewer, mode: "cartoon" | "stick" | "sphere", chain: string) {
  viewer.setStyle({}, {});
  const sel = chain ? { chain } : {};
  if (mode === "cartoon") viewer.setStyle(sel, { cartoon: { color: "spectrum" } });
  else if (mode === "stick") viewer.setStyle(sel, { stick: { colorscheme: "spectrum" } });
  else viewer.setStyle(sel, { sphere: { colorscheme: "spectrum", scale: 0.3 } });
}
