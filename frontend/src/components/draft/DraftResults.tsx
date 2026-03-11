"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Trophy, Share2, History } from "lucide-react";
import type { DraftResults, SavedDraft, TeamWithRoster } from "@/lib/types";
import { PositionBadge } from "@/components/ui/PositionBadge";
import { TEAM_LOGOS } from "@/lib/constants";
import { ShareModal } from "./ShareModal";
import { DraftHistoryDrawer } from "./DraftHistoryDrawer";
import { DraftCompareModal } from "./DraftCompareModal";
import { useHistoryStore } from "@/store/historyStore";

interface Props {
  results: DraftResults | null;
  draftState: { teams: TeamWithRoster[]; user_team_id: number } | null;
  onRestart: () => void;
}

export function DraftResults({ results, draftState, onRestart }: Props) {
  const [showShare, setShowShare] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [compareTargets, setCompareTargets] = useState<[SavedDraft, SavedDraft] | null>(null);
  const { drafts } = useHistoryStore();

  const teams = results?.teams ?? draftState?.teams ?? [];
  const userTeamId = draftState?.user_team_id;
  const userTeam = teams.find((t) => t.id === userTeamId);

  // Sort teams by draft order (id)
  const sorted = [...teams].sort((a, b) => a.id - b.id);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5 sm:mb-8"
      >
        <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 rounded-full px-4 py-1.5 mb-3 sm:mb-4">
          <Trophy size={16} className="text-yellow-600 dark:text-yellow-400" />
          <span className="text-yellow-700 dark:text-yellow-300 font-bold text-sm">2026 NFL Draft Complete</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Draft Results</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">{results?.total_picks ?? 0} total picks made across 4 rounds</p>
      </motion.div>

      {/* Teams grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-8">
        {sorted.map((team, i) => {
          const isUser = team.id === userTeamId;
          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl border overflow-hidden ${
                isUser ? "border-blue-500/60 ring-1 ring-blue-500/30" : "border-gray-200 dark:border-white/10"
              }`}
            >
              <div
                className="px-3 py-2 flex items-center gap-2"
                style={{ backgroundColor: team.primary_color + "cc" }}
              >
                {TEAM_LOGOS[team.id] && (
                  <div className="w-8 h-8 relative shrink-0">
                    <Image src={TEAM_LOGOS[team.id]} alt={team.full_name} fill className="object-contain drop-shadow-sm" />
                  </div>
                )}
                <span
                  className="text-base font-black"
                  style={{ color: team.secondary_color }}
                >
                  {team.abbreviation}
                </span>
                <span className="text-white text-sm font-semibold flex-1 truncate">
                  {team.city}
                </span>
                {isUser && (
                  <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">
                    YOU
                  </span>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-white/5 p-3 space-y-1.5">
                {team.roster.length === 0 ? (
                  <p className="text-xs text-gray-500">No picks</p>
                ) : (
                  team.roster.map((pick) => (
                    <div key={pick.id} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-8 shrink-0">
                        R{pick.round}P{pick.pick_in_round}
                      </span>
                      <span className="text-xs text-gray-900 dark:text-white flex-1 truncate font-medium">
                        {pick.prospect.name}
                      </span>
                      <PositionBadge position={pick.prospect.position} />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Undrafted prospects */}
      {results?.undrafted && results.undrafted.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 mb-8"
        >
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="font-bold text-gray-900 dark:text-white">Undrafted Prospects</h3>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {results.undrafted.slice(0, 20).map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-xs text-gray-400">
                <PositionBadge position={p.position} />
                <span className="truncate">{p.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
        {userTeam && (
          <button
            onClick={() => setShowShare(true)}
            className="inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          >
            <Share2 size={14} />
            Share Draft
          </button>
        )}
        <button
          onClick={() => setShowHistory(true)}
          className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 dark:text-white text-gray-900 font-bold text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <History size={14} />
          My Drafts
          {drafts.length > 0 && (
            <span className="bg-blue-600 text-white rounded-full text-[10px] font-black leading-none px-1.5 py-0.5">
              {drafts.length}
            </span>
          )}
        </button>
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <RotateCcw size={14} />
          Start New Draft
        </button>
      </div>

      {/* Share modal */}
      {showShare && userTeam && (
        <ShareModal team={userTeam} onClose={() => setShowShare(false)} />
      )}

      {/* History drawer */}
      <AnimatePresence>
        {showHistory && (
          <DraftHistoryDrawer
            onClose={() => setShowHistory(false)}
            onCompare={(a, b) => { setShowHistory(false); setCompareTargets([a, b]); }}
          />
        )}
      </AnimatePresence>

      {/* Compare modal */}
      <AnimatePresence>
        {compareTargets && (
          <DraftCompareModal
            a={compareTargets[0]}
            b={compareTargets[1]}
            onClose={() => setCompareTargets(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
