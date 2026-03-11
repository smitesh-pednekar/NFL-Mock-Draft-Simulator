"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Pencil, Check, History, ChevronRight, GitCompare, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useHistoryStore } from "@/store/historyStore";
import type { SavedDraft } from "@/lib/types";
import { PositionBadge } from "@/components/ui/PositionBadge";
import { TEAM_LOGOS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  onClose: () => void;
  onCompare: (a: SavedDraft, b: SavedDraft) => void;
}

export function DraftHistoryDrawer({ onClose, onCompare }: Props) {
  const { drafts, loaded, load, remove, rename, clearAll } = useHistoryStore();
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startEdit = (draft: SavedDraft) => {
    setEditingId(draft.id);
    setEditValue(draft.label);
  };

  const commitEdit = () => {
    if (editingId && editValue.trim()) {
      rename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const toggleCompareSelect = (id: string) => {
    setSelectedForCompare((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 2
        ? [...prev, id]
        : [prev[1], id] // slide window — replace oldest selection
    );
  };

  const handleCompare = () => {
    if (selectedForCompare.length === 2) {
      const [a, b] = selectedForCompare.map((id) => drafts.find((d) => d.id === id)!);
      onCompare(a, b);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="ml-auto h-full w-full max-w-[440px] bg-gray-900 border-l border-white/10 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <History size={18} className="text-blue-400" />
            <div>
              <h2 className="text-white font-bold text-base leading-tight">Draft History</h2>
              <p className="text-xs text-gray-400">
                {drafts.length} saved draft{drafts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {drafts.length >= 2 && (
              <button
                onClick={handleCompare}
                disabled={selectedForCompare.length !== 2}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors",
                  selectedForCompare.length === 2
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-white/5 text-gray-500 cursor-not-allowed"
                )}
              >
                <GitCompare size={13} />
                Compare
                {selectedForCompare.length > 0 && ` (${selectedForCompare.length}/2)`}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Compare hint */}
        {drafts.length >= 2 && selectedForCompare.length < 2 && (
          <div className="px-5 py-2 bg-blue-600/10 border-b border-blue-500/20 shrink-0">
            <p className="text-xs text-blue-400">
              Select 2 drafts to compare your picks side-by-side
            </p>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0">
          {!loaded && (
            <p className="text-center text-sm text-gray-500 py-12">Loading…</p>
          )}

          {loaded && drafts.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <History size={36} className="text-gray-600" />
              <p className="text-gray-400 text-sm font-semibold">No saved drafts yet</p>
              <p className="text-gray-600 text-xs max-w-xs">
                Complete a draft and it will automatically appear here.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {drafts.map((draft) => {
              const isExpanded = expandedId === draft.id;
              const isSelectedCompare = selectedForCompare.includes(draft.id);
              const dateStr = new Date(draft.completedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const timeStr = new Date(draft.completedAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              });

              return (
                <motion.div
                  key={draft.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "rounded-xl border overflow-hidden transition-colors",
                    isSelectedCompare
                      ? "border-blue-500/60 ring-1 ring-blue-500/40 bg-blue-900/20"
                      : "border-white/10 bg-white/5"
                  )}
                >
                  {/* Card top row */}
                  <div className="flex items-center gap-3 px-3.5 py-3">
                    {/* Compare checkbox */}
                    {drafts.length >= 2 && (
                      <button
                        onClick={() => toggleCompareSelect(draft.id)}
                        className={cn(
                          "shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                          isSelectedCompare
                            ? "bg-blue-500 border-blue-500"
                            : "border-white/20 hover:border-white/40"
                        )}
                        aria-label={isSelectedCompare ? "Deselect" : "Select for compare"}
                      >
                        {isSelectedCompare && <Check size={11} className="text-white" />}
                      </button>
                    )}

                    {/* Team logo */}
                    {TEAM_LOGOS[draft.userTeam.id] && (
                      <div className="w-9 h-9 relative shrink-0">
                        <Image
                          src={TEAM_LOGOS[draft.userTeam.id]}
                          alt={draft.userTeam.full_name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* Label + date */}
                    <div className="flex-1 min-w-0">
                      {editingId === draft.id ? (
                        <input
                          ref={inputRef}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitEdit();
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-0.5 text-sm text-white focus:outline-none focus:border-blue-400"
                        />
                      ) : (
                        <p className="text-sm font-bold text-white truncate">{draft.label}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">
                        {dateStr} · {timeStr} · {draft.userPicks.length} picks
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(draft)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Rename"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => remove(draft.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : draft.id)}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors text-gray-500 hover:text-white hover:bg-white/10",
                        )}
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                      >
                        <ChevronRight
                          size={15}
                          className={cn("transition-transform", isExpanded && "rotate-90")}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded picks */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/10 px-3.5 py-3 space-y-1.5">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            {draft.userTeam.abbreviation} Picks
                          </p>
                          {draft.userPicks.length === 0 ? (
                            <p className="text-xs text-gray-600">No picks recorded.</p>
                          ) : (
                            draft.userPicks.map((pick) => (
                              <div key={pick.id} className="flex items-center gap-2">
                                <span className="text-xs text-gray-600 font-mono w-14 shrink-0">
                                  R{pick.round}P{pick.pick_in_round}
                                </span>
                                <span className="flex-1 text-xs text-white font-medium truncate">
                                  {pick.prospect.name}
                                </span>
                                <PositionBadge position={pick.prospect.position} />
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {drafts.length > 0 && (
          <div className="px-5 py-4 border-t border-white/10 shrink-0">
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-red-400 shrink-0" />
                <p className="text-xs text-gray-400 flex-1">Delete all saved drafts?</p>
                <button
                  onClick={() => { clearAll(); setConfirmClear(false); }}
                  className="text-xs font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/20 transition-colors"
                >
                  Yes, delete all
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-xs text-gray-500 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={12} />
                Clear all drafts
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
