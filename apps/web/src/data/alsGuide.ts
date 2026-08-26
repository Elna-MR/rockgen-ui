/**
 * ALS public guide content — plain language for patients/families,
 * structured learning for students. Not medical advice.
 */

export type GuideLink = { label: string; href: string };

export type GuideArticle = {
  slug: string;
  title: string;
  summary: string;
  audience: "everyone" | "patient" | "student";
  minutes?: number;
  paragraphs: string[];
  /** Short self-check prompts after reading */
  checks?: string[];
  next?: GuideLink[];
};

export type PracticeExercise = {
  slug: string;
  title: string;
  level: "intro" | "next";
  goal: string;
  minutes: number;
  steps: string[];
  /** What to write down after the exercise */
  reflect: string[];
  openHref: string;
  openLabel: string;
};

export type LearnModule = {
  id: string;
  number: number;
  title: string;
  minutes: string;
  outcome: string;
  href: string;
  kind: "read" | "practice" | "tool";
};

/** Ordered student curriculum — progressive disclosure like lab training */
export const LEARN_MODULES: LearnModule[] = [
  {
    id: "m1",
    number: 1,
    title: "Orient — ALS in five ideas",
    minutes: "5 min",
    outcome: "Tell the disease story without jargon.",
    href: "/learn/als",
    kind: "read",
  },
  {
    id: "m2",
    number: 2,
    title: "Patient lens",
    minutes: "8 min",
    outcome: "Explain ALS to a non-scientist in one sentence.",
    href: "/learn/practice/patient-view",
    kind: "practice",
  },
  {
    id: "m3",
    number: 3,
    title: "Mental model",
    minutes: "10 min",
    outcome: "Map gene → protein → mechanism → disease.",
    href: "/learn/guides/mental-model",
    kind: "read",
  },
  {
    id: "m4",
    number: 4,
    title: "Read evidence",
    minutes: "10 min",
    outcome: "Separate claim, evidence type, and confidence.",
    href: "/learn/guides/evidence",
    kind: "read",
  },
  {
    id: "m5",
    number: 5,
    title: "Practice — Ask a review",
    minutes: "10 min",
    outcome: "Run one structured question on G118V aggregation.",
    href: "/learn/practice/ask-review",
    kind: "practice",
  },
  {
    id: "m6",
    number: 6,
    title: "Protein case study",
    minutes: "12 min",
    outcome: "Contrast PFN1 vs TUBA4A starting points.",
    href: "/learn/guides/proteins",
    kind: "read",
  },
  {
    id: "m7",
    number: 7,
    title: "Practice — Compare alleles",
    minutes: "10 min",
    outcome: "Name the most disruptive allele and one caution.",
    href: "/learn/practice/compare-pfn1",
    kind: "practice",
  },
  {
    id: "m8",
    number: 8,
    title: "Practice — Disease map",
    minutes: "10 min",
    outcome: "Navigate by biology axis, not gene list.",
    href: "/learn/practice/disease-map",
    kind: "practice",
  },
];

/** Patient & family: understand ALS in everyday language */
export const UNDERSTAND_PAGES: GuideArticle[] = [
  {
    slug: "what-is-als",
    title: "What is ALS?",
    summary: "A clear picture of the disease, in plain words.",
    audience: "patient",
    minutes: 4,
    paragraphs: [
      "ALS (amyotrophic lateral sclerosis) is a disease of the motor neurons — the nerve cells that tell your muscles to move. As those cells fail, muscles weaken and waste. People often notice changes in walking, hand strength, speech, or swallowing.",
      "ALS is progressive, which means it usually worsens over time. How fast it moves, and which body regions it affects first, differs from person to person.",
      "Most cases are not clearly inherited. A smaller share (familial ALS) runs in families and can involve a change in one of several genes. Either way, the day-to-day challenges can feel similar: mobility, communication, breathing support, and care planning.",
      "This site explains the biology researchers study. It is educational, not a diagnosis or a treatment plan. Decisions about care belong with your clinical team.",
    ],
    next: [
      { label: "What happens in the body?", href: "/understand/what-happens" },
      { label: "Genes and proteins (gentle)", href: "/understand/genes-and-proteins" },
    ],
  },
  {
    slug: "what-happens",
    title: "What happens in the body?",
    summary: "Motor neurons, muscles, and why people feel weakness.",
    audience: "patient",
    minutes: 5,
    paragraphs: [
      "Think of a motor neuron as a long wire from the spinal cord (or brain) out to a muscle. When the wire works, the muscle contracts on command. In ALS, those wires are damaged and eventually die.",
      "Without a healthy signal, the muscle gets less use and shrinks (atrophy). That is why weakness appears — not because someone is “out of shape,” but because the connection is breaking.",
      "Inside cells, many jobs must stay in balance: building and folding proteins, clearing junk, shipping cargo along the neuron’s long axon, and keeping the cell’s scaffolding stable. When those jobs fail, motor neurons are especially vulnerable because they are large and busy.",
      "Researchers group those failures into biological “routes” or mechanisms — shared ways different genes can harm the same cells. Understanding routes helps science decide what to study next; it does not mean a drug already exists for every route.",
    ],
    next: [
      { label: "Genes and proteins", href: "/understand/genes-and-proteins" },
      { label: "How science studies ALS", href: "/understand/research-today" },
    ],
  },
  {
    slug: "genes-and-proteins",
    title: "Genes and proteins — a gentle guide",
    summary: "Why you hear names like PFN1 or TUBA4A without the lab jargon.",
    audience: "patient",
    minutes: 5,
    paragraphs: [
      "A gene is an instruction. A protein is the worker built from that instruction. In some families with ALS, a spelling change (mutation) in a gene can change how a protein behaves.",
      "PFN1 (profilin-1) helps with the cell’s actin scaffold — part of the inner framework. Some PFN1 changes are linked to a rare familial form of ALS. Scientists study whether the changed protein folds badly or clumps (aggregates).",
      "TUBA4A is part of microtubules — another piece of the cell’s framework, important for shipping materials along the long motor neuron. Some TUBA4A changes are also linked to ALS.",
      "You do not need both names to live with ALS. They matter to researchers comparing how different proteins can reach similar problems. Your clinician can discuss whether genetic testing is relevant for your family.",
    ],
    next: [
      { label: "Research today", href: "/understand/research-today" },
      { label: "Common questions", href: "/understand/questions" },
    ],
  },
  {
    slug: "research-today",
    title: "How science studies ALS today",
    summary: "Evidence, mechanisms, and why molecule design comes later.",
    audience: "patient",
    minutes: 5,
    paragraphs: [
      "Researchers collect clues from many places: genetics in families, lab experiments, animals, and (where available) human studies. Not every clue is equally strong. Good programs label what is supported and what is still uncertain.",
      "A growing approach is to map shared disease mechanisms first — the common failure routes — across genes. That helps prioritise what is worth intervening on before designing new drugs.",
      "RockGen’s research tools follow that order: understand proteins and mechanisms, review evidence carefully, and only later move toward therapy design. Patients and families can read the plain-language guides; scientists use the deeper ALS workspace.",
      "Clinical trials and approved medicines (when they exist) are decided through medical and regulatory pathways. This website does not recommend treatments.",
    ],
    next: [
      { label: "Common questions", href: "/understand/questions" },
      { label: "For students — start learning", href: "/learn" },
    ],
  },
  {
    slug: "questions",
    title: "Questions families often ask",
    summary: "Direct answers with clear limits.",
    audience: "patient",
    minutes: 6,
    paragraphs: [
      "Is ALS one disease? Clinically it is one syndrome with shared features, but biology can differ — different genes and routes can lead to similar symptoms.",
      "If a gene is “involved,” does that explain my ALS? Only sometimes. Many people with ALS have no clear genetic finding with today’s tests. A research gene name on a website is not your personal diagnosis.",
      "What is a biomarker like NfL? It is a measurement that can reflect nerve injury. It is not a full explanation of why ALS started, and it is interpreted by clinicians in context.",
      "Can this site tell me my prognosis or treatment? No. Use it to understand ideas and research framing. Care, prognosis, and treatment decisions stay with your medical team and trusted ALS clinics.",
      "Where do students and researchers go next? Students can follow the Learn path. Researchers open the ALS workspace for proteins, mechanisms, and evidence tools.",
    ],
    next: [
      { label: "Back to Understand", href: "/understand" },
      { label: "Student Learn path", href: "/learn" },
      { label: "ALS research workspace", href: "/diseases/als" },
    ],
  },
];

/** Student learning guides (deeper, still readable) */
export const LEARN_GUIDES: GuideArticle[] = [
  {
    slug: "mental-model",
    title: "A working mental model of ALS",
    summary: "Genes → proteins → mechanisms → shared disease maps.",
    audience: "student",
    minutes: 10,
    paragraphs: [
      "Start with the clinical picture (motor neuron loss), then ask which molecular failures could produce it. Many genes can contribute; they often overlap on mechanisms such as aggregation, cytoskeleton stress, or transport problems.",
      "RockGen’s program proteins for deep tools today are PFN1 and TUBA4A. Use them as case studies — not as the whole disease.",
      "When you open research pages later, open one tool at a time: overview → compare or map → Ask. Progressive disclosure keeps trust: show only what you need for the current decision.",
    ],
    checks: [
      "Can you say, in one line, how a gene change becomes a protein problem?",
      "Name two mechanisms that can be shared across different ALS genes.",
      "Why is “open one tool at a time” better than a single crowded dashboard?",
    ],
    next: [
      { label: "How to read evidence", href: "/learn/guides/evidence" },
      { label: "ALS in five ideas", href: "/learn/als" },
    ],
  },
  {
    slug: "evidence",
    title: "How to read evidence without drowning",
    summary: "Claims, support types, confidence — and what biomarkers are not.",
    audience: "student",
    minutes: 10,
    paragraphs: [
      "Write a claim first (“G118V increases aggregation”), then check what backs it: computation, cells, animals, human genetics. Mix matters for confidence.",
      "Biomarkers like NfL often measure injury broadly. They are not automatic proof of a named mutation’s mechanism in one person.",
      "Ask in the research tools keeps rankings deterministic and citation-linked so you can trust the skeleton of an answer while you learn — the model may polish wording; it should not invent papers.",
    ],
    checks: [
      "What is the difference between a claim and a paper?",
      "Which evidence types would raise your confidence more: computational alone, or in vitro + human genetics?",
      "Why might NfL rise without proving a specific PFN1 mechanism?",
    ],
    next: [
      { label: "Practice: ask a review", href: "/learn/practice/ask-review" },
      { label: "PFN1 & TUBA4A case study", href: "/learn/guides/proteins" },
    ],
  },
  {
    slug: "proteins",
    title: "PFN1 and TUBA4A as case studies",
    summary: "Two proteins, overlapping scaffolding biology, different starting points.",
    audience: "student",
    minutes: 12,
    paragraphs: [
      "PFN1 touches actin; TUBA4A is a tubulin. Both speak to cytoskeleton and cellular architecture — a bridge into shared ALS mechanisms.",
      "Compare alleles on the protein pages to see which changes look more disruptive. Use pathway compare to see shared vs unique routes.",
      "Dynamics (PFN1) is a learning report of conformational ideas — demos today, richer simulation backends later. Treat scores as study priorities, not diagnoses.",
    ],
    checks: [
      "What cellular “job” does PFN1 mainly touch vs TUBA4A?",
      "If two proteins share an axis, what question should you ask next about evidence?",
      "What must you never confuse a Protein State Score with?",
    ],
    next: [
      { label: "Practice: compare PFN1", href: "/learn/practice/compare-pfn1" },
      { label: "Open ALS workspace", href: "/diseases/als" },
    ],
  },
];

export const PRACTICE: PracticeExercise[] = [
  {
    slug: "five-ideas",
    title: "ALS in five ideas",
    level: "intro",
    minutes: 5,
    goal: "Build a simple story of the disease before opening research tools.",
    steps: [
      "Read the five ideas page once through.",
      "Optional: skim What is ALS? in Understand if any sentence feels clinical.",
      "Continue to the next practice when ready.",
    ],
    reflect: [
      "Write the five ideas as five short bullets from memory.",
      "Circle the one idea you want to practice next.",
    ],
    openHref: "/learn/als",
    openLabel: "Open five ideas",
  },
  {
    slug: "patient-view",
    title: "Read the patient view once",
    level: "intro",
    minutes: 8,
    goal: "See how the same disease is explained without research jargon.",
    steps: [
      "Open Understand and read What is ALS?",
      "Read What happens in the body?",
      "Note one sentence you would use to explain ALS to a non-scientist.",
    ],
    reflect: [
      "Your one-sentence explanation (plain words only).",
      "One word you would avoid when talking with families.",
    ],
    openHref: "/understand",
    openLabel: "Open Understand",
  },
  {
    slug: "compare-pfn1",
    title: "Compare PFN1 alleles",
    level: "next",
    minutes: 10,
    goal: "See which allele looks most disruptive and why scores are not diagnoses.",
    steps: [
      "Open PFN1 compare from the protein overview.",
      "Read the most-disruptive verdict.",
      "Write one caution: scores prioritise study — they do not diagnose patients.",
    ],
    reflect: [
      "Most disruptive allele (name + one reason).",
      "Caution sentence you would say to a classmate.",
    ],
    openHref: "/proteins/P07737/compare",
    openLabel: "Open PFN1 compare",
  },
  {
    slug: "ask-review",
    title: "Ask a structured review",
    level: "next",
    minutes: 10,
    goal: "Connect a claim to evidence types and confidence.",
    steps: [
      "Open Ask.",
      "Run a review about G118V and aggregation (or a suggested prompt).",
      "List which kinds of evidence appear.",
    ],
    reflect: [
      "Claim you tested.",
      "Evidence types present (list).",
      "Confidence label shown — do you agree? Why?",
    ],
    openHref: "/ask",
    openLabel: "Open Ask",
  },
  {
    slug: "disease-map",
    title: "Browse ALS by biology",
    level: "next",
    minutes: 10,
    goal: "Navigate mechanisms instead of memorising gene lists.",
    steps: [
      "Open the disease map.",
      "Find cytoskeleton-related biology involving PFN1 or TUBA4A.",
      "Open Mechanisms and note one shared priority in a sentence.",
    ],
    reflect: [
      "Axis you explored.",
      "One shared mechanism across proteins.",
      "One open question the map still leaves unanswered.",
    ],
    openHref: "/diseases/als/map",
    openLabel: "Open disease map",
  },
];

export function getUnderstandPage(slug: string) {
  return UNDERSTAND_PAGES.find((p) => p.slug === slug);
}

export function getLearnGuide(slug: string) {
  return LEARN_GUIDES.find((g) => g.slug === slug);
}

export function getPractice(slug: string) {
  return PRACTICE.find((p) => p.slug === slug);
}
