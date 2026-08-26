import Link from "next/link";
import { StructureExplorer } from "@/components/StructureExplorer";
import { getDisease } from "@/lib/api";

export default async function StructureExplorePage() {
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
        <Link href="/diseases/als">ALS</Link> · Structure explorer
      </p>
      <header className="page-header" style={{ marginBottom: "1.25rem" }}>
        <h1>Structure explorer</h1>
        <p className="lede">
          Search the PDB by protein name — ranked structures, chain chemistry, sequence, and a live 3D
          fold (same information pattern as a classic PDB structure explorer).
        </p>
      </header>
      <StructureExplorer catalog={catalog} initialQuery="profilin-1" />
    </main>
  );
}
