"use client";

import { useEffect, useState } from "react";
import { apiBase } from "@/lib/apiBase";

type ReviewBrief = {
  conclusion: string;
  confidence: number;
  confidence_label: string;
  evidence_mix: Record<string, number>;
  summary: string;
  confidence_breakdown: Array<{ label: string; points: number }>;
  gaps: Array<{ text: string }>;
};

export function ReviewHeroCard() {
  const [review, setReview] = useState<ReviewBrief | null>(null);
  const [showWhy, setShowWhy] = useState(false);

  useEffect(() => {
    void fetch(`${apiBase()}/v1/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "Does G118V increase aggregation?" }),
    })
      .then((r) => r.json())
      .then(setReview)
      .catch(() => setReview(null));
  }, []);

  const mix = review?.evidence_mix || {};
  const max = Math.max(1, ...Object.values(mix));

  return (
    <div className="review-hero-card">
      <p className="eyebrow">Scientific review · aggregation claim</p>
      {!review ? (
        <p className="hint">Loading review…</p>
      ) : (
        <>
          <h2>
            {review.conclusion === "Yes"
              ? "G118V increases PFN1 aggregation"
              : review.conclusion}
          </h2>
          <p className="confidence-score">
            Confidence {review.confidence} — {review.confidence_label}
          </p>
          <p className="lede">{review.summary}</p>

          <h3>Evidence mix</h3>
          <div className="mix-bars">
            {(
              [
                ["computational", "Computational"],
                ["in_vitro", "In vitro"],
                ["animal", "Animal"],
                ["human_genetic", "Human"],
                ["clinical", "Clinical"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="mix-bar-row">
                <span>{label}</span>
                <div className="mix-bar-track">
                  <div
                    className="mix-bar-fill"
                    style={{ width: `${((mix[key] || 0) / max) * 100}%` }}
                  />
                </div>
                <span>{mix[key] || 0}</span>
              </div>
            ))}
          </div>

          <button type="button" className="chip" onClick={() => setShowWhy((v) => !v)}>
            {showWhy ? "Hide calculation" : "Why this score"}
          </button>
          {showWhy && (
            <ul className="list-plain calc-list">
              {(review.confidence_breakdown || []).map((b, i) => (
                <li key={i}>
                  {b.label}: {b.points > 0 ? `+${b.points}` : b.points}
                </li>
              ))}
            </ul>
          )}

          <h3>Limitations</h3>
          <ul className="list-plain">
            {(review.gaps || []).slice(0, 3).map((g, i) => (
              <li key={i}>{g.text}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
