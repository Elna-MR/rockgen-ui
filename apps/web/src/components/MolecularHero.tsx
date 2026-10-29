"use client";

import { useEffect, useState } from "react";
import { FoldAssembly } from "@/components/FoldAssembly";
import { FOLD_STRUCTURES } from "@/data/foldStructures";

const BUILD_MS = 3600;
const HOLD_MS = 2400;
const STAGE_MS = BUILD_MS + HOLD_MS;

/**
 * Hero cycles disease proteins from ProtScope Learn / Research. Each is a real 3D structure whose
 * helices, sheets and loops arrive as three pieces and combine, then holds and rotates.
 */
export function MolecularHero() {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % FOLD_STRUCTURES.length);
    }, STAGE_MS);
    return () => window.clearInterval(id);
  }, []);

  const fold = FOLD_STRUCTURES[index];

  return (
    <div
      className={`mol-hero mol-hero-light mol-hero-stage-${fold.id}`}
      style={{ ["--mol-cycle" as string]: `${STAGE_MS * FOLD_STRUCTURES.length}ms` }}
    >
      <div className="mol-hero-plate" />
      <div className="mol-hero-stage">
        <FoldAssembly
          foldId={fold.id}
          buildMs={BUILD_MS}
          reduceMotion={reduceMotion}
          className="mol-hero-canvas"
          label={`${fold.name}: 3D ribbon diagram. ${fold.source}`}
        />
      </div>
      <div className="mol-hero-meta">
        <span className="mol-hero-protein">
          {fold.meta.split(" · ")[0]} · {fold.name}
        </span>
        <span className="mol-hero-phase">{fold.heroCaption}</span>
        <span className="mol-hero-source">{fold.source}</span>
      </div>
    </div>
  );
}
