/** Minimal protein-inspired decorative SVG — ribbons, backbone, residue nodes. */
type Props = {
  variant?: "hero" | "panel" | "ambient";
  className?: string;
};

export function ProteinField({ variant = "hero", className = "" }: Props) {
  const id = `pf-${variant}`;
  return (
    <svg
      className={`protein-field protein-field-${variant} ${className}`.trim()}
      viewBox="0 0 640 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-ribbon`} x1="40" y1="80" x2="600" y2="400" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4a8b86" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#6a9aaf" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4a8b86" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={`${id}-soft`} x1="200" y1="40" x2="520" y2="440" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9bb8b4" stopOpacity="0.28" />
          <stop offset="1" stopColor="#4a8b86" stopOpacity="0.05" />
        </linearGradient>
        <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      {/* Soft atmospheric blobs */}
      <ellipse className="pf-blob pf-blob-a" cx="470" cy="150" rx="160" ry="110" fill={`url(#${id}-soft)`} filter={`url(#${id}-blur)`} />
      <ellipse className="pf-blob pf-blob-b" cx="180" cy="340" rx="130" ry="90" fill={`url(#${id}-soft)`} filter={`url(#${id}-blur)`} />

      {/* Secondary fold ribbon */}
      <path
        className="pf-ribbon pf-ribbon-back"
        d="M70 300 C150 220, 210 360, 300 280 S470 180, 560 240"
        stroke={`url(#${id}-ribbon)`}
        strokeWidth="18"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Primary backbone ribbon */}
      <path
        className="pf-ribbon pf-ribbon-main"
        d="M50 200 C140 90, 230 320, 340 190 S500 80, 600 170"
        stroke={`url(#${id}-ribbon)`}
        strokeWidth="22"
        strokeLinecap="round"
      />

      {/* Thin structure trace */}
      <path
        className="pf-trace"
        d="M80 250 C160 160, 250 340, 360 230 S510 120, 580 200"
        stroke="#2a5552"
        strokeOpacity="0.22"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4 8"
      />

      {/* Residue nodes along the fold */}
      <g className="pf-residues" fill="#4a8b86">
        <circle className="pf-res pf-res-1" cx="120" cy="155" r="5.5" />
        <circle className="pf-res pf-res-2" cx="210" cy="255" r="4.5" />
        <circle className="pf-res pf-res-3" cx="300" cy="210" r="6" />
        <circle className="pf-res pf-res-4" cx="390" cy="155" r="4.5" />
        <circle className="pf-res pf-res-5" cx="480" cy="135" r="5.5" />
        <circle className="pf-res pf-res-6" cx="545" cy="175" r="4" />
      </g>

      {/* Side-chain ticks */}
      <g className="pf-ticks" stroke="#4a8b86" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round">
        <path d="M120 155 L105 125" />
        <path d="M300 210 L325 245" />
        <path d="M480 135 L505 110" />
        <path d="M210 255 L185 285" />
      </g>

      {/* Helix cue rings */}
      <g className="pf-helix" stroke="#4a8b86" strokeOpacity="0.2" strokeWidth="1.25" fill="none">
        <ellipse className="pf-ring pf-ring-1" cx="340" cy="190" rx="42" ry="16" />
        <ellipse className="pf-ring pf-ring-2" cx="340" cy="190" rx="58" ry="24" />
      </g>
    </svg>
  );
}
