import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPositionColor(position: string): string {
  const map: Record<string, string> = {
    QB: "bg-red-500 text-white",
    WR: "bg-blue-500 text-white",
    OT: "bg-green-600 text-white",
    T: "bg-green-600 text-white",
    EDGE: "bg-orange-500 text-white",
    DE: "bg-orange-500 text-white",
    OLB: "bg-orange-400 text-white",
    CB: "bg-purple-500 text-white",
    DT: "bg-yellow-600 text-white",
    S: "bg-teal-500 text-white",
    LB: "bg-indigo-500 text-white",
    ILB: "bg-indigo-500 text-white",
    TE: "bg-pink-500 text-white",
    RB: "bg-cyan-500 text-white",
    OG: "bg-lime-600 text-white",
    G: "bg-lime-600 text-white",
    C: "bg-lime-700 text-white",
  };
  return map[position] ?? "bg-gray-500 text-white";
}

/**
 * Returns the correct display color for a team abbreviation label.
 * Some teams have secondary_color = pure white or pure black, which is
 * invisible when rendered as text on a neutral background. For those teams
 * we fall back to the primary (brand) color instead.
 */
export function getTeamAbbrevColor(primaryColor: string, secondaryColor: string): string {
  const s = secondaryColor?.toUpperCase();
  if (s === "#FFFFFF" || s === "#000000") return primaryColor;
  return secondaryColor;
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
