"use client";

import React from "react";

export interface DateTimePickerProps {
  value?: string;
  onChange?: (val: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function DateTimePicker({
  value = "",
  onChange,
  label,
  className = "",
}: DateTimePickerProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block font-mono text-[10px] font-bold text-muted-foreground uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="datetime-local"
          value={value || ""}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full h-8 rounded bg-muted/30 border border-border px-2 py-1 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
        />
      </div>
    </div>
  );
}
