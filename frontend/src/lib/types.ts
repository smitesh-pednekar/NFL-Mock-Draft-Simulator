// Core domain types for the NFL Mock Draft Simulator

export type Position =
  | "QB"
  | "WR"
  | "OT"
  | "EDGE"
  | "CB"
  | "DT"
  | "S"
  | "LB"
  | "TE"
  | "RB"
  | "OG"
  | "DE"
  | "ILB"
  | "OLB"
  | "G"
  | "T"
  | "C";

export interface Prospect {
  id: string;
  rank: number;
  name: string;
  position: string;
  college: string;
  height?: string;
  weight?: number;
  grade?: number;
  strengths?: string;
  weaknesses?: string;
  analysis?: string;
  projected_round?: string;
}

export interface Team {
  id: number;
  name: string;
  city: string;
  full_name: string;
  abbreviation: string;
  needs: string[];
  context: string;
  primary_color: string;
  secondary_color: string;
}

export interface DraftPick {
  id: string;
  round: number;
  pick_in_round: number;
  overall_pick: number;
  prospect: Prospect;
  team_id: number;
  reasoning?: string;
  timestamp: string;
}

export interface TeamWithRoster extends Team {
  roster: DraftPick[];
}

export interface DraftState {
  draft_id: string;
  current_round: number;
  current_pick_in_round: number;
  overall_pick_number: number;
  available_prospects: Prospect[];
  drafted_picks: DraftPick[];
  teams: TeamWithRoster[];
  user_team_id: number;
  draft_complete: boolean;
  is_ai_thinking: boolean;
  current_team_id: number;
}

export interface DraftResults {
  teams: TeamWithRoster[];
  undrafted: Prospect[];
  total_picks: number;
}

// SSE event payloads
export type AiPickEvent =
  | { event: "thinking"; team_id: number }
  | { event: "complete"; pick: DraftPick; state: DraftState }
  | { event: "error"; message: string };

// ─── Saved draft history ────────────────────────────────────────────────────

export interface SavedDraft {
  /** Unique local ID (uuid) */
  id: string;
  /** Date the draft was completed */
  completedAt: string;
  /** The team the user drafted for */
  userTeam: Team;
  /** User's picks only, in round order */
  userPicks: DraftPick[];
  /** All team rosters at draft end */
  teams: TeamWithRoster[];
  /** Total picks in the draft */
  totalPicks: number;
  /** User-defined label, defaults to team full name + date */
  label: string;
}
