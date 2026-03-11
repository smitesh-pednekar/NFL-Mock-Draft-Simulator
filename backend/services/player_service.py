"""Player data service: loads and normalises prospect CSV data."""

from __future__ import annotations

import csv
import re
from functools import lru_cache
from pathlib import Path

from models.schemas import Prospect
from data.constants import POSITION_CANONICAL

_CSV_PATH = Path(__file__).parent.parent / "data" / "players.csv"

# How many players to expose as the draft pool
DRAFT_POOL_SIZE = 30


def _normalize_position(raw: str) -> str:
    raw = raw.strip()
    return POSITION_CANONICAL.get(raw, raw)


def _parse_weight(raw: str) -> int | None:
    if not raw or raw in ("N/A", ""):
        return None
    try:
        return int(raw)
    except ValueError:
        return None


def _parse_grade(raw: str) -> float | None:
    if not raw or raw in ("N/A", ""):
        return None
    try:
        return float(raw)
    except ValueError:
        return None


def _slug(name: str) -> str:
    """Turn a player name into a URL-safe ID."""
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


@lru_cache(maxsize=1)
def load_all_prospects() -> list[Prospect]:
    """Load ALL prospects from CSV, deduplicated, sorted by grade desc."""
    seen_names: set[str] = set()
    prospects: list[Prospect] = []

    with open(_CSV_PATH, newline="", encoding="cp1252", errors="replace") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            name = row.get("Name", "").strip()
            if not name or name in seen_names:
                continue
            seen_names.add(name)

            rank_raw = row.get("Rank", "").strip()
            grade_raw = row.get("Grade", "").strip()

            try:
                rank = int(rank_raw)
            except ValueError:
                continue  # skip malformed rows

            position_raw = row.get("Position", "").strip()
            position = _normalize_position(position_raw)

            prospect = Prospect(
                id=_slug(name),
                rank=rank,
                name=name,
                position=position,
                college=row.get("School", "").strip(),
                height=row.get("Height", "").strip() or None,
                weight=_parse_weight(row.get("Weight", "")),
                grade=_parse_grade(grade_raw),
                strengths=row.get("Strengths", "").strip() or None,
                weaknesses=row.get("Weaknesses", "").strip() or None,
                analysis=row.get("Analysis", "").strip() or None,
                projected_round=row.get("Projected Round", "").strip() or None,
            )
            prospects.append(prospect)

    # Sort by grade descending, then rank ascending as tiebreaker
    prospects.sort(key=lambda p: (-(p.grade or 0), p.rank))
    return prospects


def get_draft_pool(size: int = DRAFT_POOL_SIZE) -> list[Prospect]:
    """Return the top-N prospects for the draft pool, ordered by big-board rank."""
    all_p = load_all_prospects()
    pool = all_p[:size]
    pool.sort(key=lambda p: p.rank)
    return pool
