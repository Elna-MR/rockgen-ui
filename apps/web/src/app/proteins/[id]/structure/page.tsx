import Link from "next/link";
import { StructureExplorer } from "@/components/StructureExplorer";
import { getDisease, getProtein } from "@/lib/api";

type Props = { params: Promise<{ id: string }> };

export default async function ProteinStructurePage({ params }: Props) {
  const { id } = await params;
  let catalog: Array<{ uniprot_id: string; symbol: string; name: string }> = [];
  let initialQuery = "profilin-1";
  let error: string | null = null;

  try {
    const protein = await getProtein(id);
    initialQuery =
      protein.symbol === "PFN1" ? "PFN1-G118V" : protein.name || protein.symbol;
    const disease = await getDisease("als").catch(() => null);
    catalog =
      disease?.proteins?.map((p) => ({
        uniprot_id: p.uniprot_id,
        symbol: p.symbol,
        name: p.name,
      })) || [];
    if (!catalog.some((p) => p.uniprot_id === protein.uniprot_id)) {
      catalog = [
        { uniprot_id: protein.uniprot_id, symbol: protein.symbol, name: protein.name },
        ...catalog,
      ];
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load protein";
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
        <Link href="/diseases/als">ALS</Link> ·{" "}
        <Link href={`/proteins/${id}`}>{id}</Link> · Structures
      </p>
      <header className="page-header" style={{ marginBottom: "0.85rem" }}>
        <h1>Structure explorer</h1>
        <p className="lede">
          PDB search seeded from this protein — inspect primary→quaternary detail, then open the
          mutation inspector or peptide design tools for the same site.
        </p>
      </header>
      <StructureExplorer catalog={catalog} initialQuery={initialQuery} />
    </main>
  );
}
