"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerContextValue {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "right" | "left";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  side = "right",
  size = "md",
  children,
}: DrawerProps) {
  // ESC key dismissal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  const sideClasses = {
    right: "right-0 border-l animate-in slide-in-from-right",
    left: "left-0 border-r animate-in slide-in-from-left",
  };

  return (
    <DrawerContext.Provider value={{ isOpen, onClose }}>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-sidebar/50 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={onClose}
        />
        {/* Drawer Surface */}
        <div
          className={cn(
            "fixed top-0 bottom-0 z-50 flex flex-col w-full bg-card text-card-foreground border-border shadow-2xl transition-all duration-300",
            sizeClasses[size],
            sideClasses[side]
          )}
        >
          {children}
        </div>
      </div>
    </DrawerContext.Provider>
  );
}

export function DrawerHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(DrawerContext);
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border-subtle bg-card-subtle px-6 py-4",
        className
      )}
    >
      <div className="flex flex-col space-y-1">{children}</div>
      {context && (
        <button
          onClick={context.onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-card hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function DrawerTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className={cn("text-base font-heading font-bold text-foreground", className)}>
      {children}
    </h2>
  );
}

export function DrawerDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("text-xs text-muted-foreground leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function DrawerContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-6 space-y-4", className)}>
      {children}
    </div>
  );
}

export function DrawerFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-border-subtle bg-card-subtle px-6 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}
