from pydantic import BaseModel, Field
from fastapi import APIRouter

from rockgen_reasoning import STARTER_QUESTIONS, review

router = APIRouter(tags=["ask"])


class AskRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=2000)


@router.get("/ask/starters")
def ask_starters() -> dict:
    return {"questions": STARTER_QUESTIONS}


@router.post("/ask")
def ask(body: AskRequest) -> dict:
    """Return a structured Scientific Review (not a chatbot blob)."""
    return review(body.question.strip())
