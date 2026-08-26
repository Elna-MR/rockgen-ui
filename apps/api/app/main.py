from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import (
    diseases,
    proteins,
    mutations,
    health,
    evidence,
    ask,
    protein_intel,
    mechanisms,
    dynamics,
    intelligence,
)
from rockgen_graph.client import close_driver


@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield
    close_driver()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="RockGen API",
        description="Scientific knowledge platform for disease and protein programs",
        version="0.1.0",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=r"https://.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(health.router)
    app.include_router(intelligence.router, prefix="/v1")
    app.include_router(mechanisms.router, prefix="/v1")
    app.include_router(dynamics.router, prefix="/v1")
    app.include_router(diseases.router, prefix="/v1")
    app.include_router(protein_intel.router, prefix="/v1")
    app.include_router(proteins.router, prefix="/v1")
    app.include_router(mutations.router, prefix="/v1")
    app.include_router(evidence.router, prefix="/v1")
    app.include_router(ask.router, prefix="/v1")
    return app


app = create_app()
