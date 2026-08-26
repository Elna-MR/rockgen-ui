"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PFN1_ANNOTATIONS } from "@/data/pfn1Dossier";

type StructureOption = (typeof PFN1_ANNOTATIONS.structures)[number];
type KnownMut = (typeof PFN1_ANNOTATIONS.knownMutations)[number];

type Viewer = {
  clear: () => void;
  addModel: (data: string, format: string) => void;
  setStyle: (sel: object, style: object) => void;
  addStyle: (sel: object, style: object) => void;
  zoomTo: (sel?: object) => void;
  render: () => void;
  setClickable: (
    sel: object,
    clickable: boolean,
    callback?: (atom: { resi?: number }) => void
  ) => void;
};

const STRENGTH_COLOR: Record<string, string> = {
  high: "#ff4d4f",
  moderate: "#f0b429",
  low: "#9bb4bc",
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
        lastError = `Failed to load ${structure.id} (${res.status} from ${url})`;
        continue;
      }
      const text = await res.text();
      if (!text.includes("ATOM") && !text.includes("HETATM")) {
        lastError = `Invalid PDB payload for ${structure.id}`;
        continue;
      }
      return text;
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }
  throw new Error(lastError);
}

export function ProteinViewer3D() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [structure, setStructure] = useState<StructureOption>(PFN1_ANNOTATIONS.structures[0]);
  const [status, setStatus] = useState("Loading structure…");
  const [selected, setSelected] = useState<KnownMut | null>(
    PFN1_ANNOTATIONS.knownMutations.find((m) => m.label === "G118V") || null
  );

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!hostRef.current) return;
      setStatus("Loading viewer…");
      try {
        const $3Dmol = await ensure3Dmol();
        if (cancelled || !hostRef.current) return;
        setStatus("Fetching coordinates…");
        const pdb = await fetchPdbText(structure);
        if (cancelled || !hostRef.current) return;

        hostRef.current.innerHTML = "";
        const viewer = $3Dmol.createViewer(hostRef.current, {
          backgroundColor: "#f3f6f5",
          antialias: true,
        });
        viewer.clear();
        viewer.addModel(pdb, "pdb");
        viewer.setStyle({}, { cartoon: { color: "#5a6f68", opacity: 0.95 } });

        for (const region of PFN1_ANNOTATIONS.regions) {
          for (const [start, end] of region.ranges) {
            const resi = Array.from({ length: end - start + 1 }, (_, i) => start + i);
            viewer.addStyle({ resi }, { cartoon: { color: region.color } });
          }
        }

        for (const mut of PFN1_ANNOTATIONS.knownMutations) {
          const color = STRENGTH_COLOR[mut.evidenceStrength] || STRENGTH_COLOR.low;
          const isSel = selected?.position === mut.position;
          viewer.addStyle(
            { resi: mut.position },
            {
              stick: { color, radius: isSel ? 0.38 : 0.22 },
              sphere: {
                color,
                radius: isSel ? 1.1 : mut.evidenceStrength === "high" ? 0.9 : 0.65,
                opacity: 0.92,
              },
            }
          );
        }

        const byPos = new Map(PFN1_ANNOTATIONS.knownMutations.map((m) => [m.position, m]));
        viewer.setClickable({}, true, (atom) => {
          if (!atom?.resi) return;
          const mut = byPos.get(atom.resi);
          if (mut) setSelected(mut);
          else setSelected(null);
        });
        viewer.zoomTo({ resi: selected?.position || 118 });
        viewer.render();
        setStatus(
          `${structure.label} · mutations colored by evidence strength · click a site`
        );
      } catch (e) {
        setStatus(e instanceof Error ? e.message : "Viewer failed");
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [structure, selected]);

  return (
    <div className="viewer-shell">
      <div className="viewer-toolbar">
        <div className="chip-row">
          {PFN1_ANNOTATIONS.structures.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`chip ${structure.id === s.id ? "chip-active" : ""}`}
              onClick={() => setStructure(s)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="viewer-legend">
          <span>
            <i style={{ background: "#ff4d4f" }} /> High evidence
          </span>
          <span>
            <i style={{ background: "#f0b429" }} /> Moderate
          </span>
          <span>
            <i style={{ background: "#9bb4bc" }} /> Low
          </span>
          <span>
            <i style={{ background: "#3dd6c6" }} /> Actin-binding
          </span>
          <span>
            <i style={{ background: "#5b8def" }} /> PLP-binding
          </span>
        </div>
      </div>
      <div ref={hostRef} className="viewer-canvas" />
      <p className="hint viewer-status">
        {status}
        {selected ? (
          <>
            {" "}
            · selected: <strong>{selected.label}</strong> ({selected.bindingRegion},{" "}
            {selected.evidenceStrength}) ·{" "}
            <Link href={`/proteins/P07737/compare#${selected.key.replace(":", "-")}`}>
              Open mutation review
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
