import Link from "next/link";
import { listDiseases } from "@/lib/api";

export default async function DiseasesPage() {
  let diseases: Awaited<ReturnType<typeof listDiseases>> = [];
  let error: string | null = null;
  try {
    diseases = await listDiseases();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load diseases";
  }

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Programs</p>
        <h1>Disease workspaces</h1>
        <p className="lede">
          Every disease program gets a home: genes, proteins, mutations,
          biomarkers, trials, and publications in one graph-backed view.
        </p>
      </header>

      {error ? (
        <p className="error">{error}. Is the API running on :8000?</p>
      ) : (
        <section className="section">
          <div className="grid">
            {diseases.map((d) => (
              <Link key={d.slug} href={`/diseases/${d.slug}`} className="item">
                <strong>{d.name}</strong>
                <span>
                  {d.protein_count ?? 0} protein
                  {(d.protein_count ?? 0) === 1 ? "" : "s"} · {d.slug}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
