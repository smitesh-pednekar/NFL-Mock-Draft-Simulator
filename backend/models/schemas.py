from __future__ import annotations

import uuid
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

Position = Literal["QB", "WR", "OT", "EDGE", "CB", "DT", "S", "LB", "TE", "RB", "OG", "DE", "ILB", "OLB", "G", "T", "C"]


class Prospect(BaseModel):
    id: str
    rank: int
    name: str
    position: str
    college: str
    height: Optional[str] = None
    weight: Optional[int] = None
    grade: Optional[float] = None
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    analysis: Optional[str] = None
    projected_round: Optional[str] = None


class Team(BaseModel):
    id: int
    name: str
    city: str
    full_name: str
    abbreviation: str
    needs: list[str]
    context: str
    primary_color: str = "#1a1a2e"
    secondary_color: str = "#16213e"


class DraftPick(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    round: int
    pick_in_round: int
    overall_pick: int
    prospect: Prospect
    team_id: int
    reasoning: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class TeamWithRoster(Team):
    roster: list[DraftPick] = []


# ── Request / Response schemas ────────────────────────────────────────────────

class StartDraftRequest(BaseModel):
    user_team_id: int = Field(..., ge=1, le=7)


class PickRequest(BaseModel):
    prospect_id: str


class DraftStateResponse(BaseModel):
    draft_id: str
    current_round: int
    current_pick_in_round: int
    overall_pick_number: int
    available_prospects: list[Prospect]
    drafted_picks: list[DraftPick]
    teams: list[TeamWithRoster]
    user_team_id: int
    draft_complete: bool
    is_ai_thinking: bool
    current_team_id: int  # whose turn it is


class DraftResultsResponse(BaseModel):
    teams: list[TeamWithRoster]
    undrafted: list[Prospect]
    total_picks: int
