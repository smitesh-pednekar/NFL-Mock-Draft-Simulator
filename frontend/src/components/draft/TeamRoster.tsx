"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { TeamWithRoster } from "@/lib/types";
import { PositionBadge } from "@/components/ui/PositionBadge";
import { SchoolLogo } from "@/components/ui/SchoolLogo";
import { TEAM_LOGOS } from "@/lib/constants";

interface Props {
  team: TeamWithRoster;
  isUserTeam?: boolean;
}

export function TeamRoster({ team, isUserTeam }: Props) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 h-full flex flex-col">
      {/* Header */}
      <div
        className="rounded-t-xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3"
        style={{ backgroundColor: team.primary_color + "cc" }}
      >
        {TEAM_LOGOS[team.id] && (
          <div className="w-10 h-10 sm:w-12 sm:h-12 relative shrink-0">
            <Image
              src={TEAM_LOGOS[team.id]}
              alt={team.full_name}
              fill
              className="object-contain drop-shadow-md"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-semibold" style={{ color: team.secondary_color }}>
            {isUserTeam ? "YOUR TEAM" : ""}
          </p>
          <h2 className="font-black text-white text-sm sm:text-base leading-tight truncate  mt-1">{team.full_name}</h2>
          <div className="flex flex-wrap gap-1 mt-3">
            {team.needs.map((n) => (
              <PositionBadge key={n} position={n} />
            ))}
          </div>
        </div>
      </div>

      {/* Picks */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {team.roster.length === 0 ? (
          <p className="text-center text-xs text-gray-500 py-6">No picks yet.</p>
        ) : (
          <AnimatePresence initial={false}>
            {team.roster.map((pick) => (
              <motion.div
                key={pick.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="bg-gray-50 dark:bg-white/5 rounded-lg px-3 py-2 flex items-center gap-2 border border-gray-100 dark:border-white/5"
              >
                <span className="text-xs text-gray-500 w-8 shrink-0">
                  R{pick.round}P{pick.pick_in_round}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {pick.prospect.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <SchoolLogo school={pick.prospect.college} size={13} />
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{pick.prospect.college}</p>
                  </div>
                </div>
                <PositionBadge position={pick.prospect.position} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
