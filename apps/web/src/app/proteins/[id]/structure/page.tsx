import Link from "next/link";
import { StructureExplorer } from "@/components/StructureExplorer";

type Props = { params: Promise<{ id: string }> };

const ALS_CATALOG = [
  { uniprot_id: "P07737", symbol: "PFN1", name: "Profilin-1" },
  { uniprot_id: "P68366", symbol: "TUBA4A", name: "Tubulin alpha-4A chain" },
  { uniprot_id: "P00441", symbol: "SOD1", name: "Superoxide dismutase [Cu-Zn]" },
  { uniprot_id: "P35637", symbol: "FUS", name: "RNA-binding protein FUS" },
  { uniprot_id: "Q13148", symbol: "TARDBP", name: "TAR DNA-binding protein 43" },
];

export default async function ProteinStructurePage({ params }: Props) {
  const { id } = await params;
  const upper = id.toUpperCase();
  const hit = ALS_CATALOG.find((p) => p.uniprot_id === upper || p.symbol === upper);
  const initialQuery =
    hit?.symbol === "PFN1" || upper === "P07737"
      ? "PFN1-G118V"
      : hit?.name || hit?.symbol || "profilin-1";
  const catalog = hit
    ? [hit, ...ALS_CATALOG.filter((p) => p.uniprot_id !== hit.uniprot_id)]
    : ALS_CATALOG;

  return (
    <main className="page page-explorer">
      <p className="eyebrow">
        <Link href="/diseases/als">ALS</Link> ·{" "}
        <Link href={`/proteins/${id}`}>{hit?.symbol || id}</Link> · Structures
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
