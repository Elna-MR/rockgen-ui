import Link from "next/link";
import { ProteinField } from "@/components/ProteinField";

export default function HomePage() {
  return (
    <main className="page home-page home-page-visual">
      <section className="home-stage">
        <div className="home-stage-copy">
          <p className="eyebrow">Neurodegeneration research</p>
          <h1>ProtScope</h1>
          <p className="science-thesis">
            Disease proteins and shared mechanisms, before molecules.
          </p>
          <div className="cta-row">
            <Link className="btn btn-primary" href="/learn">
              Learn
            </Link>
            <Link className="btn btn-ghost" href="/diseases">
              Research
            </Link>
          </div>
        </div>
        <div className="home-stage-visual" aria-hidden="true">
          <ProteinField variant="hero" />
        </div>
      </section>

      <section className="section home-paths" aria-label="Choose a path">
        <div className="path-grid path-grid-2">
          <Link href="/learn" className="path-tile path-tile-primary">
            <p className="eyebrow">Learn</p>
            <h2>Students &amp; families</h2>
            <p>Plain-language tracks by disease.</p>
          </Link>
          <Link href="/diseases" className="path-tile">
            <p className="eyebrow">Research</p>
            <h2>Scientists</h2>
            <p>Mechanisms, maps, structures, evidence.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
