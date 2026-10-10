"use client";

import { useEffect, useState } from "react";

const FOLDS = [
  "/brand/protscope-hero-mineral.jpg",
  "/brand/protscope-hero-fold-b.jpg",
  "/brand/protscope-hero-fold-c.jpg",
  "/brand/protscope-hero-ribbon.jpg",
] as const;

const INTERVAL_MS = 5200;

/** Cycles distinct protein folds every few seconds, with soft crossfade + motion. */
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
      setIndex((i) => (i + 1) % FOLDS.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  // Prefetch next fold
  useEffect(() => {
    FOLDS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="mol-hero" aria-hidden="true">
      <div className="mol-hero-glow" />
      <div className="mol-hero-stage">
        {FOLDS.map((src, i) => (
          <img
            key={src}
            className={`mol-hero-img${i === index ? " is-active" : ""}`}
            src={src}
            alt=""
            draggable={false}
          />
        ))}
      </div>
      <div className="mol-hero-sheen" />
    </div>
  );
}
