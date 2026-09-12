import React from "react";
import { cn } from "@/lib/utils";

interface SpiceMeterProps {
  level: number; // 1 to 4
  maxLevel?: number;
  className?: string;
  showLabel?: boolean;
}

export function SpiceMeter({
  level,
  maxLevel = 4,
  className = "",
  showLabel = true,
}: SpiceMeterProps) {
  const getSpiceLabel = (lvl: number) => {
    switch (lvl) {
      case 1:
        return "Mild Aromatic";
      case 2:
        return "Medium Spice";
      case 3:
        return "Piquant Heat";
      case 4:
        return "Imperial Fire";
      default:
        return "Delicate";
    }
  };

  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      title={`Spice Level: ${level}/${maxLevel} (${getSpiceLabel(level)})`}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: maxLevel }).map((_, idx) => {
          const isActive = idx < level;
          const isHigh = level >= 3;
          return (
            <span
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                isActive
                  ? isHigh
                    ? "bg-secondary-container shadow-[0_0_6px_rgba(219,118,32,0.8)]"
                    : "bg-secondary shadow-[0_0_4px_rgba(255,183,133,0.6)]"
                  : "bg-surface-variant opacity-40"
              )}
            />
          );
        })}
      </div>
      {showLabel && (
        <span className="text-[11px] font-sans tracking-wide text-on-surface-variant font-medium">
          {getSpiceLabel(level)}
        </span>
      )}
    </div>
  );
}

