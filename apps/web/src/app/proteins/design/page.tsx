import Link from "next/link";
import { InverseFoldEnrichment } from "@/components/InverseFoldEnrichment";
import { StructureToolFrame } from "@/components/StructureToolFrame";
import { StructureWorkspaceNav } from "@/components/StructureWorkspaceNav";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function PeptideDesignPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q || "PFN1-G118V").trim();
  const src = `/reference/peptide-design.html?q=${encodeURIComponent(query)}`;

  return (
    <main className="page page-explorer page-struct-tool">
      <p className="eyebrow">
        <Link href="/diseases/als">ALS</Link> · Structures · Peptide design
      </p>
      <header className="page-header" style={{ marginBottom: "0.85rem" }}>
        <h1>Peptide design</h1>
        <p className="lede">
          Explore peptide binder ideas at a mutation site: surface accessibility, chemical
          subsites, and scored peptide hypotheses. The scores are computational estimates. No
          peptide here has been tested or shown to bind. To see whether the change itself is
          disruptive, use the{" "}
          <Link href={`/proteins/inspect?q=${encodeURIComponent(query)}`}>Mutation inspector</Link>.
        </p>
      </header>
      <StructureWorkspaceNav active="design" query={query} />
      <StructureToolFrame src={src} title="Peptide binder design" />
      <InverseFoldEnrichment />
    </main>
  );
}
