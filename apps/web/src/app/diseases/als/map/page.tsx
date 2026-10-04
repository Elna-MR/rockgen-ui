import Link from "next/link";
import { AlsDiseaseMap } from "@/components/AlsDiseaseMap";
import { AlsWorkspaceNav } from "@/components/AlsWorkspaceNav";
import {
  ALS_MECHANISM_MAP_FALLBACK,
  ALS_MECHANISM_MATRIX_FALLBACK,
} from "@/data/alsMechanismFallback";
import { getDiseaseMechanismMap, getDiseaseMechanismMatrix } from "@/lib/api";

export default async function AlsMapPage() {
  let map = ALS_MECHANISM_MAP_FALLBACK;
  let matrix = ALS_MECHANISM_MATRIX_FALLBACK;
  let offline = false;

  try {
    const [liveMap, liveMatrix] = await Promise.all([
      getDiseaseMechanismMap("als"),
      getDiseaseMechanismMatrix("als"),
    ]);
    map = liveMap;
    matrix = liveMatrix;
  } catch {
    offline = true;
  }

  return (
    <main className="page page-dossier">
      <p className="eyebrow">
        <Link href="/diseases">Research</Link> · <Link href="/diseases/als">ALS</Link> · Disease map
      </p>
      <header className="hub-hero" style={{ paddingBottom: "0.5rem" }}>
        <h1>ALS by biology</h1>
        <p className="lede">Browse proteins through disease axes, not gene lists alone.</p>
        {offline && (
          <p className="hint" style={{ marginTop: "0.5rem" }}>
            Showing curated offline map. Live graph API is not connected.
          </p>
        )}
      </header>
      <AlsWorkspaceNav active="map" />
      <AlsDiseaseMap map={map} matrix={matrix} />
    </main>
  );
}
