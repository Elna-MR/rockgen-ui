import Link from "next/link";
import { StructureExplorer } from "@/components/StructureExplorer";
import { getDisease } from "@/lib/api";

type Props = { searchParams: Promise<{ q?: string }> };

const FALLBACK_CATALOG = [
  { uniprot_id: "P07737", symbol: "PFN1", name: "Profilin-1" },
  { uniprot_id: "P68366", symbol: "TUBA4A", name: "Tubulin alpha-4A chain" },
];

export default async function StructureExplorePage({ searchParams }: Props) {
  const { q } = await searchParams;
  const initialQuery = (q || "PFN1-G118V").trim();
  let catalog = FALLBACK_CATALOG;
  let apiWarning: string | null = null;

  try {
    const disease = await getDisease("als");
    if (disease.proteins?.length) {
      catalog = disease.proteins.map((p) => ({
        uniprot_id: p.uniprot_id,
        symbol: p.symbol,
        name: p.name,
      }));
    }
  } catch (e) {
    apiWarning = e instanceof Error ? e.message : "ALS catalog unavailable";
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
      {apiWarning && (
        <p className="hint" style={{ marginBottom: "0.85rem" }}>
          Live ALS catalog temporarily unavailable — PDB search still works. ({apiWarning})
        </p>
      )}
      <StructureExplorer catalog={catalog} initialQuery={initialQuery} />
    </main>
  );
}
