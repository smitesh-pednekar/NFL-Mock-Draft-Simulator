"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { DraftPick } from "@/lib/types";
import { PositionBadge } from "@/components/ui/PositionBadge";
import { SchoolLogo } from "@/components/ui/SchoolLogo";
import { TEAM_LOGOS } from "@/lib/constants";
import { getTeamAbbrevColor } from "@/lib/utils";

interface Props {
  picks: DraftPick[];
  teams: { id: number; full_name: string; abbreviation: string; primary_color: string; secondary_color: string }[];
  userTeamId: number;
}

export function DraftHistory({ picks, teams, userTeamId }: Props) {
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 h-full flex flex-col">
      <div className="px-3 sm:px-4 py-3 border-b border-gray-200 dark:border-white/10">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Draft History</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{picks.length} picks made</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-0">
        {picks.length === 0 && (
          <p className="text-center text-xs text-gray-500 py-6">Draft hasn&apos;t started yet.</p>
        )}

        {[...picks].reverse().map((pick) => {
          const team = teamMap[pick.team_id];
          const isUser = pick.team_id === userTeamId;
          return (
            <motion.div
              key={pick.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg p-2 sm:p-2.5 flex items-start gap-1.5 sm:gap-2 border ${
                isUser ? "border-blue-500/40 bg-blue-900/20" : "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-transparent"
              }`}
            >
              {/* Pick number */}
              <span className="text-xs text-gray-500 shrink-0 w-5 pt-0.5 text-center font-mono">
                {pick.overall_pick}
              </span>

              {/* Team logo + abbr */}
              <div className="flex items-center gap-1 shrink-0 w-10 sm:w-12">
                {team && TEAM_LOGOS[team.id] && (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 relative shrink-0">
                    <Image src={TEAM_LOGOS[team.id]} alt={team.full_name} fill className="object-contain" />
                  </div>
                )}
                <span
                  className="text-xs font-black"
                  style={{ color: team ? getTeamAbbrevColor(team.primary_color, team.secondary_color) : "#fff" }}
                >
                  {team?.abbreviation ?? "?"}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{pick.prospect.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <SchoolLogo school={pick.prospect.college} size={14} />
                  <p className="text-xs text-gray-500 truncate">{pick.prospect.college}</p>
                </div>
                {pick.reasoning && pick.reasoning !== "User selection." && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 italic">
                    &quot;{pick.reasoning}&quot;
                  </p>
                )}
              </div>

              <PositionBadge position={pick.prospect.position} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
