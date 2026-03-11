"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { DraftPick, TeamWithRoster } from "@/lib/types";
import { PositionBadge } from "@/components/ui/PositionBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { TEAM_LOGOS } from "@/lib/constants";

interface Props {
  team: TeamWithRoster | null;
  isThinking: boolean;
  isUserTurn: boolean;
  lastPick: DraftPick | null;
}

export function AiThinkingIndicator({ team, isThinking, isUserTurn, lastPick }: Props) {
  if (isUserTurn) {
    return (
      <motion.div
        key="user-turn"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-600/20 border border-blue-500/40 rounded-xl px-4 py-3 text-center"
      >
        <p className="text-blue-700 dark:text-blue-300 font-bold text-sm">🏈 YOUR PICK — You&apos;re on the clock!</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Select a player from the list below.
        </p>
      </motion.div>
    );
  }

  if (isThinking && team) {
    return (
      <motion.div
        key="ai-thinking"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl px-4 py-3 flex items-center gap-3 border border-black/10 dark:border-white/10"
        style={{ backgroundColor: team.primary_color + "55" }}
      >
        <LoadingSpinner className="text-white" />
        {TEAM_LOGOS[team.id] && (
          <div className="w-8 h-8 relative shrink-0">
            <Image src={TEAM_LOGOS[team.id]} alt={team.full_name} fill className="object-contain" />
          </div>
        )}
        <div>
          <p className="text-gray-900 dark:text-white font-bold text-sm">
            {team.full_name} is on the clock…
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">AI is evaluating prospects</p>
        </div>
      </motion.div>
    );
  }

  if (lastPick && !isUserTurn && !isThinking) {
    const teamName = team?.full_name ?? `Team ${lastPick.team_id}`;
    return (
      <motion.div
        key={`pick-${lastPick.id}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl px-4 py-3 border border-green-600/40 dark:border-green-500/30 bg-green-100/60 dark:bg-green-900/20"
      >
        <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-1 truncate">
          Pick #{lastPick.overall_pick} — {teamName}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
          <PositionBadge position={lastPick.prospect.position} className="shrink-0" />
          <span className="font-bold text-sm text-gray-900 dark:text-white truncate min-w-0">{lastPick.prospect.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{lastPick.prospect.college}</span>
        </div>
        {lastPick.reasoning && lastPick.reasoning !== "User selection." && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">&quot;{lastPick.reasoning}&quot;</p>
        )}
      </motion.div>
    );
  }

  return null;
}
