import Link from "next/link";
import { StructureToolFrame } from "@/components/StructureToolFrame";
import { StructureWorkspaceNav } from "@/components/StructureWorkspaceNav";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function MutationInspectPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q || "PFN1-G118V").trim();
  const src = `/reference/mutation-inspector.html?q=${encodeURIComponent(query)}`;

  return (
    <main className="page page-explorer page-struct-tool">
      <p className="eyebrow">
        <Link href="/diseases/als">ALS</Link> · Structures · Mutation inspector
      </p>
      <header className="page-header" style={{ marginBottom: "0.85rem" }}>
        <h1>Mutation inspector</h1>
        <p className="lede">
          Check the wild-type letter against UniProt, map the site onto a crystal structure, then
          measure burial, packing neighbours, and local clashes — the Substitution tool from your
          HTML pack, inside RockGen.
        </p>
      </header>
      <StructureWorkspaceNav active="inspect" query={query} />
      <StructureToolFrame src={src} title="Point mutation inspector" />
    </main>
  );
}
