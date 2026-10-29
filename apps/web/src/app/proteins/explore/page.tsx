import Link from "next/link";
import { InverseFoldEnrichment } from "@/components/InverseFoldEnrichment";
import { StructureExplorer } from "@/components/StructureExplorer";

type Props = { searchParams: Promise<{ q?: string }> };

/** Local ALS panel, avoids blocking Structures on a down Neo4j/API catalog. */
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
          A protein&rsquo;s job depends on its 3D shape, and that shape is built level by level. See
          each level in real, experimentally solved structures, and see where an ALS-linked change
          sits.
        </p>
        <ol className="structures-steps">
          <li>
            <strong>Pick a protein</strong>
            <span>Start with PFN1-G118V below, or search a gene, protein name or PDB id.</span>
          </li>
          <li>
            <strong>Read it level by level</strong>
            <span>Follow the four levels: sequence, local shapes, 3D fold and assembly.</span>
          </li>
          <li>
            <strong>See where the change sits</strong>
            <span>Check the residue in 3D, then open the mutation inspector if you want more.</span>
          </li>
        </ol>
      </header>
      <StructureExplorer catalog={ALS_CATALOG} initialQuery={initialQuery} />
      <section className="structures-limits" aria-labelledby="structures-limits-heading">
        <h2 id="structures-limits-heading">Good to know</h2>
        <ul>
          <li>Known ALS genes return the human protein. Other searches can return other species.</li>
          <li>Residue numbers follow UniProt. The page warns if the PDB entry numbers differently.</li>
          <li>Shape only: this does not say whether a change causes disease.</li>
        </ul>
      </section>
      <InverseFoldEnrichment />
    </main>
  );
}
