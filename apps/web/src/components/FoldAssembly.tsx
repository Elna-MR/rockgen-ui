"use client";

import { useEffect, useRef } from "react";
import type { FoldId } from "@/data/foldStructures";

type PieceKind = "h" | "s" | "c";
const COLORS: Record<PieceKind, string> = { h: "#c9973f", s: "#5b7fa6", c: "#a9b7bf" };
/** When each piece starts and finishes arriving, as a share of the build time. */
const WINDOW: Record<PieceKind, [number, number]> = { s: [0, 0.55], h: [0.2, 0.75], c: [0.4, 1] };
/** Direction each piece arrives from, in units of the molecule's radius. */
const FROM: Record<PieceKind, [number, number, number]> = {
  h: [-1.6, -0.5, 0.4],
  s: [1.6, -0.4, -0.4],
  c: [0, 1.7, 0],
};
const KINDS: PieceKind[] = ["h", "s", "c"];

type Atom = { x: number; y: number; z: number; ss?: string };
type Model = { selectedAtoms: (sel: object) => Atom[] };
type Viewer = {
  addModel: (data: string, format: string) => Model;
  setStyle: (sel: object, style: object) => void;
  setBackgroundColor: (color: string, alpha: number) => void;
  zoomTo: () => void;
  zoom: (factor: number) => void;
  rotate: (angle: number, axis: string) => void;
  render: () => void;
  resize: () => void;
  clear: () => void;
};

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

const textCache: Record<string, string> = {};

type Props = {
  foldId: FoldId;
  /** Time the three pieces take to arrive, in ms. The fold then holds and rotates. */
  buildMs: number;
  reduceMotion: boolean;
  className?: string;
  label: string;
  onError?: () => void;
};

/**
 * Real 3D ribbon of one solved structure. Helices, sheets and loops arrive as three separate
 * pieces, combine into the fold, then rotate slowly.
 */
export function FoldAssembly({ foldId, buildMs, reduceMotion, className, label, onError }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let raf = 0;

    async function run() {
      try {
        const lib = (await import("3dmol")) as unknown as {
          createViewer?: (el: HTMLElement, cfg: object) => Viewer;
          default?: { createViewer: (el: HTMLElement, cfg: object) => Viewer };
        };
        const create = lib.createViewer ?? lib.default?.createViewer;
        if (!create) throw new Error("3Dmol unavailable");

        let text = textCache[foldId];
        if (!text) {
          const res = await fetch(`/brand/folds/pdb/${foldId}.pdb`);
          if (!res.ok) throw new Error(`Structure file ${res.status}`);
          text = await res.text();
          textCache[foldId] = text;
        }
        if (cancelled || !host) return;

        if (!viewerRef.current) {
          viewerRef.current = create(host, { backgroundAlpha: 0, antialias: true });
        }
        const viewer = viewerRef.current;
        viewer.clear();
        viewer.setBackgroundColor("#ffffff", 0);
        const atoms = viewer.addModel(text, "pdb").selectedAtoms({});

        let cx = 0;
        let cy = 0;
        let cz = 0;
        for (const a of atoms) {
          cx += a.x;
          cy += a.y;
          cz += a.z;
        }
        cx /= atoms.length;
        cy /= atoms.length;
        cz /= atoms.length;
        let radius = 1;
        for (const a of atoms) radius = Math.max(radius, Math.hypot(a.x - cx, a.y - cy, a.z - cz));
        const home = atoms.map((a) => [a.x, a.y, a.z] as const);
        const kinds = atoms.map((a): PieceKind => (a.ss === "h" || a.ss === "s" ? a.ss : "c"));

        const paint = (opacity: Record<PieceKind, number>) => {
          for (const k of KINDS) {
            viewer.setStyle(
              { ss: k },
              { cartoon: { color: COLORS[k], opacity: opacity[k], thickness: k === "c" ? 0.28 : 0.4 } },
            );
          }
        };
        const place = (progress: Record<PieceKind, number>) => {
          atoms.forEach((a, i) => {
            const k = kinds[i];
            const away = 1 - progress[k];
            const d = FROM[k];
            a.x = home[i][0] + d[0] * radius * away;
            a.y = home[i][1] + d[1] * radius * away;
            a.z = home[i][2] + d[2] * radius * away;
          });
        };

        const still = { h: 1, s: 1, c: 1 };
        place(still);
        paint(still);
        viewer.zoomTo();
        viewer.zoom(0.9);
        viewer.render();
        if (reduceMotion) return;

        // The largest structure redraws more slowly, so update it less often.
        const minGap = atoms.length > 4000 ? 140 : 0;
        const start = performance.now();
        let last = 0;
        const frame = (now: number) => {
          if (cancelled) return;
          const t = now - start;
          if (now - last >= minGap) {
            last = now;
            if (t < buildMs) {
              const p = {} as Record<PieceKind, number>;
              for (const k of KINDS) {
                const [a, b] = WINDOW[k];
                p[k] = ease((t / buildMs - a) / (b - a));
              }
              place(p);
              paint(p);
            } else if (t < buildMs + 60) {
              place(still);
              paint(still);
            }
            viewer.rotate(0.35, "y");
            viewer.render();
          }
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
      } catch {
        if (!cancelled) onError?.();
      }
    }
    void run();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
    // onError is intentionally not a dependency: it should not restart the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foldId, buildMs, reduceMotion]);

  // Release the WebGL context when the component goes away.
  useEffect(() => {
    const host = hostRef.current;
    const onResize = () => viewerRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      viewerRef.current?.clear();
      viewerRef.current = null;
      host?.replaceChildren();
    };
  }, []);

  return <div ref={hostRef} className={className} role="img" aria-label={label} />;
}
