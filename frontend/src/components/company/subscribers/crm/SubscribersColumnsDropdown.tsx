"use client";

import React, { useRef, useEffect } from "react";
import { Columns, Check, GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ColumnDefinition {
  id: string;
  label: string;
  visible: boolean;
}

export function SubscribersColumnsDropdown({
  isOpen,
  onClose,
  columns,
  onToggleColumn,
  onResetColumns,
}: {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnDefinition[];
  onToggleColumn: (id: string) => void;
  onResetColumns: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-md shadow-2xl p-4 z-50 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <span className="font-heading font-bold text-foreground flex items-center gap-1.5">
          <Columns className="h-3.5 w-3.5 text-primary" /> Customize Columns
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
        {columns.map((col) => (
          <div
            key={col.id}
            onClick={() => onToggleColumn(col.id)}
            className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="h-3 w-3 text-muted-foreground opacity-50" />
              <span className="font-medium text-foreground">{col.label}</span>
            </div>
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                col.visible
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border bg-background"
              }`}
            >
              {col.visible && <Check className="h-3 w-3" />}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-border">
        <Button variant="ghost" size="sm" onClick={onResetColumns} className="text-[11px] h-7 px-2">
          Reset Default
        </Button>
        <Button size="sm" onClick={onClose} className="text-[11px] h-7 font-bold px-3">
          Done
        </Button>
      </div>
    </div>
  );
}
