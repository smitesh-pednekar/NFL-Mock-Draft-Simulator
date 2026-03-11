import { cn, getPositionColor } from "@/lib/utils";

interface Props {
  position: string;
  className?: string;
}

export function PositionBadge({ position, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wide",
        getPositionColor(position),
        className
      )}
    >
      {position}
    </span>
  );
}
