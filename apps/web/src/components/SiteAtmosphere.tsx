/** Site-wide mineral field — soft moving shades + faint protein fold background. */
export function SiteAtmosphere() {
  return (
    <div className="site-atmosphere" aria-hidden="true">
      <div className="atm-base" />
      <div className="atm-wash" />
      <div className="atm-protein-bg" />
      <div className="atm-grain" />
      <div className="atm-shade atm-shade-1" />
      <div className="atm-shade atm-shade-2" />
      <div className="atm-shade atm-shade-3" />
      <div className="atm-veil" />
    </div>
  );
}
