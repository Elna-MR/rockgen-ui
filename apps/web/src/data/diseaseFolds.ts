/** Representative fold art per disease (mineral ribbon style, local assets). */

export type DiseaseFold = {
  src: string;
  protein: string;
  note: string;
};

const FALLBACK: DiseaseFold = {
  src: "/brand/protscope-hero-mineral.jpg",
  protein: "Protein fold",
  note: "Representative structure motif",
};

export const DISEASE_FOLDS: Record<string, DiseaseFold> = {
  als: {
    src: "/brand/folds/fold-als-sod1.jpg",
    protein: "SOD1",
    note: "Cu/Zn superoxide dismutase fold",
  },
  parkinsons: {
    src: "/brand/folds/fold-pd-snca.jpg",
    protein: "SNCA",
    note: "α-synuclein helical motif",
  },
  alzheimers: {
    src: "/brand/folds/fold-ad-tau.jpg",
    protein: "MAPT",
    note: "Tau microtubule-binding fold",
  },
  huntingtons: {
    src: "/brand/folds/fold-hd-htt.jpg",
    protein: "HTT",
    note: "Huntingtin HEAT-repeat fold",
  },
  ftd: {
    src: "/brand/folds/fold-ftd-tardbp.jpg",
    protein: "TARDBP",
    note: "TDP-43 RRM fold",
  },
};

export function foldForDisease(slug: string): DiseaseFold {
  return DISEASE_FOLDS[slug] ?? FALLBACK;
}
