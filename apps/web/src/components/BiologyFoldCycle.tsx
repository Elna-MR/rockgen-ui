"use client";

import { useEffect, useState } from "react";
import { FoldAssembly } from "@/components/FoldAssembly";
import { FOLD_STRUCTURES } from "@/data/foldStructures";

const BUILD_MS = 3600;
const HOLD_MS = 2400;
const CYCLE_MS = BUILD_MS + HOLD_MS;

/** Cycles central-nervous-system protein folds: pieces merge by type, the fold holds, then the next starts. */
export function BiologyFoldCycle() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"build" | "hold">("build");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Which protein is on screen, and when it moves from building to holding.
  useEffect(() => {
    if (reduceMotion) {
      setPhase("hold");
      const id = window.setInterval(() => setIndex((i) => (i + 1) % FOLD_STRUCTURES.length), CYCLE_MS);
      return () => window.clearInterval(id);
    }
    setPhase("build");
    const holdTimer = window.setTimeout(() => setPhase("hold"), BUILD_MS);
    const nextTimer = window.setTimeout(
      () => setIndex((i) => (i + 1) % FOLD_STRUCTURES.length),
      CYCLE_MS,
    );
    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(nextTimer);
    };
  }, [index, reduceMotion]);

  const fold = FOLD_STRUCTURES[index];
  const status = reduceMotion || phase === "hold" ? "Fold" : "Building";

  return (
    <figure className="approach-hero-visual approach-hero-visual-strong bio-fold">
      <div className={`bio-fold-stage is-${reduceMotion ? "hold" : phase}`}>
        <FoldAssembly
          foldId={fold.id}
          buildMs={BUILD_MS}
          reduceMotion={reduceMotion}
          className="bio-fold-canvas"
          label={`${fold.name}: 3D ribbon diagram from ${fold.source}. Helices, sheets and loops assemble into the fold.`}
          onError={() => setFailed(true)}
        />
        {failed && <p className="hint">The 3D view could not load on this device.</p>}
        <p className="bio-fold-key">
          <span>
            <i className="is-helix" aria-hidden="true" /> Helix
          </span>
          <span>
            <i className="is-sheet" aria-hidden="true" /> Sheet
          </span>
          <span>
            <i className="is-loop" aria-hidden="true" /> Coil / loop
          </span>
        </p>
      </div>
      <figcaption aria-live="polite">
        <p className="bio-fold-status">{status}</p>
        <p className="bio-fold-name">{fold.name}</p>
        <p className="bio-fold-meta">{fold.meta}</p>
        <p className="bio-fold-source">{fold.source}</p>
        <span
          className="bio-fold-meter"
          key={`${fold.id}-meter`}
          style={{ animationDuration: `${CYCLE_MS}ms` }}
          aria-hidden="true"
        />
      </figcaption>
    </figure>
  );
}
