"use client";

import { useRef, useState, useCallback } from "react";
import { X, Download, Copy, Check, Loader2, Share2 } from "lucide-react";
import type { TeamWithRoster } from "@/lib/types";
import { DraftShareCard } from "./DraftShareCard";

interface Props {
  team: TeamWithRoster;
  onClose: () => void;
}

const SHARE_TEXT = (abbr: string) =>
  `I just completed my 2026 NFL Mock Draft with the ${abbr}! Check out my picks 🏈 #NFLDraft2026 #EssentiallySports`;

export function ShareModal({ team, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const getDataUrl = useCallback(async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    const { toPng } = await import("html-to-image");
    return toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
  }, []);

  const getBlob = useCallback(async (): Promise<Blob | null> => {
    const dataUrl = await getDataUrl();
    if (!dataUrl) return null;
    const res = await fetch(dataUrl);
    return res.blob();
  }, [getDataUrl]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const dataUrl = await getDataUrl();
      if (!dataUrl) return;
      const a = document.createElement("a");
      a.download = `${team.abbreviation}-draft-2026.png`;
      a.href = dataUrl;
      a.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async () => {
    setCopying(true);
    try {
      const blob = await getBlob();
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } finally {
      setCopying(false);
    }
  };

  // Native Web Share API (mobile browsers, Safari desktop)
  const handleNativeShare = async () => {
    setSharing(true);
    try {
      const blob = await getBlob();
      if (!blob) return;
      const file = new File([blob], `${team.abbreviation}-draft-2026.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "My 2026 NFL Mock Draft",
          text: SHARE_TEXT(team.abbreviation),
          files: [file],
        });
      }
    } finally {
      setSharing(false);
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center sm:p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-[640px] max-h-[92dvh] flex flex-col overflow-hidden">
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-sm sm:text-base">Share Your Draft</h2>
            <p className="text-gray-400 text-xs mt-0.5">Save or share your draft card</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Card preview — vertically scrollable, card horizontally scrollable on small screens */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-gray-950/50">
          <div className="p-4 sm:p-5 overflow-x-auto flex justify-center">
            <DraftShareCard ref={cardRef} team={team} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 border-t border-white/10">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            <span className="hidden xs:inline sm:inline">Download</span>
            <span className="hidden sm:inline"> PNG</span>
            <span className="xs:hidden sm:hidden">Save</span>
          </button>
          <button
            onClick={handleCopy}
            disabled={copying}
            className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {copying ? <Loader2 size={14} className="animate-spin" /> : copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          {canNativeShare && (
            <button
              onClick={handleNativeShare}
              disabled={sharing}
              className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="More share options"
            >
              {sharing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
              More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


