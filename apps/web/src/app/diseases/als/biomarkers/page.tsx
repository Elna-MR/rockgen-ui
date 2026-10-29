import Link from "next/link";
import { AlsWorkspaceNav } from "@/components/AlsWorkspaceNav";
import { BiomarkerExplorer } from "@/components/BiomarkerExplorer";
import { getDiseaseBiomarkers, type DiseaseBiomarker } from "@/lib/api";

export default async function AlsBiomarkersPage() {
  let biomarkers: DiseaseBiomarker[] = [];
  let error: string | null = null;

  try {
    biomarkers = (await getDiseaseBiomarkers("als")).biomarkers;
  } catch (e) {
    error = e instanceof Error ? e.message : "Biomarker catalog unavailable";
  }

  return (
    <main className="page page-dossier">
      <p className="eyebrow">
        <Link href="/diseases">Research</Link> · <Link href="/diseases/als">ALS</Link> · Biomarkers
      </p>
      <header className="hub-hero" style={{ paddingBottom: "0.5rem" }}>
        <h1>ALS biomarkers</h1>
        <p className="lede">
          A biomarker answers one question well and others poorly. Pick the question, then see
          which markers fit, how strong the evidence is and where each one falls short.
        </p>
      </header>

      <AlsWorkspaceNav active="biomarkers" />

      {error ? (
        <p className="hint">Biomarker catalog is offline ({error}). Start the API and reload.</p>
      ) : (
        <>
          <p className="hint">
            Curated summaries from the knowledge graph. Citations are pending review, so treat
            evidence levels as working labels.
          </p>
          <BiomarkerExplorer biomarkers={biomarkers} />
        </>
      )}
    </main>
  );
}
