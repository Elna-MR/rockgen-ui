/** Minimal protein motif — thin backbone, helix, residue nodes. */
type Props = {
  variant?: "hero" | "panel" | "ambient";
  className?: string;
};

export function ProteinField({ variant = "hero", className = "" }: Props) {
  const id = `pf-${variant}`;
  return (
    <svg
      className={`protein-field protein-field-${variant} ${className}`.trim()}
      viewBox="0 0 640 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-line`} x1="40" y1="80" x2="600" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4a8b86" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#5c8a9a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#4a8b86" stopOpacity="0.25" />
        </linearGradient>
        <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      <ellipse
        className="pf-blob pf-blob-a"
        cx="460"
        cy="150"
        rx="120"
        ry="80"
        fill="#9bb8b4"
        fillOpacity="0.12"
        filter={`url(#${id}-blur)`}
      />
      <ellipse
        className="pf-blob pf-blob-b"
        cx="180"
        cy="280"
        rx="100"
        ry="70"
        fill="#4a8b86"
        fillOpacity="0.08"
        filter={`url(#${id}-blur)`}
      />

      {/* Shadow line */}
      <path
        d="M70 250 C170 140, 260 340, 370 220 S520 130, 590 230"
        stroke="rgba(26,43,51,0.06)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Backbone */}
      <path
        className="pf-ribbon pf-ribbon-main"
        d="M60 240 C160 130, 250 340, 360 210 S510 120, 600 220"
        stroke={`url(#${id}-line)`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Helix */}
      <path
        className="pf-ribbon pf-ribbon-back"
        d="M210 220
           C228 185, 252 185, 270 220
           C288 255, 312 255, 330 220
           C348 185, 372 185, 390 220"
        stroke="#4a8b86"
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Sheet */}
      <g stroke="#6a9aaf" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round">
        <path d="M430 175 L505 160" />
        <path d="M435 190 L510 175" />
        <path d="M440 205 L515 190" />
      </g>

      <path
        className="pf-trace"
        d="M90 255 C180 160, 270 320, 380 230 S530 145, 580 225"
        stroke="#2a5552"
        strokeOpacity="0.18"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="3 7"
      />

      <g className="pf-residues" fill="#4a8b86">
        <circle className="pf-res pf-res-1" cx="110" cy="200" r="3.5" />
        <circle className="pf-res pf-res-2" cx="210" cy="220" r="3" />
        <circle className="pf-res pf-res-3" cx="300" cy="235" r="3.8" />
        <circle className="pf-res pf-res-4" cx="390" cy="220" r="3.2" />
        <circle className="pf-res pf-res-5" cx="470" cy="170" r="3.4" />
        <circle className="pf-res pf-res-6" cx="560" cy="210" r="3" />
      </g>

      <g className="pf-helix" stroke="#4a8b86" strokeOpacity="0.18" strokeWidth="1" fill="none">
        <ellipse className="pf-ring pf-ring-1" cx="300" cy="225" rx="28" ry="11" />
        <ellipse className="pf-ring pf-ring-2" cx="300" cy="225" rx="40" ry="16" />
      </g>
    </svg>
  );
}
