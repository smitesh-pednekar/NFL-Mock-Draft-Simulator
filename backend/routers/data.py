"""Prospects & Teams lookup router."""

from fastapi import APIRouter

from data.constants import TEAMS_DATA
from models.schemas import Prospect, Team
from services.player_service import get_draft_pool

router = APIRouter(prefix="/api", tags=["data"])


@router.get("/prospects", response_model=list[Prospect])
async def list_prospects():
    """Return the top-30 draft prospects."""
    return get_draft_pool()


@router.get("/teams", response_model=list[Team])
async def list_teams():
    """Return all 7 teams."""
    return [Team(**td) for td in TEAMS_DATA]
