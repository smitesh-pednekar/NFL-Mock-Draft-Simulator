"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ClipboardList, Newspaper, Mail, Menu, X, Sun, Moon, History } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { DraftHistoryDrawer } from "@/components/draft/DraftHistoryDrawer";
import { DraftCompareModal } from "@/components/draft/DraftCompareModal";
import { useHistoryStore } from "@/store/historyStore";
import type { SavedDraft } from "@/lib/types";

const NAV_LINKS = [
  {
    href: "https://www.essentiallysports.com/nfl-draft-board/",
    label: "NFL Draft Board",
    icon: ClipboardList,
    cta: false,
  },
  {
    href: "https://www.essentiallysports.com/category/nfl/",
    label: "NFL News",
    icon: Newspaper,
    cta: false,
  },
  {
    href: "https://www.essentiallysports.com/newsletter-hub/",
    label: "Newsletter",
    icon: Mail,
    cta: true,
  },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [compareTargets, setCompareTargets] = useState<[SavedDraft, SavedDraft] | null>(null);
  const { theme, setTheme } = useTheme();
  const { load } = useHistoryStore();

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleCompare = (a: SavedDraft, b: SavedDraft) => {
    setShowHistory(false);
    setCompareTargets([a, b]);
  };

  return (
    <>
    <header className="w-full border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      {/* Desktop / tablet row */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo — reloads the page */}
        <button
          onClick={() => window.location.reload()}
          className="shrink-0 cursor-pointer"
          aria-label="Reload"
        >
          <Image
            src="/essentially_sports_logo.webp"
            alt="EssentiallySports"
            width={150}
            height={34}
            className="object-contain"
            priority
          />
        </button>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon, cta }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                cta
                  ? "inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors"
                  : "inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              }
            >
              <Icon size={15} />
              {label}
            </a>
          ))}

          {/* History button — desktop, after Newsletter */}
          <button
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label="My Drafts"
          >
            <History size={15} />
            My Drafts
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-1 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Sun size={17} className="hidden dark:block" />
            <Moon size={17} className="block dark:hidden" />
          </button>
        </nav>

        {/* Mobile: history + theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Sun size={17} className="hidden dark:block" />
            <Moon size={17} className="block dark:hidden" />
          </button>
          <button
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950/95 px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon, cta }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className={
                cta
                  ? "inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-lg transition-colors"
                  : "inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              }
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
          {/* History — mobile dropdown */}
          <button
            onClick={() => { setMobileOpen(false); setShowHistory(true); }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <History size={16} />
            My Drafts
          </button>
        </nav>
      )}
    </header>

    <AnimatePresence>
      {showHistory && (
        <DraftHistoryDrawer onClose={() => setShowHistory(false)} onCompare={handleCompare} />
      )}
    </AnimatePresence>
    <AnimatePresence>
      {compareTargets && (
        <DraftCompareModal a={compareTargets[0]} b={compareTargets[1]} onClose={() => setCompareTargets(null)} />
      )}
    </AnimatePresence>
    </>
  );
}
