import Link from "next/link";
import { AlsDiseaseMap } from "@/components/AlsDiseaseMap";
import { getDiseaseMechanismMap, getDiseaseMechanismMatrix } from "@/lib/api";

export default async function AlsMapPage() {
  const [map, matrix] = await Promise.all([
    getDiseaseMechanismMap("als"),
    getDiseaseMechanismMatrix("als"),
  ]);

  return (
    <main className="page page-dossier">
      <p className="eyebrow">
        <Link href="/diseases/als">ALS</Link> · Disease map
      </p>
      <header className="hub-hero" style={{ paddingBottom: "0.5rem" }}>
        <h1>ALS by biology</h1>
        <p className="lede">Browse proteins through disease axes — not gene lists alone.</p>
      </header>
      <AlsDiseaseMap map={map} matrix={matrix} />
    </main>
  );
}
