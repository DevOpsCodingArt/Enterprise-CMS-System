"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  isOpen: boolean;
  onClose: () => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

export function Dialog({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // ESC key listener
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

  return (
    <DialogContext.Provider value={{ isOpen, onClose }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-sidebar/70 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={onClose}
        />
        {/* Content Container */}
        <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xl animate-in zoom-in-95">
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
}

export function DialogHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(DialogContext);
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

export function DialogTitle({
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

export function DialogContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function DialogFooter({
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
