"""FastAPI application entry point."""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import data, draft, health

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

app = FastAPI(
    title="NFL Mock Draft Simulator API",
    description="Backend for the 2026 NFL Mock Draft Simulator",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(data.router)
app.include_router(draft.router)


@app.get("/")
async def root():
    return {"message": "NFL Mock Draft Simulator API", "docs": "/docs"}
