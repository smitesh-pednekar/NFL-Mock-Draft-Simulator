import type { DraftPick, DraftResults, DraftState, Prospect, Team } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body.detail ?? message;
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getProspects: () => request<Prospect[]>("/api/prospects"),

  getTeams: () => request<Team[]>("/api/teams"),

  startDraft: (userTeamId: number) =>
    request<DraftState>("/api/draft/start", {
      method: "POST",
      body: JSON.stringify({ user_team_id: userTeamId }),
    }),

  getState: (draftId: string) =>
    request<DraftState>(`/api/draft/${draftId}/state`),

  userPick: (draftId: string, prospectId: string) =>
    request<DraftState>(`/api/draft/${draftId}/pick`, {
      method: "POST",
      body: JSON.stringify({ prospect_id: prospectId }),
    }),

  getResults: (draftId: string) =>
    request<DraftResults>(`/api/draft/${draftId}/results`),

  /**
   * Open an SSE stream for the current AI pick.
   * Returns an EventSource connected to the stream.
   */
  aiPickStream: (draftId: string): EventSource => {
    return new EventSource(`${BASE_URL}/api/draft/${draftId}/ai-pick/stream`);
  },
};
