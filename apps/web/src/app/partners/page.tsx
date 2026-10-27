import Link from "next/link";
import { PartnerBooking } from "@/components/PartnerBooking";

export const metadata = {
  title: "Research partners | ProtScope™",
  description: "Protein structure and evidence review for neurodegeneration research teams.",
};

type Status = "ready" | "partial" | "not-yet";

const STATUS_LABEL: Record<Status, string> = {
  ready: "Ready",
  partial: "Partial",
  "not-yet": "Not yet",
};

const COVERAGE: Array<{ need: string; status: Status; next: string }> = [
  { need: "Structure and variants", status: "ready", next: "Add your proteins" },
  { need: "Evidence review", status: "partial", next: "Extend past PFN1 G118V" },
  { need: "ER stress pathways", status: "partial", next: "Link to ALS genes" },
  { need: "Kinases, e.g. MAP4K", status: "not-yet", next: "Add structure pages" },
  { need: "Small-molecule design", status: "not-yet", next: "Stays with your chemists" },
  { need: "Lab and clinical data", status: "not-yet", next: "Import under agreement" },
  { need: "Diseases beyond ALS", status: "partial", next: "Deepen the one you need" },
  { need: "Private workspace", status: "not-yet", next: "Built before sharing data" },
];

export default function PartnersPage() {
  return (
    <main className="page beta-page partners-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Partners
      </p>

      <header className="hub-hero">
        <h1>Research partners</h1>
        <p className="science-thesis">Structure and evidence, next to your lab work.</p>
        <p className="lede">
          ProtScope™ maps disease proteins and variants, and shows how strong the evidence is.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#book">
            Book a call
          </a>
          <Link className="btn btn-ghost" href="/proteins/explore">
            See the tools
          </Link>
        </div>
      </header>

      <section className="section" aria-labelledby="partners-offer-heading">
        <h2 id="partners-offer-heading">What we offer</h2>
        <ul className="partners-grid">
          <li>
            <strong>Structure and variants</strong>
            See where a change sits in the fold.
          </li>
          <li>
            <strong>Auditable evidence</strong>
            Every score shows its steps.
          </li>
          <li>
            <strong>Shared mechanisms</strong>
            Compare where ALS genes converge.
          </li>
        </ul>
      </section>

      <section className="section" aria-labelledby="partners-gap-heading">
        <h2 id="partners-gap-heading">Where we are today</h2>
        <div className="beta-table-wrap">
          <table className="beta-table partners-table">
            <thead>
              <tr>
                <th scope="col">Need</th>
                <th scope="col">Status</th>
                <th scope="col">In a pilot</th>
              </tr>
            </thead>
            <tbody>
              {COVERAGE.map((row) => (
                <tr key={row.need}>
                  <th scope="row">{row.need}</th>
                  <td>
                    <span className={`status-tag is-${row.status}`}>{STATUS_LABEL[row.status]}</span>
                  </td>
                  <td>{row.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" aria-labelledby="partners-how-heading">
        <h2 id="partners-how-heading">A pilot</h2>
        <ul className="partners-grid">
          <li>
            <strong>1. Scope</strong>
            Pick one pathway.
          </li>
          <li>
            <strong>2. Build</strong>
            We fill the gaps for it.
          </li>
          <li>
            <strong>3. Review</strong>
            Your scientists check it.
          </li>
        </ul>
      </section>

      <section className="section" aria-labelledby="partners-book-heading">
        <h2 id="partners-book-heading">Book a call</h2>
        <PartnerBooking />
      </section>

      <p className="hint partners-note">
        Research tool, not medical advice. We do not design drugs or hold patient data. No company
        has endorsed or partnered with us.
      </p>
    </main>
  );
}
