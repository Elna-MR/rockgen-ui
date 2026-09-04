import Link from "next/link";
import { StructureExplorer } from "@/components/StructureExplorer";
import { getDisease } from "@/lib/api";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function StructureExplorePage({ searchParams }: Props) {
  const { q } = await searchParams;
  const initialQuery = (q || "PFN1-G118V").trim();
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

  if (error && catalog.length === 0) {
    return (
      <main className="page">
        <p className="error">{error}</p>
      </main>
    );
  }

  return (
    <main className="page page-explorer">
      <p className="eyebrow">
        <Link href="/diseases/als">ALS</Link> · Structures
      </p>
      <header className="page-header" style={{ marginBottom: "0.85rem" }}>
        <h1>Structure explorer</h1>
        <p className="lede">
          Search by protein, PDB id, or ALS mutation. From here you can inspect the substitution in
          3D chemistry, or jump to peptide binder design at the same site.
        </p>
      </header>
      <StructureExplorer catalog={catalog} initialQuery={initialQuery} />
    </main>
  );
}
