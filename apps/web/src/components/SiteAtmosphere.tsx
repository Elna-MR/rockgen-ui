/** Soft DNA / protein shadows that drift behind page content. */
export function SiteAtmosphere() {
  return (
    <div className="site-atmosphere" aria-hidden="true">
      <div className="atm-shade atm-shade-1" />
      <div className="atm-shade atm-shade-2" />
      <div className="atm-shade atm-shade-3" />
      <div className="atm-shade atm-shade-4" />

      <div className="atm-orb atm-orb-1" />
      <div className="atm-orb atm-orb-2" />
      <div className="atm-orb atm-orb-3" />

      {/* Flying protein / DNA ribbon shadows */}
      <svg className="atm-ribbon atm-ribbon-a" viewBox="0 0 1200 420" preserveAspectRatio="none">
        <path
          className="atm-path atm-path-wide"
          d="M-60 240 C160 60, 340 360, 560 170 S920 50, 1260 240"
          fill="none"
          strokeLinecap="round"
        />
        <path
          className="atm-path atm-path-mid"
          d="M-40 280 C200 110, 420 340, 640 210 S960 90, 1240 270"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <svg className="atm-ribbon atm-ribbon-b" viewBox="0 0 1200 420" preserveAspectRatio="none">
        <path
          className="atm-path atm-path-thin"
          d="M-80 180 C140 320, 380 40, 600 220 S880 360, 1280 160"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Soft DNA double-helix shadow */}
      <svg
        className="atm-dna atm-dna-main"
        viewBox="0 0 640 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="atm-dna-strand"
          d="M40 180
             C80 80, 120 80, 160 180
             C200 280, 240 280, 280 180
             C320 80, 360 80, 400 180
             C440 280, 480 280, 520 180
             C560 80, 600 80, 640 180"
          strokeLinecap="round"
        />
        <path
          className="atm-dna-strand atm-dna-strand-b"
          d="M40 180
             C80 280, 120 280, 160 180
             C200 80, 240 80, 280 180
             C320 280, 360 280, 400 180
             C440 80, 480 80, 520 180
             C560 280, 600 280, 640 180"
          strokeLinecap="round"
        />
        <g className="atm-dna-rungs" strokeLinecap="round">
          <path d="M100 130 L100 230" />
          <path d="M180 130 L180 230" />
          <path d="M260 130 L260 230" />
          <path d="M340 130 L340 230" />
          <path d="M420 130 L420 230" />
          <path d="M500 130 L500 230" />
          <path d="M580 130 L580 230" />
        </g>
      </svg>

      <svg
        className="atm-dna atm-dna-side"
        viewBox="0 0 480 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="atm-dna-strand"
          d="M20 140 C55 60, 90 60, 125 140 C160 220, 195 220, 230 140 C265 60, 300 60, 335 140 C370 220, 405 220, 460 140"
          strokeLinecap="round"
        />
        <path
          className="atm-dna-strand atm-dna-strand-b"
          d="M20 140 C55 220, 90 220, 125 140 C160 60, 195 60, 230 140 C265 220, 300 220, 335 140 C370 60, 405 60, 460 140"
          strokeLinecap="round"
        />
      </svg>

      {/* Thin protein fold silhouette, also drifting */}
      <svg
        className="atm-protein atm-protein-main"
        viewBox="0 0 900 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="atm-fold" x1="80" y1="120" x2="820" y2="560" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4a8b86" stopOpacity="0.22" />
            <stop offset="0.55" stopColor="#6a9aaf" stopOpacity="0.12" />
            <stop offset="1" stopColor="#4a8b86" stopOpacity="0.06" />
          </linearGradient>
          <filter id="atm-soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>
        <path
          className="atm-fold-shadow"
          d="M120 360 C210 210, 300 470, 420 320 S620 180, 760 310"
          stroke="rgba(26,43,51,0.08)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#atm-soft)"
        />
        <path
          className="atm-backbone"
          d="M110 350 C200 200, 290 470, 410 310 S600 170, 780 300"
          stroke="url(#atm-fold)"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        <path
          className="atm-helix"
          d="M250 290
             C268 250, 292 250, 310 290
             C328 330, 352 330, 370 290
             C388 250, 412 250, 430 290
             C448 330, 472 330, 490 290"
          stroke="rgba(74,139,134,0.2)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <g className="atm-nodes" fill="#4a8b86">
          <circle className="atm-node n1" cx="160" cy="300" r="3.2" opacity="0.3" />
          <circle className="atm-node n3" cx="340" cy="310" r="3.4" opacity="0.32" />
          <circle className="atm-node n5" cx="540" cy="240" r="3" opacity="0.28" />
          <circle className="atm-node n7" cx="760" cy="300" r="3.1" opacity="0.3" />
        </g>
      </svg>

      <div className="atm-veil" />
    </div>
  );
}
