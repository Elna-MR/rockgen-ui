"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PFN1_ANNOTATIONS } from "@/data/pfn1Dossier";

type Props = {
  sequence: string;
};

const STRENGTH_CLASS: Record<string, string> = {
  high: "mut-high",
  moderate: "mut-mod",
  low: "mut-low",
};

export function SequenceViewer({ sequence }: Props) {
  const [selected, setSelected] = useState<string | null>("G118V");

  const byPos = useMemo(() => {
    const map = new Map<number, (typeof PFN1_ANNOTATIONS.knownMutations)[number]>();
    for (const m of PFN1_ANNOTATIONS.knownMutations) map.set(m.position, m);
    return map;
  }, []);

  if (!sequence) {
    return <p className="empty">Sequence not loaded — run make ingest-pfn1</p>;
  }

  const chunks: string[] = [];
  for (let i = 0; i < sequence.length; i += 50) {
    chunks.push(sequence.slice(i, i + 50));
  }

  function classForPos(pos1: number) {
    const mut = byPos.get(pos1);
    if (mut) {
      const active = selected === mut.label ? " mut-selected" : "";
      return `aa mut ${STRENGTH_CLASS[mut.evidenceStrength] || "mut-low"}${active}`;
    }
    for (const region of PFN1_ANNOTATIONS.regions) {
      for (const [a, b] of region.ranges) {
        if (pos1 >= a && pos1 <= b) return `aa region-${region.id}`;
      }
    }
    return "aa";
  }

  const selectedMut = PFN1_ANNOTATIONS.knownMutations.find((m) => m.label === selected);

  return (
    <div className="seq-viewer">
      <p className="hint">
        Mutation map · color by evidence strength · actin/PLP regions tinted · click a mutant to
        open review
      </p>
      <div className="viewer-legend" style={{ marginBottom: "0.75rem" }}>
        <span>
          <i style={{ background: "#ff4d4f" }} /> High evidence
        </span>
        <span>
          <i style={{ background: "#f0b429" }} /> Moderate
        </span>
        <span>
          <i style={{ background: "#9bb4bc" }} /> Low / catalog-only
        </span>
        <span>
          <i style={{ background: "#6aa09b" }} /> Actin-binding
        </span>
        <span>
          <i style={{ background: "#5b8def" }} /> PLP-binding
        </span>
      </div>
      {chunks.map((chunk, idx) => {
        const start = idx * 50 + 1;
        return (
          <div key={start} className="seq-row">
            <span className="seq-num">{start}</span>
            <span className="seq-aas">
              {chunk.split("").map((aa, i) => {
                const pos = start + i;
                const mut = byPos.get(pos);
                return (
                  <button
                    key={pos}
                    type="button"
                    className={classForPos(pos)}
                    title={mut ? `${mut.label} · ${mut.evidenceStrength}` : `${aa}${pos}`}
                    onClick={() => {
                      if (mut) setSelected(mut.label);
                    }}
                  >
                    {aa}
                  </button>
                );
              })}
            </span>
          </div>
        );
      })}
      {selectedMut && (
        <p className="seq-callout">
          Selected: <strong>{selectedMut.label}</strong> (position {selectedMut.position},{" "}
          {selectedMut.bindingRegion} context, {selectedMut.evidenceStrength} evidence) ·{" "}
          <Link href={`/proteins/P07737/compare#${selectedMut.key.replace(":", "-")}`}>
            Open mutation review
          </Link>
        </p>
      )}
    </div>
  );
}
