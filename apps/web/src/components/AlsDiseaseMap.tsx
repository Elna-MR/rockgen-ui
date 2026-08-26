import Link from "next/link";
import type { DiseaseMechanismMap, MechanismMatrix } from "@/lib/api";

type Props = {
  map: DiseaseMechanismMap;
  matrix: MechanismMatrix;
};

/** Panel-wide disease map + matrix (after PFN1–TUBA4A prioritization). */
export function AlsDiseaseMap({ map, matrix }: Props) {
  return (
    <>
      <section className="section" id="disease-map">
        <h2>{map.title}</h2>
        <p className="hint">{map.panel_note}</p>
        <div className="axis-grid">
          {map.axes.map((ax) => (
            <article key={ax.id} className="intel-card axis-card" id={`axis-${ax.id}`}>
              <h3>{ax.name}</h3>
              <ul className="axis-proteins">
                {ax.proteins.map((p) => (
                  <li key={p.uniprot_id}>
                    <Link href={p.href}>{p.symbol}</Link>
                    <span className={`level-pill level-${p.max_level}`}>{p.max_level}</span>
                  </li>
                ))}
                {ax.proteins.length === 0 && <li className="hint">No panel proteins at ≥ medium</li>}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="mechanism-matrix">
        <h2>Full panel mechanism matrix</h2>
        <p className="hint">{matrix.disclaimer}</p>
        <div className="table-scroll">
          <table className="compare-table matrix-table">
            <thead>
              <tr>
                <th>Protein</th>
                {matrix.mechanisms.map((m) => (
                  <th key={m.id}>{m.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.proteins.map((p) => (
                <tr key={p.uniprot_id}>
                  <th scope="row">
                    <Link href={`/proteins/${p.uniprot_id}`}>{p.symbol}</Link>
                  </th>
                  {matrix.mechanisms.map((m) => {
                    const lv = p.levels[m.id] || "none";
                    return (
                      <td key={m.id}>
                        <span className={`level-pill level-${lv}`}>{lv}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
