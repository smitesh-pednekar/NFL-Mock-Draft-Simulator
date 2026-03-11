import Image from "next/image";
import { SCHOOL_LOGOS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  /** School abbreviation matching the CSV, e.g. "OSU", "ALA" */
  school: string;
  /**
   * Visual container size in px. The logo is inset by 2px on all sides via
   * padding so every logo — regardless of its intrinsic aspect ratio or
   * built-in whitespace — occupies the same visual weight.
   */
  size?: number;
  className?: string;
}

/**
 * Renders a school logo at a normalised, equal visual size with a transparent
 * background.
 *
 * Strategy:
 * - Fixed square container via inline style ensures all logos share the same
 *   bounding box regardless of intrinsic aspect ratios.
 * - `object-contain` prevents distortion.
 * - `mix-blend-mode: multiply` in light mode makes white/near-white pixels in
 *   the source image fully transparent against any light background.
 * - `mix-blend-mode: screen` in dark mode does the same for dark backgrounds.
 *   (Applied via Tailwind's `dark:` variant on the wrapper; the Image inherits
 *   the blend context from its stacking context.)
 * - No background fill on the wrapper — fully transparent by default.
 * - 1 px padding provides a hairline inset so logos with edge-to-edge art
 *   don't clip on rounded corners.
 */
export function SchoolLogo({ school, size = 18, className }: Props) {
  const src = SCHOOL_LOGOS[school];
  if (!src) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        "[&_img]:mix-blend-multiply dark:[&_img]:mix-blend-screen",
        className
      )}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <Image
        src={src}
        alt={school}
        width={size}
        height={size}
        style={{ padding: 1, objectFit: "contain", width: size, height: size }}
        sizes={`${size}px`}
      />
    </span>
  );
}
