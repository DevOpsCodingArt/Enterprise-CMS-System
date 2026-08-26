"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({
  content,
  position = "top",
  children,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2 animate-in fade-in-0 zoom-in-95",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2 animate-in fade-in-0 zoom-in-95",
    left: "right-full top-1/2 -translate-y-1/2 mr-2 animate-in fade-in-0 zoom-in-95",
    right: "left-full top-1/2 -translate-y-1/2 ml-2 animate-in fade-in-0 zoom-in-95",
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-md border border-border bg-sidebar px-2.5 py-1 text-xs font-mono font-medium text-sidebar-foreground shadow-md pointer-events-none",
            positionClasses[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
