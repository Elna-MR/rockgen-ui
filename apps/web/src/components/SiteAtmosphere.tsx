/** Soft site-wide protein atmosphere behind page content. */
export function SiteAtmosphere() {
  return (
    <div className="site-atmosphere" aria-hidden="true">
      <div className="atm-orb atm-orb-1" />
      <div className="atm-orb atm-orb-2" />
      <div className="atm-orb atm-orb-3" />
      <svg className="atm-ribbon" viewBox="0 0 1200 400" preserveAspectRatio="none">
        <path
          d="M-40 220 C180 40, 360 360, 560 160 S900 40, 1240 220"
          fill="none"
          stroke="rgba(74,139,134,0.12)"
          strokeWidth="28"
          strokeLinecap="round"
        />
        <path
          d="M-20 260 C220 100, 400 340, 620 200 S940 80, 1220 250"
          fill="none"
          stroke="rgba(90,120,140,0.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
