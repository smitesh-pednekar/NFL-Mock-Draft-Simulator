import type { Team } from "./types";

/** Maps CSV school abbreviation → public school logo path. Only includes schools with a logo file. */
export const SCHOOL_LOGOS: Record<string, string> = {
  ALA:  "/school-logos/ALA_Logo.webp",
  ASU:  "/school-logos/ASU_Logo.webp",
  AUB:  "/school-logos/AUB_Logo.webp",
  CLEM: "/school-logos/CLEM_Logo.webp",
  IND:  "/school-logos/IND_Logo.webp",
  LSU:  "/school-logos/LSU_Logo.webp",
  MIA:  "/school-logos/MIA_Logo.webp",
  ND:   "/school-logos/ND_Logo.webp",
  ORE:  "/school-logos/ORE_Logo.webp",
  OSU:  "/school-logos/OSU_Logo.webp",
  PSU:  "/school-logos/PSU_Logo.webp",
  TAMU: "/school-logos/TAMU_Logo.webp",
  TENN: "/school-logos/TENN_Logo.webp",
  TEX:  "/school-logos/TEX_Logo.webp",
  TTU:  "/school-logos/TTU_Logo.webp",
  UGA:  "/school-logos/UGA_Logo.webp",
  USC:  "/school-logos/USC_Logo.webp",
  UTAH: "/school-logos/UTAH_Logo.webp",
};

export const TOTAL_ROUNDS = 4;
export const TOTAL_TEAMS = 7;
export const TOTAL_PICKS = TOTAL_ROUNDS * TOTAL_TEAMS;

export const POSITION_INFO: Record<string, { name: string; role: string; color: string }> = {
  QB: { name: "Quarterback", role: "Throws the ball. Most important and valuable position.", color: "bg-red-500" },
  WR: { name: "Wide Receiver", role: "Catches passes. Primary offensive weapon alongside QB.", color: "bg-blue-500" },
  OT: { name: "Offensive Tackle", role: "Protects the QB from pass rushers.", color: "bg-green-600" },
  EDGE: { name: "Edge Rusher", role: "Rushes the opposing QB. Premier defensive position.", color: "bg-orange-500" },
  CB: { name: "Cornerback", role: "Covers opposing wide receivers. Defends against passes.", color: "bg-purple-500" },
  DT: { name: "Defensive Tackle", role: "Defends the interior. Stops runs and pressures QB.", color: "bg-yellow-600" },
  S: { name: "Safety", role: "Last line of defense. Covers deep passes and supports run defense.", color: "bg-teal-500" },
  LB: { name: "Linebacker", role: "Versatile defender. Stops runs and covers short passes.", color: "bg-indigo-500" },
  TE: { name: "Tight End", role: "Hybrid player who blocks and catches passes.", color: "bg-pink-500" },
  RB: { name: "Running Back", role: "Carries the ball on running plays.", color: "bg-cyan-500" },
  OG: { name: "Offensive Guard", role: "Interior offensive lineman. Blocks for runs and pass protection.", color: "bg-lime-600" },
  DE: { name: "Defensive End", role: "Rushes the QB and defends the edge.", color: "bg-orange-500" },
  ILB: { name: "Inside Linebacker", role: "Defends inside runs and short passes.", color: "bg-indigo-500" },
  OLB: { name: "Outside Linebacker", role: "Pass rusher and edge defender.", color: "bg-orange-500" },
  G: { name: "Guard", role: "Interior offensive lineman.", color: "bg-lime-600" },
  T: { name: "Tackle", role: "Protects the QB on the edge.", color: "bg-green-600" },
  C: { name: "Center", role: "Snaps ball, anchors offensive line.", color: "bg-lime-600" },
};

export const TEAMS_STATIC: Team[] = [
  { id: 1, name: "Raiders", city: "Las Vegas", full_name: "Las Vegas Raiders", abbreviation: "LV", needs: ["QB", "CB", "OT"], context: "No long-term QB after Geno Smith trade failed. Secondary leaks. O-line needs rebuilding.", primary_color: "#000000", secondary_color: "#A5ACAF" },
  { id: 2, name: "Jets", city: "New York", full_name: "New York Jets", abbreviation: "NYJ", needs: ["OT", "WR", "QB"], context: "Full roster reset after trade deadline teardown. O-line is the foundation to rebuild.", primary_color: "#125740", secondary_color: "#FFFFFF" },
  { id: 3, name: "Cardinals", city: "Arizona", full_name: "Arizona Cardinals", abbreviation: "ARI", needs: ["QB", "OT", "WR"], context: "Kyler Murray's future uncertain after 3-14 season. Offense needs major upgrades.", primary_color: "#97233F", secondary_color: "#000000" },
  { id: 4, name: "Titans", city: "Tennessee", full_name: "Tennessee Titans", abbreviation: "TEN", needs: ["OT", "WR", "EDGE"], context: "Must protect and support 2025 #1 pick Cam Ward. Need weapons and pass rush.", primary_color: "#0C2340", secondary_color: "#4B92DB" },
  { id: 5, name: "Giants", city: "New York", full_name: "New York Giants", abbreviation: "NYG", needs: ["WR", "EDGE", "OT"], context: "Need playmakers around QB Jaxon Dart. Pass rush was inconsistent.", primary_color: "#0B2265", secondary_color: "#A71930" },
  { id: 6, name: "Browns", city: "Cleveland", full_name: "Cleveland Browns", abbreviation: "CLE", needs: ["EDGE", "WR", "CB"], context: "Fewest receiving yards in the NFL in 2025. Need pass rush help.", primary_color: "#311D00", secondary_color: "#FF3C00" },
  { id: 7, name: "Commanders", city: "Washington", full_name: "Washington Commanders", abbreviation: "WAS", needs: ["EDGE", "CB", "LB"], context: "Oldest roster in NFL. Defense needs youth and speed everywhere.", primary_color: "#5A1414", secondary_color: "#FFB612" },
];

export const PICK_DELAY_MS = 1500; // minimum display time for AI thinking animation

export const TEAM_LOGOS: Record<number, string> = {
  1: "/team-logos/Las_Vegas_Raiders_logo.webp",
  2: "/team-logos/New_York_Jets_logo.webp",
  3: "/team-logos/Arizona_Cardinals_logo.webp",
  4: "/team-logos/Tennessee_Titans_logo.webp",
  5: "/team-logos/New_York_Giants_logo.webp",
  6: "/team-logos/Cleveland_Browns_logo.webp",
  7: "/team-logos/Washington_Commanders_logo.webp",
};
