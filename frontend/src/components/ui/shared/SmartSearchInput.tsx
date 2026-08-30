"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Command, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface QuickFilterChip {
  id: string;
  label: string;
  count?: number | string;
  variant?: "success" | "warning" | "destructive" | "info" | "secondary";
}

interface SmartSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  quickFilters?: QuickFilterChip[];
  activeFilterId?: string | null;
  onSelectFilter?: (filterId: string) => void;
  className?: string;
  showKeyboardShortcut?: boolean;
  size?: "sm" | "md";
}

export function SmartSearchInput({
  value,
  onChange,
  placeholder = "Search... (Ctrl+K)",
  quickFilters = [],
  activeFilterId = null,
  onSelectFilter,
  className,
  showKeyboardShortcut = true,
  size = "md",
}: SmartSearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && isFocused) {
        onChange("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, onChange]);

  return (
    <div className={cn("relative flex flex-col gap-2 w-full", className)}>
      <div
        className={cn(
          "relative flex items-center w-full rounded-xl border bg-card-subtle transition-all duration-200",
          isFocused
            ? "border-primary ring-2 ring-primary/20 shadow-ambient bg-card"
            : "border-border hover:border-border/80"
        )}
      >
        <Search
          className={cn(
            "absolute left-3.5 h-4 w-4 shrink-0 transition-colors pointer-events-none",
            isFocused ? "text-primary" : "text-muted-foreground"
          )}
        />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl bg-transparent pl-10 pr-20 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none",
            size === "sm" ? "h-8 py-1.5" : "h-10 py-2.5"
          )}
        />

        {/* Right side: Clear button or shortcut badge */}
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-card-subtle transition-colors cursor-pointer"
              title="Clear search (Esc)"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : showKeyboardShortcut ? (
            <div className="hidden sm:flex items-center gap-0.5 rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground shadow-2xs">
              <Command className="h-2.5 w-2.5" />
              <span>K</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Quick Filter Chips (Interactive direct access) */}
      {quickFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {quickFilters.map((chip) => {
            const isSelected = activeFilterId === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onSelectFilter && onSelectFilter(chip.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer border select-none",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs scale-[1.02]"
                    : "bg-card text-muted-foreground border-border hover:bg-card-hover hover:text-foreground hover:border-border/80"
                )}
              >
                <span>{chip.label}</span>
                {chip.count !== undefined && (
                  <Badge
                    variant={isSelected ? "secondary" : chip.variant || "secondary"}
                    className={cn(
                      "text-[9.5px] py-0 px-1 font-mono font-bold",
                      isSelected && "bg-primary-foreground/20 text-primary-foreground border-transparent"
                    )}
                  >
                    {chip.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
