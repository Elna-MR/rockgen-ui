import Link from "next/link";
import { StructureExplorer } from "@/components/StructureExplorer";

type Props = { searchParams: Promise<{ q?: string }> };

/** Local ALS panel — avoids blocking Structures on a down Neo4j/API catalog. */
const ALS_CATALOG = [
  { uniprot_id: "P07737", symbol: "PFN1", name: "Profilin-1" },
  { uniprot_id: "P68366", symbol: "TUBA4A", name: "Tubulin alpha-4A chain" },
  { uniprot_id: "P00441", symbol: "SOD1", name: "Superoxide dismutase [Cu-Zn]" },
  { uniprot_id: "P35637", symbol: "FUS", name: "RNA-binding protein FUS" },
  { uniprot_id: "Q13148", symbol: "TARDBP", name: "TAR DNA-binding protein 43" },
];

export default async function StructureExplorePage({ searchParams }: Props) {
  const { q } = await searchParams;
  const initialQuery = (q || "PFN1-G118V").trim();

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
      <StructureExplorer catalog={ALS_CATALOG} initialQuery={initialQuery} />
    </main>
  );
}
