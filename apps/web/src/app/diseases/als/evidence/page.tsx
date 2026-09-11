import Link from "next/link";
import { AlsWorkspaceNav } from "@/components/AlsWorkspaceNav";
import { BiomarkerIntelligenceSection } from "@/components/BiomarkerIntelligence";
import { MutationBiomarkerMap } from "@/components/MutationBiomarkerMap";
import { MutationIntelligenceSection } from "@/components/MutationIntelligence";
import { getDiseaseIntelligence, type MutationIntelCard } from "@/lib/api";

export default async function AlsEvidencePage() {
  let mutations: MutationIntelCard[] = [];
  let error: string | null = null;
  let gaps: string[] = [];

  try {
    const intel = await getDiseaseIntelligence("als");
    mutations = intel.focus_proteins
      .flatMap((p) => p.mutations)
      .filter((m) => (m.statements?.length ?? 0) > 0 || (m.confidence_score ?? 0) > 0);
    gaps = intel.gaps || [];
  } catch (e) {
    error = e instanceof Error ? e.message : "Disease Intelligence Engine unavailable";
  }

  return (
    <main className="page page-dossier">
      <p className="eyebrow">
        <Link href="/diseases">Research</Link> · <Link href="/diseases/als">ALS</Link> · Evidence
      </p>
      <header className="hub-hero" style={{ paddingBottom: "0.5rem" }}>
        <h1>Mutations &amp; biomarkers</h1>
        <p className="lede">
          Mutation cards answer “what drives mechanism?” Biomarkers answer “how do we measure?” —
          both should come from the knowledge graph.
        </p>
      </header>

      <AlsWorkspaceNav active="evidence" />

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <MutationIntelligenceSection
          mutations={mutations}
          sourceNote="Source: GET /v1/intelligence/diseases/als (Disease Intelligence Engine)."
        />
      )}

      <BiomarkerIntelligenceSection />
      <MutationBiomarkerMap />

      {gaps.length > 0 && (
        <section className="section">
          <h2>Graph-reported gaps</h2>
          <ul className="gap-list">
            {gaps.slice(0, 8).map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
