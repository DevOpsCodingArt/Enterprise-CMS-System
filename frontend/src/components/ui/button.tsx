"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm border border-transparent",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm border border-transparent",
      outline: "border border-border bg-card text-foreground hover:bg-card-subtle hover:border-primary",
      ghost: "text-foreground hover:bg-card-subtle hover:text-primary",
      link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-sm",
      md: "h-10 px-4 py-2 text-sm rounded-md",
      lg: "h-12 px-6 text-base rounded-lg",
      icon: "h-10 w-10 p-2 rounded-md justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-colors cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
