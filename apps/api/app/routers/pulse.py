"""Pulse: a biomarker Q&A grounded only in the knowledge graph.

No language model is involved. Every sentence in an answer is composed from fields stored on
Biomarker nodes, so Pulse cannot state anything the graph does not hold.
"""

import re

from fastapi import APIRouter
from pydantic import BaseModel, Field

from rockgen_graph import queries

router = APIRouter(tags=["pulse"])

SLUG = "als"

CONTEXT_WORDS = {
    "diagnostic": ("diagnos", "detect", "has als", "confirm"),
    "prognostic": ("prognos", "progress", "survival", "how fast", "predict"),
    "pharmacodynamic": ("treatment", "therapy", "drug", "target engagement", "pharmacodynamic", "trial", "response"),
    "stratification": ("stratif", "subtype", "subgroup", "which patients", "tdp-43 pathology"),
}
SPECIMEN_WORDS = {
    "CSF": ("csf", "cerebrospinal", "spinal fluid", "lumbar"),
    "blood": ("blood", "serum", "plasma"),
}
DATA_WORDS = ("data", "dataset", "cohort", "target als", "data engine", "collection")

SUGGESTIONS = [
    "What does NfL tell us, and what can it not tell us?",
    "Which biomarkers can show a treatment is hitting its target?",
    "Which biomarkers can I measure in blood?",
    "Which biomarkers might identify TDP-43 pathology?",
]

CAVEAT = (
    "These are curated summaries and their citations are still pending review. "
    "Educational only, not medical advice."
)


class PulseRequest(BaseModel):
    message: str = Field(..., min_length=2, max_length=1000)


def _norm(text: str) -> str:
    return re.sub(r"[^a-z0-9\- ]+", " ", text.lower())


def _aliases(b: dict) -> set[str]:
    name = _norm(b["name"])
    aliases = {name, b["id"].lower()}
    # Short forms in parentheses, e.g. "(NfL)", plus the leading word of the id.
    aliases.update(_norm(m) for m in re.findall(r"\(([^)]+)\)", b["name"]))
    aliases.add(b["id"].split("-")[0].lower())
    if b["id"] == "stmn2-truncated":
        aliases.update({"stmn2", "cryptic exon"})
    if b["id"] == "tdp43-seed-amp":
        aliases.update({"rt-quic", "seed amplification"})
    return {a.strip() for a in aliases if len(a.strip()) >= 3}


def _mentions(text: str, alias: str) -> bool:
    return re.search(rf"(?<![a-z0-9]){re.escape(alias)}(?![a-z0-9])", text) is not None


def _card(b: dict) -> str:
    specimen = ", ".join(b["specimen"])
    uses = ", ".join(b["context_of_use"])
    return (
        f"{b['name']} ({b['evidence_level']} evidence; measured in {specimen}; used for {uses}). "
        f"{b['evidence_note']} Limit: {b['limitation']}"
    )


def _sources(rows: list[dict]) -> list[dict]:
    seen: dict[str, dict] = {}
    for b in rows:
        for s in b.get("data_sources", []):
            seen.setdefault(s["id"], {"name": s["name"], "url": s["url"]})
    return list(seen.values())


def answer(message: str, biomarkers: list[dict]) -> dict:
    text = _norm(message)

    named = [b for b in biomarkers if any(_mentions(text, a) for a in _aliases(b))]
    if named:
        body = "\n\n".join(_card(b) for b in named)
        if len(named) == 1 and named[0].get("data_sources"):
            names = ", ".join(s["name"] for s in named[0]["data_sources"])
            body += (
                f"\n\nCandidate data in the Target ALS Data Engine: {names}. "
                "Not connected yet, and whether each collection holds this analyte is unconfirmed."
            )
        return _result(body, named, biomarkers)

    contexts = [c for c, words in CONTEXT_WORDS.items() if any(w in text for w in words)]
    specimens = [s for s, words in SPECIMEN_WORDS.items() if any(w in text for w in words)]
    matches = biomarkers
    if contexts:
        matches = [b for b in matches if set(contexts) & set(b["context_of_use"])]
    if specimens:
        matches = [
            b
            for b in matches
            if any(
                (sp == "CSF" and "CSF" in b["specimen"])
                or (sp == "blood" and {"serum", "plasma", "blood"} & set(b["specimen"]))
                for sp in specimens
            )
        ]

    if contexts or specimens:
        if not matches:
            return _result(
                "No biomarker in the graph matches that combination yet. "
                "That is a gap in the graph, not evidence that none exists.",
                [],
                biomarkers,
            )
        order = {"strong": 0, "moderate": 1, "emerging": 2}
        matches = sorted(matches, key=lambda b: order.get(b["evidence_level"], 3))
        lead = f"{len(matches)} biomarker{'s' if len(matches) != 1 else ''} in the graph fit"
        if contexts:
            lead += f" {' / '.join(contexts)} use"
        if specimens:
            lead += f" in {' / '.join(specimens)}"
        body = lead + ", strongest evidence first:\n\n" + "\n\n".join(_card(b) for b in matches)
        return _result(body, matches, biomarkers)

    if any(w in text for w in DATA_WORDS):
        sources = _sources(biomarkers)
        if sources:
            names = ", ".join(s["name"] for s in sources)
            return _result(
                f"Candidate data sources in the Target ALS Data Engine: {names}. "
                "They are linked in the graph but not yet connected, and access is controlled.",
                [],
                biomarkers,
            )

    names = ", ".join(b["name"] for b in biomarkers)
    return _result(
        f"I can only answer from the biomarkers in the graph: {names}. "
        "Name one, or ask what is used for diagnosis, prognosis, treatment response or "
        "patient stratification, or what can be measured in blood or CSF.",
        [],
        biomarkers,
    )


def _result(body: str, matched: list[dict], all_rows: list[dict]) -> dict:
    return {
        "answer": body,
        "biomarker_ids": [b["id"] for b in matched],
        "sources": _sources(matched),
        "caveat": CAVEAT,
        "suggestions": SUGGESTIONS,
        "grounded_in": f"{len(all_rows)} biomarkers in the ALS knowledge graph",
    }


@router.get("/pulse/starters")
def pulse_starters() -> dict:
    return {"questions": SUGGESTIONS}


@router.post("/pulse/chat")
def pulse_chat(body: PulseRequest) -> dict:
    return answer(body.message.strip(), queries.list_biomarkers(SLUG))
