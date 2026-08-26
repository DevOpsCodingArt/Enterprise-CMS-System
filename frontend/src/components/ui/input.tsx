"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  isMono?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      prefixIcon,
      suffixIcon,
      isMono = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-foreground font-heading"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {prefixIcon && (
            <div className="absolute left-3 flex items-center justify-center text-muted-foreground pointer-events-none">
              {prefixIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs transition-colors",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              prefixIcon && "pl-9",
              suffixIcon && "pr-9",
              isMono && "font-mono text-xs",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
          {suffixIcon && (
            <div className="absolute right-3 flex items-center justify-center text-muted-foreground">
              {suffixIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-destructive font-medium">{error}</span>}
        {helperText && !error && <span className="text-xs text-muted-foreground">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
