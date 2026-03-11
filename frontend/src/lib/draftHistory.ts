/**
 * Draft History — localStorage persistence layer.
 *
 * All reads/writes are wrapped in try/catch so a storage quota error or
 * private-browsing restriction never crashes the app.
 */

import type { DraftState, DraftResults, SavedDraft } from "./types";

const STORAGE_KEY = "nfl-draft-history-v1";
const MAX_SAVED = 20; // cap to avoid bloating localStorage

// ─── helpers ────────────────────────────────────────────────────────────────

function readAll(): SavedDraft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedDraft[];
  } catch {
    return [];
  }
}

function writeAll(drafts: SavedDraft[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    // quota exceeded — silently ignore
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── public API ─────────────────────────────────────────────────────────────

export function getSavedDrafts(): SavedDraft[] {
  return readAll().sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
}

export function saveDraft(
  draftState: DraftState,
  results: DraftResults | null
): SavedDraft {
  const userTeam = draftState.teams.find(
    (t) => t.id === draftState.user_team_id
  )!;

  const userPicks = (results?.teams ?? draftState.teams)
    .find((t) => t.id === draftState.user_team_id)
    ?.roster.slice()
    .sort((a, b) => a.overall_pick - b.overall_pick) ?? [];

  const completedAt = new Date().toISOString();
  const dateLabel = new Date(completedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const draft: SavedDraft = {
    id: generateId(),
    completedAt,
    userTeam,
    userPicks,
    teams: results?.teams ?? draftState.teams,
    totalPicks: results?.total_picks ?? draftState.drafted_picks.length,
    label: `${userTeam.full_name} — ${dateLabel}`,
  };

  const existing = readAll();
  // prevent exact duplicate (same draft_id via same session)
  const filtered = existing.filter(
    (d) => d.completedAt !== draft.completedAt || d.userTeam.id !== draft.userTeam.id
  );
  const updated = [draft, ...filtered].slice(0, MAX_SAVED);
  writeAll(updated);
  return draft;
}

export function deleteDraft(id: string): void {
  const updated = readAll().filter((d) => d.id !== id);
  writeAll(updated);
}

export function renameDraft(id: string, label: string): void {
  const updated = readAll().map((d) => (d.id === id ? { ...d, label } : d));
  writeAll(updated);
}

export function clearAllDrafts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
