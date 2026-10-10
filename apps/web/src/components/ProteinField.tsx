/** Soft mineral protein motif — same fold language as the home hero, used as background. */
type Props = {
  variant?: "hero" | "panel" | "ambient";
  className?: string;
};

export function ProteinField({ variant = "panel", className = "" }: Props) {
  return (
    <div
      className={`protein-field protein-field-photo protein-field-${variant} ${className}`.trim()}
      aria-hidden="true"
    >
      <img src="/brand/protscope-hero-mineral.jpg" alt="" draggable={false} />
    </div>
  );
}
