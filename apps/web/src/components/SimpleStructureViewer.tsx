"use client";

import { useEffect, useRef, useState } from "react";

type StructureOption = {
  id: string;
  label: string;
  url: string;
  fallbackUrls?: string[];
};

type Viewer = {
  clear: () => void;
  addModel: (data: string, format: string) => void;
  setStyle: (sel: object, style: object) => void;
  zoomTo: (sel?: object) => void;
  render: () => void;
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

async function fetchPdbText(structure: StructureOption): Promise<string> {
  const candidates = [structure.url, ...(structure.fallbackUrls || [])];
  let lastError = `Failed to load ${structure.id}`;
  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        lastError = `Failed to load ${structure.id} (${res.status})`;
        continue;
      }
      const text = await res.text();
      if (!text.includes("ATOM") && !text.includes("HETATM")) {
        lastError = `Invalid PDB for ${structure.id}`;
        continue;
      }
      return text;
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }
  throw new Error(lastError);
}

type Props = {
  structures: StructureOption[];
};

export function SimpleStructureViewer({ structures }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [structure, setStructure] = useState(structures[0]);
  const [status, setStatus] = useState("Loading structure…");
  const [spin, setSpin] = useState(false);
  const viewerRef = useRef<Viewer | null>(null);
  const spinRef = useRef<number | null>(null);

  useEffect(() => {
    if (structures.length && !structures.find((s) => s.id === structure?.id)) {
      setStructure(structures[0]);
    }
  }, [structures, structure?.id]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!hostRef.current || !structure) return;
      setStatus("Loading viewer…");
      try {
        const $3Dmol = await ensure3Dmol();
        if (cancelled || !hostRef.current) return;
        setStatus("Fetching coordinates…");
        const pdb = await fetchPdbText(structure);
        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = "";
        const viewer = $3Dmol.createViewer(hostRef.current, {
          backgroundColor: "#f4f6f8",
        });
        viewerRef.current = viewer;
        viewer.clear();
        viewer.addModel(pdb, "pdb");
        viewer.setStyle({}, { cartoon: { color: "spectrum" } });
        viewer.zoomTo();
        viewer.render();
        setStatus(`${structure.label} · drag to rotate, scroll to zoom`);
      } catch (e) {
        if (!cancelled) setStatus(e instanceof Error ? e.message : "Failed to load");
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [structure]);

  useEffect(() => {
    if (spinRef.current) {
      cancelAnimationFrame(spinRef.current);
      spinRef.current = null;
    }
    if (!spin || !viewerRef.current) return;
    const viewer = viewerRef.current as Viewer & { rotate?: (angle: number, axis: string) => void };
    const tick = () => {
      viewer.rotate?.(1, "y");
      viewer.render();
      spinRef.current = requestAnimationFrame(tick);
    };
    spinRef.current = requestAnimationFrame(tick);
    return () => {
      if (spinRef.current) cancelAnimationFrame(spinRef.current);
    };
  }, [spin, structure]);

  if (!structures.length) {
    return <p className="hint">No coordinate files available for this protein yet.</p>;
  }

  return (
    <div className="viewer-shell">
      <div className="viewer-toolbar chip-row">
        {structures.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`chip ${structure?.id === s.id ? "chip-active" : ""}`}
            onClick={() => setStructure(s)}
          >
            {s.label}
          </button>
        ))}
        <button type="button" className={`chip ${spin ? "chip-active" : ""}`} onClick={() => setSpin((v) => !v)}>
          Spin
        </button>
      </div>
      <div ref={hostRef} className="viewer-canvas" />
      <p className="viewer-status hint">{status}</p>
    </div>
  );
}
