/**
 * Educational enrichment for the Structure workspace.
 * Links Inverse FoldDir as a later-stage sequence redesign idea (not live inference yet).
 */
export function InverseFoldEnrichment() {
  return (
    <section className="section inverse-fold-enrichment" aria-labelledby="after-fold-heading">
      <h2 id="after-fold-heading">After you understand the fold…</h2>
      <p className="lede" style={{ maxWidth: "42rem" }}>
        RockGen starts with mechanisms and structure. A later step is{" "}
        <strong>inverse folding</strong>: given a backbone, propose amino acid sequences that could
        adopt it — refining the whole sequence together, not one residue at a time.
      </p>
      <p className="hint">
        Research prototype context only. Live generation is not wired into RockGen yet; use the
        preprint and code when you have a GPU / local setup. Not medical advice.
      </p>
      <div className="hub-grid" style={{ marginTop: "1rem" }}>
        <a
          className="hub-link"
          href="https://www.biorxiv.org/content/10.64898/2026.09.06.749733v1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>Inverse FoldDir preprint</strong>
          <span>Structure-conditioned design with Dirichlet flow matching (bioRxiv)</span>
        </a>
        <a
          className="hub-link"
          href="https://github.com/microsoft/InverseFoldDir"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>Code &amp; model weights</strong>
          <span>microsoft/InverseFoldDir — run redesign offline or on your own backend</span>
        </a>
        <div className="hub-link hub-link-muted" aria-disabled="true">
          <strong>In RockGen · Soon</strong>
          <span>Full-sequence / site inpainting from the Structure lab when GPU inference is available</span>
        </div>
      </div>
    </section>
  );
}
