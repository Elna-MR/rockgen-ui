/** Minimal animated protein silhouette for the page background. */
export function SiteAtmosphere() {
  return (
    <div className="site-atmosphere" aria-hidden="true">
      <div className="atm-shade atm-shade-1" />
      <div className="atm-shade atm-shade-2" />
      <div className="atm-shade atm-shade-3" />

      <svg
        className="atm-protein atm-protein-main"
        viewBox="0 0 900 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="atm-fold" x1="80" y1="120" x2="820" y2="560" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4a8b86" stopOpacity="0.28" />
            <stop offset="0.55" stopColor="#6a9aaf" stopOpacity="0.16" />
            <stop offset="1" stopColor="#4a8b86" stopOpacity="0.08" />
          </linearGradient>
          <filter id="atm-soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Soft shadow under the fold */}
        <path
          className="atm-fold-shadow"
          d="M120 360 C210 210, 300 470, 420 320 S620 180, 760 310"
          stroke="rgba(26,43,51,0.07)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#atm-soft)"
        />

        {/* Backbone */}
        <path
          className="atm-backbone"
          d="M110 350 C200 200, 290 470, 410 310 S600 170, 780 300"
          stroke="url(#atm-fold)"
          strokeWidth="2.25"
          strokeLinecap="round"
        />

        {/* Alpha-helix coil (looks like a protein helix, not a thick wave) */}
        <path
          className="atm-helix"
          d="M250 290
             C268 250, 292 250, 310 290
             C328 330, 352 330, 370 290
             C388 250, 412 250, 430 290
             C448 330, 472 330, 490 290"
          stroke="rgba(74,139,134,0.22)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Beta-sheet cues */}
        <g className="atm-sheet" stroke="rgba(90,120,140,0.18)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M520 250 L610 235" />
          <path d="M525 268 L615 253" />
          <path d="M530 286 L620 271" />
        </g>

        {/* Residue nodes */}
        <g className="atm-nodes" fill="#4a8b86">
          <circle className="atm-node n1" cx="160" cy="300" r="3.2" opacity="0.35" />
          <circle className="atm-node n2" cx="250" cy="290" r="2.6" opacity="0.3" />
          <circle className="atm-node n3" cx="340" cy="310" r="3.4" opacity="0.38" />
          <circle className="atm-node n4" cx="430" cy="290" r="2.8" opacity="0.32" />
          <circle className="atm-node n5" cx="540" cy="240" r="3" opacity="0.3" />
          <circle className="atm-node n6" cx="680" cy="275" r="2.5" opacity="0.28" />
          <circle className="atm-node n7" cx="760" cy="300" r="3.1" opacity="0.34" />
        </g>
      </svg>

      <svg
        className="atm-protein atm-protein-side"
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="atm-backbone-side"
          d="M70 280 C150 140, 230 360, 320 230 S470 140, 560 250"
          stroke="rgba(74,139,134,0.12)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          className="atm-helix-side"
          d="M180 250 C195 220, 215 220, 230 250 C245 280, 265 280, 280 250 C295 220, 315 220, 330 250"
          stroke="rgba(42,85,82,0.14)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <g fill="#4a8b86">
          <circle className="atm-node" cx="120" cy="240" r="2.4" opacity="0.22" />
          <circle className="atm-node" cx="230" cy="250" r="2.8" opacity="0.25" />
          <circle className="atm-node" cx="400" cy="200" r="2.3" opacity="0.2" />
          <circle className="atm-node" cx="520" cy="235" r="2.6" opacity="0.24" />
        </g>
      </svg>

      <div className="atm-veil" />
    </div>
  );
}
