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
    success: "bg-success/15 text-success border-success/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
    info: "bg-info/15 text-info border-info/30",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
    outline: "bg-card text-foreground border-border",
  };

  const pulseColors = {
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    info: "bg-info",
    secondary: "bg-muted-foreground",
    outline: "bg-primary",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-bold rounded-full border tracking-wide uppercase transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {hasPulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              pulseColors[variant]
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              pulseColors[variant]
            )}
          />
        </span>
      )}
      {children}
    </div>
  );
}
