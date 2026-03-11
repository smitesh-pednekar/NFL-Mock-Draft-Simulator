"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DraftPick, DraftResults, DraftState, TeamWithRoster } from "@/lib/types";
import { api } from "@/lib/api";
import { PICK_DELAY_MS } from "@/lib/constants";
import { saveDraft } from "@/lib/draftHistory";
import { useHistoryStore } from "./historyStore";

export type DraftPhase =
  | "team-selection"
  | "drafting"
  | "ai-thinking"
  | "results";

interface DraftStore {
  phase: DraftPhase;
  draftState: DraftState | null;
  lastPick: DraftPick | null;
  error: string | null;
  positionFilter: string;
  /** Results cached after draft completes (used for auto-save) */
  cachedResults: DraftResults | null;

  // Actions
  setPhase: (phase: DraftPhase) => void;
  startDraft: (userTeamId: number) => Promise<void>;
  makeUserPick: (prospectId: string) => Promise<void>;
  triggerAiPick: () => Promise<void>;
  resetDraft: () => void;
  setPositionFilter: (pos: string) => void;
  dismissError: () => void;
  setCachedResults: (r: DraftResults) => void;
}

const initialState = {
  phase: "team-selection" as DraftPhase,
  draftState: null,
  lastPick: null,
  error: null,
  positionFilter: "ALL",
  cachedResults: null,
};

/** Persist draft to history and notify historyStore */
function persistToHistory(state: DraftState, results: DraftResults | null) {
  try {
    const saved = saveDraft(state, results);
    useHistoryStore.getState().addDraft(saved);
  } catch {
    // never let a storage error break the app
  }
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPhase: (phase) => set({ phase }),

      startDraft: async (userTeamId) => {
        try {
          set({ error: null });
          const state = await api.startDraft(userTeamId);
          set({ draftState: state, phase: "drafting", lastPick: null });

          // If AI goes first, trigger it immediately
          if (state.current_team_id !== userTeamId && !state.draft_complete) {
            setTimeout(() => get().triggerAiPick(), 600);
          }
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },

      makeUserPick: async (prospectId) => {
        const { draftState } = get();
        if (!draftState) return;
        try {
          set({ error: null });
          const newState = await api.userPick(draftState.draft_id, prospectId);
          const lastPick = newState.drafted_picks[newState.drafted_picks.length - 1];
          set({ draftState: newState, lastPick });

          if (newState.draft_complete) {
            set({ phase: "results" });
            // Auto-save with whatever results we have now (full results fetched by page.tsx)
            persistToHistory(newState, null);
          } else if (newState.current_team_id !== newState.user_team_id) {
            setTimeout(() => get().triggerAiPick(), 800);
          }
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },

      triggerAiPick: async () => {
        const { draftState } = get();
        if (!draftState || draftState.draft_complete) return;

        set({ phase: "ai-thinking" });

        return new Promise<void>((resolve) => {
          const source = api.aiPickStream(draftState.draft_id);
          const startTime = Date.now();

          source.addEventListener("thinking", () => {
            // Already in ai-thinking phase; nothing extra needed
          });

          source.addEventListener("complete", (ev: MessageEvent) => {
            source.close();
            const data = JSON.parse(ev.data) as { pick: DraftPick; state: DraftState };
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, PICK_DELAY_MS - elapsed);

            setTimeout(() => {
              set({
                draftState: data.state,
                lastPick: data.pick,
                phase: data.state.draft_complete ? "results" : "drafting",
              });

              if (data.state.draft_complete) {
                persistToHistory(data.state, null);
              }

              // Chain next AI pick if still not user's turn
              if (
                !data.state.draft_complete &&
                data.state.current_team_id !== data.state.user_team_id
              ) {
                setTimeout(() => get().triggerAiPick(), 600);
              }
              resolve();
            }, remaining);
          });

          source.addEventListener("error", (ev: Event) => {
            source.close();
            const msg = (ev as MessageEvent).data
              ? JSON.parse((ev as MessageEvent).data).message
              : "AI pick failed.";
            set({ error: msg, phase: "drafting" });
            resolve();
          });

          // Handle EventSource network errors
          source.onerror = () => {
            source.close();
            set({ error: "Connection error during AI pick.", phase: "drafting" });
            resolve();
          };
        });
      },

      resetDraft: () => {
        set(initialState);
      },

      setPositionFilter: (pos) => set({ positionFilter: pos }),
      dismissError: () => set({ error: null }),
      setCachedResults: (r) => set({ cachedResults: r }),
    }),
    {
      name: "nfl-draft-state",
      partialize: (state) => ({
        phase: state.phase,
        draftState: state.draftState,
        lastPick: state.lastPick,
      }),
    }
  )
);
