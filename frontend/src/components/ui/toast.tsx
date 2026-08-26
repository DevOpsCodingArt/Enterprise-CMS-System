"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  type: "success" | "warning" | "destructive" | "info";
  title: string;
  description?: string;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto-dismiss in 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-lg transition-all animate-in slide-in-from-bottom-5"
            )}
          >
            {t.type === "success" && <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />}
            {t.type === "warning" && <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />}
            {t.type === "destructive" && <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />}
            {t.type === "info" && <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />}

            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-semibold text-foreground">{t.title}</p>
              {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    toast: (opts: Omit<ToastMessage, "id">) => context.addToast(opts),
    success: (title: string, description?: string) => context.addToast({ type: "success", title, description }),
    warning: (title: string, description?: string) => context.addToast({ type: "warning", title, description }),
    error: (title: string, description?: string) => context.addToast({ type: "destructive", title, description }),
    info: (title: string, description?: string) => context.addToast({ type: "info", title, description }),
  };
}
