"use client";

import { useEffect, useState } from "react";

/**
 * Hero cycles disease proteins from ProtScope Learn / Research.
 * Original fold colors on a soft disc so ribbons stay visible on the light page.
 */
const STAGES = [
  {
    id: "pfn1",
    src: "/brand/protscope-hero-ribbon-light.png",
    protein: "PFN1 · profilin-1",
    caption: "ALS · actin dynamics",
  },
  {
    id: "sod1",
    src: "/brand/folds/fold-als-sod1-light.png",
    protein: "SOD1 · superoxide dismutase",
    caption: "ALS · oxidative stress",
  },
  {
    id: "snca",
    src: "/brand/folds/fold-pd-snca-light.png",
    protein: "SNCA · α-synuclein",
    caption: "Parkinson’s · Lewy pathology",
  },
  {
    id: "mapt",
    src: "/brand/folds/fold-ad-tau-light.png",
    protein: "MAPT · tau",
    caption: "Alzheimer’s · microtubule binding",
  },
  {
    id: "htt",
    src: "/brand/folds/fold-hd-htt-light.png",
    protein: "HTT · huntingtin",
    caption: "Huntington’s · polyglutamine",
  },
  {
    id: "tardbp",
    src: "/brand/folds/fold-ftd-tardbp-light.png",
    protein: "TARDBP · TDP-43",
    caption: "FTD / ALS · RNA binding",
  },
] as const;

const STAGE_MS = 3400;
const CYCLE_MS = STAGE_MS * STAGES.length;

/** Cycles disease-linked protein folds with soft crossfade. */
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
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % STAGES.length);
    }, STAGE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    STAGES.forEach((stage) => {
      const img = new Image();
      img.src = `${stage.src}?v=plate1`;
    });
  }, []);

  const stage = STAGES[index];

  return (
    <div
      className={`mol-hero mol-hero-light mol-hero-stage-${stage.id}`}
      aria-hidden="true"
      style={{ ["--mol-cycle" as string]: `${CYCLE_MS}ms` }}
    >
      {/* Soft disc gives the fold a mid-tone stage so light ribbons stay readable */}
      <div className="mol-hero-plate" />
      <div className="mol-hero-stage">
        {STAGES.map((s, i) => (
          <img
            key={s.id}
            className={`mol-hero-img mol-hero-img-${s.id}${i === index ? " is-active" : ""}`}
            src={`${s.src}?v=plate1`}
            alt=""
            draggable={false}
          />
        ))}
      </div>
      <div className="mol-hero-meta">
        <span className="mol-hero-protein">{stage.protein}</span>
        <span className="mol-hero-phase">{stage.caption}</span>
      </div>
    </div>
  );
}
