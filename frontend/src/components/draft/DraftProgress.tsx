"use client";

import { TOTAL_ROUNDS, TOTAL_TEAMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  currentRound: number;
  currentPickInRound: number;
  overallPickNumber: number;
  userTeamId: number;
  currentTeamId: number;
  isComplete: boolean;
}

export function DraftProgress({
  currentRound,
  currentPickInRound,
  overallPickNumber,
  userTeamId,
  currentTeamId,
  isComplete,
}: Props) {
  const completedPicks = overallPickNumber - 1;
  const totalPicks = TOTAL_ROUNDS * TOTAL_TEAMS;
  const pct = Math.round((completedPicks / totalPicks) * 100);

  return (
    <div className="bg-white dark:bg-white/5 rounded-xl px-3 py-2.5 sm:p-4 border border-gray-200 dark:border-white/10">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="min-w-0">
          {isComplete ? (
            <span className="text-green-400 font-bold text-sm sm:text-base">Draft Complete!</span>
          ) : (
            <span className="text-gray-900 dark:text-white font-bold text-sm sm:text-base">
              Round {currentRound} · Pick {currentPickInRound}
            </span>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Pick #{completedPicks + (isComplete ? 0 : 1)} of {totalPicks}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* Round pills */}
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_ROUNDS }, (_, i) => i + 1).map((r) => (
              <div
                key={r}
                className={cn(
                  "w-7 h-5 rounded text-center text-xs font-bold leading-5 transition-colors",
                  r < currentRound
                    ? "bg-green-500 text-white"
                    : r === currentRound
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600"
                )}
              >
                R{r}
              </div>
            ))}
          </div>
          <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{pct}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
