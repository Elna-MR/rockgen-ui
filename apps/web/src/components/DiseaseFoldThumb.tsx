import { foldForDisease } from "@/data/diseaseFolds";

/** Small in-card fold for a disease tile. */
export function DiseaseFoldThumb({ slug }: { slug: string }) {
  const fold = foldForDisease(slug);
  return (
    <div className="disease-fold-thumb" aria-hidden="true">
      <img src={fold.src} alt="" draggable={false} />
      <span className="disease-fold-label">{fold.protein}</span>
    </div>
  );
}
