"use client";

import { useEffect, useState } from "react";
import { absoluteApiBase, apiBase } from "@/lib/apiBase";

type DynamicsSummary = {
  normal_protein_states: number;
  mutant_protein_states: number;
  disease_associated_state_detected: boolean;
  hydrophobic_exposure: string;
  aggregation_risk: string;
  actin_binding_region_stability: string;
  potential_transient_pocket: string;
  flexibility_near_g118?: string;
  hydrogen_bonding?: string;
};

type DynamicsReport = {
  title: string;
  backend: string;
  disclaimer: string;
  storage_policy: string;
  summary: DynamicsSummary;
  disease_associated_states: Array<{
    cluster_id: number;
    fraction: number;
    disease_relevance_score: number;
    representative_frame: number;
  }>;
  transient_druggable_pockets: Array<{
    cluster_id: number;
    fraction: number;
    druggability_score: number;
  }>;
  mean_features: {
    delta_mutant_minus_wt: Record<string, number>;
  };
  next_backend: string[];
};

export function DynamicsReportPanel() {
  const [report, setReport] = useState<DynamicsReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mdUrl = `${absoluteApiBase()}/v1/dynamics/pfn1/g118v?format=markdown`;

  useEffect(() => {
    void fetch(`${apiBase()}/v1/dynamics/pfn1/g118v`)
      .then((r) => {
        if (!r.ok) throw new Error(`Dynamics failed (${r.status})`);
        return r.json();
      })
      .then(setReport)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load dynamics"));
  }, []);

  return (
    <section className="section" id="dynamics">
      <h2>Protein Dynamics — PFN1 G118V</h2>
      <p className="hint">
        Frames are conformational samples over time (a movie of atomic coordinates), not a million
        screenshots. We store trajectories/features/clusters; images render only for selected
        frames.
      </p>
      {error && <p className="error">{error}</p>}
      {!report && !error && <p className="hint">Running dynamics analysis…</p>}
      {report && (
        <>
          <p className="eyebrow">
            Backend: {report.backend} ·{" "}
            <span className="hint">{report.disclaimer}</span>
          </p>
          <div className="intel-card" style={{ marginTop: "0.75rem" }}>
            <h3>{report.title}</h3>
            <ul className="gap-list">
              <li>
                <strong>Normal protein states:</strong> {report.summary.normal_protein_states}
              </li>
              <li>
                <strong>Mutant protein states:</strong> {report.summary.mutant_protein_states}
              </li>
              <li>
                <strong>Disease-associated state detected:</strong>{" "}
                {report.summary.disease_associated_state_detected ? "Yes" : "No"}
              </li>
              <li>
                <strong>Hydrophobic exposure:</strong> {report.summary.hydrophobic_exposure}
              </li>
              <li>
                <strong>Aggregation risk:</strong> {report.summary.aggregation_risk}
              </li>
              <li>
                <strong>Actin-binding region stability:</strong>{" "}
                {report.summary.actin_binding_region_stability}
              </li>
              <li>
                <strong>Potential transient pocket:</strong>{" "}
                {report.summary.potential_transient_pocket}
              </li>
              {report.summary.flexibility_near_g118 && (
                <li>
                  <strong>Flexibility near G118:</strong> {report.summary.flexibility_near_g118}
                </li>
              )}
              {report.summary.hydrogen_bonding && (
                <li>
                  <strong>Hydrogen bonding:</strong> {report.summary.hydrogen_bonding}
                </li>
              )}
            </ul>
          </div>

          <h3 style={{ marginTop: "1.25rem" }}>Disease-associated mutant clusters</h3>
          <ul className="gap-list">
            {report.disease_associated_states.map((s) => (
              <li key={s.cluster_id}>
                Cluster {s.cluster_id}: fraction {s.fraction}, disease score{" "}
                {s.disease_relevance_score}, representative frame {s.representative_frame}
              </li>
            ))}
            {report.disease_associated_states.length === 0 && (
              <li className="hint">None above threshold</li>
            )}
          </ul>

          <h3>Transient druggable pockets</h3>
          <ul className="gap-list">
            {report.transient_druggable_pockets.map((p) => (
              <li key={p.cluster_id}>
                Cluster {p.cluster_id}: druggability {p.druggability_score}, fraction {p.fraction}
              </li>
            ))}
            {report.transient_druggable_pockets.length === 0 && (
              <li className="hint">None detected</li>
            )}
          </ul>

          <h3>Feature deltas (mutant − WT)</h3>
          <div className="table-scroll">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Δ</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(report.mean_features.delta_mutant_minus_wt).map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">
                      <code>{k}</code>
                    </th>
                    <td>{v > 0 ? `+${v}` : v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="hint" style={{ marginTop: "1rem" }}>
            {report.storage_policy}
          </p>
          <h4>Next backend milestones</h4>
          <ul className="gap-list">
            {report.next_backend.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <div className="cta-row" style={{ marginTop: "1rem" }}>
            <a className="btn btn-primary" href={mdUrl}>
              Download Dynamics Report
            </a>
          </div>
        </>
      )}
    </section>
  );
}
