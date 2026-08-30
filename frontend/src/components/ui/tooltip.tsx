"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  delay?: number;
}

export function Tooltip({
  content,
  position = "top",
  children,
  className,
  containerClassName,
  delay = 100,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const updateCoordinates = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (position) {
      case "right":
        top = rect.top + rect.height / 2;
        left = rect.right + 10;
        break;
      case "bottom":
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - 10;
        break;
      case "top":
      default:
        top = rect.top - 8;
        left = rect.left + rect.width / 2;
        break;
    }

    setCoords({ top, left });
  }, [position]);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updateCoordinates();
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) return;
    const handleScrollOrResize = () => {
      updateCoordinates();
    };
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isVisible, updateCoordinates]);

  const getTransform = () => {
    switch (position) {
      case "right":
        return "translateY(-50%)";
      case "bottom":
        return "translateX(-50%)";
      case "left":
        return "translate(-100%, -50%)";
      case "top":
      default:
        return "translate(-50%, -100%)";
    }
  };

  if (!content) return <>{children}</>;

  return (
    <div
      ref={triggerRef}
      className={cn("relative inline-flex items-center", containerClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      {mounted &&
        isVisible &&
        coords &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: getTransform(),
              zIndex: 99999,
            }}
            className={cn(
              "pointer-events-none whitespace-nowrap rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-mono font-bold text-foreground shadow-elevated transition-opacity duration-150 animate-in fade-in-0 zoom-in-95",
              className
            )}
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
}
