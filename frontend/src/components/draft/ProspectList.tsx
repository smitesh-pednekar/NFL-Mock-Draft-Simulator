"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import type { Prospect } from "@/lib/types";
import { PositionBadge } from "@/components/ui/PositionBadge";
import { SchoolLogo } from "@/components/ui/SchoolLogo";
import { cn } from "@/lib/utils";

const POSITIONS = ["ALL", "QB", "WR", "OT", "EDGE", "CB", "DT", "S", "LB", "TE", "RB", "OG"];

interface Props {
  prospects: Prospect[];
  onSelect: (prospectId: string) => void;
  disabled: boolean;
  positionFilter: string;
  onFilterChange: (pos: string) => void;
}

export function ProspectList({ prospects, onSelect, disabled, positionFilter, onFilterChange }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = prospects;
    if (positionFilter !== "ALL") {
      list = list.filter((p) => {
        const pos = p.position.toUpperCase();
        if (positionFilter === "OT") return pos === "OT" || pos === "T";
        if (positionFilter === "EDGE") return ["EDGE", "DE", "OLB"].includes(pos);
        if (positionFilter === "LB") return ["LB", "ILB"].includes(pos);
        if (positionFilter === "OG") return ["OG", "G", "C"].includes(pos);
        return pos === positionFilter;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.college.toLowerCase().includes(q)
      );
    }
    return list;
  }, [prospects, positionFilter, search]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Search + filter */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or college…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-8 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {POSITIONS.map((pos) => (
            <button
              key={pos}
              onClick={() => onFilterChange(pos)}
              className={cn(
                "shrink-0 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors",
                positionFilter === pos
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Prospect count */}
      <p className="text-xs text-gray-500 shrink-0">
        {filtered.length} of {prospects.length} prospects available
      </p>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
        <AnimatePresence initial={false}>
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.18, delay: Math.min(i * 0.02, 0.3) }}
            >
              <ProspectCard
                prospect={p}
                onSelect={onSelect}
                disabled={disabled}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-8">No prospects match your filter.</p>
        )}
      </div>
    </div>
  );
}

function ProspectCard({
  prospect,
  onSelect,
  disabled,
}: {
  prospect: Prospect;
  onSelect: (id: string) => void;
  disabled: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border transition-all",
        disabled
          ? "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-transparent cursor-default"
          : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-500/60 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
      )}
    >
      <div
        className="flex items-center gap-3 p-3"
        onClick={() => !disabled && setExpanded((v) => !v)}
      >
        {/* Rank */}
        <span className="text-sm font-black text-gray-400 w-6 text-center shrink-0">
          {prospect.rank}
        </span>

        {/* Name + college */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{prospect.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <SchoolLogo school={prospect.college} size={16} />
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{prospect.college}</p>
          </div>
        </div>

        {/* Position */}
        <PositionBadge position={prospect.position} className="shrink-0" />

        {/* Pick button */}
        {!disabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(prospect.id);
            }}
            className="shrink-0 ml-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={`Draft ${prospect.name}`}
          >
            DRAFT
          </button>
        )}
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 text-xs text-gray-500 dark:text-gray-400 space-y-1 border-t border-gray-100 dark:border-white/10 pt-2">
              {prospect.height && prospect.weight && (
                <p>
                  <span className="text-gray-700 dark:text-gray-300">Measurables:</span> {prospect.height} · {prospect.weight} lbs
                </p>
              )}
              {prospect.projected_round && (
                <p>
                  <span className="text-gray-700 dark:text-gray-300">Projected:</span> {prospect.projected_round} round
                </p>
              )}
              {prospect.strengths && prospect.strengths !== "N/A" && (
                <p className="line-clamp-3">
                  <span className="text-green-400">Strengths:</span> {prospect.strengths}
                </p>
              )}
              {prospect.weaknesses && prospect.weaknesses !== "N/A" && (
                <p className="line-clamp-2">
                  <span className="text-red-400">Weaknesses:</span> {prospect.weaknesses}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
