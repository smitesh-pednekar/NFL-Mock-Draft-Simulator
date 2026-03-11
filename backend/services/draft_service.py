"""Draft orchestration service."""

from __future__ import annotations

import logging

from models.game_state import DraftSession
from models.schemas import DraftPick, Prospect
from services.ai_service import make_ai_pick

logger = logging.getLogger(__name__)


async def execute_ai_pick(session: DraftSession) -> DraftPick:
    """Run the AI pick for the current team in `session` and apply it."""
    team = next(t for t in session.teams if t.id == session.current_team_id)

    session.is_ai_thinking = True
    try:
        prospect, reasoning = await make_ai_pick(
            team=team,
            available_prospects=session.available_prospects,
            current_round=session.current_round,
            current_pick=session.current_pick_in_round,
            overall_pick=session.overall_pick_number,
        )
        pick = session.apply_pick(prospect, reasoning=reasoning)
        return pick
    finally:
        session.is_ai_thinking = False


def execute_user_pick(session: DraftSession, prospect_id: str) -> DraftPick:
    """Apply a user-submitted pick, after validating it."""
    available_ids = {p.id for p in session.available_prospects}
    if prospect_id not in available_ids:
        raise ValueError(f"Prospect '{prospect_id}' is not available.")

    if not session.is_user_turn:
        raise PermissionError("It is not the user's turn.")

    prospect = next(p for p in session.available_prospects if p.id == prospect_id)
    return session.apply_pick(prospect, reasoning="User selection.")
