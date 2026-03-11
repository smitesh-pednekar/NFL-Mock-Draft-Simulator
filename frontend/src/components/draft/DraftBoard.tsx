"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDraftStore } from "@/store/draftStore";
import { DraftProgress } from "./DraftProgress";
import { ProspectList } from "./ProspectList";
import { TeamRoster } from "./TeamRoster";
import { DraftHistory } from "./DraftHistory";
import { AiThinkingIndicator } from "./AiThinkingIndicator";

type MobileTab = "prospects" | "roster" | "history";

export function DraftBoard() {
  const [mobileTab, setMobileTab] = useState<MobileTab>("prospects");
  const {
    draftState,
    phase,
    lastPick,
    positionFilter,
    setPositionFilter,
    makeUserPick,
  } = useDraftStore();

  if (!draftState) return null;

  const userTeam = draftState.teams.find((t) => t.id === draftState.user_team_id)!;
  const currentTeam = draftState.teams.find((t) => t.id === draftState.current_team_id) ?? null;
  const isUserTurn =
    draftState.current_team_id === draftState.user_team_id && !draftState.draft_complete;
  const isAiThinking = phase === "ai-thinking";

  return (
    <div className="flex flex-col gap-2 sm:gap-3 h-full">
      {/* Top: progress */}
      <DraftProgress
        currentRound={draftState.current_round}
        currentPickInRound={draftState.current_pick_in_round}
        overallPickNumber={draftState.overall_pick_number}
        userTeamId={draftState.user_team_id}
        currentTeamId={draftState.current_team_id}
        isComplete={draftState.draft_complete}
      />

      {/* Status strip */}
      <AiThinkingIndicator
        team={currentTeam}
        isThinking={isAiThinking}
        isUserTurn={isUserTurn}
        lastPick={lastPick}
      />

      {/* Mobile tab bar */}
      <div className="flex md:hidden shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
        {(["prospects", "roster", "history"] as MobileTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={cn(
              "flex-1 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors",
              mobileTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            )}
          >
            {tab === "prospects" ? "Prospects" : tab === "roster" ? "My Team" : "History"}
          </button>
        ))}
      </div>

      {/* Desktop: three-column grid */}
      <div className="hidden md:grid grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
        <div className="col-span-3 overflow-hidden">
          <TeamRoster team={userTeam} isUserTeam />
        </div>
        <div className="col-span-6 overflow-hidden flex flex-col">
          <ProspectList
            prospects={draftState.available_prospects}
            onSelect={makeUserPick}
            disabled={!isUserTurn || isAiThinking}
            positionFilter={positionFilter}
            onFilterChange={setPositionFilter}
          />
        </div>
        <div className="col-span-3 overflow-hidden">
          <DraftHistory
            picks={draftState.drafted_picks}
            teams={draftState.teams}
            userTeamId={draftState.user_team_id}
          />
        </div>
      </div>

      {/* Mobile: single panel via tabs */}
      <div className="md:hidden flex-1 min-h-0 overflow-hidden relative">
        <div className={cn("absolute inset-0 overflow-hidden flex flex-col", mobileTab !== "prospects" && "hidden")}>
          <ProspectList
            prospects={draftState.available_prospects}
            onSelect={makeUserPick}
            disabled={!isUserTurn || isAiThinking}
            positionFilter={positionFilter}
            onFilterChange={setPositionFilter}
          />
        </div>
        <div className={cn("absolute inset-0 overflow-hidden", mobileTab !== "roster" && "hidden")}>
          <TeamRoster team={userTeam} isUserTeam />
        </div>
        <div className={cn("absolute inset-0 overflow-hidden", mobileTab !== "history" && "hidden")}>
          <DraftHistory
            picks={draftState.drafted_picks}
            teams={draftState.teams}
            userTeamId={draftState.user_team_id}
          />
        </div>
      </div>
    </div>
  );
}
