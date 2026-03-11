"""AI service: calls Groq to make draft decisions with intelligent fallback."""

from __future__ import annotations

import json
import logging
import re
from typing import Optional

from groq import AsyncGroq

from config import settings
from models.schemas import DraftPick, Prospect, TeamWithRoster
from prompts.draft_prompt import build_draft_prompt

logger = logging.getLogger(__name__)

_MODEL_NAME = "llama-3.1-8b-instant"
_client: Optional[AsyncGroq] = None


def _get_client() -> AsyncGroq:
    global _client
    if _client is None:
        if not settings.groq_api_key:
            raise RuntimeError("GROQ_API_KEY is not set in environment.")
        _client = AsyncGroq(api_key=settings.groq_api_key)
    return _client


def _strip_fences(text: str) -> str:
    """Remove markdown code fences so the JSON parser can find the object."""
    # Remove ```json ... ``` or ``` ... ``` wrappers
    text = re.sub(r"```(?:json)?\s*", "", text)
    return text.strip()


def _parse_response(text: str, raw_for_log: str = "") -> dict:
    """Extract the outermost JSON object from the LLM response text."""
    clean = _strip_fences(text)
    # Try direct parse first (model returned pure JSON)
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        pass
    # Greedy regex – captures from first { to LAST }
    match = re.search(r"\{[\s\S]*\}", clean)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError as exc:
            logger.warning("JSON decode failed: %s | raw snippet: %.500s", exc, raw_for_log or text)
    else:
        logger.warning("No closing brace – response likely truncated. Raw: %.500s", raw_for_log or text)

    # Last-resort: pull selected_player_id directly even from a truncated response
    id_match = re.search(r'"selected_player_id"\s*:\s*"([^"]+)"', clean)
    reasoning_match = re.search(r'"reasoning"\s*:\s*"([^"]*)', clean)
    if id_match:
        return {
            "selected_player_id": id_match.group(1),
            "reasoning": reasoning_match.group(1).rstrip(',"{} ') if reasoning_match else "",
        }
    return {}


def _fallback_pick(
    team: TeamWithRoster,
    available_prospects: list[Prospect],
) -> tuple[Prospect, str]:
    """
    Intelligent fallback when LLM is unavailable:
    1. Highest-ranked prospect at primary need
    2. Highest-ranked at any team need
    3. Best player available overall
    """
    for need in team.needs:
        for p in available_prospects:
            if p.position == need:
                return p, f"Selected via fallback: highest-ranked {need} available."

    best = available_prospects[0]
    return best, "Selected via BPA fallback."


async def make_ai_pick(
    team: TeamWithRoster,
    available_prospects: list[Prospect],
    current_round: int,
    current_pick: int,
    overall_pick: int,
) -> tuple[Prospect, str]:
    """
    Make an AI-driven pick. Returns (Prospect, reasoning_string).
    Falls back gracefully on any error.
    """
    try:
        client = _get_client()
        prompt = build_draft_prompt(
            team=team,
            available_prospects=available_prospects,
            current_round=current_round,
            current_pick=current_pick,
            overall_pick=overall_pick,
        )
        response = await client.chat.completions.create(
            model=_MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=512,
        )
        raw = response.choices[0].message.content or ""
        logger.debug("Model raw response (%.300s)", raw)
        result = _parse_response(raw, raw_for_log=raw)
        selected_id = result.get("selected_player_id", "").removeprefix("ID:")
        reasoning = result.get("reasoning", "")

        available_ids = {p.id for p in available_prospects}
        if selected_id in available_ids:
            prospect = next(p for p in available_prospects if p.id == selected_id)
            return prospect, reasoning or "AI selection."

        logger.warning("AI returned unknown player id '%s'; falling back.", selected_id)

    except Exception as exc:
        logger.error("AI pick failed for %s: %s", team.full_name, exc)

    return _fallback_pick(team, available_prospects)
