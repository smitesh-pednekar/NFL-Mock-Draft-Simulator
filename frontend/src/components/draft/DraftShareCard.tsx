"use client";

import { forwardRef } from "react";
import Image from "next/image";
import type { TeamWithRoster } from "@/lib/types";
import { TEAM_LOGOS } from "@/lib/constants";

interface Props {
  team: TeamWithRoster;
}

const POSITION_COLORS: Record<string, string> = {
  QB: "#ef4444",
  WR: "#3b82f6",
  OT: "#16a34a",
  T: "#16a34a",
  EDGE: "#f97316",
  DE: "#f97316",
  OLB: "#fb923c",
  CB: "#a855f7",
  DT: "#ca8a04",
  S: "#0d9488",
  LB: "#6366f1",
  ILB: "#6366f1",
  TE: "#ec4899",
  RB: "#06b6d4",
  OG: "#65a30d",
  G: "#65a30d",
  C: "#4d7c0f",
};

export const DraftShareCard = forwardRef<HTMLDivElement, Props>(
  ({ team }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: 560,
          background:
            "linear-gradient(135deg, #0d1117 0%, #0f172a 60%, #1e1b4b 100%)",
          borderRadius: 16,
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
          flexShrink: 0,
        }}
      >
        {/* Team color header */}
        <div
          style={{
            backgroundColor: team.primary_color,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {TEAM_LOGOS[team.id] && (
            <div
              style={{
                width: 54,
                height: 54,
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Image
                src={TEAM_LOGOS[team.id]}
                alt={team.full_name}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: team.secondary_color,
                textTransform: "uppercase",
                letterSpacing: 2,
                opacity: 0.9,
              }}
            >
              MY 2026 NFL DRAFT CLASS
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.15,
              }}
            >
              {team.full_name}
            </div>
          </div>

        </div>

        {/* Picks list */}
        <div
          style={{
            padding: "14px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {team.roster.length === 0 ? (
            <div
              style={{
                color: "#64748b",
                fontSize: 13,
                textAlign: "center",
                padding: 16,
              }}
            >
              No picks recorded
            </div>
          ) : (
            team.roster.map((pick, idx) => (
              <div
                key={pick.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background:
                    idx % 2 === 0
                      ? "rgba(255,255,255,0.05)"
                      : "transparent",
                  borderRadius: 8,
                  padding: "8px 10px",
                }}
              >
                {/* Round badge */}
                <div
                  style={{
                    background: team.primary_color,
                    color: "#fff",
                    borderRadius: 6,
                    padding: "3px 8px",
                    fontSize: 11,
                    fontWeight: 800,
                    flexShrink: 0,
                    minWidth: 34,
                    textAlign: "center",
                  }}
                >
                  R{pick.round}
                </div>

                {/* Overall pick # */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#64748b",
                    flexShrink: 0,
                    width: 28,
                  }}
                >
                  #{pick.overall_pick}
                </div>

                {/* Name + college */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#f1f5f9",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {pick.prospect.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    {pick.prospect.college}
                  </div>
                </div>

                {/* Position badge */}
                <div
                  style={{
                    background:
                      POSITION_COLORS[pick.prospect.position] ?? "#6b7280",
                    color: "#fff",
                    borderRadius: 4,
                    padding: "2px 8px",
                    fontSize: 11,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {pick.prospect.position}
                </div>


              </div>
            ))
          )}
        </div>

        {/* Footer branding */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 11, color: "#475569" }}>
            essentiallysports.com
          </div>
          {/* Logo from public folder — plain <img> required for html-to-image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/essentially_sports_logo.webp"
            alt="EssentiallySports"
            style={{ height: 18, objectFit: "contain", display: "block" }}
          />
          <div style={{ fontSize: 11, color: "#475569" }}>
            NFL Mock Draft 2026
          </div>
        </div>
      </div>
    );
  }
);
DraftShareCard.displayName = "DraftShareCard";
