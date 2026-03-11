"""LLM prompt templates for draft decisions."""

from __future__ import annotations

from models.schemas import DraftPick, Prospect, TeamWithRoster


def _format_roster(roster: list[DraftPick]) -> str:
    if not roster:
        return "  (no picks yet)"
    lines = [f"  R{p.round}P{p.pick_in_round}: {p.prospect.name} ({p.prospect.position})" for p in roster]
    return "\n".join(lines)


def _format_prospects(prospects: list[Prospect]) -> str:
    lines = []
    for p in prospects:
        grade_str = f" | Grade: {p.grade}" if p.grade else ""
        lines.append(f"  ID:{p.id} | #{p.rank} {p.name} ({p.position}) – {p.college}{grade_str}")
    return "\n".join(lines)


def _smart_prospect_pool(
    available_prospects: list[Prospect],
    team_needs: list[str],
    pool_size: int = 15,
    needs_per_position: int = 3,
) -> list[Prospect]:
    """
    Build a smart prospect pool for the AI:
    - Top N prospects by overall rank (BPA)
    - Top `needs_per_position` prospects at each team need position
    Deduplicates and re-sorts by rank so the list stays coherent.
    """
    bpa = available_prospects[:pool_size]
    needs_picks: list[Prospect] = []
    for pos in team_needs:
        pos_players = [p for p in available_prospects if p.position == pos]
        needs_picks.extend(pos_players[:needs_per_position])

    merged = {p.id: p for p in bpa + needs_picks}
    return sorted(merged.values(), key=lambda p: p.rank)[:pool_size]


def build_draft_prompt(
    team: TeamWithRoster,
    available_prospects: list[Prospect],
    current_round: int,
    current_pick: int,
    overall_pick: int,
) -> str:
    # Smart pool: top BPA prospects + top prospects at each positional need
    top_available = _smart_prospect_pool(available_prospects, team.needs)

    return f"""You are the General Manager of the {team.full_name} making a pick in the 2026 NFL Draft.

## Team Situation
{team.context}

## Positional Needs (Priority Order)
{', '.join(team.needs)}

## Players Already Drafted By Your Team
{_format_roster(team.roster)}

## Current Pick
Round {current_round}, Pick {current_pick} (Overall #{overall_pick})

## Available Prospects (Big Board Order)
{_format_prospects(top_available)}

## Instructions
Select the best player for your franchise. Consider:
1. Positional needs vs. best player available (BPA)
2. Which positions can be addressed in later rounds
3. Value at this draft slot

YOUR RESPONSE MUST BE RAW JSON ONLY. No markdown. No code fences. No explanation outside the JSON.
Output exactly this structure and nothing else:
{{"selected_player_id": "<exact id string from the list above>", "reasoning": "<2-3 sentences explaining this pick>"}}"""
