/** Soft site-wide drifting shadows and fold ribbons behind page content. */
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

      <div className="atm-veil" />
    </div>
  );
}
