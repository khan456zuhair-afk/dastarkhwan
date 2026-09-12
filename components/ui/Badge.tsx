import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "secondary" | "emerald" | "ruby" | "surface";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "gold",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    gold: "bg-primary/10 text-primary border border-primary/25",
    secondary: "bg-secondary/15 text-secondary border border-secondary/30",
    emerald: "bg-tertiary/10 text-tertiary border border-tertiary/25",
    ruby: "bg-error/15 text-error border border-error/30",
    surface: "bg-surface-container-high text-on-surface-variant border border-outline-variant/40",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] tracking-wider uppercase font-semibold",
    md: "px-2.5 py-1 text-xs tracking-wide font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

