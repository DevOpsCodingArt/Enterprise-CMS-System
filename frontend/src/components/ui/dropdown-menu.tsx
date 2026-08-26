"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export function DropdownMenu({
  trigger,
  items,
  value,
  onSelect,
  className,
  align = "left",
}: {
  trigger?: React.ReactNode;
  items: DropdownItem[];
  value?: string;
  onSelect: (value: string) => void;
  className?: string;
  align?: "left" | "right";
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedItem = items.find((item) => item.value === value);

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button
            type="button"
            className="inline-flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs hover:bg-card-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            <span className="truncate">{selectedItem ? selectedItem.label : "Select option..."}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1 min-w-[200px] w-full rounded-md border border-border bg-card p-1 shadow-lg animate-in fade-in-80",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                onSelect(item.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-foreground transition-colors text-left cursor-pointer",
                item.value === value
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-card-subtle hover:text-foreground",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
              <div className="flex flex-col">
                <span>{item.label}</span>
                {item.description && (
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
