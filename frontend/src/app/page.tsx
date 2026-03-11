"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDraftStore } from "@/store/draftStore";
import { TeamSelectionScreen } from "@/components/draft/TeamSelectionScreen";
import { DraftBoard } from "@/components/draft/DraftBoard";
import { DraftResults } from "@/components/draft/DraftResults";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import type { DraftResults as DraftResultsType } from "@/lib/types";
import { api } from "@/lib/api";

export default function Home() {
  return <DraftApp />;
}

function DraftApp() {
  const { phase, draftState, error, startDraft, resetDraft, dismissError, triggerAiPick } =
    useDraftStore();

  const [results, setResults] = useState<DraftResultsType | null>(null);

  // Scroll to top whenever the phase changes (e.g. team-selection → drafting)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [phase]);

  // After page reload mid-draft, re-trigger AI if it's their turn
  useEffect(() => {
    if (
      phase === "drafting" &&
      draftState &&
      !draftState.draft_complete &&
      draftState.current_team_id !== draftState.user_team_id
    ) {
      triggerAiPick();
    }
    // Run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load results when draft completes
  useEffect(() => {
    if (phase === "results" && draftState?.draft_id) {
      api
        .getResults(draftState.draft_id)
        .then(setResults)
        .catch(() => {});
    }
  }, [phase, draftState?.draft_id]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 text-gray-900 dark:text-white">
      {error && <ErrorBanner message={error} onDismiss={dismissError} />}

      <AnimatePresence mode="wait">
        {phase === "team-selection" && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TeamSelectionScreen onStart={startDraft} />
          </motion.div>
        )}

        {(phase === "drafting" || phase === "ai-thinking") && draftState && (
          <motion.div
            key="draft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[calc(100dvh-3.5rem)] p-3 sm:p-4 gap-3"
          >
            <header className="flex items-center justify-between shrink-0">
              <h1 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">🏈 NFL Mock Draft 2026</h1>
              <button
                onClick={resetDraft}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border border-gray-200 dark:border-white/10 rounded px-3 py-1.5"
              >
                ↩ Restart
              </button>
            </header>
            <div className="flex-1 min-h-0">
              <DraftBoard />
            </div>
          </motion.div>
        )}

        {phase === "results" && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DraftResults
              results={results}
              draftState={draftState}
              onRestart={resetDraft}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


