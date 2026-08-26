/** Amino-acid chemistry helpers for structure explorer Primary tab. */

const AA_MASS: Record<string, number> = {
  A: 89.09,
  R: 174.2,
  N: 132.12,
  D: 133.1,
  C: 121.16,
  E: 147.13,
  Q: 146.15,
  G: 75.07,
  H: 155.16,
  I: 131.17,
  L: 131.17,
  K: 146.19,
  M: 149.21,
  F: 165.19,
  P: 115.13,
  S: 105.09,
  T: 119.12,
  W: 204.23,
  Y: 181.19,
  V: 117.15,
};

/** Kyte–Doolittle hydrophobicity */
const AA_HYDRO: Record<string, number> = {
  A: 1.8,
  R: -4.5,
  N: -3.5,
  D: -3.5,
  C: 2.5,
  E: -3.5,
  Q: -3.5,
  G: -0.4,
  H: -3.2,
  I: 4.5,
  L: 3.8,
  K: -3.9,
  M: 1.9,
  F: 2.8,
  P: -1.6,
  S: -0.8,
  T: -0.7,
  W: -0.9,
  Y: -1.3,
  V: 4.2,
};

const AA_PKA_C = 2.34;
const AA_PKA_N = 9.69;
const AA_PKA_SIDE: Record<string, number> = {
  D: 3.86,
  E: 4.25,
  H: 6.0,
  C: 8.33,
  Y: 10.07,
  K: 10.53,
  R: 12.48,
};

export type AaClass = "hydrophobic" | "polar" | "acidic" | "basic" | "special";

export function aaClass(aa: string): AaClass {
  const u = aa.toUpperCase();
  if ("AILMFVW".includes(u)) return "hydrophobic";
  if ("STNQYG".includes(u)) return "polar";
  if ("DE".includes(u)) return "acidic";
  if ("KRH".includes(u)) return "basic";
  return "special"; // CP etc.
}

export function composition(sequence: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const ch of sequence.toUpperCase()) {
    if (!/[A-Z]/.test(ch)) continue;
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
}

export function molecularMassDa(sequence: string): number {
  const seq = sequence.toUpperCase().replace(/[^A-Z]/g, "");
  if (!seq) return 0;
  let sum = 0;
  for (const ch of seq) sum += AA_MASS[ch] ?? 110;
  // peptide bonds lose water
  sum -= (seq.length - 1) * 18.015;
  return sum;
}

export function gravy(sequence: string): number {
  const seq = sequence.toUpperCase().replace(/[^A-Z]/g, "");
  if (!seq) return 0;
  let s = 0;
  for (const ch of seq) s += AA_HYDRO[ch] ?? 0;
  return s / seq.length;
}

/** Rough theoretical pI via charge balance (educational approximation). */
export function theoreticalPi(sequence: string): number {
  const seq = sequence.toUpperCase().replace(/[^A-Z]/g, "");
  if (!seq) return 7;
  const counts = composition(seq);

  function charge(pH: number): number {
    let c = 0;
    c += 1 / (1 + Math.pow(10, pH - AA_PKA_N));
    c -= 1 / (1 + Math.pow(10, AA_PKA_C - pH));
    for (const [aa, n] of Object.entries(counts)) {
      const pka = AA_PKA_SIDE[aa];
      if (!pka) continue;
      if ("DECY".includes(aa)) {
        c -= n / (1 + Math.pow(10, pka - pH));
      } else {
        c += n / (1 + Math.pow(10, pH - pka));
      }
    }
    return c;
  }

  let lo = 0;
  let hi = 14;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (charge(mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Extinction coefficient approximation (Trp/Tyr/Cys pairs). */
export function extinction280(sequence: string): number {
  const seq = sequence.toUpperCase();
  const W = (seq.match(/W/g) || []).length;
  const Y = (seq.match(/Y/g) || []).length;
  const C = (seq.match(/C/g) || []).length;
  return W * 5500 + Y * 1490 + Math.floor(C / 2) * 125;
}

export function chemistrySummary(sequence: string) {
  const seq = sequence.toUpperCase().replace(/[^A-Z]/g, "");
  const mass = molecularMassDa(seq);
  return {
    length: seq.length,
    modelled: seq.length,
    massKda: mass / 1000,
    pi: theoreticalPi(seq),
    gravy: gravy(seq),
    extinction: extinction280(seq),
    composition: composition(seq),
  };
}
