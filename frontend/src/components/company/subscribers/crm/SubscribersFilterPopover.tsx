"use client";

import React, { useRef, useEffect } from "react";
import { Filter, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SubscriberFiltersState {
  profileStatus: string[];
  connection: string[];
  financial: string[];
  expiration: string[];
}

export function SubscribersFilterPopover({
  isOpen,
  onClose,
  filters,
  onToggleFilter,
  onResetFilters,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: SubscriberFiltersState;
  onToggleFilter: (category: keyof SubscriberFiltersState, value: string) => void;
  onResetFilters: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories: Array<{
    key: keyof SubscriberFiltersState;
    label: string;
    options: string[];
  }> = [
    {
      key: "profileStatus",
      label: "Profile Status",
      options: ["active", "suspended", "expired", "terminated"],
    },
    {
      key: "connection",
      label: "Radius Session",
      options: ["online", "offline"],
    },
    {
      key: "financial",
      label: "Ledger State",
      options: ["Good Standing", "Pending Due", "Overdue Suspended"],
    },
    {
      key: "expiration",
      label: "Expiry Window",
      options: ["Expiring Today", "Expiring in 3 Days", "Expired"],
    },
  ];

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-md shadow-2xl p-4 z-50 text-xs space-y-4 animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <span className="font-heading font-bold text-foreground flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-primary" /> Filter Subscribers
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-1">
        {categories.map((cat) => (
          <div key={cat.key} className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold tracking-wider">
              {cat.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cat.options.map((opt) => {
                const isSelected = filters[cat.key].includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onToggleFilter(cat.key, opt)}
                    className={`px-2.5 py-1 rounded border text-xs font-mono font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/30 border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-border">
        <Button variant="ghost" size="sm" onClick={onResetFilters} className="text-xs">
          Reset All
        </Button>
        <Button size="sm" onClick={onClose} className="text-xs font-bold">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
