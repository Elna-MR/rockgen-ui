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
        <h2 id="structures-limits-heading">What this page can and cannot tell you</h2>
        <ul>
          <li>
            <strong>Known ALS genes</strong> (PFN1, TUBA4A, SOD1, FUS, TARDBP) search by UniProt
            accession, so every result is the human protein. Other searches are free text and can
            return other species.
          </li>
          <li>
            <strong>Resolution</strong> shows how finely a structure was measured. Lower is better.
            NMR models have no resolution value.
          </li>
          <li>
            <strong>The site check uses sequence only.</strong> It estimates whether a residue sits
            in a polar or hydrophobic neighbourhood. It does not measure burial or predict whether
            a mutation causes disease. Confirm in 3D.
          </li>
          <li>
            <strong>Numbering</strong> follows UniProt. A PDB entry can number residues
            differently, so the page warns when the residue or protein does not match.
          </li>
          <li>
            <strong>Coming:</strong>{" "}
            <a
              href="https://github.com/microsoft/bioemu2"
              target="_blank"
              rel="noopener noreferrer"
            >
              BioEmu2
            </a>{" "}
            ensembles for fold and motion, explained by Helix in{" "}
            <Link href="/agentics">Lumen</Link>. Not live yet.
          </li>
        </ul>
      </section>
      <InverseFoldEnrichment />
    </main>
  );
}
