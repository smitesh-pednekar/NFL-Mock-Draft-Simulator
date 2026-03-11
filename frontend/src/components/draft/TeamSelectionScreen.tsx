"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import { TeamSelector } from "@/components/draft/TeamSelector";
import { TEAMS_STATIC } from "@/lib/constants";
import type { Team } from "@/lib/types";
import { api } from "@/lib/api";

interface Props {
  onStart: (teamId: number) => void;
}

export function TeamSelectionScreen({ onStart }: Props) {
  const [teams, setTeams] = useState<Team[]>(TEAMS_STATIC);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .getTeams()
      .then(setTeams)
      .catch(() => setTeams(TEAMS_STATIC));
  }, []);

  const handleStart = async () => {
    if (selectedId === null) return;
    setLoading(true);
    await onStart(selectedId);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 text-gray-900 dark:text-white flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex flex-col flex-1 gap-4 sm:gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative"
        >
        {/* History button removed — now lives in Navbar */}

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-700 dark:text-blue-300 text-sm font-semibold">🏈 2026 NFL Draft</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Mock Draft Simulator
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Pick your team and make your selections. AI controls the other 6 franchises through 4 rounds of drafting.
          </p>
        </motion.div>

        {/* Draft format info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center flex-wrap gap-x-4 gap-y-3 sm:gap-x-8 text-sm text-gray-600 dark:text-gray-400"
        >
          {[
            { label: "Rounds", value: "4" },
            { label: "Teams", value: "7" },
            { label: "Total Picks", value: "28" },
            { label: "Prospect Pool", value: "30" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Team selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1"
        >
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Choose your franchise:
          </p>
          <TeamSelector
            teams={teams}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </motion.div>

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center pb-4"
        >
          <button
            onClick={handleStart}
            disabled={selectedId === null || loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base px-6 py-2.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 shadow-lg shadow-blue-900/30"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Start Draft
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
