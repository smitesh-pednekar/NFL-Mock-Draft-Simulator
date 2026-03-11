"""In-memory draft session state management."""

from __future__ import annotations

import uuid
from copy import deepcopy
from typing import Optional

from models.schemas import (
    DraftPick,
    DraftStateResponse,
    Prospect,
    TeamWithRoster,
)
from data.constants import TEAMS_DATA
from services.player_service import get_draft_pool

TOTAL_ROUNDS = 4
TOTAL_TEAMS = 7
TOTAL_PICKS = TOTAL_ROUNDS * TOTAL_TEAMS  # 28


class DraftSession:
    """Encapsulates the mutable state for a single draft session."""

    def __init__(self, draft_id: str, user_team_id: int, prospects: list[Prospect]):
        self.draft_id = draft_id
        self.user_team_id = user_team_id

        self.teams: list[TeamWithRoster] = [
            TeamWithRoster(**td) for td in TEAMS_DATA
        ]

        self.available_prospects: list[Prospect] = list(prospects)
        self.drafted_picks: list[DraftPick] = []

        self.overall_pick_number: int = 1  # 1-indexed, max 28
        self.is_ai_thinking: bool = False
        self.draft_complete: bool = False

    # ── Computed properties ──────────────────────────────────────────────────

    @property
    def current_round(self) -> int:
        return (self.overall_pick_number - 1) // TOTAL_TEAMS + 1

    @property
    def current_pick_in_round(self) -> int:
        return (self.overall_pick_number - 1) % TOTAL_TEAMS + 1

    @property
    def current_team_id(self) -> int:
        """1-indexed team ID whose turn it is (same order every round: 1→7)."""
        return self.current_pick_in_round

    @property
    def is_user_turn(self) -> bool:
        return self.current_team_id == self.user_team_id and not self.draft_complete

    # ── Mutation helpers ─────────────────────────────────────────────────────

    def apply_pick(self, prospect: Prospect, reasoning: Optional[str] = None) -> DraftPick:
        """Apply a pick and advance draft state. Returns the resulting DraftPick."""
        pick = DraftPick(
            round=self.current_round,
            pick_in_round=self.current_pick_in_round,
            overall_pick=self.overall_pick_number,
            prospect=prospect,
            team_id=self.current_team_id,
            reasoning=reasoning,
        )

        # Remove from available pool
        self.available_prospects = [
            p for p in self.available_prospects if p.id != prospect.id
        ]

        # Add to drafted list and team roster
        self.drafted_picks.append(pick)
        for team in self.teams:
            if team.id == self.current_team_id:
                team.roster.append(pick)
                break

        self.overall_pick_number += 1

        if self.overall_pick_number > TOTAL_PICKS:
            self.draft_complete = True

        return pick

    def to_response(self) -> DraftStateResponse:
        return DraftStateResponse(
            draft_id=self.draft_id,
            current_round=self.current_round,
            current_pick_in_round=self.current_pick_in_round,
            overall_pick_number=self.overall_pick_number,
            available_prospects=self.available_prospects,
            drafted_picks=self.drafted_picks,
            teams=deepcopy(self.teams),
            user_team_id=self.user_team_id,
            draft_complete=self.draft_complete,
            is_ai_thinking=self.is_ai_thinking,
            current_team_id=self.current_team_id if not self.draft_complete else 0,
        )


# ── Session store (in-memory, single-process) ────────────────────────────────

_sessions: dict[str, DraftSession] = {}


def create_session(user_team_id: int) -> DraftSession:
    draft_id = str(uuid.uuid4())
    prospects = get_draft_pool()
    session = DraftSession(draft_id=draft_id, user_team_id=user_team_id, prospects=prospects)
    _sessions[draft_id] = session
    return session


def get_session(draft_id: str) -> Optional[DraftSession]:
    return _sessions.get(draft_id)


def delete_session(draft_id: str) -> None:
    _sessions.pop(draft_id, None)
