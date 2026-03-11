"""Draft session router with SSE support for AI picks."""

from __future__ import annotations

import asyncio
import json
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from models.game_state import create_session, get_session
from models.schemas import (
    DraftResultsResponse,
    DraftStateResponse,
    PickRequest,
    StartDraftRequest,
    TeamWithRoster,
)
from services.draft_service import execute_ai_pick, execute_user_pick

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/draft", tags=["draft"])


# ── Session lifecycle ────────────────────────────────────────────────────────

@router.post("/start", response_model=DraftStateResponse)
async def start_draft(body: StartDraftRequest):
    """Create a new draft session."""
    session = create_session(user_team_id=body.user_team_id)
    return session.to_response()


@router.get("/{draft_id}/state", response_model=DraftStateResponse)
async def get_state(draft_id: str):
    session = get_session(draft_id)
    if not session:
        raise HTTPException(status_code=404, detail="Draft session not found.")
    return session.to_response()


# ── User pick ────────────────────────────────────────────────────────────────

@router.post("/{draft_id}/pick", response_model=DraftStateResponse)
async def user_pick(draft_id: str, body: PickRequest):
    session = get_session(draft_id)
    if not session:
        raise HTTPException(status_code=404, detail="Draft session not found.")
    if session.draft_complete:
        raise HTTPException(status_code=400, detail="Draft is already complete.")

    try:
        execute_user_pick(session, body.prospect_id)
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    return session.to_response()


# ── AI pick (SSE) ─────────────────────────────────────────────────────────────

@router.get("/{draft_id}/ai-pick/stream")
async def ai_pick_stream(draft_id: str):
    """
    SSE endpoint that:
    1. Emits 'thinking' immediately
    2. Calls Groq, applies the pick
    3. Emits 'complete' with the pick payload
    4. Closes the stream
    """
    session = get_session(draft_id)
    if not session:
        raise HTTPException(status_code=404, detail="Draft session not found.")
    if session.draft_complete:
        raise HTTPException(status_code=400, detail="Draft is already complete.")
    if session.is_user_turn:
        raise HTTPException(status_code=400, detail="It is the user's turn, not the AI's.")

    async def event_stream():
        # 1. Announce thinking
        yield _sse_event("thinking", {"team_id": session.current_team_id})
        await asyncio.sleep(0)  # yield control

        # 2. Execute pick
        try:
            pick = await execute_ai_pick(session)
            yield _sse_event("complete", {
                "pick": pick.model_dump(mode="json"),
                "state": session.to_response().model_dump(mode="json"),
            })
        except Exception as exc:
            logger.error("SSE ai-pick error: %s", exc)
            yield _sse_event("error", {"message": "AI pick failed. Please retry."})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


# ── Results ──────────────────────────────────────────────────────────────────

@router.get("/{draft_id}/results", response_model=DraftResultsResponse)
async def get_results(draft_id: str):
    session = get_session(draft_id)
    if not session:
        raise HTTPException(status_code=404, detail="Draft session not found.")

    drafted_ids = {p.prospect.id for p in session.drafted_picks}
    undrafted = [p for p in session.available_prospects if p.id not in drafted_ids]

    return DraftResultsResponse(
        teams=session.teams,
        undrafted=session.available_prospects,
        total_picks=len(session.drafted_picks),
    )


# ── Helpers ───────────────────────────────────────────────────────────────────

def _sse_event(event: str, data: dict) -> str:
    payload = json.dumps(data)
    return f"event: {event}\ndata: {payload}\n\n"
