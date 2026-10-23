"use client";

import { useEffect, useState } from "react";

/** Disease folds already used on the site. Each one assembles, holds, then yields. */
const FOLDS = [
  {
    id: "pfn1",
    src: "/brand/protscope-hero-ribbon-light.png?v=plate1",
    name: "Profilin-1",
    meta: "PFN1 · actin assembly · familial ALS",
    alt: "Ribbon diagram of profilin-1 assembling. Copper ribbons are alpha helices and blue ribbons are beta sheets.",
  },
  {
    id: "sod1",
    src: "/brand/folds/fold-als-sod1-light.png?v=plate1",
    name: "Superoxide dismutase",
    meta: "SOD1 · oxidative stress · ALS",
    alt: "Ribbon diagram of superoxide dismutase assembling.",
  },
  {
    id: "snca",
    src: "/brand/folds/fold-pd-snca-light.png?v=plate1",
    name: "α-synuclein",
    meta: "SNCA · Lewy pathology · Parkinson’s",
    alt: "Ribbon diagram of alpha-synuclein assembling.",
  },
  {
    id: "mapt",
    src: "/brand/folds/fold-ad-tau-light.png?v=plate1",
    name: "Tau",
    meta: "MAPT · microtubules · Alzheimer’s",
    alt: "Ribbon diagram of tau assembling.",
  },
  {
    id: "htt",
    src: "/brand/folds/fold-hd-htt-light.png?v=plate1",
    name: "Huntingtin",
    meta: "HTT · polyglutamine · Huntington’s",
    alt: "Ribbon diagram of huntingtin assembling.",
  },
  {
    id: "tardbp",
    src: "/brand/folds/fold-ftd-tardbp-light.png?v=plate1",
    name: "TDP-43",
    meta: "TARDBP · RNA binding · FTD / ALS",
    alt: "Ribbon diagram of TDP-43 assembling.",
  },
] as const;

const BUILD_MS = 3400;
const HOLD_MS = 1800;
const CYCLE_MS = BUILD_MS + HOLD_MS;

/** Cycles central-nervous-system folds: pieces merge, the fold holds, then the next protein starts. */
export function BiologyFoldCycle() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"build" | "hold">("build");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    FOLDS.forEach((fold) => {
      const image = new Image();
      image.src = fold.src;
    });
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      const id = window.setInterval(() => {
        setIndex((current) => (current + 1) % FOLDS.length);
      }, CYCLE_MS);
      return () => window.clearInterval(id);
    }

    setPhase("build");
    const holdTimer = window.setTimeout(() => setPhase("hold"), BUILD_MS);
    const nextTimer = window.setTimeout(() => {
      setPhase("build");
      setIndex((current) => (current + 1) % FOLDS.length);
    }, CYCLE_MS);
    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(nextTimer);
    };
  }, [index, reduceMotion]);

  const fold = FOLDS[index];

  return (
    <figure className="approach-hero-visual approach-hero-visual-strong bio-fold">
      <div className={`bio-fold-stage is-${reduceMotion ? "hold" : phase}`} key={fold.id}>
        <img className="bio-fold-part is-left" src={fold.src} alt="" width={640} height={360} draggable={false} />
        <img className="bio-fold-part is-right" src={fold.src} alt="" width={640} height={360} draggable={false} />
        <img className="bio-fold-part is-core" src={fold.src} alt={fold.alt} width={640} height={360} draggable={false} />
        <p className="bio-fold-key">
          <span>
            <i className="is-helix" aria-hidden="true" /> Helix
          </span>
          <span>
            <i className="is-sheet" aria-hidden="true" /> Sheet
          </span>
        </p>
      </div>
      <figcaption aria-live="polite">
        <p className="bio-fold-status">{reduceMotion || phase === "hold" ? "Fold" : "Building"}</p>
        <p className="bio-fold-name">{fold.name}</p>
        <p className="bio-fold-meta">{fold.meta}</p>
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
