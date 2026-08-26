import Link from "next/link";
import { AskPanel } from "@/components/AskPanel";
import { CausalPathway } from "@/components/CausalPathway";
import { ComparisonPanel } from "@/components/ComparisonPanel";
import { EvidenceTimeline } from "@/components/EvidenceTimeline";
import { ExperimentCards, ResearchGaps } from "@/components/ResearchGaps";
import { ReviewHeroCard } from "@/components/ReviewHeroCard";
import { SequenceViewer } from "@/components/SequenceViewer";
import { getMutationPath, getProtein, getProteinEvidence } from "@/lib/api";

type Props = { params: Promise<{ id: string }> };

export default async function ProteinDossierPage({ params }: Props) {
  const { id } = await params;
  let protein: Awaited<ReturnType<typeof getProtein>> | null = null;
  let evidence: Awaited<ReturnType<typeof getProteinEvidence>> | null = null;
  let error: string | null = null;

  try {
    protein = await getProtein(id);
    evidence = await getProteinEvidence(id);
    const preferred =
      protein.mutations.find((m) => m.key?.includes("G118V") || m.key?.includes("R320C")) ||
      protein.mutations[0];
    if (preferred?.key) await getMutationPath(preferred.key);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load";
  }

  if (error || !protein) {
    return (
      <main className="page">
        <p className="error">{error ?? "Not found"}</p>
      </main>
    );
  }

  const isPfn1 = protein.uniprot_id === "P07737";

  return (
    <main className="page page-dossier">
      <p className="eyebrow">
        <Link href={`/proteins/${id}`}>{protein.symbol}</Link> · Evidence dossier
      </p>
      <header className="dossier-header">
        <div>
          <h1>{protein.symbol} evidence</h1>
          <p className="lede">Detailed panels — use overview + workspace links when you need less.</p>
        </div>
        <Link className="btn btn-ghost" href={`/proteins/${id}`}>
          ← Quiet overview
        </Link>
      </header>

      {isPfn1 ? (
        <>
          <ReviewHeroCard />
          <ComparisonPanel />
          <CausalPathway evidence={evidence} />
          <EvidenceTimeline />
          <ResearchGaps />
          <ExperimentCards />
          <section className="section">
            <h2>Sequence</h2>
            <SequenceViewer sequence={protein.sequence || ""} />
          </section>
          <AskPanel />
        </>
      ) : (
        <>
          <section className="section">
            <h2>Mutations</h2>
            <div className="grid">
              {protein.mutations.map((m) => (
                <div key={m.key} className="item">
                  <strong>{m.hgvs_p || m.key}</strong>
                  <span>{m.significance}</span>
                </div>
              ))}
            </div>
          </section>
          <AskPanel />
        </>
      )}
    </main>
  );
}
