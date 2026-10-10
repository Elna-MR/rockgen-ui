import { foldForDisease } from "@/data/diseaseFolds";

/** Small in-card fold for a disease tile — each disease uses a distinct fold asset. */
export function DiseaseFoldThumb({ slug }: { slug: string }) {
  const fold = foldForDisease(slug);
  return (
    <div className="disease-fold-thumb" data-fold={slug} aria-hidden="true">
      <img src={`${fold.src}?v=2`} alt="" draggable={false} />
      <span className="disease-fold-label">{fold.protein}</span>
    </div>
  );
}
