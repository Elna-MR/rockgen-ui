import Link from "next/link";
import { StructureExplorer } from "@/components/StructureExplorer";
import { getDisease, getProtein } from "@/lib/api";

type Props = { params: Promise<{ id: string }> };

export default async function ProteinStructurePage({ params }: Props) {
  const { id } = await params;
  let protein: Awaited<ReturnType<typeof getProtein>> | null = null;
  let catalog: Array<{ uniprot_id: string; symbol: string; name: string }> = [];
  let error: string | null = null;

  try {
    protein = await getProtein(id);
    const disease = await getDisease("als").catch(() => null);
    catalog =
      disease?.proteins?.map((p) => ({
        uniprot_id: p.uniprot_id,
        symbol: p.symbol,
        name: p.name,
      })) || [];
    if (protein && !catalog.some((p) => p.uniprot_id === protein!.uniprot_id)) {
      catalog = [
        { uniprot_id: protein.uniprot_id, symbol: protein.symbol, name: protein.name },
        ...catalog,
      ];
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load protein";
  }

  if (error || !protein) {
    return (
      <main className="page">
        <p className="error">{error ?? "Not found"}</p>
      </main>
    );
  }

  return (
    <main className="page page-explorer">
      <p className="eyebrow">
        <Link href="/diseases/als">ALS</Link> ·{" "}
        <Link href={`/proteins/${protein.uniprot_id}`}>{protein.symbol}</Link> · Structure explorer
      </p>
      <header className="page-header" style={{ marginBottom: "1.25rem" }}>
        <h1>Structure explorer</h1>
        <p className="lede">
          Search a protein, then move through primary → quaternary detail — sequence chemistry,
          fold cues, 3D, and assembly context.
        </p>
      </header>
      <StructureExplorer
        catalog={catalog}
        initialId={protein.uniprot_id}
        detailsById={{ [protein.uniprot_id]: protein }}
      />
    </main>
  );
}
