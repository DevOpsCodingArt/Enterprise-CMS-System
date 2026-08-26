"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "destructive" | "info" | "secondary" | "outline";
  hasPulse?: boolean;
}

export function Badge({
  className,
  variant = "secondary",
  hasPulse = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    success:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    warning:
      "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
    destructive:
      "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    info:
      "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30",
    secondary:
      "bg-secondary text-secondary-foreground border-border/40",
    outline:
      "bg-transparent text-foreground border-border",
  };

  const pulseColors = {
    success: "bg-emerald-500 dark:bg-emerald-400",
    warning: "bg-amber-500 dark:bg-amber-400",
    destructive: "bg-rose-500 dark:bg-rose-400",
    info: "bg-sky-500 dark:bg-sky-400",
    secondary: "bg-muted-foreground",
    outline: "bg-primary",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold rounded-md border tracking-wide uppercase transition-colors shrink-0",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {hasPulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              pulseColors[variant]
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              pulseColors[variant]
            )}
          />
        </span>
      )}
      {children}
    </div>
  );
}
