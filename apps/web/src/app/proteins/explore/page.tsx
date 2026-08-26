import Link from "next/link";
import { redirect } from "next/navigation";
import { StructureExplorer } from "@/components/StructureExplorer";
import { getDisease, getProtein } from "@/lib/api";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function StructureExplorePage({ searchParams }: Props) {
  const { q } = await searchParams;
  let catalog: Array<{ uniprot_id: string; symbol: string; name: string }> = [];
  let error: string | null = null;

  try {
    const disease = await getDisease("als");
    catalog = disease.proteins.map((p) => ({
      uniprot_id: p.uniprot_id,
      symbol: p.symbol,
      name: p.name,
    }));
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load protein catalog";
  }

  if (error) {
    return (
      <main className="page">
        <p className="error">{error}</p>
      </main>
    );
  }

  const needle = (q || "").trim().toLowerCase();
  if (needle) {
    const hit = catalog.find(
      (p) =>
        p.symbol.toLowerCase() === needle ||
        p.uniprot_id.toLowerCase() === needle ||
        p.name.toLowerCase().includes(needle),
    );
    if (hit) redirect(`/proteins/${hit.uniprot_id}/structure`);
  }

  const initial = catalog.find((p) => p.uniprot_id === "P07737") || catalog[0];
  if (!initial) {
    return (
      <main className="page">
        <p className="empty">No proteins in the ALS panel yet.</p>
      </main>
    );
  }

  let protein: Awaited<ReturnType<typeof getProtein>> | null = null;
  try {
    protein = await getProtein(initial.uniprot_id);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load protein";
  }

  if (error || !protein) {
    return (
      <main className="page">
        <p className="error">{error ?? "Not found"}</p>
      </main>
    );
  }

  return (
    <main className="page page-explorer">
      <p className="eyebrow">
        <Link href="/diseases/als">ALS</Link> · Structure explorer
      </p>
      <header className="page-header" style={{ marginBottom: "1.25rem" }}>
        <h1>Structure explorer</h1>
        <p className="lede">
          Search by protein name, then inspect primary chemistry through quaternary assembly —
          similar detail depth to a PDB structure explorer, inside RockGen.
        </p>
      </header>
      <StructureExplorer
        catalog={catalog}
        initialId={protein.uniprot_id}
        detailsById={{ [protein.uniprot_id]: protein }}
      />
    </main>
  );
}
