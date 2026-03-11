"use client";

import { motion } from "framer-motion";
import { X, ArrowLeftRight } from "lucide-react";
import Image from "next/image";
import type { SavedDraft, DraftPick } from "@/lib/types";
import { PositionBadge } from "@/components/ui/PositionBadge";
import { TEAM_LOGOS } from "@/lib/constants";

interface Props {
  a: SavedDraft;
  b: SavedDraft;
  onClose: () => void;
}

// Build a lookup: round → pick
function pickMap(picks: DraftPick[]): Map<number, DraftPick> {
  return new Map(picks.map((p) => [p.round, p]));
}

// All unique round keys, sorted
function allSlots(a: DraftPick[], b: DraftPick[]): number[] {
  const rounds = new Set([...a.map((p) => p.round), ...b.map((p) => p.round)]);
  return [...rounds].sort((x, y) => x - y);
}

function TeamHeader({ draft }: { draft: SavedDraft }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-t-xl"
      style={{ backgroundColor: draft.userTeam.primary_color + "cc" }}
    >
      {TEAM_LOGOS[draft.userTeam.id] && (
        <div className="w-10 h-10 relative shrink-0">
          <Image
            src={TEAM_LOGOS[draft.userTeam.id]}
            alt={draft.userTeam.full_name}
            fill
            className="object-contain"
          />
        </div>
      )}
      <div className="min-w-0">
        <p
          className="text-xs font-bold uppercase tracking-wider truncate"
          style={{ color: draft.userTeam.secondary_color }}
        >
          {draft.userTeam.abbreviation}
        </p>
        <p className="text-white text-sm font-black truncate">{draft.label}</p>
      </div>
    </div>
  );
}

export function DraftCompareModal({ a, b, onClose }: Props) {
  const mapA = pickMap(a.userPicks);
  const mapB = pickMap(b.userPicks);
  const slots = allSlots(a.userPicks, b.userPicks);

  let sharedCount = 0;
  let diffCount = 0;
  slots.forEach((round) => {
    const pA = mapA.get(round);
    const pB = mapB.get(round);
    if (pA && pB) {
      if (pA.prospect.name === pB.prospect.name) sharedCount++;
      else diffCount++;
    }
  });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="bg-gray-900 border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl max-h-[92dvh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={16} className="text-blue-400" />
            <h2 className="text-white font-bold text-sm sm:text-base">Draft Comparison</h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="text-green-400 font-semibold">{sharedCount} same</span>
            <span className="text-red-400 font-semibold">{diffCount} different</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Two-column team headers */}
        <div className="grid grid-cols-2 shrink-0">
          <TeamHeader draft={a} />
          <div className="border-l border-white/10">
            <TeamHeader draft={b} />
          </div>
        </div>

        {/* Pick rows */}
        <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-white/5">
        {slots.map((round) => {
            const pA = mapA.get(round);
            const pB = mapB.get(round);
            const same = pA && pB && pA.prospect.name === pB.prospect.name;
            const onlyA = pA && !pB;
            const onlyB = !pA && pB;

            const rowBg = same
              ? "bg-green-500/20 border-l-2 border-green-400/60"
              : pA && pB
              ? "bg-red-500/20 border-l-2 border-red-400/60"
              : "bg-white/[0.02]";

            return (
              <div key={round} className={`grid grid-cols-2 border-b border-white/5 ${rowBg}`}>
                {/* Round label bar */}
                <div className="col-span-2 px-3 pt-2 pb-0.5">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    same ? "text-green-400" : pA && pB ? "text-red-400" : "text-gray-500"
                  }`}>Round {round}</span>
                </div>

                {/* Column A */}
                <div className={`px-3 pb-2.5 flex items-center gap-2 ${onlyB ? "opacity-30" : ""}`}>
                  {pA ? (
                    <>
                      <span className="text-xs text-gray-400 font-mono shrink-0">
                        Pick {pA.overall_pick}
                      </span>
                      <span className={`flex-1 text-xs sm:text-sm font-semibold truncate ${
                        same ? "text-green-300" : pA && pB ? "text-red-300" : "text-white"
                      }`}>
                        {pA.prospect.name}
                      </span>
                      <PositionBadge position={pA.prospect.position} />
                    </>
                  ) : (
                    <span className="text-xs text-gray-600 italic">—</span>
                  )}
                </div>

                {/* Column B */}
                <div className={`px-3 pb-2.5 flex items-center gap-2 border-l border-white/10 ${onlyA ? "opacity-30" : ""}`}>
                  {pB ? (
                    <>
                      <span className="text-xs text-gray-400 font-mono shrink-0">
                        Pick {pB.overall_pick}
                      </span>
                      <span className={`flex-1 text-xs sm:text-sm font-semibold truncate ${
                        same ? "text-green-300" : pA && pB ? "text-red-300" : "text-white"
                      }`}>
                        {pB.prospect.name}
                      </span>
                      <PositionBadge position={pB.prospect.position} />
                    </>
                  ) : (
                    <span className="text-xs text-gray-600 italic">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-5 py-3 border-t border-white/10 shrink-0 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-400/70 inline-block ring-1 ring-green-400/40" />
            <span className="text-green-400 font-semibold">Same pick</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-400/70 inline-block ring-1 ring-red-400/40" />
            <span className="text-red-400 font-semibold">Different player</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
