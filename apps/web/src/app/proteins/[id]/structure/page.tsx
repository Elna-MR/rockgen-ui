import Link from "next/link";
import { StructureExplorer } from "@/components/StructureExplorer";
import { getDisease, getProtein } from "@/lib/api";

type Props = { params: Promise<{ id: string }> };

const FALLBACK_CATALOG = [
  { uniprot_id: "P07737", symbol: "PFN1", name: "Profilin-1" },
  { uniprot_id: "P68366", symbol: "TUBA4A", name: "Tubulin alpha-4A chain" },
];

export default async function ProteinStructurePage({ params }: Props) {
  const { id } = await params;
  let catalog = FALLBACK_CATALOG;
  let initialQuery = id.toUpperCase() === "P07737" ? "PFN1-G118V" : "profilin-1";
  let apiWarning: string | null = null;

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
      })) || FALLBACK_CATALOG;
    if (!catalog.some((p) => p.uniprot_id === protein.uniprot_id)) {
      catalog = [
        { uniprot_id: protein.uniprot_id, symbol: protein.symbol, name: protein.name },
        ...catalog,
      ];
    }
  } catch (e) {
    apiWarning = e instanceof Error ? e.message : "Protein API unavailable";
    if (id.toUpperCase() === "P07737") initialQuery = "PFN1-G118V";
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
      {apiWarning && (
        <p className="hint" style={{ marginBottom: "0.85rem" }}>
          Live protein API temporarily unavailable — PDB search still works. ({apiWarning})
        </p>
      )}
      <StructureExplorer catalog={catalog} initialQuery={initialQuery} />
    </main>
  );
}
