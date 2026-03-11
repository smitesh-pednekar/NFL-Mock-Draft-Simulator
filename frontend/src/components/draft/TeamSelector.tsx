"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { Team } from "@/lib/types";
import { cn, getTeamAbbrevColor } from "@/lib/utils";
import { PositionBadge } from "@/components/ui/PositionBadge";
import { TEAM_LOGOS } from "@/lib/constants";

interface Props {
  teams: Team[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function TeamSelector({ teams, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
      {teams.map((team, i) => {
        const isSelected = selectedId === team.id;
        const abbrevColor = getTeamAbbrevColor(team.primary_color, team.secondary_color);

        return (
          <motion.button
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => onSelect(team.id)}
            className={cn(
              "relative text-left rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white",
              isSelected
                ? "border-blue-600 dark:border-white bg-blue-50 dark:bg-white/10 shadow-lg shadow-blue-500/20 dark:shadow-white/10"
                : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/30 hover:bg-gray-50 dark:hover:bg-white/10"
            )}
            style={isSelected ? { borderColor: abbrevColor } : {}}
            aria-pressed={isSelected}
          >
            {isSelected && (
              <CheckCircle
                size={16}
                className="absolute bottom-2.5 right-2.5 text-green-400"
              />
            )}

            {/* ── Mobile: horizontal layout ── */}
            <div className="flex sm:hidden flex-col">
              {/* Top row: logo + info + context */}
              <div className="flex items-start gap-3 p-3">
                {/* Logo */}
                {TEAM_LOGOS[team.id] && (
                  <div className="w-12 h-12 relative shrink-0 mt-0.5">
                    <Image src={TEAM_LOGOS[team.id]} alt={team.full_name} fill className="object-contain drop-shadow-md" />
                  </div>
                )}
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xl font-black leading-none" style={{ color: abbrevColor }}>
                      {team.abbreviation}
                    </div>
                    <span
                      className="shrink-0 rounded px-1.5 py-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: team.id === 6 ? "#FF3C00" : (team.primary_color || "#333") }}
                    >
                      Pick #{team.id}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-gray-900 dark:text-white leading-tight mt-0.5">
                    {team.full_name}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mt-1">
                    {team.context}
                  </p>
                </div>
              </div>
              {/* Needs footer */}
              <div className="flex items-center gap-1.5 flex-wrap px-3 pb-2.5 pt-1.5 border-t border-gray-100 dark:border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-0.5">Needs:</span>
                {team.needs.slice(0, 4).map((pos) => (
                  <PositionBadge key={pos} position={pos} />
                ))}
              </div>
            </div>

            {/* ── Desktop (sm+): vertical layout ── */}
            <div className="hidden sm:flex flex-col">
              <div className="p-4 flex-1">
                <div className="flex items-center justify-between mb-2">
                  {TEAM_LOGOS[team.id] && (
                    <div className="w-14 h-14 relative shrink-0">
                      <Image src={TEAM_LOGOS[team.id]} alt={team.full_name} fill className="object-contain drop-shadow-md" />
                    </div>
                  )}
                  <span
                    className="inline-block rounded px-2 py-0.5 text-xs font-bold text-white"
                    style={{ backgroundColor: team.id === 6 ? "#FF3C00" : (team.primary_color || "#333") }}
                  >
                    Pick #{team.id}
                  </span>
                </div>

                <div className="text-3xl font-black mb-1" style={{ color: abbrevColor }}>
                  {team.abbreviation}
                </div>

                <div className="text-sm font-semibold text-gray-900 dark:text-white">{team.full_name}</div>

                <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {team.context}
                </p>
              </div>
              {/* Needs footer */}
              <div className="flex items-center gap-1.5 flex-wrap px-4 pb-3 pt-2 border-t border-gray-100 dark:border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-0.5">Needs:</span>
                {team.needs.slice(0, 3).map((pos) => (
                  <PositionBadge key={pos} position={pos} />
                ))}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
